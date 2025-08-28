import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

   // En esta parte iría la logica de la 
   // verifiación JWT, actualmente es un placeholder
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    // En esta otra parte tendría que ir la
    //  logica para la verifiación del admin
  next();
}; 