import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import AppError from 'src/models/AppError';
import AppResponse from 'src/models/AppResponse';
import { decryptId } from 'src/utils/db';
import { runSelectQuery, runWriteQuery } from 'src/utils/mysqlDb';
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


      const badgeCounts: Record<number, number> = {
        9600: 30,
        9601: 66,
        9602: 20,
        9603: 20,
        9604: 49,
        9605: 10,
        9606: 30,
        9607: 15,
        9608: 20,
        9609: 20,
        9610: 20,
        9611: 60,
        9612: 30,
        9613: 20,
        9614: 70,
        9615: 34,
        9616: 20,
        9617: 22,
        9618: 60,
        9619: 20
      };
      

    const allowedCheckins = badgeCounts[chestNumber] || 1; 

    // Count how many times this chestNumber has already checked in
    const [existingCheckins] = await runSelectQuery(
      `SELECT COUNT(*) as count FROM food_checkins 
   WHERE event_id = ? AND chest_number = ? AND date = ? AND type = ?`,
      [eventId, chestNumber, formattedDate, type]
    );

    if (existingCheckins.count >= allowedCheckins) {
      return next(new AppError('Participant already checked in for this meal', 400));
    }

    
      // const checkExisting = await runSelectQuery(
      //   `SELECT id FROM food_checkins 
      //    WHERE event_id = ? AND chest_number = ? AND date = ? AND type = ?`,
      //   [eventId, chestNumber, formattedDate, type]
      // );
      
      // if (checkExisting.length > 0) {
      //   return next(new AppError('Participant already checked in for this meal', 400));
      // }
      
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
