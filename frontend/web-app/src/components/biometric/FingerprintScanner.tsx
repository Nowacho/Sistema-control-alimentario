import React from 'react';
import { Fingerprint, Check, X } from 'lucide-react';
import { useFingerprintDevice } from '../../hooks/useFingerprintDevice';

interface FingerprintScannerProps {
  onScanComplete?: (data: string) => void;
  serviceType: number;
}

export const FingerprintScanner: React.FC<FingerprintScannerProps> = ({ onScanComplete, serviceType }) => {
  const { isConnected, isScanning, lastResult, scan, connectUSB, connectSerial } = useFingerprintDevice();

  const handleScan = async () => {
    try {
      const fingerprintData = await scan();
      if (onScanComplete) onScanComplete(fingerprintData);
    } catch (error) {
      console.error('Error scanning fingerprint:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Escáner de Huella Digital</h2>
      
      <div className="text-center">
        <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all ${
          isScanning ? 'bg-blue-100 animate-pulse' : 'bg-gray-100 hover:bg-gray-200'
        }`}>
          <Fingerprint className={`h-16 w-16 ${isScanning ? 'text-blue-600' : 'text-gray-400'}`} />
        </div>
        
        <button
          onClick={handleScan}
          disabled={!isConnected || isScanning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {isScanning ? 'Escaneando...' : 'Colocar Dedo'}
        </button>
        
        {!isConnected && (
          <div className="mt-4 space-x-2">
            <button onClick={connectUSB} className="bg-green-600 text-white px-4 py-2 rounded">
              Conectar USB
            </button>
            <button onClick={connectSerial} className="bg-green-600 text-white px-4 py-2 rounded">
              Conectar Serial
            </button>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mt-2">
          {isConnected ? 'Presione el botón y coloque el dedo en el sensor' : 'Conecte un dispositivo primero'}
        </p>
      </div>

      {lastResult && (
        <div className={`mt-6 p-4 rounded-lg ${
          lastResult.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {lastResult.success ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
            <span className={lastResult.success ? 'text-green-800' : 'text-red-800'}>
              {lastResult.message}
            </span>
          </div>
          {lastResult.student && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <div className="text-sm">
                <p><strong>Estudiante:</strong> {lastResult.student.nombres} {lastResult.student.apellidos}</p>
                <p><strong>Documento:</strong> {lastResult.student.numero_documento}</p>
                <p><strong>Grado:</strong> {lastResult.student.grado}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};