import * as types from './types';

import api from '../../../../../services';
import * as actions from './actions';

export default {
  [`${types.INSERT}_START`]: {
    api: (params: any) => api.license.insert(params),
    success: (payload: any) => actions.insertSuccess(payload),
    error: (error: any) => actions.insertError(error)
  },

  [`${types.UPDATE}_START`]: {
    api: (params: any) => api.license.fetch(params),
    success: (payload: any) => actions.updateSuccess(payload),
    error: (error: any) => actions.updateError(error)
  },
}