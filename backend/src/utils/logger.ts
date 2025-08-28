import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(__dirname, '../../logs');

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const getCurrentLogFile = (logType: string) => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return path.join(LOGS_DIR, `${logType}-${date}.log`);
};

export const logger = {
  info: (message: string, data?: any) => {
    const logMessage = `[INFO] ${new Date().toISOString()} - ${message} ${data ? JSON.stringify(data) : ''}\n`;
    fs.appendFileSync(getCurrentLogFile('application'), logMessage);
    console.log(logMessage.trim());
  },
  
  error: (message: string, error?: any) => {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : {};
    
    const logMessage = `[ERROR] ${new Date().toISOString()} - ${message} ${JSON.stringify(errorData)}\n`;
    fs.appendFileSync(getCurrentLogFile('error'), logMessage);
    console.error(logMessage.trim());
  },
  
  audit: (action: string, userId: string, details: any) => {
    const logMessage = `[AUDIT] ${new Date().toISOString()} - User: ${userId} - Action: ${action} - Details: ${JSON.stringify(details)}\n`;
    fs.appendFileSync(getCurrentLogFile('audit'), logMessage);
  },
  
  database: (query: string, params: any[], executionTime: number) => {
    const logMessage = `[DB] ${new Date().toISOString()} - Query: ${query} - Params: ${JSON.stringify(params)} - Time: ${executionTime}ms\n`;
    fs.appendFileSync(getCurrentLogFile('database'), logMessage);
  }
};

export const cleanupOldLogs = () => {
  try {
    const files = fs.readdirSync(LOGS_DIR);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).getTime();

    files.forEach(file => {
      const filePath = path.join(LOGS_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile() && stats.mtimeMs < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
        logger.info(`Log antiguo eliminado: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error limpiando logs antiguos:', error);
  }
};

cleanupOldLogs();