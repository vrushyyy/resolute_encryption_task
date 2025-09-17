import CryptoJS from 'crypto-js';

const FRONTEND_KEY = "frontend-secret-key-level1-32chars"; 
export const encryptLevel1 = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, FRONTEND_KEY).toString();
    console.log('🔐 Frontend Level 1 Encryption applied');
    return encrypted;
  } catch (error) {
    console.error('❌ Frontend encryption failed:', error);
    throw new Error('Frontend encryption failed');
  }
};

// Level 1 Decryption Decrypt data received from backend //
export const decryptLevel1 = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, FRONTEND_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Failed to decrypt - invalid key or corrupted data');
    }
    
    console.log('🔓 Frontend Level 1 Decryption applied');
    return decrypted;
  } catch (error) {
    console.error('❌ Frontend decryption failed:', error);
    throw new Error('Frontend decryption failed');
  }
};

export const encryptData = encryptLevel1;
export const decryptData = decryptLevel1;