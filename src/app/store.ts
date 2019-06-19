// https://redux.js.org/faq/organizing-state

import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";

import logger from 'redux-logger'
import rootReducer from './rootReducer';
import rootEpic from './rootEpic';
import configs from './configs';

const epicMiddleware = createEpicMiddleware();
const store = createStore(
  rootReducer, 
  applyMiddleware(...[
    epicMiddleware,
    configs.debug && logger
  ].filter(v=>v))
);
epicMiddleware.run(rootEpic);

export default store;
