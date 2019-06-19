import * as React from "react";
import update from 'immutability-helper';
import { Row, Col, Table, Tag, Button, List, Icon, Switch, message, Modal, Popconfirm } from 'antd';
import moment from 'moment';

import api from '../../services'
import connect from './connect';
import SearchForm from './components/SearchForm';
import AddNewForm from './components/AddNewForm';



class License extends React.Component<any> {
  state = { 
    modal: {
      visible: false
    },
    table: {
      pagination: {
        pageSize: 10
      },
      data: [],
      fetching: false,
      expandedRowKeys: new Set<string>(),
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
    let data = await api.license.fetch(this.state.table.query);
    this.setState(update(this.state, {
      table: {
        data: { $set: data },
        fetching: { $set: true }
      }
    }), () => {
      this.setState(update(this.state, {
        table: {
          fetching: { $set: false }
        }
      }));
    })
  }

  componentDidMount() {
    this.fetchTableData();
  }
  
  meta = [
    {
      title: 'ライセンスキー',
      dataIndex: 'key',
      render: (text, record) => {
        let visible = this.state.table.visibleRowKeys.has(record.key);
        return (
          <>
            {visible?text:(('#'.repeat(8)+'-').repeat(3) + text.slice(-8))}　
            <a href="#n" onClick={()=>this.handleToggleKeyVisible(record)}><Icon type={visible?'eye-invisible':'eye'} /></a>
          </>
        );
      },
    },
    {
      title: '開始日',
      dataIndex: 'created_at',
      render: (text, record) => (
        <>
          {moment(text).format('Y/MM/DD')}
        </>
      ),
    },
    
    {
      title: '有効期限',
      dataIndex: 'expire',
      render: (text, record) => (
        <>
          {moment(text).format('Y/MM/DD')}
        </>
      ),
    },
    
    {
      title: 'お客様名',
      dataIndex: 'name',
      render: (text, record) => (
        <>
          <Tag color={record.type === 1 ? 'geekblue' : 'green'}>
            {{1:'個人', 2:'法人'}[record.type]}
          </Tag>
          {text}
        </>
      ),
    },
  
    {
      title: 'デバイス',
      dataIndex: 'device_count',
      render: (text, record) => 
      <>
        {record.device_count} 
        件　
        {record.device_count > 0 && <span className={`ant-table-row-expand-icon ant-table-row-${this.state.table.expandedRowKeys.has(record.key) ? 'expanded' : 'collapsed'}`} onClick={()=>this.handleExpand(record)}/> }
      </>,
    },
  
    {
      title: '状態',
      dataIndex: 'enabled',
      render: (text, record) => (
        <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>{
        }}>
          <Switch size="small" checked={record.enabled}/>
        </Popconfirm>
      ),
    },
  ];

  handleExpand = async (record) => {
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

    if(!collapsed) {
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

  handleToggleKeyVisible = (record) => {
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
    form.current.validateFields((err, values) => {
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

  componentDidUpdate(prevProps) {
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

  handleTableChange = (pagination, filters, sorter) => {
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

  handleOnFilterChange = (filters) => {
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

  render() {
    let insertPending = this.props.insert.status === 'pending';
    let { table, modal } = this.state;
    let rowKeys = Array.from(table.expandedRowKeys);

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
                <List
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
               }
            />
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