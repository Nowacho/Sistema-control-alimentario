import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

export const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error en solicitud', {
    method: req.method,
    path: req.path,
    error: error.message,
    stack: error.stack
  });
  
  next(error);
};