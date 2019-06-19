import * as React from "react";
import { BrowserRouter as Router, Link, Switch } from "react-router-dom";
import './index.less';

class NotFound extends React.Component<any> {
  state = { user: '0' };

  handleOnClick = () => {
    this.props.login('aaa', 'bbb');
  }
  render() {
    return (
      <div>
        <div className="imgBlock">
        <img src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg" alt="img"/>
        </div>
        <div className="content">
          <h1>404</h1>
          <div className="desc">Page not found</div>
          <div>
            <Link to='/'>Back to home</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;