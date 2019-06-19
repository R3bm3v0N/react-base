import * as React from "react";
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

interface Props {
}

class MinimalLayout extends React.Component<Props> {

  render() {
    return (
      <>
        {this.props.children}
      </>
    );
  }
}

export default MinimalLayout;