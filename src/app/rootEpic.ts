import { combineEpics } from "redux-observable";
import * as loginEpics from './pages/Login/redux/epics';
import * as licenseEpics from './pages/License/redux/epics';
import * as epicUtil from './utils/epicUtils';

export default combineEpics(
  ...epicUtil.loadEpics(loginEpics), 
  ...epicUtil.loadEpics(licenseEpics),
); 
