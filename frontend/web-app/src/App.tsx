import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  User, 
  Coffee, 
  BarChart3, 
  Home,
  Settings
} from 'lucide-react';
import { ConsumptionPanel } from './components/consumption/ConsumptionPanel';
import { StudentList } from './components/students/StudentList';
import { DailyReport } from './components/reports/DailyReport';
import { Statistics } from './components/reports/Statistics';
import { useStudents } from './hooks/useStudents';

type Tab = 'dashboard' | 'consumption' | 'students' | 'reports' | 'settings';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { students, loading, error, createStudent, loadStudents } = useStudents();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Statistics
              totalStudents={students.length}
              activeStudents={students.filter(s => s.activo).length}
              todayConsumptions={0}
              weekConsumptions={0}
            />
            <ConsumptionPanel />
          </div>
        );
      case 'consumption':
        return <ConsumptionPanel />;
      case 'students':
        return (
          <StudentList
            students={students}
            loading={loading}
            error={error}
            onCreateStudent={async (data) => {
              await createStudent(data);
            }}
            onRefresh={loadStudents}
          />
        );

      
      case 'reports':
        return <DailyReport />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración</h2>
            <p className="text-gray-600">Panel de configuración en desarrollo...</p>
          </div>
        );
      default:
        return <ConsumptionPanel />;
    }
  };

  const NavigationItem: React.FC<{ 
    icon: React.ComponentType<any>; 
    label: string; 
    tab: Tab;
    count?: number;
  }> = ({ icon: Icon, label, tab, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
      {count !== undefined && (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen p-4">
          <div className="flex items-center space-x-3 p-4 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Fingerprint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Control Biométrico</h1>
              <p className="text-xs text-gray-600">Sistema Alimentario</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavigationItem icon={Home} label="Dashboard" tab="dashboard" />
            <NavigationItem icon={Coffee} label="Consumos" tab="consumption" />
            <NavigationItem 
              icon={User} 
              label="Estudiantes" 
              tab="students" 
              count={students.length} 
            />
            <NavigationItem icon={BarChart3} label="Reportes" tab="reports" />
            <NavigationItem icon={Settings} label="Configuración" tab="settings" />
          </nav>

          <div className="mt-auto p-4">
            <div className="text-xs text-gray-500 text-center">
              <p>v1.0.0</p>
              <p>© 2024 Sistema Alimentario</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {activeTab === 'dashboard' && 'Dashboard'}
                    {activeTab === 'consumption' && 'Registro de Consumos'}
                    {activeTab === 'students' && 'Gestión de Estudiantes'}
                    {activeTab === 'reports' && 'Reportes y Estadísticas'}
                    {activeTab === 'settings' && 'Configuración'}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'dashboard' && 'Resumen general del sistema'}
                    {activeTab === 'consumption' && 'Registro de desayunos y refrigerios'}
                    {activeTab === 'students' && 'Gestión de estudiantes registrados'}
                    {activeTab === 'reports' && 'Reportes detallados y estadísticas'}
                    {activeTab === 'settings' && 'Configuración del sistema'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-gray-600">
                    {currentTime.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;