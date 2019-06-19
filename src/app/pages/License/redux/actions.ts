import { createActionCreator } from "deox";

import * as types from "./types";

/**
 * FETCH
 */
export const fetch = createActionCreator(
  `${types.FETCH}_START`,
  resolve => (username, password) =>
    resolve({
      username,
      password
    })
);

export const fetchSuccess = createActionCreator(
  `${types.FETCH}_SUCCESS`,
  resolve => payload => resolve(payload)
);

export const fetchError = createActionCreator(
  `${types.FETCH}_ERROR`,
  resolve => payload => resolve(payload)
);




/**
 * INSERT
 */
export const insert = createActionCreator(
  `${types.INSERT}_START`,
  resolve => (payload) =>
    resolve(payload)
);

export const insertSuccess = createActionCreator(
  `${types.INSERT}_SUCCESS`,
  resolve => payload => resolve(payload)
);

export const insertError = createActionCreator(
  `${types.INSERT}_ERROR`,
  resolve => payload => resolve(payload)
);
