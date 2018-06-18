import React, { Component } from 'react';
import { Button, Form, DatePicker, Icon, Modal, Select, Input, Radio, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
class CreateForm extends Component{
  static propTypes={
    form: PropTypes.object,
    onCancel: PropTypes.func,
    onCreate: PropTypes.func,
    visible: PropTypes.bool,
  }

  static defaultProps={

  }

  constructor(props){
    super(props);
    this.state={
      startValue: null,
    }
  }

  filterStation = () => {

  }

  selectChange = (value) => {
    console.log(`selected ${value}`);
  }

  disabledDate = (start) => {
    return start < moment().subtract(1,'day');
  }

  timeRange = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledTime = (time) => {
    return {
      disabledHours: () => this.timeRange(0, 24).splice(0, moment().hour()),
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  } 
    

  render(){
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    const { visible, onCancel, onCreate, form } = this.props;
    const {
      getFieldDecorator,
    } = this.props.form;
    return(
      <div>
        <Modal
          visible={visible}
          title="基本信息"
          footer={null}
          onCancel={onCancel}
        >
          <Form >
            <FormItem
              {...formItemLayout}
              label="巡检名称"
            >
              {getFieldDecorator('inspectName',{
                rules:[{
                  required: true,
                  message: "",
                  max: 10,
                }]
              })(
                <Input placeholder="必填，10个中文字符以内" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="电站名称"
            >
              {getFieldDecorator('stationCodes',{
                rules:[{
                  required: true,
                }]
              })(
                <Input placeholder="输入名字快速查询" onClick={this.filterStation} addonAfter={<Icon type="filter" />} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="设备类型"
            >
              {getFieldDecorator('deviceTypeCodes',{
                rules:[{
                  required: true,
                }]
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择设备类型"
                  onChange={this.selectChange}
                >
                  {children}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="截止时间"
            >
              {getFieldDecorator('deadline',{
                rules:[{
                  required: true,
                }]
              })(
                <DatePicker 
                  showTime 
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder="请选择截至时间"
                  disabledDate={this.disabledDate}
                  disabledTime={this.disabledTime}
                  language="zh-CN"
                />
              )}
            </FormItem>
            <FormItem
              {...tailFormItemLayout}
            >
              <Button htmlType="reset" onClick={onCancel} >取消</Button>
              <Button type="primary" htmlType="submit" onClick={onCreate} >提交</Button>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }

}

export default Form.create()(CreateForm);
