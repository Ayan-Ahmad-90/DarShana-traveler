import { Router } from 'express';
import { TrainController } from '../controllers/trainController.js';

const router = Router();

router.get('/search', TrainController.searchTrains);
router.get('/schedule', TrainController.getSchedule);
router.get('/:id', TrainController.getTrainDetails);

export default router;
