export interface DeviceInfo {
  type: 'USB' | 'Serial' | 'Simulator';
  vendorId?: number;
  productId?: number;
  productName?: string;
  manufacturerName?: string;
  connected?: boolean;
}

export interface ScanResult {
  success: boolean;
  message: string;
  student?: {
    id: number;
    numero_documento: string;
    nombres: string;
    apellidos: string;
    grado: string;
    grupo: string;
  };
  consumptionId?: number;
  timestamp?: string;
  data?: string;
}

export interface FingerprintRegistrationData {
  estudiante_id: number;
  fingerprint_data: string;
  dedo_registrado: string;
}