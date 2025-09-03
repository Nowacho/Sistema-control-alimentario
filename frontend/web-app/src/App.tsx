import { useState } from 'react';
import { StudentList } from './components/students/StudentList';
import { StudentForm } from './components/students/StudentForm';
import { ConsumptionPanel } from './components/consumption/ConsumptionPanel';
import { DailyReport } from './components/reports/DailyReport';
import { useStudents } from './hooks/useStudents';

function App() {
  const [activeTab, setActiveTab] = useState('students');
  const [showStudentForm, setShowStudentForm] = useState(false);
  const { students, loading, error, createStudent, loadStudents } = useStudents();

  const handleCreateStudent = async (studentData: any) => {
    try {
      await createStudent(studentData);
      setShowStudentForm(false);
      await loadStudents();
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    return loadStudents();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Sistema de Control Alimentario</h1>
        <p className="text-blue-100">Gestión con Autenticación Biométrica</p>
      </header>

      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'students', label: 'Estudiantes', icon: '👥' },
              { id: 'consumption', label: 'Control de Consumo', icon: '🍽️' },
              { id: 'reports', label: 'Reportes', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestión de Estudiantes</h2>
              <button
                onClick={() => setShowStudentForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Nuevo Estudiante
              </button>
            </div>

            {showStudentForm && (
              <StudentForm
                onSubmit={handleCreateStudent}
                onClose={() => setShowStudentForm(false)}
              />
            )}

            <StudentList
              students={students}
              loading={loading}
              error={error}
              onCreateStudent={async () => setShowStudentForm(true)}
              onRefresh={handleRefresh}
            />
          </div>
        )}
        
        {activeTab === 'consumption' && <ConsumptionPanel />}
        
        {activeTab === 'reports' && <DailyReport />}
      </main>
    </div>
  );
}

export default App;