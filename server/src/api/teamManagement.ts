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

  let teamName = kvStore.get(`${eventId}:team:${teamId}:name`);
  if (!teamName) {
    const teamNameRes = await executeQuery(
      `select teamname as name from ofm_team where teamno = ${teamId} and eventid = ${eventId}`,
    );
    teamName = teamNameRes?.[0].name;
    kvStore.set(`${eventId}:team:${teamId}:name`, teamName);
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
      cp.programdate as date,
      cp.scheduledstart as startTime,
      cp.scheduledend as endTime,
      (
        SELECT
          pa.participant as name,
          pa.chestno as chestNumber,
          ai.status,
          ai.codeletter as codeLetter,
          ai.rank
        FROM
          ofm_assignitem AS ai
          INNER JOIN ofm_participant AS pa ON pa.chestno = ai.chestno
        WHERE
          ai.itemcode = cp.itemcode
          and ai.teamnumber = ${teamId}
          and pa.teamno = ${teamId}
          and pa.eventid = ${eventId}
          and ai.eventid = ${eventId}
        FOR JSON PATH
      ) AS participants
    from
      ofm_competitions as cp
      inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
      inner join ofm_category as ca on ca.categoryno = im.categoryno
      inner join ofm_stages as st on st.pid = cp.stageno
    where cp.eventid = ${eventId}
    `;

    if (stageId) query += ` and cp.stageno = '${stageId}'`;
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
      cp.id,
      cp.programdate,
      cp.scheduledstart,
      cp.scheduledend
    order by
      im.itemname, ca.categoryname, st.stage
    offset (${page} - 1) * ${limit} rows
    fetch next ${limit} rows only;`;

    const data = await executeQuery(query);

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

    let query = `select COUNT(*) OVER () AS totalCount,
        pa.chestno as chestNumber,
        pa.participant as name,
        ca.categoryname as categoryName,
        (
          SELECT
            it.itemname as itemName,
            ai.status as participantStatus,
            ai.rank as rank,
            ai.codeletter as codeLetter,
            ca.status as status
          FROM
            ofm_assignitem AS ai
            LEFT JOIN ofm_competitions AS ca ON ca.itemcode = ai.itemcode
            left join ofm_itemmaster as it on it.itemcode = ca.itemcode
          WHERE
            ai.chestno = pa.chestno
            and ai.teamnumber = ${teamId}
            and ca.eventid = ${eventId}
          FOR JSON PATH
        ) AS competitions
        from ofm_participant pa
        inner join ofm_category ca on ca.categoryno = pa.categoryno
        where pa.teamno = ${teamId} and pa.eventid = ${eventId}
      `;

    if (categoryId) query += ` and pa.categoryno = '${categoryId}'`;

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
