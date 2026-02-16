import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

// Generate or retrieve a secure encryption key
const getEncryptionKey = () => {
  // In production, this should be generated once and stored securely
  // For now, using a more secure base key
  return "camorent_secure_key_2024_v1_" + "mobile_app_encryption";
};

export const storage = new MMKV({
  id: "camorent-storage",
  encryptionKey: getEncryptionKey(),
});

export const MMKVStorage: StateStorage = {
  setItem: (name: string, value: any) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};
