import { Router } from 'express';
import studentRoutes from './students';
import fingerprintRoutes from './fingerprints';
import consumptionRoutes from './consumption';
import reportRoutes from './reports';

const router = Router();

router.use('/students', studentRoutes);
router.use('/fingerprints', fingerprintRoutes);
router.use('/consumption', consumptionRoutes);
router.use('/reports', reportRoutes);

export default router;