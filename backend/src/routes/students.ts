import { Router } from 'express';
import { createStudent, getStudents } from '../controllers/StudentController';
import { validateStudent } from '../middleware/validation';

const router = Router();

router.post('/', validateStudent, createStudent);
router.get('/', getStudents);

export default router;