import { Request, Response } from 'express';
import { pool } from '../services/DatabaseService';

export const getDailyReport = async (req: Request, res: Response) => {
  try {
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

    const [consumptionStats] = await pool.execute(`
      SELECT 
        ts.nombre as servicio,
        COUNT(rc.id) as cantidad,
        ts.hora_inicio,
        ts.hora_fin
      FROM tipos_servicio ts
      LEFT JOIN registros_consumo rc ON ts.id = rc.tipo_servicio_id 
        AND rc.fecha_consumo = ?
      WHERE ts.activo = TRUE
      GROUP BY ts.id, ts.nombre, ts.hora_inicio, ts.hora_fin
    `, [fecha]);

    const [detailedRecords] = await pool.execute(`
      SELECT 
        e.numero_documento,
        CONCAT(e.nombres, ' ', e.apellidos) as nombre_completo,
        e.grado,
        e.grupo,
        ts.nombre as servicio,
        rc.hora_registro,
        rc.metodo_registro
      FROM registros_consumo rc
      JOIN estudiantes e ON rc.estudiante_id = e.id
      JOIN tipos_servicio ts ON rc.tipo_servicio_id = ts.id
      WHERE rc.fecha_consumo = ?
      ORDER BY rc.hora_registro DESC
    `, [fecha]);

    const [totalStudents] = await pool.execute(
      'SELECT COUNT(*) as total FROM estudiantes WHERE activo = TRUE'
    );

    res.status(200).json({
      success: true,
      data: {
        fecha,
        estadisticas: consumptionStats,
        registros_detallados: detailedRecords,
        total_estudiantes: (totalStudents as any[])[0].total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getServiceTypes = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM tipos_servicio WHERE activo = TRUE ORDER BY hora_inicio'
    );

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};