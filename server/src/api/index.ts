import express from 'express';
import teamManagement from './teamManagement';
import stageManagement from './stageManagement';
import judgement from './judgement';
import admin from './admin';
import foodManagement from './foodManagement';
import mediaManagement from './mediaManagement';
import announceManagement from './announceManagement';
import offstageManagement from './offstageManagement';
// import prizeManagement from './prizeManagement';
// import judgeLinks from './judgeLinks';

const router = express.Router();

router.get('/ping', (_, res) => res.json({ time: new Date() }));
router.use('/teamManagement', teamManagement);
router.use('/stageManagement', stageManagement);
router.use('/mediaManagement', mediaManagement);
router.use('/announceManagement', announceManagement);
router.use('/offstageManagement', offstageManagement);
router.use('/judgement', judgement);
router.use('/admin', admin);
router.use('/foodManagement', foodManagement);
// router.use('/prizeManagement', prizeManagement);
// router.use('/judgeLinks', judgeLinks);

export default router;
