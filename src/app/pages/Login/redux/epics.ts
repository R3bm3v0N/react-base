import * as types from './types';

import api from '../../../services';
import { loginSuccess, loginError } from './actions';

export default {
  [`${types.LOGIN}_START`]: {
    api: params => api.user.login(params.username, params.password),
    success: payload => loginSuccess(payload),
    error: error => loginError(error)
  }
}