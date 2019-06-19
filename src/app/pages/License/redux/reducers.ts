import { createReducer } from 'deox';
import * as actions from './actions';
import update from 'immutability-helper';

const { 
  fetch,
  fetchSuccess,
  fetchError,
  insert,
  insertSuccess,
  insertError,
} = actions;

export type State = {
  fetch?: {
    status: string,
    error?: {
      code: string,
      message: string
    }
  },
  insert?: {
    status: string,
    error?: {
      code: string,
      message: string
    }
  }
}

const defaultState: State = {
  fetch: {
    status: null,
  },
  insert: {
    status: null,
  }
}

export default createReducer(defaultState, (handleAction) => [
  handleAction(fetch, (state, action : any) => update(state, {
    fetch: {
      status: { $set: 'pending'}
    }
  })),

  handleAction(fetchSuccess, (state, action : any) => update(state, {
    fetch: {
      status: { $set: 'success'}
    }
  })),
  handleAction(fetchError, (state, action : any) => update(state, {
    fetch: {
      status: { $set: 'error' },
      error: { $set: action.payload }
    }
  })),


  handleAction(insert, (state, action : any) => update(state, {
    insert: {
      status: { $set: 'pending'}
    }
  })),

  handleAction(insertSuccess, (state, action : any) => update(state, {
    insert: {
      status: { $set: 'success'}
    }
  })),
  handleAction(insertError, (state, action : any) => update(state, {
    insert: {
      status: { $set: 'error' },
      error: { $set: action.payload }
    }
  })),
]);