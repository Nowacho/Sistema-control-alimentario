import { Request, Response } from 'express';
import { pool } from '../services/DatabaseService';
import { Student } from '../models/Student';

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student: Student = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO estudiantes (numero_documento, nombres, apellidos, grado, grupo) VALUES (?, ?, ?, ?, ?)',
      [student.numero_documento, student.nombres, student.apellidos, student.grado, student.grupo]
    );

    res.status(201).json({
      success: true,
      message: 'Estudiante registrado exitosamente',
      studentId: (result as any).insertId
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        success: false,
        message: 'El número de documento ya está registrado'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        e.id,
        e.numero_documento,
        e.nombres,
        e.apellidos,
        e.grado,
        e.grupo,
        e.activo,
        COUNT(hd.id) as huellas_registradas
      FROM estudiantes e
      LEFT JOIN huellas_digitales hd ON e.id = hd.estudiante_id AND hd.activa = TRUE
      GROUP BY e.id
      ORDER BY e.nombres, e.apellidos
    `);

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