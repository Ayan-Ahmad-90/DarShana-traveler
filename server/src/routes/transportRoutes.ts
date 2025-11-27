import { Router } from 'express';
import { TransportController } from '../controllers/transportController.js';

const router = Router();

router.get('/cabs/search', TransportController.searchCabs);
router.get('/cruises/search', TransportController.searchCruises);
router.get('/jets/search', TransportController.searchPrivateJets);
router.get('/bikes/search', TransportController.searchBikes);

export default router;
