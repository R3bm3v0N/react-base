import * as React from 'react'
import { Form, Radio, Button, Icon, DatePicker, Input } from 'antd';
import debounce from 'lodash/debounce';

const defaultState = {
  name: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  type: undefined,
  enabled: undefined
};

class SearchForm extends React.Component<any, any> {
  state = defaultState;
  constructor(props: any) {
    super(props);
    this.triggerFilterNow = debounce(this.triggerFilterNow, 500);
    // this.handleFilterOnChangeName = debounce(this.handleFilterOnChangeName, 500);
  }

  handleSearch = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err : any, values: any) => {
      console.log('Received values of form: ', values);
    });
  };

  handleFilterOnChangeName = (e: any) => {
    const { value } = e.target;
    this.setState({
      name: value
    }, this.triggerFilter)
  }

  handleFilterOnChangeDateFrom = (dateFrom: any) => {
    this.setState({
      dateFrom: dateFrom ? dateFrom.format('Y/MM/DD') : undefined
    }, this.triggerFilter)
  }

  handleFilterOnChangeDateTo = (dateTo: any) => {
    this.setState({
      dateTo: dateTo ? dateTo.format('Y/MM/DD') : undefined
    }, this.triggerFilter)
  }

  handleFilterOnChangeType = (e: any) => {
    const { value } = e.target;
    this.setState({
      type: value
    }, this.triggerFilter)
  }

  handleFilterOnChangeEnable = (e: any) => {
    const { value } = e.target;
    this.setState({
      enabled: value
    }, this.triggerFilter)
  }

  triggerFilter = () => {
    this.props.onFilterChangePrepare();
    this.triggerFilterNow();
  }

  triggerFilterNow = () => {
    console.log('triggerFilterNow')
    this.props.onFilterChange(this.state);
  }

  handleReset = () => {
    this.props.form.resetFields(null, {triggerOnChange:true});
    this.setState(defaultState, this.triggerFilter);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const isDefaultFilter = JSON.stringify(defaultState) === JSON.stringify(this.state);
    return (
      <Form layout="inline" className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Form.Item>
          {getFieldDecorator('customer')(<Input onChange={this.handleFilterOnChangeName} placeholder='お客様名' style={{width: 135}} suffix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}/>)}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('dateFrom')(<DatePicker onChange={this.handleFilterOnChangeDateFrom} placeholder='有効時間（終）' style={{ width: 135 }}/>)}
        </Form.Item>
        <Form.Item><span style={{ display: 'inline-block', textAlign: 'center' }}>～</span></Form.Item>
        <Form.Item>
          {getFieldDecorator('dateTo')(<DatePicker onChange={this.handleFilterOnChangeDateTo} placeholder='有効時間（始）' style={{ width: 135 }}/>)}
        </Form.Item>

        <Form.Item>
        {getFieldDecorator('type', {
          initialValue: undefined
        })(
          <Radio.Group onChange={this.handleFilterOnChangeType}>
            <Radio.Button value={undefined}>全て</Radio.Button>
            <Radio.Button value={1}>個人</Radio.Button>
            <Radio.Button value={2}>法人</Radio.Button>
          </Radio.Group>
          )}
        </Form.Item>

        <Form.Item>
        {getFieldDecorator('enabled', {
          initialValue: undefined
        })(
          <Radio.Group onChange={this.handleFilterOnChangeEnable}>
            <Radio.Button value={undefined}>全て</Radio.Button>
            <Radio.Button value={1}>有効</Radio.Button>
            <Radio.Button value={0}>無効</Radio.Button>
          </Radio.Group>
          )}
        </Form.Item>
        {!isDefaultFilter && <Form.Item>
          <Button type="link" style={{ marginLeft: 8 }} onClick={this.handleReset}>
              <Icon type="close-circle"/> リセット
          </Button>
        </Form.Item>}
      </Form>
    );
  }
}

export default Form.create<any>({ name: 'advanced_search' })(SearchForm);