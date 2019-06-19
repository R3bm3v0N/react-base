import * as types from './types';

import api from '../../../services';
import * as actions from './actions';

export default {
  [`${types.FETCH}_START`]: {
    api: params => api.license.fetch(params),
    success: payload => actions.fetchSuccess(payload),
    error: error => actions.fetchError(error)
  },

  [`${types.INSERT}_START`]: {
    api: params => api.license.insert(params),
    success: payload => actions.fetchSuccess(payload),
    error: error => actions.fetchError(error)
  },
}