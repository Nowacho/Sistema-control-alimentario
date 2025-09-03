import express, { Request, Response } from 'express';
import cors from 'cors';
import { requestLogger, responseLogger } from './middleware/logging';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(responseLogger);

app.use('/api', apiRoutes);

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Sistema operativo',
      timestamp: new Date().toISOString(),
      database: 'conectada'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Sistema no disponible',
      database: 'desconectada'
    });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});