export interface Student {
  id: number;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  grado: string;
  grupo: string;
  activo: boolean;
  fecha_registro: string;
  fecha_actualizacion: string;
  huellas_registradas: number;
}

export interface StudentFormData {
  numero_documento: string;
  nombres: string;
  apellidos: string;
  grado: string;
  grupo: string;
}