import { createReducer } from 'deox'
import * as actions from './actions';
import update from 'immutability-helper';

const { 
  login,
  loginSuccess,
  loginError
} = actions;

export type State = {
  status: string,
  error?: {
    code: string,
    message: string,
  }
}

const defaultState: State = {
  status: null,
  error: null
}

export default createReducer(defaultState, (handleAction) => [
  handleAction(login, (state, action : any) => update(state, {
    status: { $set: 'pending'},
    error: { $set: null}
  })),
  handleAction(loginSuccess, (state, action : any) => update(state, {
    status: { $set: 'success'},
    error: { $set: null}
  })),
  handleAction(loginError, (state, action : any) => update(state, {
    status: { $set: 'error'},
    error: { $set: action.payload }
  })),
]);