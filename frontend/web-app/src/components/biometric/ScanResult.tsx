import React from 'react';
import { Check, X, User, Clock } from 'lucide-react';
import type { ScanResult } from '../../types/Device';

interface ScanResultProps {
  result: ScanResult;
  onClose: () => void;
}

export const ScanResultComponent: React.FC<ScanResultProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`bg-white rounded-xl p-6 max-w-md w-full mx-4 ${
        result.success ? 'border-green-400' : 'border-red-400'
      } border-2`}>
        <div className="flex items-center space-x-3 mb-4">
          {result.success ? (
            <Check className="h-8 w-8 text-green-600" />
          ) : (
            <X className="h-8 w-8 text-red-600" />
          )}
          <h3 className="text-lg font-semibold">
            {result.success ? 'Éxito' : 'Error'}
          </h3>
        </div>
        
        <p className="mb-4">{result.message}</p>
        
        {result.student && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold">Información del Estudiante</h4>
            </div>
            <div className="text-sm space-y-1">
              <p><strong>Nombre:</strong> {result.student.nombres} {result.student.apellidos}</p>
              <p><strong>Documento:</strong> {result.student.numero_documento}</p>
              <p><strong>Grado:</strong> {result.student.grado}</p>
              <p><strong>Grupo:</strong> {result.student.grupo}</p>
            </div>
          </div>
        )}
        
        {result.timestamp && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};