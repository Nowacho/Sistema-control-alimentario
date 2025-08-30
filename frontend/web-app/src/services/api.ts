import { API_BASE_URL } from '../utils/constants';
import type { Student, StudentFormData, ConsumptionRecord, ServiceType, DailyReport, FingerprintRegistrationData } from '../types';

export const api = {
  async getStudents(): Promise<{ success: boolean; data: Student[]; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/students`);
    return response.json();
  },

  async createStudent(studentData: StudentFormData): Promise<{ success: boolean; studentId?: number; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    return response.json();
  },

  async registerFingerprint(fingerprintData: FingerprintRegistrationData): Promise<{ success: boolean; fingerprintId?: number; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/fingerprints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fingerprintData)
    });
    return response.json();
  },

  async verifyConsumption(consumptionData: { fingerprint_data: string; tipo_servicio_id: number }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/verify-consumption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consumptionData)
    });
    return response.json();
  },

  async registerManualConsumption(consumptionData: { estudiante_id: number; tipo_servicio_id: number; observaciones?: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/manual-consumption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consumptionData)
    });
    return response.json();
  },

  async getDailyReport(date?: string): Promise<{ success: boolean; data: DailyReport; message?: string }> {
    const url = date ? `${API_BASE_URL}/daily-report?fecha=${date}` : `${API_BASE_URL}/daily-report`;
    const response = await fetch(url);
    return response.json();
  },

  async getServiceTypes(): Promise<{ success: boolean; data: ServiceType[]; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/service-types`);
    return response.json();
  },

  async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string; database: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
};