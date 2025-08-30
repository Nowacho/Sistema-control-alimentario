export interface ConsumptionRecord {
  id: number;
  estudiante_id: number;
  tipo_servicio_id: number;
  fecha_consumo: string;
  hora_registro: string;
  metodo_registro: 'huella_digital' | 'manual';
  hash_huella_usado?: string;
  observaciones?: string;
  estudiante?: {
    numero_documento: string;
    nombres: string;
    apellidos: string;
    grado: string;
    grupo: string;
  };
  servicio?: {
    nombre: string;
    hora_inicio: string;
    hora_fin: string;
  };
}

export interface ServiceType {
  id: number;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

export interface DailyReport {
  fecha: string;
  estadisticas: Array<{
    servicio: string;
    cantidad: number;
    hora_inicio: string;
    hora_fin: string;
  }>;
  registros_detallados: Array<{
    numero_documento: string;
    nombre_completo: string;
    grado: string;
    grupo: string;
    servicio: string;
    hora_registro: string;
    metodo_registro: string;
  }>;
  total_estudiantes: number;
}