import * as React from "react";
import update from 'immutability-helper';
import { Row, Col, Table, Tag, Button, List, Switch, message, Modal, Popconfirm, Skeleton } from 'antd';
import moment from 'moment';

import api from '../../services'
import connect from './connect';
import SearchForm from './components/SearchForm';
import AddNewForm from './components/AddNewForm';
const {CopyToClipboard} = require('react-copy-to-clipboard');


class License extends React.Component<any> {
  state = { 
    modal: {
      visible: false
    },
    table: {
      pagination: {
        pageSize: 10
      },
      data: [] as any[],
      fetching: false,
      expandedRowKeys: new Set<string>(),
      fetchingRowKeys: new Set<string>(),
      visibleRowKeys: new Set<string>(),
      query: {
        paging: {
          limit: 10,
          page: 1,
          sort: null
        },
        filters: {}
      }
    }
  };

  fetchTableData = async () => {
    this.setState(update(this.state, {
      table: {
        fetching: { $set: true },
        expandedRowKeys: { $set: new Set<string>() }
      }
    }), async () => {
      let data = await api.license.fetch(this.state.table.query);
      this.setState(update(this.state, {
        table: {
          data: { $set: data },
          fetching: { $set: false }
        }
      }));
    });
    
  }

  componentDidMount() {
    this.fetchTableData();
  }

  handleCopy = (record: any) => {

  }
  
  meta = [
    {
      title: 'ライセンスキー',
      dataIndex: 'key',
      render: (text: any, record: any) => {
        let visible = this.state.table.visibleRowKeys.has(record.key);
        return (
          <>
            <span style={{minWidth:280, display: 'inline-block'}}>{visible?text:(('#'.repeat(8)+'-').repeat(3) + text.slice(-8))}</span>　
            <Button style={{marginRight:5}} shape="circle" size="small" icon={!visible?'eye-invisible':'eye'} onClick={()=>this.handleToggleKeyVisible(record)}/>
            <CopyToClipboard text={text} onCopy={()=>message.success('クリップボードにコピー。')}>
              <Button shape="circle" size="small" icon="copy" />
            </CopyToClipboard>
          </>
        );
      },
    },
    {
      title: '開始日',
      dataIndex: 'created_at',
      render: (text: any, record: any) => (
        <>
          {moment(text).format('Y/MM/DD')}
        </>
      ),
    },
    
    {
      title: '有効期限',
      dataIndex: 'expire',
      render: (text: any, record: any) => (
        <>
          {moment(text).format('Y/MM/DD')}
        </>
      ),
    },
    
    {
      title: 'お客様名',
      dataIndex: 'name',
      render: (text: any, record: any) => (
        <>
          <Tag color={record.type === 1 ? 'geekblue' : 'green'}>
            {({1:'個人', 2:'法人'} as any)[record.type]}
          </Tag>
          {text}
        </>
      ),
    },
  
    {
      title: 'デバイス',
      dataIndex: 'device_count',
      render: (text: any, record: any) => 
      <>
        {record.device_count} 
        件　
        {record.device_count > 0 && <span className={`ant-table-row-expand-icon ant-table-row-${this.state.table.expandedRowKeys.has(record.key) ? 'expanded' : 'collapsed'}`} onClick={()=>this.handleExpand(record)}/> }
      </>,
    },
  
    {
      title: '状態',
      dataIndex: 'enabled',
      render: (text: any, record: any) => (
        <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>{
        }}>
          <Switch size="small" checked={record.enabled}/>
        </Popconfirm>
      ),
    },
  ];

  handleExpand = async (record: any) => {

    let oldExpands = this.state.table.expandedRowKeys as Set<string>;
    let collapsed = oldExpands.has(record.key);
    collapsed 
      ? oldExpands.delete(record.key)
      : oldExpands.add(record.key);

    this.setState(update(this.state, {
      table: {
        expandedRowKeys: {
          $set: oldExpands
        }
      }
    }));

    if(!collapsed && !record.devices) {
      let data = await api.device.fetch({
        license_key: record.key
      });

      // this.state.table.data.findIndex(v=>v.key===record.key);

      let idx = this.state.table.data.findIndex(v=>v.key===record.key);
      this.setState(update(this.state, {
        table: {
          data: {
            [idx] : {
              devices: {
                $set: data
              }
            }
          }
        }
      }));
    }
  }

  handleToggleKeyVisible = (record: any) => {
    let oldVisibles = this.state.table.visibleRowKeys as Set<string>;
    oldVisibles.has(record.key) 
      ? oldVisibles.delete(record.key)
      : oldVisibles.add(record.key);

    this.setState(update(this.state, {
      table: {
        visibleRowKeys: {
          $set: oldVisibles
        }
      }
    }));
  }

  showModal = () => {
    this.setState(update(this.state, {
      modal: {
        visible: {
          $set: true,
        }
      } 
    }));
  };

  hideModal = () => {
    this.setState(update(this.state, {
      modal: {
        visible: {
          $set: false,
        }
      } 
    }));
  };

  addNewForm = React.createRef<any>();
  handleCreate = () => {
    const form = this.addNewForm;
    form.current.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      if(values.customerId === 'null') {
        values.customerId = null;
      }
      this.props.insert(values);
    });
  };

  // saveFormRef = formRef => {
  //   this.formRef = formRef;
  // };

  componentDidUpdate(prevProps: any) {
    const form = this.addNewForm;
    if(prevProps.insert.status === 'pending') {
      if(this.props.insert.status === 'success') {
        message.success('データを追加した。');
        form.current.resetFields();
        this.hideModal();
      } else {
        message.error('データの追加に失敗しました。');
      }
    }
  };

  handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pager = { ...this.state.table.pagination } as any;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      query : {
        paging: {
          limit: pagination.pageSize,
          page: pagination.current,
          sort: (sorter.order === 'ascend' ? '' : '-') + sorter.field
        },
        filters,
      }
    }, this.fetchTableData);
  };

  handleOnFilterChange = (filters: any) => {
    this.setState(update(this.state, {
      table: {
        query: {
          filters: {
            $set: filters
          }
        }
      }
    }), this.fetchTableData);
  }

  renderDevicesSkeleton = () => <Row style={{ width: '100%' }}>
    <Col span={10}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['80%', '80%']}}/></Col>
    <Col span={10}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['80%', '80%']}}/></Col>
    <Col span={4}>
      <div style={{float:'right', width: '80%'}}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['100%', '100%']}}/></div>
    </Col>
  </Row>

  // renderTableSkeleton = () => <Row style={{ width: '100%' }}>
  //   <Col span={4}><Skeleton active={true} loading={true} title={false} paragraph={{rows:5, width: ['80%', '80%']}}/></Col>
  //   <Col span={4}><Skeleton active={true} loading={true} title={false} paragraph={{rows:5, width: ['80%', '80%']}}/></Col>
  //   <Col span={4}><Skeleton active={true} loading={true} title={false} paragraph={{rows:5, width: ['80%', '80%']}}/></Col>
  //   <Col span={4}><Skeleton active={true} loading={true} title={false} paragraph={{rows:5, width: ['80%', '80%']}}/></Col>
  //   <Col span={4}><Skeleton active={true} loading={true} title={false} paragraph={{rows:5, width: ['80%', '80%']}}/></Col>
  //   <Col span={4}>
  //     <div style={{float:'right', width: '80%'}}><Skeleton active={true} loading={true} title={false} paragraph={{rows:10, width: ['100%', '100%']}}/></div>
  //   </Col>
  // </Row>

  render() {
    let insertPending = this.props.insert.status === 'pending';
    let { table, modal } = this.state;
    let rowKeys = Array.from(table.expandedRowKeys);
    console.log('table', table)
    return (
      <Row>
        <Col span={24}>
          <Row>
            <Button icon='plus' onClick={this.showModal} type="primary" style={{ marginBottom: 16, float: 'right' }}>
            新規追加
            </Button>
            <SearchForm onFilterChange={this.handleOnFilterChange}/>
          </Row>
          <div className="search-result-list">
            {
            <Table 
              dataSource={table.data} 
              pagination={table.pagination}
              rowKey={record => record.key}
              loading={table.fetching}
              columns={this.meta}
              onChange={this.handleTableChange}
              expandedRowKeys={rowKeys}
              expandIconAsCell={false}
              expandIcon={()=><></>}
              
              expandedRowRender={record => 
                (record.devices && record.devices.length) 
                ? <List
                  size="small"
                  dataSource={record.devices}
                  renderItem={(item : any, key) => (
                    <List.Item key={key}>
                      <Row style={{width:'100%'}}>
                        <Col span={10}>{key + 1}.&nbsp;{item.info}</Col>
                        <Col span={10}>{item.id}</Col>
                        <Col span={4}>
                          <span style={{float:'right'}}>
                            {moment(item.created_at).format('Y/MM/DD')}
                            に活性化
                          </span>
                        </Col>
                        </Row>
                      </List.Item>
                    )}
                />
                : this.renderDevicesSkeleton()
               }
            />}
          </div>
        </Col>

        <Modal
          visible={modal.visible}
          title="新規ライセンスキーを追加"
          okText="追加"
          onCancel={this.hideModal}
          onOk={this.handleCreate}
          confirmLoading={insertPending}
          cancelButtonProps={{disabled:insertPending}}
          closable={!insertPending}
          maskClosable={!insertPending}
        >
          <AddNewForm
            ref={this.addNewForm}
            insertPending={this.props.insert.status === 'pending'}
          />
        </Modal>
      </Row>
    );
  }
}

export default connect(License);