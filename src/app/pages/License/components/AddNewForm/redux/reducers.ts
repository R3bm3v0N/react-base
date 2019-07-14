import { createReducer } from 'deox';
import * as actions from './actions';
import {default as doUpdate} from 'immutability-helper';

const { 
  insert,
  insertSuccess,
  insertError,

  update,
  updateSuccess,
  updateError,
} = actions;

export type State = {
  update?: {
    status?: string,
    error?: {
      code: string,
      message: string
    }
  },
  insert?: {
    status?: string,
    error?: {
      code: string,
      message: string
    }
  }
}

const defaultState: State = {
  update: {
    status: undefined,
  },
  insert: {
    status: undefined,
  }
}

export default createReducer(defaultState, (handleAction) => [
  handleAction(insert, (state, action : any) => doUpdate(state, {
    insert: {
      status: { $set: 'pending'}
    }
  })),

  handleAction(insertSuccess, (state, action : any) => doUpdate(state, {
    insert: {
      status: { $set: 'success'}
    }
  })),
  handleAction(insertError, (state, action : any) => doUpdate(state, {
    insert: {
      status: { $set: 'error' },
      error: { $set: action.payload }
    }
  })),


  handleAction(update, (state, action: any) => doUpdate(state, {
    update: {
      status: { $set: 'pending' }
    }
  })),

  handleAction(updateSuccess, (state, action: any) => doUpdate(state, {
    update: {
      status: { $set: 'success' }
    }
  })),
  handleAction(updateError, (state, action: any) => doUpdate(state, {
    update: {
      status: { $set: 'error' },
      error: { $set: action.payload }
    }
  })),
]);