import React, { Component } from 'react';
import { Button, Form, DatePicker, Icon, Modal, Select, Input, Radio, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import styles from './inspectCreateForm.scss';
import moment from 'moment';
import StationSelect from '../../../../Common/StationSelect';

const FormItem = Form.Item;
const Option = Select.Option;
class InspectCreateForm extends Component{
  static propTypes={
    form: PropTypes.object,
    onCancel: PropTypes.func,
    createInspect: PropTypes.func,
    visible: PropTypes.bool,
    loadDeviceTypeList: PropTypes.func,
    onCloseInspectCreate: PropTypes.func,
    getStations: PropTypes.func,
    stations: PropTypes.object,
    deviceTypeItems: PropTypes.object,
  }

  static defaultProps={
  }

  constructor(props){
    super(props);
    this.state={
      startValue: null,
    }
  }

  onHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.props.createInspect({
          inspectName: values.inspectName,
          stationCodes: values.stationCodes.map((item) => (item.stationCode)).toString(),
          deviceTypeCodes: values.deviceTypeCodes.toString(),
          deadline: values.deadline.format("YYYY-MM-DD hh:mm:ss"),
        })
      }
    })
  }

  stationSelected = (stations) => {
    const stationCodes = (stations && stations[0] && stations[0].stationCode) || 0;
    this.props.loadDeviceTypeList({stationCodes})
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
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 8,
          offset: 8,
        },
        sm: {
          span: 16,
          offset: 16,
        },
      },
    };
    
    const { deviceTypeItems } = this.props;
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <Form onSubmit={this.onHandleSubmit} >
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
              <StationSelect 
                data={this.props.stations.toJS()}
                multiple={true}
                onChange={this.stationSelected}
              />
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
                disabled={deviceTypeItems.size === 0}
              >
                {deviceTypeItems.map((item, index) => (
                  <Option key={item.get('deviceTypeName')+index} value={item.get('deviceTypeCode')} >{item.get('deviceTypeName')}</Option> 
                ))}
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
            <Button htmlType="reset" onClick={this.props.onCloseInspectCreate} >取消</Button>
            <Button type="primary" htmlType="submit" >提交</Button>
          </FormItem>
        </Form>
      </div>
    )
  }

}

export default Form.create()(InspectCreateForm);
