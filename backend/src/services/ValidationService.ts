import { pool } from './DatabaseService';

export const validateServiceTime = async (tipo_servicio_id: number): Promise<boolean> => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM tipos_servicio WHERE id = ? AND activo = TRUE AND CURTIME() BETWEEN hora_inicio AND hora_fin',
      [tipo_servicio_id]
    );
    
    return (rows as any[]).length > 0;
  } catch (error) {
    console.error('Error validando horario de servicio:', error);
    return false;
  }
};

export const hasConsumedToday = async (estudiante_id: number, tipo_servicio_id: number): Promise<boolean> => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM registros_consumo WHERE estudiante_id = ? AND tipo_servicio_id = ? AND fecha_consumo = CURDATE()',
      [estudiante_id, tipo_servicio_id]
    );
    
    return (rows as any[]).length > 0;
  } catch (error) {
    console.error('Error verificando consumo:', error);
    return false;
  }
};