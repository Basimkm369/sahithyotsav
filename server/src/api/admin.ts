import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import AppError from 'src/models/AppError';
import AppResponse from 'src/models/AppResponse';
import { decryptId, executeQuery, executeStoredProcedure } from 'src/utils/db';
import kvStore from 'src/utils/kvStore';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { eventId: eventIdEnc, teamId: teamIdEnc } = req.query;

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

  const teams = await executeQuery(
    `select tm.teamname as name,
        tm.teamno as number
    from ofm_team as tm 
      where tm.eventid = @eventId`,
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
      teams,
    }),
  );
});

router.get('/overview', async (req, res, next) => {
  const { eventId: eventIdEnc, teamId: teamIdEnc } = req.query;

  let eventId = kvStore.get(`encId:${eventIdEnc}`);
  if (!eventId) {
    eventId = await decryptId(eventIdEnc as string);
    kvStore.set(`encId:${eventIdEnc}`, eventId);
  }

  const data = await executeQuery(
    `select count(cp.id) as count,
        cp.status
    from ofm_competitions as cp
    where cp.eventid = @eventId
    group by cp.status`,
    { eventId },
  );

  return next(
    new AppResponse('', {
      countByStatus: data,
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
      cp.id as id,
      cp.itemcode as itemCode,
      im.itemname as name,
      ca.categoryname as categoryName,
      st.stage as stageName,
      cp.status,
      cp.programdate as date,
      cp.scheduledstart as startTime,
      cp.scheduledend as endTime,
      jd1.pid as judge1Id,
      jd2.pid as judge2Id,
      jd3.pid as judge3Id,
      ISNULL(jd1.judgename, '') as judge1Name,
      ISNULL(jd2.judgename, '') as judge2Name,
      ISNULL(jd3.judgename, '') as judge3Name
    from
      ofm_competitions as cp
      inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
      inner join ofm_category as ca on ca.categoryno = im.categoryno
      inner join ofm_stages as st on st.pid = cp.stageno
      left join ofm_judges as jd1 on jd1.pid = cp.judgeid1
      left join ofm_judges as jd2 on jd2.pid = cp.judgeid2
      left join ofm_judges as jd3 on jd3.pid = cp.judgeid3
    where cp.eventid = @eventId
    `;

    if (stageId) query += ` and cp.stageno = @stageId`;
    if (status === 'C') {
      query += ` and cp.status in ('C', 'M', 'O', 'F')`;
    } else if (status) {
      query += ` and cp.status = @status`;
    }
    if (categoryId) query += ` and im.categoryno = @categoryId`;

    query += ` group by
        im.itemname,
        ca.categoryname,
        st.stage,
        cp.status,
        cp.itemcode,
        cp.id,
        cp.programdate,
        cp.scheduledstart,
        cp.scheduledend,
        jd1.pid,
        jd2.pid,
        jd3.pid,
        jd1.judgename,
        jd2.judgename,
        jd3.judgename
      order by
        im.itemname, ca.categoryname, st.stage
      offset (@page - 1) * @limit rows
      fetch next @limit rows only;`;

    const data = await executeQuery(query, {
      eventId,
      stageId,
      categoryId,
      status,
      page: +page,
      limit: +limit,
    });

    const parsedData = data.map((row: any) => ({
      ...row,
      participants: row.participants
        ? JSON.parse(row.participants).map((p: any) => ({
            ...p,
            rank:
              p.rank <= 3 && ['A', 'D', 'C', 'F'].includes(row.status)
                ? p.rank
                : 0,
          }))
        : [],
    }));

    return next(new AppResponse('', parsedData));
  } catch (err) {
    return next(err);
  }
});

router.get('/judges', async (req, res, next) => {
  try {
    const { eventId: eventIdEnc } = req.query;

    let eventId = kvStore.get(`encId:${eventIdEnc}`);
    if (!eventId) {
      eventId = await decryptId(eventIdEnc as string);
      kvStore.set(`encId:${eventIdEnc}`, eventId);
    }

    const data = await executeQuery(
      `
        SELECT 
          j.pid AS id,
          j.judgename AS name
        FROM 
          ofm_judges j
        JOIN 
          ofm_eventmaster e ON e.eventid = @eventId
        WHERE 
          j.entityxid = e.entityxid
        ORDER BY j.JudgeName
      `,{eventId}
    );
    return next(new AppResponse('', data));
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/updateCompetition',
  [
    body('eventId').notEmpty(),
    body('itemId').notEmpty(),
    body('judge1Id').optional().notEmpty(),
    body('judge2Id').optional().notEmpty(),
    body('judge3Id').optional().notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new AppError('Validation Error', 400, { errors: errors.array() }),
        );
      }

      const {
        eventId: eventIdEnc,
        itemId,
        judge1Id,
        judge2Id,
        judge3Id,
      } = req.body;

      let eventId = kvStore.get(`encId:${eventIdEnc}`);
      if (!eventId) {
        eventId = await decryptId(eventIdEnc as string);
        kvStore.set(`encId:${eventIdEnc}`, eventId);
      }

      await executeQuery(
        `UPDATE ofm_competitions
         SET judgeid1 = @judge1Id,
             judgeid2 = @judge2Id,
             judgeid3 = @judge3Id
         WHERE itemcode = @itemId
          and eventid = @eventId`,
        { itemId, eventId, judge1Id, judge2Id, judge3Id },
      );

      return next(new AppResponse('Judges updated successfully'));
    } catch (err) {
      return next(err);
    }
  },
);

router.get('/participants', async (req, res, next) => {
  try {
    const {
      categoryId,
      teamId,
      eventId: eventIdEnc,
      limit = 10,
      page = 1,
    } = req.query;

    let eventId = kvStore.get(`encId:${eventIdEnc}`);
    if (!eventId) {
      eventId = await decryptId(eventIdEnc as string);
      kvStore.set(`encId:${eventIdEnc}`, eventId);
    }

    let query = `select COUNT(*) OVER () AS totalCount,
        pa.chestno as chestNumber,
        pa.participant as name,
        ca.categoryname as categoryName,
        tm.teamname as teamName,
        (
          SELECT
            it.itemname as itemName,
            ai.status as participantStatus,
            ai.rank as rank,
            ai.codeletter as codeLetter,
            ca.status as status
          FROM
            ofm_assignitem AS ai
            LEFT JOIN ofm_competitions AS ca ON ca.itemcode = ai.itemcode and ca.eventid = ${eventId}
            left join ofm_itemmaster as it on it.itemcode = ca.itemcode
          WHERE
            ai.chestno = pa.chestno
            and ai.eventid = ${eventId}
          FOR JSON PATH
        ) AS competitions
        from ofm_participant pa
        inner join ofm_category ca on ca.categoryno = pa.categoryno
        inner join ofm_team tm on tm.teamno = pa.teamno and tm.eventId = ${eventId}
        where pa.eventid = ${eventId}
      `;

    if (categoryId) query += ` and pa.categoryno = '${categoryId}'`;
    if (teamId) query += ` and pa.teamno = '${teamId}'`;

    query += ` order by pa.chestno, ca.categoryname, pa.participant
      offset (${page} - 1) * ${limit} rows
      fetch next ${limit} rows only;`;

    const data = await executeQuery(query);

    const parsedData = data.map((row: any) => ({
      ...row,
      competitions: row.competitions
        ? JSON.parse(row.competitions).map((c: any) => ({
            ...c,
            rank:
              c.rank <= 3 && ['A', 'D', 'C', 'F'].includes(c.status)
                ? c.rank
                : 0,
          }))
        : [],
    }));

    return next(new AppResponse('', parsedData));
  } catch (err) {
    return next(err);
  }
});

export default router;
