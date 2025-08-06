import express, { NextFunction, Request, Response } from 'express';
import AppResponse from 'src/models/AppResponse';
import kvStore from 'src/utils/kvStore';
import { decryptId, executeQuery, executeStoredProcedure } from 'src/utils/db';
import { body, validationResult } from 'express-validator';
import AppError from 'src/models/AppError';

const router = express.Router();

router.get('/', async (req, res, next) => {
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

    let query = `select
      cp.status as competitionStatus,
      im.itemname as itemName,
      ca.categoryname as categoryName,
      jd.judgename as judgeName,
      (
        SELECT
          ai.codeletter as codeLetter,
          tme.mark1 as mark,
          tme.notes
        FROM
          ofm_assignitem AS ai
        LEFT JOIN ofm_tempmarkentry AS tme
          on tme.itemcode = ai.itemcode
            and tme.chestno = ai.chestno
            and tme.codeletter = ai.codeletter
            and tme.eventid = @eventId
            and tme.sino = @judgeId
        WHERE
          ai.itemcode = cp.itemcode
          and ai.eventid = @eventId
          and ai.status = 'E'
          and ai.codeletter IS NOT NULL AND ai.codeletter <> ''
        FOR JSON PATH
      ) AS scores
      from
        ofm_competitions as cp
        inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
        inner join ofm_category as ca on ca.categoryno = im.categoryno
        inner join ofm_judges as jd on jd.pid = cp.judgeid${judgeId}
      where cp.eventid = @eventId
        and cp.itemcode = @itemId`;

    const data = await executeQuery(query, { eventId, itemId, judgeId });

    const parsedData = data.map((row: any) => ({
      ...row,
      notes: row.scores ? JSON.parse(row.scores)?.[0]?.notes ?? '' : '',
      scores: row.scores
        ? JSON.parse(row.scores).sort((a: any, b: any) =>
            a.codeLetter.localeCompare(b.codeLetter),
          )
        : [],
    }));

    return next(new AppResponse('', parsedData[0]));
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/updateMark',
  [
    body('eventId').notEmpty(),
    body('judgeId').notEmpty(),
    body('itemId').notEmpty(),
    body('codeLetter').notEmpty().isString(),
    body('mark')
      .notEmpty()
      .isInt({ min: 0, max: 100 })
      .withMessage('Mark must be a whole number between 0 and 100'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation Error', 400, { errors: errors.array() });
      }

      const {
        eventId: eventIdEnc,
        judgeId: judgeIdEnc,
        itemId: itemIdEnc,
        codeLetter,
        mark,
      } = req.body;

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

      const assignRes = await executeQuery(
        `SELECT id FROM OFM_AssignItem
         WHERE itemcode = @itemId
          AND eventid = @eventId
          AND codeletter = @codeLetter`,
        { itemId, eventId, codeLetter },
      );
      const pid = assignRes?.[0]?.id;
      if (!pid) throw new Error('Participant assignment not found');

      await executeStoredProcedure('usp_UpateJudjesMarkEntryByPart', {
        PartID: pid,
        Mark1: mark,
        SINO: judgeId,
      });

      return next(new AppResponse('Mark updated successfully'));
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  '/updateNotes',
  [
    body('eventId').notEmpty(),
    body('judgeId').notEmpty(),
    body('itemId').notEmpty(),
    body('notes').isString(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation Error', 400, { errors: errors.array() });
      }

      const {
        eventId: eventIdEnc,
        judgeId: judgeIdEnc,
        itemId: itemIdEnc,
        notes,
      } = req.body;

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

      await executeQuery(
        `UPDATE ofm_tempmarkentry
          SET notes = @notes
          WHERE eventid = @eventId
            AND itemcode = @itemId
            AND sino = @judgeId`,
        {
          eventId,
          itemId,
          judgeId,
          notes,
        },
      );

      return next(new AppResponse('Notes updated successfully'));
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  '/submit',
  [
    body('eventId').notEmpty(),
    body('judgeId').notEmpty(),
    body('itemId').notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation Error', 400, { errors: errors.array() });
      }

      const {
        eventId: eventIdEnc,
        judgeId: judgeIdEnc,
        itemId: itemIdEnc,
      } = req.body;

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

      await executeQuery(
        `UPDATE ofm_competitions
          SET judge${judgeId}submittedyn = 'Y'
          WHERE eventid = @eventId
            AND itemcode = @itemId`,
        {
          eventId,
          itemId,
          judgeId,
        },
      );

      return next(new AppResponse('Saved successfully'));
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
