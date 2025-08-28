import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateStudent = [
  body('numero_documento').notEmpty().withMessage('Número de documento requerido'),
  body('nombres').notEmpty().withMessage('Nombres requeridos'),
  body('apellidos').notEmpty().withMessage('Apellidos requeridos'),
  body('grado').notEmpty().withMessage('Grado requerido'),
  body('grupo').notEmpty().withMessage('Grupo requerido'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateFingerprint = [
  body('estudiante_id').isInt().withMessage('ID de estudiante inválido'),
  body('fingerprint_data').notEmpty().withMessage('Datos de huella requeridos'),
  body('dedo_registrado').isIn([
    'pulgar_derecho', 'indice_derecho', 'medio_derecho', 'anular_derecho', 'meñique_derecho',
    'pulgar_izquierdo', 'indice_izquierdo', 'medio_izquierdo', 'anular_izquierdo', 'meñique_izquierdo'
  ]).withMessage('Dedo registrado inválido'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }
    next();
  }
];