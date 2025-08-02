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

  const data = await executeQuery(
    `select count(cp.id) as count, stage,
         MAX(tm.teamname) AS teamname
    from ofm_stages as st 
    left join ofm_competitions as cp 
      on cp.stageno = st.pid
    left join ofm_team as tm 
      on tm.teamno = ${teamId}
    where cp.eventid = ${eventId}
    group by stage`,
  );

  return next(
    new AppResponse('', {
      teamName: data[0]?.teamname,
      competitionSummary: data,
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
      im.itemname,
      ca.categoryname,
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
      im.itemname, ca.categoryname, st.stage
    offset (${page} - 1) * ${limit} rows
    fetch next ${limit} rows only;`;

    // stageId, status, categoryId
    if (stageId) query += ` and cp.stageno = ${stageId}`;
    if (status) query += ` and status = ${status}`;
    if (categoryId) query += ` and im.categoryno = ${categoryId}`;

    const data = await executeQuery(query);

    return next(new AppResponse('', data));
  } catch (err) {
    return next(err);
  }
});

export default router;
