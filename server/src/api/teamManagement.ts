import express from 'express';
import AppResponse from 'src/models/AppResponse';
import { executeQuery } from 'src/utils/db';

const router = express.Router();

router.get('/', async (req, res, next) => {
  // const { teamId: teamIdEnc } = req.params;

  // const teamId = await executeStoredProcedure('Usp_DecryptIdKey', {
  //   EncryptedTxt: teamIdEnc,
  // });

  const data = await executeQuery(
    `select count(cp.id) as count, stage 
    from ofm_stages as st 
    left join ofm_competitions as cp 
      on cp.stageno = st.pid
    group by stage`,
  );

  return next(new AppResponse('', data));
});

export default router;
