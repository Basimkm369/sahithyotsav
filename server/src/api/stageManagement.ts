import express from 'express';
import AppResponse from 'src/models/AppResponse';
import kvStore from 'src/utils/kvStore';
import { decryptId, executeQuery } from 'src/utils/db';

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
      cp.scheduledend as endTime
    from
      ofm_competitions as cp
      inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
      inner join ofm_category as ca on ca.categoryno = im.categoryno
      inner join ofm_stages as st on st.pid = cp.stageno
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
      cp.scheduledend
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
    ai.status,
    ai.codeletter as codeLetter
    from ofm_participant pa
    inner join ofm_assignitem ai on ai.chestno = pa.chestno
    inner join ofm_competitions co on co.itemcode = ai.itemcode
    where ai.itemcode = ${itemCode}
      and co.stageno = ${stageId}
      and pa.eventid = ${eventId}`;

  query += ` order by pa.chestno`;

  const data = await executeQuery(query);

  return next(
    new AppResponse('', {
      participants: data,
    }),
  );
});

export default router;
