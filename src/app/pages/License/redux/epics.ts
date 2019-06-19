import * as types from './types';

import api from '../../../services';
import * as actions from './actions';

export default {
  [`${types.FETCH}_START`]: {
    api: (params: any) => api.license.fetch(params),
    success: (payload: any) => actions.fetchSuccess(payload),
    error: (error: any) => actions.fetchError(error)
  },

  [`${types.INSERT}_START`]: {
    api: (params: any) => api.license.insert(params),
    success: (payload: any) => actions.fetchSuccess(payload),
    error: (error: any) => actions.fetchError(error)
  },
}