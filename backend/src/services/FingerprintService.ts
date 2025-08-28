import bcrypt from 'bcrypt';

export const hashFingerprint = async (fingerprintData: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(fingerprintData, saltRounds);
};

export const verifyFingerprint = async (fingerprintData: string, hashedFingerprint: string): Promise<boolean> => {
  return await bcrypt.compare(fingerprintData, hashedFingerprint);
};