import { createActionCreator } from "deox";

import * as types from "./types";



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


/**
 * UPDATE
 */
export const update = createActionCreator(
  `${types.UPDATE}_START`,
  resolve => (payload) =>
    resolve(payload)
);

export const updateSuccess = createActionCreator(
  `${types.UPDATE}_SUCCESS`,
  resolve => payload => resolve(payload)
);

export const updateError = createActionCreator(
  `${types.UPDATE}_ERROR`,
  resolve => payload => resolve(payload)
);
