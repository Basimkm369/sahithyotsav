import express from 'express';
import teamManagement from './teamManagement';
import stageManagement from './stageManagement';
import judgement from './judgement';
import admin from './admin';

const router = express.Router();

router.get('/ping', (_, res) => res.json({ time: new Date() }));
router.use('/teamManagement', teamManagement);
router.use('/stageManagement', stageManagement);
router.use('/judgement', judgement);
router.use('/admin', admin);

export default router;
