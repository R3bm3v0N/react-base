import {combineReducers} from 'redux';
import { createReducer } from 'deox'
import {loginSuccess} from './pages/Login/redux/actions'

import login, {State as LoginState} from './pages/Login/redux/reducers'
import license, {State as LicenseState} from './pages/License/redux/reducers'
import Cookies from 'universal-cookie';


export type SessionState = {
    jwt?: string,
    email?: string,
    userDisplayName?: string
}
export type State = {
  session: SessionState,
  page: {
    login: LoginState,
    license: LicenseState
  }
}

const sessionDefaultState : SessionState = {
  jwt: undefined,
  email: undefined,
  userDisplayName: undefined
}

const sessionReducer = createReducer(sessionDefaultState, (handleAction) => [
  handleAction(loginSuccess, (state, { payload } : any) => {
    let cookies = new Cookies();
    cookies.set('jwt', payload.jwt, { path: '/' , httpOnly: false, });
    return ({
      jwt: payload.jwt,
      email: payload.email,
      userDisplayName: payload.userDisplayName
    })
}),
]);

export default combineReducers({
  session: sessionReducer,
  page: combineReducers({
    login,
    license,
  }),
})