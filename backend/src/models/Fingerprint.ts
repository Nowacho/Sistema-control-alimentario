export interface Fingerprint {
  id?: number;
  estudiante_id: number;
  hash_huella: string;
  dedo_registrado: string;
  activa?: boolean;
  fecha_registro?: Date;
}