import express, { NextFunction, Request, Response } from 'express';
import AppResponse from 'src/models/AppResponse';
import kvStore from 'src/utils/kvStore';
import { decryptId, executeQuery, executeStoredProcedure } from 'src/utils/db';
import CompetitionStatus from 'src/constants/CompetitionStatus';
import { body, validationResult } from 'express-validator';
import AppError from 'src/models/AppError';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { eventId: eventIdEnc } = req.query;

  let eventId = kvStore.get(`encId:${eventIdEnc}`);
  if (!eventId) {
    eventId = await decryptId(eventIdEnc as string);
    kvStore.set(`encId:${eventIdEnc}`, eventId);
  }

  const stages = await executeQuery(
    `select count(cp.id) as competitionsCount,
        st.stage as name,
        st.pid as number
    from ofm_stages as st 
    left join ofm_competitions as cp 
      on cp.stageno = st.pid
    where cp.eventid = @eventId
    group by st.stage, st.pid`,
    { eventId },
  );

  let categories = kvStore.get(`categories`);
  if (!categories) {
    categories = await executeQuery(
      `select categoryno as number, categoryname as name from ofm_category`,
    );
    kvStore.set('categories', categories);
  }

  return next(
    new AppResponse('', {
      stages,
      categories,
    }),
  );
});

router.get('/competitions', async (req, res, next) => {
  try {
    const {
      stageId,
      status,
      categoryId,
      eventId: eventIdEnc,
      limit = 10,
      page = 1,
    } = req.query;

    let eventId = kvStore.get(`encId:${eventIdEnc}`);
    if (!eventId) {
      eventId = await decryptId(eventIdEnc as string);
      kvStore.set(`encId:${eventIdEnc}`, eventId);
    }

    let query = `select
      COUNT(*) OVER () AS totalCount,
      cp.itemcode as itemCode,
      im.itemname as name,
      im.stagetype as stageType,
      ca.categoryname as categoryName,
      st.stage as stageName,
      cp.status,
      cp.programdate as date,
      cp.scheduledstart as startTime,
      cp.scheduledend as endTime,
      ISNULL(jd1.judgename, '') as judge1Name,
      ISNULL(jd2.judgename, '') as judge2Name,
      ISNULL(jd3.judgename, '') as judge3Name,
      cp.judge1submittedyn as judge1Submitted,
      cp.judge2submittedyn as judge2Submitted,
      cp.judge3submittedyn as judge3Submitted
    from
      ofm_competitions as cp
      inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
      inner join ofm_category as ca on ca.categoryno = im.categoryno
      left join ofm_stages as st on st.pid = cp.stageno and st.eventid = @eventId
      left join ofm_judges as jd1 on jd1.pid = cp.judgeid1
      left join ofm_judges as jd2 on jd2.pid = cp.judgeid2
      left join ofm_judges as jd3 on jd3.pid = cp.judgeid3
    where cp.eventid = @eventId
      and im.stagetype = 'Non Stage'`;

    if (status === 'M') {
      query += ` and cp.status in ('F', 'A', 'O', 'D')`;
    } else if (status) {
      query += ` and cp.status = @status`;
    }
    if (categoryId) query += ` and im.categoryno = @categoryId`;
    if (stageId) query += ` and cp.stageno = @stageId`;

    query += ` group by
      im.itemname,
      im.stagetype,
      ca.categoryname,
      st.stage,
      cp.status,
      cp.itemcode,
      cp.programdate,
      cp.scheduledstart,
      cp.scheduledend,
      jd1.judgename,
      jd2.judgename,
      jd3.judgename,
      cp.judge1submittedyn,
      cp.judge2submittedyn,
      cp.judge3submittedyn
    order by
      im.itemname, ca.categoryname, st.stage
    offset (@page - 1) * @limit rows
    fetch next @limit rows only;`;

    const data = await executeQuery(query, {
      stageId,
      eventId,
      categoryId,
      status,
      page: +page,
      limit: +limit,
    });

    const parsedData = data.map((row: any) => ({
      ...row,
      judge1Submitted: row.judge1Submitted === 'Y',
      judge2Submitted: row.judge2Submitted === 'Y',
      judge3Submitted: row.judge3Submitted === 'Y',
    }));

    return next(new AppResponse('', parsedData));
  } catch (err) {
    return next(err);
  }
});

router.get('/competitions/:itemCode', async (req, res, next) => {
  const { itemCode } = req.params;
  const { eventId: eventIdEnc } = req.query;

  let eventId = kvStore.get(`encId:${eventIdEnc}`);
  if (!eventId) {
    eventId = await decryptId(eventIdEnc as string);
    kvStore.set(`encId:${eventIdEnc}`, eventId);
  }

  let query = `select pa.chestno as chestNumber,
    pa.participant as name,
    te.teamname as teamName,
    ai.status,
    ISNULL(ai.codeletter, '') as codeLetter
    from ofm_participant pa
    inner join ofm_assignitem ai on ai.chestno = pa.chestno and ai.eventid = @eventId
    inner join ofm_competitions co on co.itemcode = ai.itemcode and co.eventid = @eventId
    inner join ofm_team te on te.teamno = pa.teamno and te.eventid = @eventId
    where ai.itemcode = @itemCode
      and pa.eventid = @eventId`;

  const data = await executeQuery(query, {
    eventId,
    itemCode,
  });

  return next(
    new AppResponse('', {
      participants: data.sort((a, b) => a.chestNumber - b.chestNumber),
    }),
  );
});

router.post(
  '/updateCompetitionStatus',
  [
    body('eventId').notEmpty(),
    body('itemCode').notEmpty().isNumeric(),
    body('status').notEmpty().isString().isLength({ max: 1 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation Error', 400, { errors: errors.array() });
      }

      const { eventId: eventIdEnc, itemCode, status } = req.body;

      if (status !== CompetitionStatus.MarkEntryClosed) {
        throw new AppError(
          'You can only change the status to Mark Entry Closed',
        );
      }

      let eventId = kvStore.get(`encId:${eventIdEnc}`);
      if (!eventId) {
        eventId = await decryptId(eventIdEnc as string);
        kvStore.set(`encId:${eventIdEnc}`, eventId);
      }

      const programRes = await executeQuery(
        `SELECT id FROM OFM_Competitions
          WHERE itemcode = @itemCode
          AND eventid = @eventId`,
        { eventId, itemCode },
      );
      const programId = programRes?.[0]?.id;
      if (!programId) throw new Error('Program ID not found');

      await executeStoredProcedure('usp_StartProgram', {
        programId,
        Status: status,
        datetime: new Date(),
        Notes: '',
      });

      return next(new AppResponse('Competition status updated successfully'));
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
