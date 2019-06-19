import http from './http';
import * as qs from 'qs';


export const fetch = async (filters: any) => {
  console.log(filters)
  const response = await http.get(`/device${qs.stringify(filters, {addQueryPrefix: true})}`);
  return response.data.payload;
}