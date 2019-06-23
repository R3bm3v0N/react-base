import * as React from "react";
import { Route, Redirect } from "react-router-dom";

import DefaultLayout from '../layouts/Basic';

import Cookies from 'universal-cookie';


const AppRoute = ({ layout: Layout = DefaultLayout, component: Component, store, permissions = [], ...rest } : any) => {

  let {session} = store.getState();
  // let granted = !permissions.length || session.jwt !== null;

  let cookies = new Cookies();
  let jwt = cookies.get('jwt');
  console.log('jwtjwtjwt', jwt)
  let granted = !permissions.length || (jwt && jwt.length);

  return (
    <Route
      {...rest}
      render={props =>
        granted ? (
          <Layout>
            <Component {...props} />
           </Layout>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default AppRoute;