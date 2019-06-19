import * as React from "react";
import { Redirect } from "react-router-dom";
import { Row, Col } from 'antd';
import connect from './connect';
import LoginForm from './components/LoginForm';

class Login extends React.Component<any> {
  
  render() {
    const { loggedIn } = this.props;
    if(loggedIn) return <Redirect to="/" />

    return (
      <Row>
        <Col span={12} offset={6}>
          <LoginForm />
        </Col>
      </Row>
    );
  }
}

export default connect(Login);