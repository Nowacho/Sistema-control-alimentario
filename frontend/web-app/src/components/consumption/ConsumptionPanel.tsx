import React, { useState } from 'react';
import { ServiceSelector } from './ServiceSelector';
import { FingerprintScanner } from '../biometric/FingerprintScanner';
import { useFingerprintDevice } from '../../hooks/useFingerprintDevice';
import { ScanResultComponent } from '../biometric/ScanResult';
import { DeviceStatus } from '../biometric/DeviceStatus';

export const ConsumptionPanel: React.FC = () => {
  const [selectedService, setSelectedService] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const { verifyConsumption, lastResult, deviceInfo, isConnected } = useFingerprintDevice();

  const handleScanComplete = async (fingerprintData: string) => {
    try {
      const result = await verifyConsumption(fingerprintData, selectedService);
      setShowResult(true);
    } catch (error) {
      console.error('Error verifying consumption:', error);
      setShowResult(true);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <ServiceSelector 
          selectedService={selectedService} 
          onServiceChange={setSelectedService} 
        />
        
        <DeviceStatus deviceInfo={deviceInfo} isConnected={isConnected} />
        
        <FingerprintScanner 
          onScanComplete={handleScanComplete}
          serviceType={selectedService}
        />
      </div>

      {showResult && lastResult && (
        <ScanResultComponent result={lastResult} onClose={handleCloseResult} />
      )}
    </div>
  );
};