export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const SERVICE_TYPES = {
  DESAYUNO: 1,
  REFRIGERIO: 2
} as const;

export const FINGER_OPTIONS = [
  { value: 'pulgar_derecho', label: 'Pulgar derecho' },
  { value: 'indice_derecho', label: 'Índice derecho' },
  { value: 'medio_derecho', label: 'Medio derecho' },
  { value: 'anular_derecho', label: 'Anular derecho' },
  { value: 'meñique_derecho', label: 'Meñique derecho' },
  { value: 'pulgar_izquierdo', label: 'Pulgar izquierdo' },
  { value: 'indice_izquierdo', label: 'Índice izquierdo' },
  { value: 'medio_izquierdo', label: 'Medio izquierdo' },
  { value: 'anular_izquierdo', label: 'Anular izquierdo' },
  { value: 'meñique_izquierdo', label: 'Meñique izquierdo' }
];

export const SERVICE_DISPLAY = {
  1: { name: 'Desayuno', icon: '☕', color: 'orange', time: '06:30 - 08:30' },
  2: { name: 'Refrigerio', icon: '🍎', color: 'green', time: '09:30 - 11:00' }
};