import express, { NextFunction, Request, Response } from 'express';
import AppResponse from 'src/models/AppResponse';
import kvStore from 'src/utils/kvStore';
import { decryptId, executeQuery, executeStoredProcedure } from 'src/utils/db';
import CompetitionStatus from 'src/constants/CompetitionStatus';
import { body, validationResult } from 'express-validator';
import AppError from 'src/models/AppError';

const router = express.Router();


router.get('/competitions', async (req, res, next) => {
  try {
    // const {
    //   stageId: stageIdEnc,
    //   status,
    //   categoryId,
    //   eventId: eventIdEnc,
    //   limit = 10,
    //   page = 1,
    // } = req.query;

    // let stageId = kvStore.get(`encId:${stageIdEnc}`);
    // if (!stageId) {
    //   stageId = await decryptId(stageIdEnc as string);
    //   kvStore.set(`encId:${stageIdEnc}`, stageId);
    // }

    let eventId = 52;
    

    let query = `
    SELECT
      im.itemname AS name,
      im.itemcode AS itemcode,
      im.stagetype AS stageType,
      ca.categoryname AS categoryName,
      st.stage AS stageName,
      cp.status,
      case 
    when cp.status in ('M', 'F', 'O', 'A', 'D') then 'C'
    else cp.status
  end,
      cp.programdate AS date,
      cp.scheduledstart AS startTime,
      cp.scheduledend AS endTime
    FROM
      ofm_competitions AS cp
      INNER JOIN ofm_itemmaster AS im ON im.itemcode = cp.itemcode
      INNER JOIN ofm_category AS ca ON ca.categoryno = im.categoryno
      INNER JOIN ofm_stages AS st ON st.pid = cp.stageno
    WHERE
      cp.eventid = @eventId
    ORDER BY
      im.itemname,
      ca.categoryname,
      st.stage;
  `;
  

    const data = await executeQuery(query, {
      eventId,
    });

   

    return next(new AppResponse('', data));
  } catch (err) {
    return next(err);
  }
});



export default router;
