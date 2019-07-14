import http from './http';
import * as qs from 'qs';


export const fetch = async (filters: any) => {
  console.log(filters)
  const response = await http.get(`/license${qs.stringify(filters, {addQueryPrefix: true})}`);
  return response.data.payload;
}

export const generate = async (payload: any) => {
    const response = await http.post('/license/generate', payload);
    return response.data.payload;
}


export const insert = async (payload: any) => {
  const response = await http.post('/license', payload);
  return response.data.payload;
}

export const update = async (payload: any) => {
  const response = await http.put('/license', payload);
  return response.data.payload;
}