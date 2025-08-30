import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Student, StudentFormData } from '../types';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getStudents();
      if (result.success) {
        setStudents(result.data);
      } else {
        setError(result.message || 'Error al cargar estudiantes');
      }
    } catch (err: any) {
      setError('Error de conexión al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (studentData: StudentFormData) => {
    try {
      setError(null);
      const result = await api.createStudent(studentData);
      if (result.success) {
        await loadStudents();
        return result;
      }
      throw new Error(result.message || 'Error al crear estudiante');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [loadStudents]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return { students, loading, error, loadStudents, createStudent };
};