import React from 'react';
import { Clock, User, Coffee, Apple } from 'lucide-react';
import type { ConsumptionRecord } from '../../types/Consumption';
import { formatDateTime } from '../../utils/formatters';

interface ConsumptionHistoryProps {
  records: ConsumptionRecord[];
  loading?: boolean;
}

export const ConsumptionHistory: React.FC<ConsumptionHistoryProps> = ({ records, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Historial de Consumos</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Historial de Consumos</h2>
      
      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No hay registros de consumo</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {records.map((record) => (
            <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {record.tipo_servicio_id === 1 ? (
                    <Coffee className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Apple className="h-4 w-4 text-green-600" />
                  )}
                  <span className="font-semibold text-sm">
                    {record.estudiante?.nombres} {record.estudiante?.apellidos}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDateTime(record.hora_registro)}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 mt-1">
                <div className="flex items-center space-x-4">
                  <span>Documento: {record.estudiante?.numero_documento}</span>
                  <span>Grado: {record.estudiante?.grado}{record.estudiante?.grupo}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    record.metodo_registro === 'huella_digital' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {record.metodo_registro === 'huella_digital' ? 'Huella' : 'Manual'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};