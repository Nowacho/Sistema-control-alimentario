export interface Fingerprint {
  id?: number;
  estudiante_id: number;
  hash_huella: string;
  dedo_registrado: string;
  activa?: boolean;
  fecha_registro?: Date;
}

export interface FingerprintWithStudent extends Fingerprint {
  numero_documento?: string;
  nombres?: string;
  apellidos?: string;
  grado?: string;
  grupo?: string;
}