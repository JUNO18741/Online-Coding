import { storage } from '@/config';

export const clearContainerStorage = () => {
  localStorage.removeItem(storage.containerId);
  localStorage.removeItem(storage.containerIp);
  localStorage.removeItem(storage.containerPort);
};
export const getContainerInfo = () => ({
  protocol: 'http',
  ip: localStorage.getItem(storage.containerIp),
  port: localStorage.getItem(storage.containerPort),
});
