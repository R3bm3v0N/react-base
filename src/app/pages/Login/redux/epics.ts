import * as types from './types';

import api from '../../../services';
import { loginSuccess, loginError } from './actions';

export default {
  [`${types.LOGIN}_START`]: {
    api: (params: any) => api.user.login(params.username, params.password),
    success: (payload: any) => loginSuccess(payload),
    error: (error: any) => loginError(error)
  }
}