import * as React from "react";
import { Provider } from "react-redux";
import { LocaleProvider } from 'antd';
import jaJP from 'antd/lib/locale-provider/ja_JP';
import { BrowserRouter as Router, Switch } from "react-router-dom";

import Route from './components/Route';
import LoginPage from './pages/Login';
import LicensePage from './pages/License';
import NotFoundPage from './pages/404';
import MinimalLayout from './layouts/Minimal';
import store from "./store";

// Need Remove In production
// https://ant.design/docs/react/use-with-create-react-app#Import-on-demand
import 'antd/dist/antd.css';


import './index.less';



class App extends React.Component<any> {
  render() {
    return (
      <Provider store={store}>
        <LocaleProvider locale={jaJP}>
          <Router>
            <Switch>
              <Route path="/" exact component={LicensePage} store={store} permissions={['license.manager']} />
              <Route path="/login" exact component={LoginPage} layout={MinimalLayout} store={store} />
              <Route component={NotFoundPage} store={store} layout={MinimalLayout}/>
            </Switch>
          </Router>
        </LocaleProvider>
      </Provider>
    );
  }
}

export default App;