export interface Student {
  id?: number;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  grado: string;
  grupo: string;
  activo?: boolean;
  fecha_registro?: Date;
  fecha_actualizacion?: Date;
}

export interface StudentWithFingerprints extends Student {
  huellas_registradas: number;
}