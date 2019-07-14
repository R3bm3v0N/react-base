import * as React from 'react';
import { AutoComplete, Tooltip, Form, Input, InputNumber, Icon, DatePicker, Switch, Select, Typography, message, Button, Row, Col} from 'antd';
import debounce from 'lodash/debounce';
import moment from 'moment';
import api from '../../../../services'
import './index.css';

const { RangePicker } = DatePicker;

const AddNewForm = Form.create<any>({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component<any,any> {
    form = React.createRef<any>();

    state = {
      newKeyPending: false,
      customers: [] as any[],
      customerId: undefined,
      customerSearchPending: false,
      customerEmailDataSource: [],
      customerEmailValidateStatus: undefined,
      customerEmailValidateError: undefined,
    };

    constructor(props: any) {
      super(props);
      this.handleLoadCustomer = debounce(this.handleLoadCustomer, 500);
    }

    handleGenerateNewKey = () => {
      this.setState({
        newKeyPending: true
      }, async () => {
        try {
          let newKey = await api.license.generate({});
          this.setState({
            newKeyPending: false,
          }, () => {
            // https://ant.design/components/form/#this.props.form.getFieldDecorator(id,-options)
            // => You shouldn't call setState manually, please use this.props.form.setFieldsValue to change value programmatically.
            this.props.form.setFieldsValue({
              key: newKey
            })
          })
        } catch(error) {
          this.setState({
            newKeyPending: false,
          }, () => message.error(error.message))
        }
      })
    };

    handleLoadCustomer = (keyword: string) => {
      this.setState({
        customerSearchPending: true
      }, async () => {
        try {
          let customers = await api.user.search(keyword);
          this.setState({
            customerSearchPending: false,
            customers
          });
        } catch(error) {
          this.setState({
            customerSearchPending: false,
          }, () => message.error(error.message))
        }
      })
    }

    handleCustomerChange = (customerId: number) => {
      console.log(customerId)
      this.setState({
        customerId
      })
    }

    handleChangeCustomerEmail = (value: any) => {
      this.setState({
        customerEmailDataSource:
          !value || value.indexOf('@') >= 0
            ? []
            : [
              `${value}@gmail.com`, 
              `${value}@yahoo.com`, 
              `${value}@hotmail.com`,
              `${value}@outlook.com`,
              `${value}@yahoo.co.jp`,
            ],
      }, ()=> {
        
      });
    }

    checkCustomerEmail = async (rule: any, email: any, callback: any)  => {
      console.log({rule, email, callback})
      let exists = await api.user.checkEmail(email);
      
      callback(exists ? [new Error('メールが存在します。')] : []);
    }
    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      const insertPending = this.props.insertPending as boolean;
      const initData = this.props.initData;
      const inEditMode = initData !== undefined;
      const options = this.state.customers.map(d => 
        <Select.Option key={d.id}>
        {d.name} - <Typography.Text type="secondary">{d.email}</Typography.Text>
        </Select.Option>
      );
      options.push(<Select.Option key={'null'}><Icon type="plus" style={{marginRight: 5}}/>新規追加</Select.Option>);


      return (
        <Form layout="vertical" ref={this.form}>
          <Form.Item label="ライセンスキー">
            {getFieldDecorator('key', {
              rules: [{ required: true, message: '入力してください。' }],
              initialValue: inEditMode? initData.key : ''
            })(<Input
              readOnly
              disabled={insertPending || inEditMode} 
              placeholder="########-########-########-########"
              suffix={!inEditMode &&
                <Tooltip title="新規ライセンスキーを生成する。"><Button style={{padding:0, margin:0, display: 'inline'}} type='link' disabled={insertPending || this.state.newKeyPending} onClick={this.handleGenerateNewKey}><Icon type="sync" spin={this.state.newKeyPending}/></Button></Tooltip>
              }
            />)}
          </Form.Item>
          
          
          {!inEditMode 
            ? <Form.Item label="有効時間">
                {getFieldDecorator('time', {
                  rules: [{ required: true, message: '入力してください。' }],
                })(
                  <RangePicker disabled={insertPending} style={{ width: '100%' }} />
                )}
              </Form.Item>
          : <Form.Item label="有効時間" style={{ marginBottom: 0 }}>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
              >
                <DatePicker disabled defaultValue={moment(initData.created_at)} style={{ width: '100%' }}/>
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', textAlign: 'center', lineHeight: '30px' }}>〜</span>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('timeTo', {
                  rules: [{ required: true, message: '入力してください。' }],
                  initialValue: moment(initData.expire)
                })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Form.Item>
          }


          <Form.Item label="お客様">
            {getFieldDecorator('customerId', {
              rules: [{ required: true, message: '入力してください。' }],
              initialValue: inEditMode ? (initData.user_name + ' - ' + initData.user_email) : ''
            })(
            // <Input disabled={insertPending} placeholder={'お客様名を入力してください。'} style={{ width: '100%' }} />
              inEditMode
                ? <Input disabled style={{ width: '100%' }} />
                :<Select
                  showSearch
                  allowClear
                  // value={this.state.value}
                  placeholder="お客様を選択してください。"
                  style={this.props.style}
                  defaultActiveFirstOption={false}
                  filterOption={false}
                  onSearch={this.handleLoadCustomer}
                  onChange={this.handleCustomerChange}
                  notFoundContent={null}
                  loading={this.state.customerSearchPending}
                >
                  {options}
                </Select>
            )}
          </Form.Item>

          {
          this.state.customerId === 'null' &&
          <Form.Item style={{padding: 10, background: '#efefef', borderRadius: 4}}>
            <Form.Item label="お客様名">
              {getFieldDecorator('customerName', {
                rules: [{ required: true, message: '入力してください。' }],
              })(<Input
                disabled={insertPending}
                placeholder="例：太郎様"
                suffix={
                  <Icon type="edit" style={{ color: 'rgba(0, 0, 0, 0.25)' }}/>
                }
              />)}
            </Form.Item>
            <Form.Item label="お客様のメールアドレス"
            // hasFeedback
            // validateStatus={this.state.customerEmailValidateStatus}
            // help={this.state.customerEmailValidateError}
            >
              {getFieldDecorator('customerEmail', {
                rules: [
                  { required: true, message: '入力してください。' },
                  {
                    validator: this.checkCustomerEmail
                  },
                ],
              })(<AutoComplete
                disabled={insertPending} 
                dataSource={this.state.customerEmailDataSource}
                onChange={this.handleChangeCustomerEmail}
                placeholder="例：tarokun@gmail.com"
              >
              <Input suffix={this.state.customerEmailValidateStatus === null && <Icon type="edit" style={{ color: 'rgba(0, 0, 0, 0.25)' }}/>} />
              </AutoComplete>)}
            </Form.Item>
          </Form.Item>
          }
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item label="最大顧客数" style={{ display: 'inline-block', width: '50%', marginBottom: 0 }}>
              {getFieldDecorator('maxClient', {
                initialValue: 1,
                rules: [{ required: true, message: '入力してください。' }],
              })(<InputNumber placeholder='最大顧客数' min={1} max={10000} />)}
            </Form.Item>
            {/* <div style={{float:'right'}}> */}
            <Form.Item label="有効" labelAlign="right" className="patch-align-right" 
            style={{ display: 'inline-block', width: '50%', textAlign: 'right', marginBottom: 0}}
            >
              {getFieldDecorator('type', {
                initialValue: true,
                // defaultChecked: true
              })(
                <Switch disabled={insertPending} defaultChecked/>,
              )}
            </Form.Item>
            {/* </div> */}
          </Form.Item>
        </Form>
      );
    }
  },
);

export default AddNewForm;