import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import CompetitionStatus from 'src/constants/CompetitionStatus';
import AppError from 'src/models/AppError';
import AppResponse from 'src/models/AppResponse';
import { decryptId, executeQuery, executeStoredProcedure } from 'src/utils/db';
import kvStore from 'src/utils/kvStore';

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
      ca.categoryname as categoryName,
      st.stage as stageName,
      cp.status,
      cp.programdate as date,
      cp.scheduledstart as startTime,
      cp.scheduledend as endTime
    from
      ofm_competitions as cp
      inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
      inner join ofm_category as ca on ca.categoryno = im.categoryno
      left join ofm_stages as st on st.pid = cp.stageno
    where cp.eventid = @eventId
      and cp.status = '${CompetitionStatus.Announced}'`;

    if (categoryId) query += ` and im.categoryno = @categoryId`;
    if (stageId) query += ` and cp.stageno = @stageId`;

    query += ` group by
      im.itemname,
      ca.categoryname,
      st.stage,
      cp.status,
      cp.itemcode,
      cp.programdate,
      cp.scheduledstart,
      cp.scheduledend
    order by
      im.itemname, ca.categoryname, st.stage
    offset (${page} - 1) * ${limit} rows
    fetch next ${limit} rows only;`;

    const data = await executeQuery(query, {
      eventId,
      categoryId,
      stageId,
    });

    return next(new AppResponse('', data));
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
    ai.codeletter as codeLetter,
    ai.rank,
    ai.grade
    from ofm_participant pa
    inner join ofm_assignitem ai on ai.chestno = pa.chestno and ai.eventid = @eventId
    inner join ofm_competitions co on co.itemcode = ai.itemcode and co.eventid = @eventId
    inner join ofm_team te on te.teamno = pa.teamno and te.eventid = @eventId
    where ai.codeletter IS NOT NULL and ai.codeletter <> ''
      and ai.itemcode = @itemCode
      and pa.eventid = @eventId
      and co.status = '${CompetitionStatus.Announced}'`;

  const data = await executeQuery(query, { eventId, itemCode });

  return next(
    new AppResponse('', {
      participants: data.sort((a, b) => (a.rank || 1000) - (b.rank || 1000)),
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

      if (status !== CompetitionStatus.PrizeDistributed) {
        throw new AppError('You can only change the status to Prize Distributed');
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
