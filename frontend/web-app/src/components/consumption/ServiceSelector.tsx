import React from 'react';
import { Coffee, Apple, Clock } from 'lucide-react';
import { SERVICE_DISPLAY } from '../../utils/constants';

interface Service {
  id: number;
  name: string;
  icon: any;
  time: string;
  color: string;
}

interface ServiceSelectorProps {
  selectedService: number;
  onServiceChange: (serviceId: number) => void;
}

const services: Service[] = [
  { 
    id: 1, 
    name: SERVICE_DISPLAY[1].name, 
    icon: Coffee, 
    time: SERVICE_DISPLAY[1].time, 
    color: 'bg-orange-500' 
  },
  { 
    id: 2, 
    name: SERVICE_DISPLAY[2].name, 
    icon: Apple, 
    time: SERVICE_DISPLAY[2].time, 
    color: 'bg-green-500' 
  }
];

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ selectedService, onServiceChange }) => {
  const getCurrentService = (): number | null => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const currentMinutes = hour * 60 + minute;
    
    if (currentMinutes >= 390 && currentMinutes <= 510) return 1;
    if (currentMinutes >= 570 && currentMinutes <= 660) return 2;
    return null;
  };

  const currentService = getCurrentService();
  const isServiceActive = currentService !== null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Servicio Actual</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {services.map((service) => {
          const IconComponent = service.icon;
          const isActive = currentService === service.id;
          
          return (
            <button
              key={service.id}
              onClick={() => onServiceChange(service.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedService === service.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isActive ? 'ring-2 ring-green-400' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${service.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.time}</div>
                  {isActive && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      • Activo ahora
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {!isServiceActive && (
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800">Fuera del horario de servicio</span>
          </div>
        </div>
      )}
    </div>
  );
};