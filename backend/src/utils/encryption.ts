import bcrypt from 'bcrypt';

export const encryptData = async (data: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(data, saltRounds);
};

export const compareEncryptedData = async (data: string, encryptedData: string): Promise<boolean> => {
  return await bcrypt.compare(data, encryptedData);
};