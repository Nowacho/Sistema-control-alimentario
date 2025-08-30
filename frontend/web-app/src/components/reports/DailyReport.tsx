import React, { useState } from 'react';
import { Calendar, Download, Coffee, Apple, Users } from 'lucide-react';
import { useReports } from '../../hooks/useReports';
import { formatDate } from '../../utils/formatters';

export const DailyReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { reports, loading, error, getDailyReport } = useReports();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleGenerateReport = async () => {
    try {
      await getDailyReport(selectedDate);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const currentReport = reports.find(report => report.fecha === selectedDate);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Reporte Diario</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Seleccionar Fecha</span>
            </div>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-end">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{loading ? 'Generando...' : 'Generar Reporte'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {currentReport ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Coffee className="h-5 w-5 text-orange-600" />
                <span className="font-semibold">Desayunos</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {currentReport.estadisticas.find(s => s.servicio === 'desayuno')?.cantidad || 0}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Apple className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Refrigerios</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {currentReport.estadisticas.find(s => s.servicio === 'refrigerio')?.cantidad || 0}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Total Estudiantes</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {currentReport.total_estudiantes}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Registros Detallados</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b p-3 text-left text-sm font-semibold">Estudiante</th>
                    <th className="border-b p-3 text-left text-sm font-semibold">Documento</th>
                    <th className="border-b p-3 text-left text-sm font-semibold">Grado</th>
                    <th className="border-b p-3 text-left text-sm font-semibold">Servicio</th>
                    <th className="border-b p-3 text-left text-sm font-semibold">Hora</th>
                    <th className="border-b p-3 text-left text-sm font-semibold">Método</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReport.registros_detallados.map((registro, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border-b p-3 text-sm">{registro.nombre_completo}</td>
                      <td className="border-b p-3 text-sm">{registro.numero_documento}</td>
                      <td className="border-b p-3 text-sm">{registro.grado}{registro.grupo}</td>
                      <td className="border-b p-3 text-sm capitalize">{registro.servicio}</td>
                      <td className="border-b p-3 text-sm">{registro.hora_registro}</td>
                      <td className="border-b p-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          registro.metodo_registro === 'huella_digital' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {registro.metodo_registro === 'huella_digital' ? 'Huella' : 'Manual'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Seleccione una fecha y genere el reporte</p>
        </div>
      )}
    </div>
  );
};