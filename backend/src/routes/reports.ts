import { Router } from 'express';
import { getDailyReport, getServiceTypes } from '../controllers/ReportController';

const router = Router();

router.get('/daily', getDailyReport);
router.get('/service-types', getServiceTypes);

export default router;