import { api } from './api';

interface EventListeners {
  [key: string]: Function[];
}

declare global {
  interface Navigator {
    usb?: any;
    serial?: any;
  }
}

interface USBDevice {
  open(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  transferOut(endpointNumber: number, data: BufferSource): Promise<void>;
  transferIn(endpointNumber: number, length: number): Promise<any>;
  releaseInterface(interfaceNumber: number): Promise<void>;
  close(): Promise<void>;
  configuration: any;
  productName?: string;
  vendorId?: number;
  productId?: number;
  manufacturerName?: string;
}

interface SerialPort {
  open(options: any): Promise<void>;
  close(): Promise<void>;
  readable: any;
  writable: any;
  getReader(): any;
  getWriter(): any;
}

export class FingerprintClient {
  private device: USBDevice | SerialPort | null = null;
  private isConnected = false;
  private isScanning = false;
  private eventListeners: EventListeners = {};

  constructor(private apiBaseUrl: string = 'http://localhost:3001/api') {}

  on(event: string, callback: Function): void {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(callback);
  }

  emit(event: string, data: any = {}): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  async connectUSBDevice(): Promise<boolean> {
    try {
      if (!navigator.usb) return false;

      const filters = [{ vendorId: 0x1162 }, { vendorId: 0x16d1 }, { vendorId: 0x0483 }, { vendorId: 0x147e }, { vendorId: 0x08ff }];

      const device = await navigator.usb.requestDevice({ filters });
      this.device = device as USBDevice;
      await this.device.open();
      
      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }

      await this.device.claimInterface(0);
      this.isConnected = true;
      this.emit('connected', { deviceName: this.device.productName });
      return true;
    } catch (error: any) {
      this.emit('error', { type: 'connection', message: error.message });
      return false;
    }
  }

  async connectSerialDevice(): Promise<boolean> {
    try {
      if (!navigator.serial) return false;

      const device = await navigator.serial.requestPort();
      this.device = device as SerialPort;
      await this.device.open({ baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none' });
      this.isConnected = true;
      this.emit('connected', { deviceType: 'serial' });
      return true;
    } catch (error: any) {
      this.emit('error', { type: 'connection', message: error.message });
      return false;
    }
  }

  async scanFingerprint(timeout: number = 10000): Promise<string> {
    if (!this.isConnected) throw new Error('Dispositivo no conectado');
    if (this.isScanning) throw new Error('Escaneo en progreso');

    this.isScanning = true;
    this.emit('scanStart', {});

    try {
      const fingerprintData = await this.performScan(timeout);
      if (fingerprintData) {
        this.emit('scanSuccess', { data: fingerprintData });
        return fingerprintData;
      }
      throw new Error('No se pudo capturar la huella');
    } catch (error: any) {
      this.emit('scanError', { message: error.message });
      throw error;
    } finally {
      this.isScanning = false;
      this.emit('scanEnd', {});
    }
  }

  private async performScan(timeout: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout: No se detectó huella'));
      }, timeout);

      if (this.isUSBDevice(this.device)) {
        this.performUSBScan()
          .then(data => {
            clearTimeout(timeoutId);
            resolve(data);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            reject(error);
          });
      } else if (this.isSerialPort(this.device)) {
        this.performSerialScan()
          .then(data => {
            clearTimeout(timeoutId);
            resolve(data);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            reject(error);
          });
      } else {
        setTimeout(() => {
          clearTimeout(timeoutId);
          Math.random() > 0.1 ? resolve(this.generateSimulatedFingerprint()) : reject(new Error('Huella no detectada'));
        }, 2000);
      }
    });
  }

  private isUSBDevice(device: any): device is USBDevice {
    return device && typeof device.transferOut === 'function';
  }

  private isSerialPort(device: any): device is SerialPort {
    return device && typeof device.getReader === 'function';
  }

  private async performUSBScan(): Promise<string> {
    try {
      const startCommand = new Uint8Array([0x01, 0x02, 0x03]);
      await (this.device as USBDevice).transferOut(1, startCommand);
      const result = await (this.device as USBDevice).transferIn(1, 64);
      if (result.data?.byteLength > 0) return this.processFingerprintData(result.data);
      throw new Error('No se recibieron datos del dispositivo');
    } catch (error: any) {
      throw new Error(`Error USB: ${error.message}`);
    }
  }

  private async performSerialScan(): Promise<string> {
    try {
      const writer = (this.device as SerialPort).writable.getWriter();
      const reader = (this.device as SerialPort).readable.getReader();
      await writer.write(new TextEncoder().encode('SCAN\r\n'));
      writer.releaseLock();
      const { value } = await reader.read();
      reader.releaseLock();
      if (value) return this.parseSerialResponse(new TextDecoder().decode(value));
      throw new Error('No se recibió respuesta del dispositivo');
    } catch (error: any) {
      throw new Error(`Error Serial: ${error.message}`);
    }
  }

  private processFingerprintData(dataBuffer: ArrayBuffer): string {
    const data = new Uint8Array(dataBuffer);
    const quality = this.calculateFingerprintQuality(data);
    if (quality < 0.6) throw new Error('Calidad de huella insuficiente');
    return this.createFingerprintHash(this.extractFeatures(data));
  }

  private parseSerialResponse(response: string): string {
    const parts = response.trim().split(':');
    if (parts[0] === 'OK' && parts[1]) return parts[1];
    if (parts[0] === 'ERROR') throw new Error(parts[1] || 'Error desconocido');
    throw new Error('Respuesta inválida del dispositivo');
  }

  private calculateFingerprintQuality(data: Uint8Array): number {
    let quality = 0;
    const contrast = data.reduce((sum, val) => sum + val, 0) / (data.length * 255);
    quality += contrast * 0.4;
    let edges = 0;
    for (let i = 1; i < data.length; i++) if (Math.abs(data[i] - data[i-1]) > 50) edges++;
    const clarity = edges / (data.length * 0.1);
    quality += clarity * 0.3;
    let validPixels = 0;
    for (let i = 0; i < data.length; i++) if (data[i] > 50 && data[i] < 200) validPixels++;
    const coverage = validPixels / data.length;
    quality += coverage * 0.3;
    return Math.min(quality, 1.0);
  }

  private extractFeatures(data: Uint8Array): any {
    return { minutiae: [], ridgeCount: 0, corePoint: null, deltaPoints: [] };
  }

  private createFingerprintHash(features: any): string {
    let hash = 0;
    const str = JSON.stringify(features) + Date.now();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  private generateSimulatedFingerprint(): string {
    const hashes = ['fp_juan123', 'fp_maria456', 'fp_pedro789', 'fp_ana101', 'fp_carlos999', 'fp_sofia888'];
    return hashes[Math.floor(Math.random() * hashes.length)];
  }

  async verifyAndRegisterConsumption(fingerprintData: string, serviceType: number = 1): Promise<any> {
    try {
      const result = await api.verifyConsumption({ fingerprint_data: fingerprintData, tipo_servicio_id: serviceType });
      if (result.success) {
        this.emit('consumptionRegistered', result);
        return result;
      }
      this.emit('consumptionError', result);
      throw new Error(result.message);
    } catch (error: any) {
      this.emit('networkError', { message: error.message });
      throw error;
    }
  }

  async registerNewFingerprint(studentId: number, fingerprintData: string, finger: string): Promise<any> {
    try {
      const result = await api.registerFingerprint({
        estudiante_id: studentId,
        fingerprint_data: fingerprintData,
        dedo_registrado: finger
      });
      if (result.success) {
        this.emit('fingerprintRegistered', result);
        return result;
      }
      throw new Error(result.message);
    } catch (error: any) {
      this.emit('registrationError', { message: error.message });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.device) {
        if (this.isUSBDevice(this.device)) {
          await this.device.releaseInterface(0);
          await this.device.close();
        } else if (this.isSerialPort(this.device)) {
          await this.device.close();
        }
      }
      this.device = null;
      this.isConnected = false;
      this.emit('disconnected', {});
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
  }

  isDeviceConnected(): boolean {
    return this.isConnected && this.device !== null;
  }

  getDeviceInfo(): any {
    if (!this.device) return null;
    if (this.isUSBDevice(this.device)) {
      return {
        type: 'USB',
        vendorId: this.device.vendorId,
        productId: this.device.productId,
        productName: this.device.productName,
        manufacturerName: this.device.manufacturerName
      };
    } else if (this.isSerialPort(this.device)) {
      return { type: 'Serial', connected: this.device.readable && this.device.writable };
    }
    return { type: 'Simulator' };
  }
}