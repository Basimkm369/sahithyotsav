import express from 'express';
import teamManagement from './teamManagement';
import stageManagement from './stageManagement';

const router = express.Router();

router.get('/ping', (_, res) => res.json({ time: new Date() }));
router.use('/teamManagement', teamManagement);
router.use('/stageManagement', stageManagement);

export default router;
