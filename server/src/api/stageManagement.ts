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
      `select stage as name from ofm_stages where pid = ${stageId}`,
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

export default router;
