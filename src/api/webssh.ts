import { getContainerInfo } from './../utils/index';
import { baseConfig, storage } from '@/config';
import { RequestIntercept } from '.';

interface IUpload {
  to: string;
  file: Blob;
}
interface IDownload {
  filename: string;
}

const http = new RequestIntercept(getContainerInfo());
const httpV1 = new RequestIntercept(getContainerInfo(), 'api/v1/');

export function initWs(id: string) {
  const url = `ws://${getContainerInfo().ip}:${getContainerInfo().port}/ws?id=${id}`;
  return new WebSocket(url);
}

export async function initTerminal() {
  return http.post('', { form: baseConfig.ssh });
}
export async function upload(form: IUpload) {
  return httpV1.post('upload', {
    params: { id: localStorage.getItem(storage.containerId) },
    form,
  });
}

export async function listDir(obj: { dir: string }) {
  return httpV1.post('listdir', {
    json: obj,
  });
}

export async function download(obj: IDownload) {
  return httpV1.post('download', {
    params: { id: localStorage.getItem(storage.containerId) },
    json: obj,
  });
}
export async function download2(obj: IDownload) {
  return httpV1.post('download', {
    params: { id: localStorage.getItem(storage.containerId) },
    json: obj,
  },
  {responseType:'blob'}
  );
}