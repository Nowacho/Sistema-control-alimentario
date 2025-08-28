import mysql from 'mysql2/promise';
import { logger } from '../utils/logger';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_alimentario',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const pool = mysql.createPool(dbConfig);

pool.on('connection', (connection) => {
  logger.info('Nueva conexión de base de datos establecida');
});

pool.on('acquire', (connection) => {
  logger.info('Conexión adquirida del pool');
});

pool.on('release', (connection) => {
  logger.info('Conexión liberada al pool');
});

pool.on('enqueue', () => {
  logger.info('Esperando conexión disponible');
});

export const executeQuery = async (query: string, params: any[] = []) => {
  const start = Date.now();
  try {
    const [result] = await pool.execute(query, params);
    const duration = Date.now() - start;
    logger.database(query, params, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    if (error instanceof Error) {
      logger.error('Error en query de base de datos', {
        query,
        params,
        duration: `${duration}ms`,
        error: error.message
      });
    } else {
      logger.error('Error en query de base de datos', {
        query,
        params,
        duration: `${duration}ms`,
        error: String(error)
      });
    }
    throw error;
  }
};