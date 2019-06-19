import axios from 'axios';
import Cookies from 'universal-cookie';
import configs from '../configs';

if(configs.debug) {
  require('axios-debug-log');
  localStorage.debug = "axios"
}

export default axios.create({
  baseURL: configs.apiBaseURL,
  timeout: 60000,
  headers: {'Authentication': new Cookies().get('jwt')}
});