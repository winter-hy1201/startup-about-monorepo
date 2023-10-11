import { StorageType } from './typings';

const getStorageFunc = (type: StorageType) =>
  type === 'local' ? localStorage : sessionStorage;

function getStorage(type: StorageType = 'local', key?: string): any {
  let data: unknown;
  const storageFunc = getStorageFunc(type);
  const value = typeof key === 'undefined' ? key : storageFunc.getItem(key);
  try {
    data = JSON.parse(value!);
  } catch (e) {
    data = value;
  }
  return data;
}

function setStorage(type: StorageType = 'local', key: string, value: unknown) {
  const storageFunc = getStorageFunc(type);
  const newValue = typeof value === 'string' ? value : JSON.stringify(value);
  return storageFunc.setItem(key, newValue);
}

const getLocalStorage = (key?: string) => getStorage('local', key);
const setLocalStorage = (key: string, value: unknown) =>
  setStorage('local', key, value);

const getSessionStorage = (key?: string) => getStorage('session', key);
const setSessionStorage = (key: string, value: unknown) =>
  setStorage('session', key, value);

export {
  getLocalStorage,
  getSessionStorage,
  setLocalStorage,
  setSessionStorage,
};
