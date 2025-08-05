import express, { NextFunction, Request, Response } from 'express';
import AppResponse from 'src/models/AppResponse';
import kvStore from 'src/utils/kvStore';
import { decryptId, executeQuery, executeStoredProcedure } from 'src/utils/db';
import CompetitionStatus from 'src/constants/CompetitionStatus';
import { body, validationResult } from 'express-validator';
import AppError from 'src/models/AppError';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { eventId: eventIdEnc, stageId: stageIdEnc } = req.query;

  let stageId = kvStore.get(`encId:${stageIdEnc}`);
  if (!stageId) {
    stageId = await decryptId(stageIdEnc as string);
    kvStore.set(`encId:${stageIdEnc}`, stageId);
  }

  let eventId = kvStore.get(`encId:${eventIdEnc}`);
  if (!eventId) {
    eventId = await decryptId(eventIdEnc as string);
    kvStore.set(`encId:${eventIdEnc}`, eventId);
  }

  let stageName = kvStore.get(`${eventId}:stage:${stageId}:name`);
  if (!stageName) {
    const stageNameRes = await executeQuery(
      `select stage as name from ofm_stages where pid = ${stageId} and eventid = ${eventId}`,
    );
    stageName = stageNameRes?.[0].name;
    kvStore.set(`${eventId}:stage:${stageId}:name`, stageName);
  }

  let categories = kvStore.get(`categories`);
  if (!categories) {
    categories = await executeQuery(
      `select categoryno as number, categoryname as name from ofm_category`,
    );
    kvStore.set('categories', categories);
  }

  return next(
    new AppResponse('', {
      stageName,
      categories,
    }),
  );
});

router.get('/competitions', async (req, res, next) => {
  try {
    const {
      stageId: stageIdEnc,
      status,
      categoryId,
      eventId: eventIdEnc,
      limit = 10,
      page = 1,
    } = req.query;

    let stageId = kvStore.get(`encId:${stageIdEnc}`);
    if (!stageId) {
      stageId = await decryptId(stageIdEnc as string);
      kvStore.set(`encId:${stageIdEnc}`, stageId);
    }

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
      cp.scheduledend as endTime,
      ISNULL(jd1.judgename, '') as judge1Name,
      ISNULL(jd2.judgename, '') as judge2Name,
      ISNULL(jd3.judgename, '') as judge3Name
    from
      ofm_competitions as cp
      inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
      inner join ofm_category as ca on ca.categoryno = im.categoryno
      inner join ofm_stages as st on st.pid = cp.stageno
      inner join ofm_judges as jd1 on jd1.pid = cp.judgeid1
      inner join ofm_judges as jd2 on jd2.pid = cp.judgeid2
      inner join ofm_judges as jd3 on jd3.pid = cp.judgeid3
    where cp.stageno = ${stageId} and cp.eventid = ${eventId}`;

    if (status === 'C') {
      query += ` and cp.status in ('C', 'M', 'O', 'F')`;
    } else if (status) {
      query += ` and cp.status = '${status}'`;
    }
    if (categoryId) query += ` and im.categoryno = '${categoryId}'`;

    query += ` group by
      im.itemname,
      ca.categoryname,
      st.stage,
      cp.status,
      cp.itemcode,
      cp.programdate,
      cp.scheduledstart,
      cp.scheduledend,
      jd1.judgename,
      jd2.judgename,
      jd3.judgename
    order by
      im.itemname, ca.categoryname, st.stage
    offset (${page} - 1) * ${limit} rows
    fetch next ${limit} rows only;`;

    const data = await executeQuery(query);

    return next(new AppResponse('', data));
  } catch (err) {
    return next(err);
  }
});

router.get('/competitions/:itemCode', async (req, res, next) => {
  const { itemCode } = req.params;
  const { eventId: eventIdEnc, stageId: stageIdEnc } = req.query;

  let stageId = kvStore.get(`encId:${stageIdEnc}`);
  if (!stageId) {
    stageId = await decryptId(stageIdEnc as string);
    kvStore.set(`encId:${stageIdEnc}`, stageId);
  }

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
    inner join ofm_assignitem ai on ai.chestno = pa.chestno
    inner join ofm_competitions co on co.itemcode = ai.itemcode
    inner join ofm_team te on te.teamno = pa.teamno
    where ai.itemcode = ${itemCode}
      and co.stageno = ${stageId}
      and ai.eventid = ${eventId}
      and co.eventid = ${eventId}
      and te.eventid = ${eventId}
      and pa.eventid = ${eventId}`;

  const data = await executeQuery(query);

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
    body('stageId').notEmpty(),
    body('itemCode').notEmpty().isNumeric(),
    body('status').notEmpty().isString().isLength({ max: 1 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation Error', 400, { errors: errors.array() });
      }

      const {
        eventId: eventIdEnc,
        stageId: stageIdEnc,
        itemCode,
        status,
      } = req.body;

      let stageId = kvStore.get(`encId:${stageIdEnc}`);
      if (!stageId) {
        stageId = await decryptId(stageIdEnc as string);
        kvStore.set(`encId:${stageIdEnc}`, stageId);
      }

      let eventId = kvStore.get(`encId:${eventIdEnc}`);
      if (!eventId) {
        eventId = await decryptId(eventIdEnc as string);
        kvStore.set(`encId:${eventIdEnc}`, eventId);
      }

      const programRes = await executeQuery(
        `SELECT id FROM OFM_Competitions
        WHERE itemcode = ${itemCode}
        AND stageno = ${stageId}
        AND eventid = ${eventId}`,
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

router.post(
  '/updateCompetitionParticipant',
  [
    body('eventId').notEmpty(),
    body('stageId').notEmpty(),
    body('itemCode').notEmpty().isNumeric(),
    body('chestNumber').if(body('codeLetter').not().exists()).notEmpty(),
    body('codeLetter')
      .if(body('chestNumber').not().exists())
      .notEmpty()
      .isString()
      .isLength({ max: 10 }),
    body('status').notEmpty().isString().isLength({ max: 1 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation Error', 400, { errors: errors.array() });
      }

      const {
        eventId: eventIdEnc,
        stageId: stageIdEnc,
        itemCode,
        chestNumber,
        status,
        codeLetter,
      } = req.body;

      let stageId = kvStore.get(`encId:${stageIdEnc}`);
      if (!stageId) {
        stageId = await decryptId(stageIdEnc as string);
        kvStore.set(`encId:${stageIdEnc}`, stageId);
      }

      let eventId = kvStore.get(`encId:${eventIdEnc}`);
      if (!eventId) {
        eventId = await decryptId(eventIdEnc as string);
        kvStore.set(`encId:${eventIdEnc}`, eventId);
      }

      const pidRes = await executeQuery(
        `SELECT ai.id FROM OFM_AssignItem ai
          INNER JOIN ofm_competitions co on co.itemcode = ai.itemcode
          WHERE ai.chestno = '${chestNumber}'
            AND ai.itemcode = ${itemCode}
            AND co.stageno = ${stageId}
            AND co.eventid = ${eventId}
            AND ai.eventid = ${eventId}`,
      );
      const pid = pidRes?.[0]?.id;
      if (!pid) throw new Error('Participant ID not found');

      await executeStoredProcedure('usp_updateCodeLetter', {
        pid,
        CodeLetter: codeLetter,
        Status: status,
      });

      return next(new AppResponse('Participant updated successfully'));
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
