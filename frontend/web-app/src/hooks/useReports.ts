import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { DailyReport } from '../types';

export const useReports = () => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDailyReport = useCallback(async (date?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getDailyReport(date);
      if (result.success) {
        setReports(prev => [...prev, result.data]);
        return result.data;
      }
      throw new Error(result.message || 'Error al obtener reporte');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reports, loading, error, getDailyReport };
};