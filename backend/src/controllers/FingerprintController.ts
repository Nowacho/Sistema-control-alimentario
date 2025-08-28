import { Request, Response } from 'express';
import { pool } from '../services/DatabaseService';
import { hashFingerprint } from '../services/FingerprintService';

export const registerFingerprint = async (req: Request, res: Response) => {
  try {
    const { estudiante_id, fingerprint_data, dedo_registrado } = req.body;
    
    const [studentRows] = await pool.execute(
      'SELECT id FROM estudiantes WHERE id = ? AND activo = TRUE',
      [estudiante_id]
    );

    if ((studentRows as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado o inactivo'
      });
    }

    const hashedFingerprint = await hashFingerprint(fingerprint_data);

    const [result] = await pool.execute(
      'INSERT INTO huellas_digitales (estudiante_id, hash_huella, dedo_registrado) VALUES (?, ?, ?)',
      [estudiante_id, hashedFingerprint, dedo_registrado]
    );

    res.status(201).json({
      success: true,
      message: 'Huella digital registrada exitosamente',
      fingerprintId: (result as any).insertId
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        success: false,
        message: 'Ya existe una huella registrada para este dedo del estudiante'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};