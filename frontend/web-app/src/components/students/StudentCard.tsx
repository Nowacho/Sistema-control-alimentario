import React from 'react';
import { User, Fingerprint, Mail, Book, Users } from 'lucide-react';
import type { Student } from '../../types/Student';
import { formatDocument } from '../../utils/formatters';

interface StudentCardProps {
  student: Student;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  return (
    <div className={`border rounded-lg p-4 ${student.activo ? 'bg-white' : 'bg-gray-50 opacity-75'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            student.activo ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
          }`}>
            <User className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {student.nombres} {student.apellidos}
            </h3>
            
            <div className="text-sm text-gray-600 space-y-1 mt-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Doc: {formatDocument(student.numero_documento)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Book className="h-4 w-4" />
                <span>Grado: {student.grado}{student.grupo}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Fingerprint className="h-4 w-4" />
                <span>Huellas: {student.huellas_registradas}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          student.activo 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {student.activo ? 'Activo' : 'Inactivo'}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Registrado: {new Date(student.fecha_registro).toLocaleDateString()}</span>
          <span>Actualizado: {new Date(student.fecha_actualizacion).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};