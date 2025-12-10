import { Router } from 'express';
import { LogsController } from '../controllers/logs.controller';

const router = Router();
const logsController = new LogsController;

router.get('/logs', logsController.getLastAction);

export default router;