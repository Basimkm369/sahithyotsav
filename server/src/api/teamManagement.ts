import express from 'express';
import AppResponse from 'src/models/AppResponse';
import { decryptId, executeQuery, executeStoredProcedure } from 'src/utils/db';
import kvStore from 'src/utils/kvStore';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { eventId: eventIdEnc, teamId: teamIdEnc } = req.query;

  let teamId = kvStore.get(`encId:${teamIdEnc}`);
  if (!teamId) {
    teamId = await decryptId(teamIdEnc as string);
    kvStore.set(`encId:${teamIdEnc}`, teamId);
  }

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
    where cp.eventid = ${eventId}
    group by st.stage, st.pid`,
  );

  let teamName = kvStore.get(`team:${teamId}:name`);
  if (!teamName) {
    const teamNameRes = await executeQuery(
      `select teamname as name from ofm_team where teamno = ${teamId}`,
    );
    teamName = teamNameRes?.[0].name;
    kvStore.set(`team:${teamId}:name`, teamName);
  }

  let categories = kvStore.get(`categories`);
  if (!categories) {
    categories = await executeQuery(
      `select categoryno as no, categoryname as name from ofm_category`,
    );
    kvStore.set('categories', categories);
  }

  return next(
    new AppResponse('', {
      teamName,
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
      teamId: teamIdEnc,
      limit = 10,
      page = 1,
    } = req.query;

    let teamId = kvStore.get(`encId:${teamIdEnc}`);
    if (!teamId) {
      teamId = await decryptId(teamIdEnc as string);
      kvStore.set(`encId:${teamIdEnc}`, teamId);
    }

    let eventId = kvStore.get(`encId:${eventIdEnc}`);
    if (!eventId) {
      eventId = await decryptId(eventIdEnc as string);
      kvStore.set(`encId:${eventIdEnc}`, eventId);
    }

    let query = `select
      COUNT(*) OVER () AS totalCount,
      cp.id as id,
      im.itemname as name,
      ca.categoryname as categoryName,
      st.stage as stageName,
      cp.status,
      (
        SELECT
          pa.participant,
          pa.chestno as chestNo,
          ai.status
        FROM
          ofm_assignitem AS ai
          LEFT JOIN ofm_participant AS pa ON pa.chestno = ai.chestno
        WHERE
          ai.itemcode = cp.itemcode
          and ai.teamnumber = ${teamId}
          and pa.eventid = ${eventId}
        FOR JSON PATH
      ) AS participants
    from
      ofm_competitions as cp
      inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
      inner join ofm_category as ca on ca.categoryno = im.categoryno
      inner join ofm_stages as st on st.pid = cp.stageno
    where 1=1
    `;

    if (stageId) query += ` and cp.stageno = '${stageId}'`;
    if (status) query += ` and cp.status = '${status}'`;
    if (categoryId) query += ` and im.categoryno = '${categoryId}'`;

    query += ` group by
      im.itemname,
      ca.categoryname,
      st.stage,
      cp.status,
      cp.itemcode,
      cp.id
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

router.get('/participants', async (req, res, next) => {
  try {
    const {
      categoryId,
      eventId: eventIdEnc,
      teamId: teamIdEnc,
      limit = 10,
      page = 1,
    } = req.query;

    let teamId = kvStore.get(`encId:${teamIdEnc}`);
    if (!teamId) {
      teamId = await decryptId(teamIdEnc as string);
      kvStore.set(`encId:${teamIdEnc}`, teamId);
    }

    let eventId = kvStore.get(`encId:${eventIdEnc}`);
    if (!eventId) {
      eventId = await decryptId(eventIdEnc as string);
      kvStore.set(`encId:${eventIdEnc}`, eventId);
    }

    let query = `select
      COUNT(*) OVER () AS totalCount,
      im.itemname,
      ca.categoryname as categoryName,
      st.stage,
      cp.status,
      (
        SELECT
          pa.participant,
          pa.chestno,
          ai.status
        FROM
          ofm_assignitem AS ai
          LEFT JOIN ofm_participant AS pa ON pa.chestno = ai.chestno
        WHERE
          ai.itemcode = cp.itemcode
          and ai.teamnumber = ${teamId}
          and pa.eventid = ${eventId}
        FOR JSON PATH
      ) AS participants
    from
      ofm_competitions as cp
      inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
      inner join ofm_category as ca on ca.categoryno = im.categoryno
      inner join ofm_stages as st on st.pid = cp.stageno
    group by
      im.itemname,
      ca.categoryname,
      st.stage,
      cp.status,
      cp.itemcode
    order by
      im.itemname, ca.categoryname, st.stage`;

    if (categoryId) query += ` and im.categoryno = '${categoryId}'`;

    query += ` offset (${page} - 1) * ${limit} rows
    fetch next ${limit} rows only;`;

    const data = await executeQuery(query);

    return next(new AppResponse('', data));
  } catch (err) {
    return next(err);
  }
});

export default router;
