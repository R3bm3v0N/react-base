import * as React from "react";
import { Layout, Menu, Breadcrumb, Icon, Avatar, Badge } from 'antd';
import './Basic.css';
import Cookies from 'universal-cookie';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import {State} from '../rootReducer';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


// interface Props {
// }

class BasicLayout extends React.Component<any, any> {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logout = () => {
    let cookies = new Cookies();
    cookies.remove('jwt');
    // this.props.history.push('/');
    window.location.reload();
  }

  render() {
    console.log('this.props', this.props)
    return (
      <Layout className="layout-basic">
        <Sider width={200} trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="ant-pro-sider-menu-logo logo">
              {/* <img src="https://via.placeholder.com/150x50"/> */}
            </div>

            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Icon type="key" />
                <span>ライセンス管理</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="setting" />
                <span>設定</span>
              </Menu.Item>
            </Menu>
          </Sider>
        
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['2']}
              selectable={false}
              style={{ lineHeight: '64px', float: 'right', marginRight: 24}}
              overflowedIndicator={<></>}
            >
              <SubMenu
                title={
                  <>
                    <Avatar size={24} 
                      icon="user"
                      src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" 
                      // style={{border: '1px solid #444'}}
                     />
                    <span style={{marginLeft: 8}}>{this.props.session.userDisplayName}</span>
                  </>
                }
              >
                <Menu.Item key="user:logout" onClick={this.logout}><Icon type="logout" />Logout</Menu.Item>
              </SubMenu>
              {/* <Menu.Item key="3" style={{ padding: '0 15px' }}> */}
                {/* <Badge count={'JA'} style={{ margin:0, backgroundColor: '#52c41a' }}> */}
                  {/* <Icon type="global" style={{ margin:0, fontSize: 16 }}/> */}
                {/* </Badge> */}
              {/* </Menu.Item> */}
            </Menu>
          </Header>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state : State, ownProps: any) => ({
  sss: state,
  session: state.session
})

const mapDispatchToProps = null;
// const mapDispatchToProps = (dispatch: any) => ()=>{};

// const routerAware = withRouter(BasicLayout);
const routerAware = BasicLayout;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(routerAware);