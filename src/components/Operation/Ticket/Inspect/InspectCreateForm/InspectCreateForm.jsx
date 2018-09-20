import React, { Component } from 'react';
import { Button, Form, DatePicker, Select, Input } from 'antd';
import PropTypes from 'prop-types';
import styles from './inspectCreateForm.scss';
import moment from 'moment';
import StationSelect from '../../../../Common/StationSelect';

const FormItem = Form.Item;
const Option = Select.Option;
class InspectCreateForm extends Component{
  static propTypes={
    form: PropTypes.object,
    error: PropTypes.object,
    createInspect: PropTypes.func,
    loadDeviceTypeList: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    stations: PropTypes.object,
    deviceTypeItems: PropTypes.object,
  }

  constructor(props){
    super(props);
  }

  onInspectCreate = (isContinueAdd) => {
    const { error, form, createInspect } = this.props;
    form.validateFields((err, values) => {
      if(!err){
        createInspect({
          inspectName: values.inspectName,
          isContinueAdd,
          stationCodes: values.stationCodes.map(item => item.stationCode).join(','),
          deviceTypeCodes: values.deviceTypeCodes.join(','),
          deadline: values.deadline.format("YYYY-MM-DD HH:mm:ss"),
        });
        if(isContinueAdd && error.get('code') === '') {
          form.resetFields();
        }
      }
    });
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
    const { deviceTypeItems, stations } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form className={styles.inspectCreateForm}>
          <FormItem label="巡检名称" colon={false}>
            {getFieldDecorator('inspectName',{
              rules:[
                { required: true, message: "请输入巡检名称"},
                { max: 10, message: "不超过10个字"},
              ]
            })(
              <Input placeholder="必填，10个中文字符以内" />
            )}
            <div className={styles.tipText}>(10个字以内)</div>
          </FormItem>
          <FormItem label="电站名称" colon={false}>
            {getFieldDecorator('stationCodes',{
              initialValue: [],
              rules:[{ required: true, message: '请选择电站' }]
            })(
              <StationSelect 
                data={stations.toJS()}
                multiple={true}
                onChange={this.stationSelected}
              />
            )}
            <div className={styles.tipText}>(点击<i className="iconfont icon-filter" />图标可选择)</div>
          </FormItem>
          <FormItem label="设备类型" colon={false}>
            {getFieldDecorator('deviceTypeCodes',{
              rules:[{ required: true, message: '请选择设备类型' }]
            })(
              <Select
                style={{width:200}}
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
          <FormItem label="截止时间" colon={false}>
            {getFieldDecorator('deadline',{
              rules:[{ required: true, message: '请选择截止时间' }]
            })(
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss" 
                placeholder="默认当前时间"
                disabledDate={this.disabledDate}
                disabledTime={this.disabledTime}
                language="zh-CN"
              />
            )}
          </FormItem>
          <div className={styles.actionBar}>
            <Button className={styles.saveBtn} onClick={()=>this.onInspectCreate(false)}>保存</Button>
            <Button onClick={()=>this.onInspectCreate(true)}>保存并继续添加</Button>
          </div>
          <div className={styles.addTips}>
            <span>选择“保存”按钮后将跳转到对应的列表页；</span>
            <span>选择“保存并继续添加”按钮会停留在添加页面</span>
          </div>
        </Form>
      </div>
    );
  }

}

export default Form.create()(InspectCreateForm);
