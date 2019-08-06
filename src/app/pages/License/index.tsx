import * as React from "react";
import update from 'immutability-helper';
import { Row, Col, Table, Tag, Button, List, Switch, message, Modal, Popconfirm, Skeleton, Alert, Icon } from 'antd';
import moment from 'moment';

import api from '../../services'
import connect from './connect';
import SearchForm from './components/SearchForm';
import AddNewForm from './components/AddNewForm';
import './index.css';
import { setState } from "../../utils/reactUtils";

const {CopyToClipboard} = require('react-copy-to-clipboard');


class License extends React.Component<any> {
  state = { 
    modal: {
      visible: false,
      mode: 'insert',
      // licenseKey: undefined,
      params: undefined
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
      fetchingUpdateRowKeys: new Set<string>(),
      fetchUpdateData: undefined
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
        if (!record.key) return {
          children: <Alert
            message={<span>お顧客からのライセンス要求<span style={{ float: 'right', fontSize: '14px' }}>{moment(record.created_at).format('Y/MM/DD')}に作成されました</span></span>}
            description={record.request_note}
            type="warning"
            showIcon
            icon={<Icon type="message" />}
          />,
          props: {
            colSpan: 3,
          }
        };

        let visible = this.state.table.visibleRowKeys.has(record.key);
        return <>
          <span style={{ minWidth: 280, display: 'inline-block' }}>{visible ? text : (('#'.repeat(8) + '-').repeat(3) + text.slice(-8))}</span>
          <Button style={{ marginRight: 5 }} shape="circle" size="small" icon={!visible ? 'eye-invisible' : 'eye'} onClick={() => this.handleToggleKeyVisible(record)} />
          <CopyToClipboard text={text} onCopy={() => message.success('クリップボードにコピー。')}>
            <Button shape="circle" size="small" icon="copy" />
          </CopyToClipboard>
        </>;
      },
    },
    {
      title: '開始日',
      dataIndex: 'created_at',
      render: (text: any, record: any) => {
        if (!record.key) return {
          children: '',
          props: {
            colSpan: 0,
          }
        };
        return <>
          {text && moment(text).format('Y/MM/DD') || ''}
        </>
      },
      sorter: true
    },
    
    {
      title: '有効期限',
      dataIndex: 'expire',
      render: (text: any, record: any) => {
        if (!record.key) return {
          children: '',
          props: {
            colSpan: 0,
          }
        };
        return <>
          {text && moment(text).format('Y/MM/DD') || ''}
        </>;
      },
      sorter: true
    },
    
    {
      title: 'お客様名',
      dataIndex: 'user_name',
      render: (text: any, record: any) => (
        <>
          <Tag color={record.license_type === 1 ? 'geekblue' : 'green'}>
            {({1:'個人', 2:'法人'} as any)[record.license_type]}
          </Tag>
          {text || (record.purchase_email || '').split(',')[0].trim()}
        </>
      ),
      sorter: true
    },
  
    {
      title: 'デバイス',
      dataIndex: 'device_count',
      render: (text: any, record: any) => 
      <>
        {record.device_count}/{record.max_client} 
        件　
        {record.device_count > 0 && <span className={`ant-table-row-expand-icon ant-table-row-${this.state.table.expandedRowKeys.has(`${record.key}_${record.license_request_id}`) ? 'expanded' : 'collapsed'}`} onClick={()=>this.handleExpand(record)}/> }
      </>,
      sorter: true
    },
  
    {
      title: '状態',
      dataIndex: 'enabled',
      render: (text: any, record: any) => {
        if (!record.key) return {
          children: <Button loading={this.state.table.fetchingUpdateRowKeys.has(record.key + record.license_request_id)} shape="round" size="small" block icon="plus" type="danger" onClick={e => this.showModal('process_license_request', record)}>処理</Button>,
          props: {
            colSpan: 2,
          }
        };

        return <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={() => {
            console.log(record.enabled)
          }}>
            <Switch size="small" checked={record.enabled === 1} />
          </Popconfirm>;
      },
    },

    {
      title: '変更',
      dataIndex: 'edit',
      render: (text: any, record: any) => {
        if (!record.key) return {
          children: '',
          props: {
            colSpan: 0,
          }
        };

        return <Button loading={this.state.table.fetchingUpdateRowKeys.has(record.key + record.license_request_id)} shape="circle" size="small" icon="edit" onClick={e => this.showModal('update', record)} />
      },
    },
  ];

  handleExpand = async (record: any) => {
    let rowKey = `${record.key}_${record.license_request_id}`;
    let oldExpands = this.state.table.expandedRowKeys as Set<string>;
    let collapsed = oldExpands.has(rowKey);
    collapsed 
      ? oldExpands.delete(rowKey)
      : oldExpands.add(rowKey);

    await setState(this, update(this.state, {
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
      
      let idx = this.state.table.data.findIndex(v => v.key === record.key);
      if (idx > -1) {
        await setState(this, update(this.state, {
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

  // showModalAdd = () => {
  //   console.log(this.modal.current)
  //   console.log(this.modal.current)
  //   console.log(this.modal.current.props)

  //   this.modal.current.getForm().showModal('insert');
  //   // const form = this.modal;
  //   // form.current && form.current.resetFields();
  //   // this.setState(update(this.state, {
  //   //   table: {
  //   //     fetchingUpdateRowKeys: {
  //   //       $set: new Set<string>()
  //   //     },
  //   //     fetchUpdateData: {
  //   //       $set: undefined
  //   //     }
  //   //   }
  //   // }));
  // };

  modal = React.createRef<any>();
  // handleCreate = () => {
  //   const form = this.modal;
  //   const { table} = this.state;
  //   form.current.validateFields(async (err: any, values: any) => {
  //     if (err) {
  //       return;
  //     }
  //     if(values.customerId === 'null') {
  //       values.customerId = null;
  //     }

  //     if (table.fetchUpdateData) {
  //       try {
  //         let payload = await api.license.update(values);
  //         message.success('データを変更した。');
  //         form.current.resetFields();
  //         this.hideModal();
  //         this.fetchTableData();
  //       } catch(error) {
  //         message.error(error.message);
  //       }

  //     } else {
  //       // this.props.insert(values);
  //       try {
  //         let payload = await api.license.insert(values);
  //         message.success('データを追加した。');
  //         form.current.resetFields();
  //         this.hideModal();
  //         this.fetchTableData();
  //       } catch (error) {
  //         message.error(error.message);
  //       }
  //     }
  //   });
  // };

  // saveFormRef = formRef => {
  //   this.formRef = formRef;
  // };

  componentDidUpdate(prevProps: any) {
    // const form = this.modal;
    // if(prevProps.insert.status === 'pending') {
    //   if(this.props.insert.status === 'success') {
    //     message.success('データを追加した。');
    //     form.current.resetFields();
    //     this.hideModal();
    //   } else {
    //     message.error('データの追加に失敗しました。');
    //   }
    // }
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

  renderDevicesSkeleton = () => <Row style={{ width: '100%' }}>
    <Col span={10}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['80%', '80%']}}/></Col>
    <Col span={10}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['80%', '80%']}}/></Col>
    <Col span={4}>
      <div style={{float:'right', width: '80%'}}><Skeleton active={true} loading={true} title={false} paragraph={{rows:2, width: ['100%', '100%']}}/></div>
    </Col>
  </Row>

  // Modal - START
  hideModal = () => {
    setState(this, update(this.state, {
      modal: {
        visible: { $set: false }
      }
    }))
  }

  showModal = async (mode: 'insert' | 'update' | 'process_license_request', params: any = undefined) => {
    if (mode === 'update' || mode === 'process_license_request') {
      let { fetchingUpdateRowKeys } = this.state.table;

      let rowKey = params.key + params.license_request_id;
      console.log(rowKey)

      // loading icon - on
      fetchingUpdateRowKeys.add(rowKey);
      await setState(this, update(this.state, {
        table: {
          fetchingUpdateRowKeys: {
            $set: fetchingUpdateRowKeys
          }
        }
      }));

      try {
        let data;
        if (mode === 'update') {
          [data] = await api.license.get(params.key);
        } else {
          [data] = await api.licenseRequest.get(params.license_request_id);
        }

        await setState(this, update(this.state, {
          table: {
            fetchUpdateData: {
              $set: data
            }
          },
        }))
        
      } catch (error) {
        message.error(error.message);
      }

      // loading icon - off
      fetchingUpdateRowKeys.delete(rowKey);
      await setState(this, update(this.state, {
        table: {
          fetchingUpdateRowKeys: {
            $set: fetchingUpdateRowKeys
          }
        }
      }));
    }

    setState(this, update(this.state, {
      modal: {
        visible: { $set: true },
        mode: { $set: mode },
        params: { $set: params }
      }
    }))
  }
  // Modal - END

  render() {
    let { table, modal } = this.state;
    let rowKeys = Array.from(table.expandedRowKeys);
    let {current, size: pageSize, total} = table.meta.page;
    // console.log('table', table)
    return (
      <Row>
        <Col span={24}>
          <Row>
            <Button icon='plus' onClick={e=>this.showModal('insert')} type="primary" style={{ marginBottom: 16, float: 'right' }}>
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
                showTotal: (total: number, range: [number, number]) => <div>全件数：{total} (表示{range.join('〜')})</div>,
                // onChange: this.handleOnPageChange,
                // onShowSizeChange: this.handleOnPageChange,
              }}
              rowKey={record => `${record.key}_${record.license_request_id}`}
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
                        <Col span={10} dangerouslySetInnerHTML={{
                          __html: this.renderDeviceInfoHtml(key, item) }} style={{ overflow: 'auto' }}/>
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

        {modal.visible && <AddNewForm
          ref={this.modal}
          mode={modal.mode}
          params={modal.params}
          onSubmitSuccess={this.handleModalSubmitSuccess}
          onSubmitFailed={this.handleModalSubmitFailed}
          onCancelBtn={this.hideModal}
        />}
      </Row>
    );
  }

  

  handleModalSubmitSuccess = () => {
    this.hideModal();
    this.fetchTableData();
  }

  handleModalSubmitFailed = () => {
    this.hideModal();
    this.fetchTableData();
  }

  renderDeviceInfoHtml(key: number, item: any): string {
    let num = key + 1;
    return '<div style="max-height: 100px; overflow-y:auto"><table width="100%"><tr>' + (() => {
      let obj = JSON.parse(item.info);
      return Object.entries(obj).map(([key, val], idx) => `<tr><td width="20px">${idx === 0 ? num : ''}</td><td width="150px">${this.translate(key)}</td><td>${val}</td></tr>`).join('');
    })() + '</tr></table></div>';
  }
  translate(key: string) {
    return ({
      brand: 'ブランド',
      buildId: 'ビルドID',
      cpuAbi: 'CPU Abi',
      cpuAbi2: 'CPU Abi 2',
      device: 'デバイス',
      display: '表示',
      hardware: 'ハードウェア',
      host: 'ホスト',
      manufacturer: 'メーカー',
      modelAndProduct: 'モデルと製品',
      osApiLevel: 'OS API レベル',
      osVersion: 'OS バージョン',
      release: 'リリース',
      serial: 'シリアル',
      unknown: 'Unknown',
      user: 'ユーザー',
    } as any)[key] ;
  }
}

export default connect(License);