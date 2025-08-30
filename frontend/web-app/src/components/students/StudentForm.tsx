import React, { useState } from 'react';
import { X, User, Mail, Book, Users } from 'lucide-react';
import { validateDocument, validateName, validateGrade, validateGroup } from '../../utils/validators';

interface StudentFormData {
  numero_documento: string;
  nombres: string;
  apellidos: string;
  grado: string;
  grupo: string;
}

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => Promise<void>;
  onClose: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<StudentFormData>({
    numero_documento: '',
    nombres: '',
    apellidos: '',
    grado: '',
    grupo: ''
  });
  
  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};

    if (!formData.numero_documento) {
      newErrors.numero_documento = 'El documento es requerido';
    } else if (!validateDocument(formData.numero_documento)) {
      newErrors.numero_documento = 'Documento inválido';
    }

    if (!formData.nombres) {
      newErrors.nombres = 'Los nombres son requeridos';
    } else if (!validateName(formData.nombres)) {
      newErrors.nombres = 'Nombres inválidos';
    }

    if (!formData.apellidos) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    } else if (!validateName(formData.apellidos)) {
      newErrors.apellidos = 'Apellidos inválidos';
    }

    if (!formData.grado) {
      newErrors.grado = 'El grado es requerido';
    } else if (!validateGrade(formData.grado)) {
      newErrors.grado = 'Grado inválido';
    }

    if (!formData.grupo) {
      newErrors.grupo = 'El grupo es requerido';
    } else if (!validateGroup(formData.grupo)) {
      newErrors.grupo = 'Grupo inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof StudentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Nuevo Estudiante</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Número de Documento</span>
              </div>
            </label>
            <input
              type="text"
              name="numero_documento"
              value={formData.numero_documento}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.numero_documento ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 1234567890"
            />
            {errors.numero_documento && (
              <p className="text-red-500 text-sm mt-1">{errors.numero_documento}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Nombres</span>
              </div>
            </label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nombres ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Juan Carlos"
            />
            {errors.nombres && (
              <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Apellidos</span>
              </div>
            </label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.apellidos ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Pérez García"
            />
            {errors.apellidos && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4" />
                  <span>Grado</span>
                </div>
              </label>
              <input
                type="text"
                name="grado"
                value={formData.grado}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.grado ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 10"
              />
              {errors.grado && (
                <p className="text-red-500 text-sm mt-1">{errors.grado}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Grupo</span>
                </div>
              </label>
              <input
                type="text"
                name="grupo"
                value={formData.grupo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.grupo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: A"
              />
              {errors.grupo && (
                <p className="text-red-500 text-sm mt-1">{errors.grupo}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Estudiante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};