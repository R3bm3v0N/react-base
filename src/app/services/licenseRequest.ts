import http from './http';
import * as qs from 'qs';

export const get = async (id: number) => {
  const response = await http.get(`/license-request/${id}`);
  return response.data.payload;
}

export const process = async (id: number, payload: any) => {
    const response = await http.post(`/license-request/${id}`, payload);
    return response.data.payload;
};