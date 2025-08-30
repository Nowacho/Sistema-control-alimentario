import React from 'react';
import { Wifi, WifiOff, Usb, Cable } from 'lucide-react';
import type { DeviceInfo } from '../../types/Device';

interface DeviceStatusProps {
  deviceInfo: DeviceInfo | null;
  isConnected: boolean;
}

export const DeviceStatus: React.FC<DeviceStatusProps> = ({ deviceInfo, isConnected }) => {
  if (!deviceInfo) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <WifiOff className="h-5 w-5" />
        <span>Dispositivo no conectado</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-full ${
        isConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {isConnected ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          {deviceInfo.type === 'USB' && <Usb className="h-4 w-4 text-blue-600" />}
          {deviceInfo.type === 'Serial' && <Cable className="h-4 w-4 text-green-600" />}
          <span className="font-medium">{deviceInfo.type}</span>
        </div>
        
        {deviceInfo.productName && (
          <p className="text-sm text-gray-600">{deviceInfo.productName}</p>
        )}
        
        {deviceInfo.vendorId && deviceInfo.productId && (
          <p className="text-xs text-gray-500">
            ID: {deviceInfo.vendorId?.toString(16)}:{deviceInfo.productId?.toString(16)}
          </p>
        )}
      </div>
      
      <div className={`px-2 py-1 rounded text-xs font-medium ${
        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? 'Conectado' : 'Desconectado'}
      </div>
    </div>
  );
};