import { of, from } from 'rxjs';
import { map, mergeMap, catchError } from "rxjs/operators";
import { ofType } from "redux-observable";

export const loadEpics = (loadedEpic: any) => {
  let actionTypes = Object.keys(loadedEpic.default);
  return actionTypes.map(actionType => (action$: any) => action$.pipe(
    ofType(actionType),
    mergeMap((action : any) => from(loadedEpic.default[actionType].api(action.payload)).pipe(
      // map(response => {console.log(response); return response}),
      
      map((response : any) => {
        let json = response.data;
        if(json.success) {
          // console.log('SUCCESS', json.payload)
          return loadedEpic.default[actionType].success(json.payload)
        } else {
          // console.log('ERROR', json.error)
          throw json.error;
        }
      }),
      catchError((error) => {
        // console.log('___ERROR', error)
        return of(loadedEpic.default[actionType].error(error));
      }),
    ),
    )
  ));
}









// export const loadEpics = (loadedEpic) => {
//   let actionTypes = Object.keys(loadedEpic.default);
//   return actionTypes.map(actionType => action$ => action$.pipe(
//     ofType(actionType),
//     mergeMap((action : any) => from(loadedEpic.default[actionType].api(action.payload).then(response => {
//       console.log('response', response)
//       let json = response.data;
//       if(json.success) {
//         console.log('SUCCESS', json.payload)
//         return of(loadedEpic.default[actionType].success(json.payload))
//       } else {
//         console.log('ERROR', json.error)
//         // return loadedEpic.default[actionType].error(json.error)
//         throw json.error;
//       }
//     }).catch(error => {
//       return loadedEpic.default[actionType].error(error);
//     }))
//   )))
// };
    