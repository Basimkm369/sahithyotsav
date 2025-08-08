import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import AppError from "src/models/AppError";
import AppResponse from "src/models/AppResponse";
import { decryptId, executeQuery, executeStoredProcedure } from "src/utils/db";
import kvStore from "src/utils/kvStore";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { eventId: eventIdEnc, teamId: teamIdEnc } = req.query;

  let eventId = kvStore.get(`encId:${eventIdEnc}`);
  if (!eventId) {
    eventId = await decryptId(eventIdEnc as string);
    kvStore.set(`encId:${eventIdEnc}`, eventId);
  }

  let categories = kvStore.get(`categories`);
  if (!categories) {
    categories = await executeQuery(
      `select categoryno as number, categoryname as name from ofm_category`
    );
    kvStore.set("categories", categories);
  }

  return next(
    new AppResponse("", {
      categories,
    })
  );
});

router.get("/competitions", async (req, res, next) => {
  try {
    const { categoryId, eventId: eventIdEnc } = req.query;

    let eventId = kvStore.get(`encId:${eventIdEnc}`);
    if (!eventId) {
      eventId = await decryptId(eventIdEnc as string);
      kvStore.set(`encId:${eventIdEnc}`, eventId);
    }

    let query = `select
    cp.id as id,
    cp.itemcode as itemCode,
    im.itemname as name,
    cp.status,
    cp.programdate as date,
    cp.scheduledstart as startTime,
    cp.scheduledend as endTime,
    cp.Judge1Link,
    cp.Judge2Link,
    cp.Judge3Link,
    jd1.pid as judge1Id,
    jd2.pid as judge2Id,
    jd3.pid as judge3Id,
    ISNULL(jd1.judgename, '') as judge1Name,
    ISNULL(jd2.judgename, '') as judge2Name,
    ISNULL(jd3.judgename, '') as judge3Name
  from
    ofm_competitions as cp
    inner join ofm_itemmaster as im on im.itemcode = cp.itemcode
    left join ofm_judges as jd1 on jd1.pid = cp.judgeid1
    left join ofm_judges as jd2 on jd2.pid = cp.judgeid2
    left join ofm_judges as jd3 on jd3.pid = cp.judgeid3
  where cp.eventid = @eventId
  `;

    if (categoryId) query += ` and im.categoryno = @categoryId`;

    query += ` group by
      im.itemname,
      cp.status,
      cp.itemcode,
      cp.id,
      cp.programdate,
      cp.scheduledstart,
      cp.scheduledend,
      cp.Judge1Link,
      cp.Judge2Link,
      cp.Judge3Link,
      jd1.pid,
      jd2.pid,
      jd3.pid,
      jd1.judgename,
      jd2.judgename,
      jd3.judgename
    order by
      im.itemname;`;

    const data = await executeQuery(query, {
      eventId,
      categoryId,
    });

    data.forEach((item) => {
      ["Judge1Link", "Judge2Link", "Judge3Link"].forEach((key, index) => {
        if (item[key]) {
          const url = new URL(item[key]);
          const eventId = url.searchParams.get("eventid");
          const itemId = url.searchParams.get("ItemCode");
          const judgeId = url.searchParams.get("SINO");

          item[
            key
          ] = `https://sahityotsav.ssfkerala.org/judgement?eventId=${eventId}&itemId=${itemId}&judgeId=${judgeId}`;
        }
      });
    });

    return next(new AppResponse("", data));
  } catch (err) {
    return next(err);
  }
});

export default router;
