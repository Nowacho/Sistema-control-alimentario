import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useConsumption = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerManualConsumption = useCallback(async (consumptionData: {
    estudiante_id: number;
    tipo_servicio_id: number;
    observaciones?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.registerManualConsumption(consumptionData);
      if (result.success) return result;
      throw new Error(result.message || 'Error al registrar consumo manual');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, registerManualConsumption };
};