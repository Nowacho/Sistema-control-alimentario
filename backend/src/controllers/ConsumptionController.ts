import { Request, Response } from 'express';
import { pool } from '../services/DatabaseService';
import { verifyFingerprint } from '../services/FingerprintService';

export const verifyAndRegisterConsumption = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { fingerprint_data, tipo_servicio_id } = req.body;

    const [fingerprintRows] = await connection.execute(`
      SELECT hd.*, e.numero_documento, e.nombres, e.apellidos, e.grado, e.grupo
      FROM huellas_digitales hd
      JOIN estudiantes e ON hd.estudiante_id = e.id
      WHERE hd.activa = TRUE AND e.activo = TRUE
    `);

    let matchedStudent = null;
    let matchedFingerprint = null;

    for (const fingerprint of (fingerprintRows as any[])) {
      const isMatch = await verifyFingerprint(fingerprint_data, fingerprint.hash_huella);
      if (isMatch) {
        matchedStudent = {
          id: fingerprint.estudiante_id,
          numero_documento: fingerprint.numero_documento,
          nombres: fingerprint.nombres,
          apellidos: fingerprint.apellidos,
          grado: fingerprint.grado,
          grupo: fingerprint.grupo
        };
        matchedFingerprint = fingerprint;
        break;
      }
    }

    if (!matchedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Huella digital no reconocida'
      });
    }

    const [serviceRows] = await connection.execute(`
      SELECT * FROM tipos_servicio 
      WHERE id = ? AND activo = TRUE
      AND CURTIME() BETWEEN hora_inicio AND hora_fin
    `, [tipo_servicio_id]);

    if ((serviceRows as any[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Servicio no disponible en este horario'
      });
    }

    const [consumptionRows] = await connection.execute(`
      SELECT * FROM registros_consumo 
      WHERE estudiante_id = ? AND tipo_servicio_id = ? AND fecha_consumo = CURDATE()
    `, [matchedStudent.id, tipo_servicio_id]);

    if ((consumptionRows as any[]).length > 0) {
      return res.status(400).json({
        success: false,
        message: `${matchedStudent.nombres} ${matchedStudent.apellidos} ya registró este servicio hoy`,
        student: matchedStudent
      });
    }

    const [insertResult] = await connection.execute(`
      INSERT INTO registros_consumo (estudiante_id, tipo_servicio_id, fecha_consumo, hash_huella_usado)
      VALUES (?, ?, CURDATE(), ?)
    `, [matchedStudent.id, tipo_servicio_id, matchedFingerprint.hash_huella]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Consumo registrado exitosamente',
      student: matchedStudent,
      consumptionId: (insertResult as any).insertId,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    await connection.rollback();
    
    if (error.sqlMessage && error.sqlMessage.includes('Ya registró este servicio hoy')) {
      res.status(400).json({
        success: false,
        message: error.sqlMessage
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  } finally {
    connection.release();
  }
};

export const registerManualConsumption = async (req: Request, res: Response) => {
  try {
    const { estudiante_id, tipo_servicio_id, observaciones } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO registros_consumo (estudiante_id, tipo_servicio_id, fecha_consumo, metodo_registro, observaciones)
      VALUES (?, ?, CURDATE(), 'manual', ?)
    `, [estudiante_id, tipo_servicio_id, observaciones || null]);

    res.status(201).json({
      success: true,
      message: 'Consumo registrado manualmente',
      consumptionId: (result as any).insertId
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        success: false,
        message: 'El estudiante ya registró este servicio hoy'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};