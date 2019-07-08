// https://redux.js.org/faq/organizing-state

import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import persistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';

import logger from 'redux-logger'
import rootReducer from './rootReducer';
import rootEpic from './rootEpic';
import configs from './configs';



const epicMiddleware = createEpicMiddleware();
// const store = createStore(
//   rootReducer, 
//   applyMiddleware(...[
//     epicMiddleware,
//     configs.debug && logger,
//     persistState()
//   ].filter(v=>v) as any[]),
// );

// epicMiddleware.run(rootEpic);


const middlewares = applyMiddleware(...[
  epicMiddleware,
  configs.debug && logger,
].filter(v => v) as any[]);


const reducer = compose(
  mergePersistedState()
)(rootReducer);

const storage = compose(
  filter('session.userDisplayName')
)(adapter(window.localStorage));

const enhancer = compose(
  middlewares,
  persistState(storage, 'esares_session')
);

const store = createStore(reducer as any /*, [initialState]*/, enhancer);
epicMiddleware.run(rootEpic);

export default store;
