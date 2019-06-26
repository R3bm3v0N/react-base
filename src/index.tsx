import * as React from "react";
import { render } from "react-dom";
import App from './app';
import {message} from 'antd';

message.config({
  maxCount: 1,
});

render(
  <App/>,
  document.getElementById("root")
);
