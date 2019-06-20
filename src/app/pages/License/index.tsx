import * as React from "react";
import update from 'immutability-helper';
import { Row, Col, Table, Tag, Button, List, Switch, message, Modal, Popconfirm, Skeleton, Card, Tabs } from 'antd';
import moment from 'moment';

import api from '../../services'
import connect from './connect';
import SearchForm from './components/SearchForm';
import AddNewForm from './components/AddNewForm';
import './index.css';

const {CopyToClipboard} = require('react-copy-to-clipboard');


class License extends React.Component<any> {
  state = { 
    modal: {
      visible: false
    },
    table: {
      meta: {
        page: {
          current: 1,
          total: 0,
          size: 5,
        },
        sort: {
          column: undefined,
          order: undefined
        },
        filters: {}
      },
      data: [] as any[],
      fetching: false,
      expandedRowKeys: new Set<string>(),
      fetchingRowKeys: new Set<string>(),
      visibleRowKeys: new Set<string>(),
    }
  };

  fetchTableData = async () => {
    // if(this.state.table.fetching) return;

    this.setState(update(this.state, {
      table: {
        fetching: { $set: true },
        expandedRowKeys: { $set: new Set<string>() }
      }
    }), async () => {
      try {
        let payload = await api.license.fetch({
          ...this.state.table.meta
        });
        this.setState(update(this.state, {
          table: {
            meta: {
              page: {
                total: {
                  $set: payload.meta.total
                }
              }
            },
            data: { $set: payload.data },
            fetching: { $set: false }
          }
        }));
      } catch(error) {
        message.destroy();
        message.error(<>{error.message} <Button type="link" style={{padding: 0}} onClick={()=>{message.destroy(); this.fetchTableData()}}>再試行する</Button></>, 0)
        this.setState(update(this.state, {
          table: {
            fetching: { $set: false }
          }
        }));
      }
      
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
      sorter: true
    },
    
    {
      title: '有効期限',
      dataIndex: 'expire',
      render: (text: any, record: any) => (
        <>
          {moment(text).format('Y/MM/DD')}
        </>
      ),
      sorter: true
    },
    
    {
      title: 'お客様名',
      dataIndex: 'user_name',
      render: (text: any, record: any) => (
        <>
          <Tag color={record.user_type === 1 ? 'geekblue' : 'green'}>
            {({1:'個人', 2:'法人'} as any)[record.user_type]}
          </Tag>
          {text}
        </>
      ),
      sorter: true
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
      sorter: true
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
    // const { page, sort, filters } = this.state.table.meta;
    this.setState(update(this.state, {
      table: {
        meta: {
          page: {
            $set: {
              current: pagination.current,
              size: pagination.pageSize,
              total: pagination.total
            }
          },
          sort: {
            $set: {
              column: sorter.columnKey,
              order: sorter.order
            }
          },
          // filters: {
          //   $set: filters
          // }
        }
      }
    }), () => {
      console.log(sorter);
      this.fetchTableData();
    })
  };

  handleOnFilterChangePrepare = () => {
    this.setState(update(this.state, {
      table: {
        fetching: {
          $set: true
        }
      }
    }));
  }

  handleOnFilterChange = (filters: any) => {
    this.setState(update(this.state, {
      table: {
        meta: {
          filters: {
            $set: filters
          }
        }
      }
    }), this.fetchTableData);
  }

  // handleOnPageChange = (page: number, pageSize?: number) => {
  //   console.log('page', page, pageSize)
  //   this.setState(update(this.state, {
  //     table: {
  //       meta: {
  //         page: {
  //           current: {
  //             $set: page
  //           },
  //           size: {
  //             $set: pageSize || 0
  //           }
  //         }
  //       }
  //     }
  //   }), this.fetchTableData);
  // }

  renderDevicesSkeleton = () => <Row style={{ width: '100%' }}>
    <Col span={10}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['80%', '80%']}}/></Col>
    <Col span={10}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['80%', '80%']}}/></Col>
    <Col span={4}>
      <div style={{float:'right', width: '80%'}}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['100%', '100%']}}/></div>
    </Col>
  </Row>

  render() {
    let insertPending = this.props.insert.status === 'pending';
    let { table, modal } = this.state;
    let rowKeys = Array.from(table.expandedRowKeys);
    let {current, size: pageSize, total} = table.meta.page;
    // console.log('table', table)
    return (
      <Row>
        <Col span={24}>
          <Row>
            <Button icon='plus' onClick={this.showModal} type="primary" style={{ marginBottom: 16, float: 'right' }}>
            新規
            </Button>
            <SearchForm onFilterChangePrepare={this.handleOnFilterChangePrepare} onFilterChange={this.handleOnFilterChange}/>
          </Row>
          <div className="search-result-list">
            {
            <Table 
              dataSource={table.data} 
              pagination={{
                current, pageSize, total,
                // hideOnSinglePage: true,
                position: 'both',
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50', '100'],
                // showQuickJumper: true,
                style: { width: '100%', textAlign: 'right'},
                showTotal: (total: number, range: [number, number]) => <div>総アイテム数：{total} (表示{range.join('〜')})</div>,
                // onChange: this.handleOnPageChange,
                // onShowSizeChange: this.handleOnPageChange,
              }}
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
          title="ライセンスキー新規作成"
          okText="作成"
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