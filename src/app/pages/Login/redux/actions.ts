import { createActionCreator } from 'deox'

import * as types from './types';

export const login 
            = createActionCreator(`${types.LOGIN}_START`, resolve => (username, password) => resolve({username, password}))
export const loginSuccess 
            = createActionCreator(`${types.LOGIN}_SUCCESS`, resolve => (payload) => resolve(payload))
export const loginError 
            = createActionCreator(`${types.LOGIN}_ERROR`, resolve => (payload) => resolve(payload))
