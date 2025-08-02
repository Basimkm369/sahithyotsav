import express from 'express';
import teamManagement from './teamManagement';

const router = express.Router();

router.get('/ping', (_, res) => res.json({ time: new Date() }));
router.use('/teamManagement', teamManagement);

export default router;
