export interface ConsumptionRecord {
  id?: number;
  estudiante_id: number;
  tipo_servicio_id: number;
  fecha_consumo: string;
  hora_registro?: Date;
  metodo_registro?: 'huella_digital' | 'manual';
  hash_huella_usado?: string;
  observaciones?: string;
}