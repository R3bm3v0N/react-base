import axios from 'axios';
import Cookies from 'universal-cookie';
import configs from '../configs';

if(configs.debug) {
  require('axios-debug-log');
  localStorage.debug = "axios"
}

const instance = axios.create({
  baseURL: configs.apiBaseURL,
  timeout: 60000,
  headers: {'Authentication': new Cookies().get('jwt')},
  // withCredentials: true
});

instance.interceptors.response.use(function (response) {
  console.log('response', response)
  if(response.data && (typeof response.data.success !== undefined) && !response.data.success) {
    if(response.data.error) {
      return Promise.reject(response.data.error);
    } else {
      return Promise.reject({
        code: 4000,
        message: 'Unhandled server error'
      });
    }
  }
  return response;
}, (error) => {
  // if (error.response) {
  //   // The request was made and the server responded with a status code
  //   // that falls out of the range of 2xx
  //   console.log('error.response', error.response.data);
  //   console.log('error.response', error.response.status);
  //   console.log('error.response', error.response.headers);
  // } else if (error.request) {
  //   // The request was made but no response was received
  //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //   // http.ClientRequest in node.js
  //   console.log('error.request', error.request.statusText);
  // } else {
  //   // Something happened in setting up the request that triggered an Error
  //   console.log('Error', error.message);
  //   return Promise.reject({
  //     message: error.message
  //   });
  // }

  return Promise.reject({
    message: error.message
  });
});


export default instance;