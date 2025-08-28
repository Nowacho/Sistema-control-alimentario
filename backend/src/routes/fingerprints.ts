import { Router } from 'express';
import { registerFingerprint } from '../controllers/FingerprintController';
import { validateFingerprint } from '../middleware/validation';

const router = Router();

router.post('/', validateFingerprint, registerFingerprint);

export default router;