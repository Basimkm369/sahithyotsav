import express from 'express';
import AppResponse from 'src/models/AppResponse';
import kvStore from 'src/utils/kvStore';
import { decryptId, executeQuery } from 'src/utils/db';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const {
    eventId: eventIdEnc,
    itemId: itemIdEnc,
    judgeId: judgeIdEnc,
  } = req.query;

  let itemId = kvStore.get(`encId:${itemIdEnc}`);
  if (!itemId) {
    itemId = await decryptId(itemIdEnc as string);
    kvStore.set(`encId:${itemIdEnc}`, itemId);
  }

  let judgeId = kvStore.get(`encId:${judgeIdEnc}`);
  if (!judgeId) {
    judgeId = await decryptId(judgeIdEnc as string);
    kvStore.set(`encId:${judgeIdEnc}`, judgeId);
  }

  let eventId = kvStore.get(`encId:${eventIdEnc}`);
  if (!eventId) {
    eventId = await decryptId(eventIdEnc as string);
    kvStore.set(`encId:${eventIdEnc}`, eventId);
  }

  const scores = [
    { codeLetter: 'A', mark: 89 },
    { codeLetter: 'B', mark: null },
    { codeLetter: 'C', mark: 92 },
    { codeLetter: 'D', mark: null },
  ];

  return next(
    new AppResponse('', {
      judgeName: 'Jafar Swadhique',
      itemName: 'Book Test',
      categoryName: 'Senior',
      scores,
      notes: 'hi',
    }),
  );
});

router.get('/participants', async (req, res, next) => {
  try {
    const {
      eventId: eventIdEnc,
      itemId: itemIdEnc,
      judgeId: judgeIdEnc,
    } = req.query;

    let itemId = kvStore.get(`encId:${itemIdEnc}`);
    if (!itemId) {
      itemId = await decryptId(itemIdEnc as string);
      kvStore.set(`encId:${itemIdEnc}`, itemId);
    }
    let judgeId = kvStore.get(`encId:${judgeIdEnc}`);
    if (!judgeId) {
      judgeId = await decryptId(judgeIdEnc as string);
      kvStore.set(`encId:${judgeIdEnc}`, judgeId);
    }

    let eventId = kvStore.get(`encId:${eventIdEnc}`);
    if (!eventId) {
      eventId = await decryptId(eventIdEnc as string);
      kvStore.set(`encId:${eventIdEnc}`, eventId);
    }

    let data = [
      { codeLetter: 'A', mark: 89 },
      { codeLetter: 'B', mark: null },
      { codeLetter: 'C', mark: 92 },
      { codeLetter: 'D', mark: null },
    ];

    return next(new AppResponse('', data));
  } catch (err) {
    return next(err);
  }
});

export default router;
