import { Router } from 'express';
import { verifyAndRegisterConsumption, registerManualConsumption } from '../controllers/ConsumptionController';

const router = Router();

router.post('/verify', verifyAndRegisterConsumption);
router.post('/manual', registerManualConsumption);

export default router;