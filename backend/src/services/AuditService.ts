import { pool } from './DatabaseService';

export const logAudit = async (
  tabla_afectada: string,
  registro_id: number,
  accion: 'INSERT' | 'UPDATE' | 'DELETE',
  datos_anteriores: any = null,
  datos_nuevos: any = null,
  usuario: string = 'system'
) => {
  try {
    await pool.execute(
      'INSERT INTO auditoria (tabla_afectada, registro_id, accion, datos_anteriores, datos_nuevos, usuario) VALUES (?, ?, ?, ?, ?, ?)',
      [tabla_afectada, registro_id, accion, JSON.stringify(datos_anteriores), JSON.stringify(datos_nuevos), usuario]
    );
  } catch (error) {
    console.error('Error al registrar auditoría:', error);
  }
};