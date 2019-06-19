import * as React from 'react'
import { Form, Row, Col, Radio, Button, Icon, DatePicker, Input } from 'antd';
import debounce from 'lodash/debounce';

const defaultState = {
  name: null,
  dateFrom: null,
  dateTo: null,
  type: null,
  enabled: null
};

class AdvancedSearchForm extends React.Component<any, any> {
  state = defaultState;

  constructor(props) {
    super(props);
    this.triggerFilter = debounce(this.triggerFilter, 800);
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
    });
  };

  handleFilterOnChangeName = (e) => {
    const { value } = e.target;
    this.setState({
      name: value
    }, this.triggerFilter)
  }

  handleFilterOnChangeDateFrom = (dateFrom) => {
    this.setState({
      dateFrom: dateFrom.format('Y/MM/DD')
    }, this.triggerFilter)
  }

  handleFilterOnChangeDateTo = (dateTo) => {
    this.setState({
      dateTo: dateTo.format('Y/MM/DD')
    }, this.triggerFilter)
  }

  handleFilterOnChangeType = (e) => {
    const { value } = e.target;
    this.setState({
      type: value
    }, this.triggerFilter)
  }

  handleFilterOnChangeEnable = (e) => {
    const { value } = e.target;
    this.setState({
      enabled: value
    }, this.triggerFilter)
  }

  triggerFilter = () => {
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
          initialValue: null
        })(
          <Radio.Group onChange={this.handleFilterOnChangeType}>
            <Radio.Button value={null}>全て</Radio.Button>
            <Radio.Button value={1}>個人</Radio.Button>
            <Radio.Button value={2}>法人</Radio.Button>
          </Radio.Group>
          )}
        </Form.Item>

        <Form.Item>
        {getFieldDecorator('enabled', {
          initialValue: null
        })(
          <Radio.Group onChange={this.handleFilterOnChangeEnable}>
            <Radio.Button value={null}>全て</Radio.Button>
            <Radio.Button value={1}>有効</Radio.Button>
            <Radio.Button value={2}>無効</Radio.Button>
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

export default Form.create<any>({ name: 'advanced_search' })(AdvancedSearchForm);