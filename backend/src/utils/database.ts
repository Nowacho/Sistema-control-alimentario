import { Pool } from 'mysql2/promise';

export const executeQuery = async (pool: Pool, query: string, params: any[] = []) => {
  try {
    const [result] = await pool.execute(query, params);
    return result;
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
};

export const beginTransaction = async (pool: Pool) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

export const commitTransaction = async (connection: any) => {
  await connection.commit();
  connection.release();
};

export const rollbackTransaction = async (connection: any) => {
  await connection.rollback();
  connection.release();
};