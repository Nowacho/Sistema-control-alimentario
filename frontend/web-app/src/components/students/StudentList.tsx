import React, { useState } from 'react';
import { User, Plus, Search, Filter } from 'lucide-react';
import { StudentCard } from './StudentCard';
import { StudentForm } from './StudentForm';
import type { Student } from '../../types/Student';

interface StudentListProps {
  students: Student[];
  loading: boolean;
  error: string | null;
  onCreateStudent: (studentData: any) => Promise<void>;
  onRefresh: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  loading,
  error,
  onCreateStudent,
  onRefresh
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(true);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.numero_documento.includes(searchTerm);
    
    const matchesFilter = filterActive ? student.activo : true;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Estudiantes</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Estudiantes</h2>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <button
            onClick={onRefresh}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Lista de Estudiantes</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Estudiante</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
          <Filter className="h-4 w-4 text-gray-600" />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filterActive}
              onChange={(e) => setFilterActive(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm">Solo activos</span>
          </label>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>{searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))
        )}
      </div>

      {showForm && (
        <StudentForm
          onSubmit={onCreateStudent}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};