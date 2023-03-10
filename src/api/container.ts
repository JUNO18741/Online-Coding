import { baseConfig, storage } from '@/config';
import { RequestIntercept } from '.';
const http = new RequestIntercept(baseConfig.service, 'container_service/');
const params = {
  params: { user_ip: '172.20.10.2' },
};

export async function createContainer() {
  return http.get('create_container', params);
}
export async function clearContainer() {
  return await http.get('clear_container', { params: { container_name: localStorage.getItem(storage.containerId) } });
}
export async function checkContainer() {
  return http.get('check_container_status', params);
}
