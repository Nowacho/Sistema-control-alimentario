import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: 'Registro duplicado'
    });
  }

  if (error.sqlMessage) {
    return res.status(400).json({
      success: false,
      message: error.sqlMessage
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
};