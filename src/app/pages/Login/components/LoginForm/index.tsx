import * as React from 'react';
import { Form, Icon, Input, Button, Checkbox, Alert, Typography } from 'antd';
import connect from './connect';
import './styles.css';

class NormalLoginForm extends React.Component<any> {
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {username, password} = values;
        this.props.login(username, password);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { error, loginPending} = this.props;
    
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {error && <Alert message={<>{error.code && <Typography.Text code>{error.code}</Typography.Text>} {error.message}</>} type="error" style={{ marginBottom: 24 }} showIcon/>}
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'ユーザー名を入力してください。' }],
          })(
            <Input
              disabled={loginPending}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="ユーザー名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'パスワードを入力してください。' }],
          })(
            <Input.Password
              disabled={loginPending}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="パスワード"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox disabled={loginPending}>ログイン状態を保持する</Checkbox>)}
          {/* <a className="login-form-forgot" href="">
            Forgot password
          </a> */}
          <Button loading={loginPending} type="primary" htmlType="submit" className="login-form-button">
          ログイン
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default connect(WrappedNormalLoginForm);