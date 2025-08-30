import { useState, useEffect, useCallback } from 'react';
import { FingerprintClient } from '../services/fingerprintClient';
import type { ScanResult, DeviceInfo } from '../types';

export const useFingerprintDevice = () => {
  const [client] = useState(() => new FingerprintClient());
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    const handleConnected = (data: any) => {
      setIsConnected(true);
      setDeviceInfo(client.getDeviceInfo());
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setDeviceInfo(null);
    };

    const handleScanStart = () => setIsScanning(true);
    const handleScanEnd = () => setIsScanning(false);
    const handleScanSuccess = (data: any) => setLastResult({ success: true, ...data });
    const handleScanError = (data: any) => setLastResult({ success: false, ...data });
    const handleConsumptionRegistered = (data: any) => setLastResult({ success: true, ...data });
    const handleConsumptionError = (data: any) => setLastResult({ success: false, ...data });

    client.on('connected', handleConnected);
    client.on('disconnected', handleDisconnected);
    client.on('scanStart', handleScanStart);
    client.on('scanEnd', handleScanEnd);
    client.on('scanSuccess', handleScanSuccess);
    client.on('scanError', handleScanError);
    client.on('consumptionRegistered', handleConsumptionRegistered);
    client.on('consumptionError', handleConsumptionError);

    return () => {
      client.disconnect();
    };
  }, [client]);

  const connectUSB = useCallback(() => client.connectUSBDevice(), [client]);
  const connectSerial = useCallback(() => client.connectSerialDevice(), [client]);
  const scan = useCallback(() => client.scanFingerprint(), [client]);
  const disconnect = useCallback(() => client.disconnect(), [client]);
  const verifyConsumption = useCallback((data: string, serviceType: number) => 
    client.verifyAndRegisterConsumption(data, serviceType), [client]);
  const registerFingerprint = useCallback((studentId: number, fingerprintData: string, finger: string) => 
    client.registerNewFingerprint(studentId, fingerprintData, finger), [client]);

  return {
    isConnected,
    isScanning,
    deviceInfo,
    lastResult,
    connectUSB,
    connectSerial,
    scan,
    disconnect,
    verifyConsumption,
    registerFingerprint
  };
};