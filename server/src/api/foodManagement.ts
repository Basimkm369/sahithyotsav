import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import AppError from 'src/models/AppError';
import AppResponse from 'src/models/AppResponse';
import { decryptId } from 'src/utils/db';
import { runSelectQuery, runWriteQuery } from 'src/utils/local_db';
import kvStore from 'src/utils/kvStore';

const router = express.Router();

router.post(
  '/checkIn',
  [
    body('eventId').notEmpty(),
    body('chestNumber').notEmpty(),
    body('date').notEmpty(),
    body('type').notEmpty(),
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
        chestNumber,
        date,
        type,
      } = req.body;

      let eventId = kvStore.get(`encId:${eventIdEnc}`);
      if (!eventId) {
        eventId = await decryptId(eventIdEnc as string);
        kvStore.set(`encId:${eventIdEnc}`, eventId);
      }
      const formattedDate = convertDateFormat(date);


      const checkExisting = await runSelectQuery(
        `SELECT id FROM food_checkins 
         WHERE event_id = ? AND chest_number = ? AND date = ? AND type = ?`,
        [eventId, chestNumber, formattedDate, type]
      );
      
      if (checkExisting.length > 0) {
        return next(new AppError('Participant already checked in for this meal', 400));
      }
      
      await runWriteQuery(
        `INSERT INTO food_checkins (event_id, chest_number, date, type)
         VALUES (?, ?, ?, ?)`,
        [eventId, chestNumber, formattedDate, type]
      );
      


      return next(new AppResponse('Checked in successfully'));
    } catch (err) {
      return next(err);
    }
  },
);

function convertDateFormat(dateStr: string): string {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}


export default router;
