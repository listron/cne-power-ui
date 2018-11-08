




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import styles from './stationSide.scss';
import { dataRuleFunc } from './detailInformation';
const FormItem = Form.Item;
const { Option } = Select; 


const EditOtherInfo = ({stationDetail, form, ...restProps}) => {
  const { getFieldDecorator } = form;
  let timeZoneArr = [];
  for(let i = -12; i < 12;i += 1){
    let zoneName = '';
    if(i === 0){
      zoneName = 'UTC'
    }else{
      let timeFillText = `${Math.abs(i)}`.padStart(2,'0');
      zoneName = i > 0? `UTC+${timeFillText}:00`: `UTC-${timeFillText}:00`;
    }
    timeZoneArr.push({
      zoneName,
      zoneValue: i,
    })
  }
  return (<div style={{display: 'flex', flexWrap: 'wrap'}}>
    <FormItem label="有功控制能力" >
      {getFieldDecorator('automaticActiveControl',{
        initialValue: stationDetail.automaticActiveControl,
      })(
        <Select style={{ width: '198px' }} >
          <Option value={true}>是</Option>
          <Option value={false}>否</Option>
        </Select>
      )}
    </FormItem>
    <FormItem label="监控系统厂家" >
      {getFieldDecorator('monitoringSystemName',{
        initialValue: stationDetail.monitoringSystemName,
        rules: [{ max: 30, message: '不超过30字符' }]
      })(
        <Input />
      )}
    </FormItem>
    <span>
      <span>创建人</span>
      <span>{stationDetail.createUser}</span>
    </span>
    <FormItem label="无功控制能力" >
      {getFieldDecorator('automaticReactiveContro',{
        initialValue: stationDetail.automaticReactiveContro,
      })(
        <Select style={{ width: '198px' }} >
          <Option value={true}>是</Option>
          <Option value={false}>否</Option>
        </Select>
      )}
    </FormItem>
    <FormItem label="监控系统个数" >
      {getFieldDecorator('monitoringSystemCount',{
        initialValue: stationDetail.monitoringSystemCount,
        rules: [{ validator:dataRuleFunc() }]
      })(
        <Input />
      )}
    </FormItem>
    <span>
      <span>创建时间</span>
      <span>{stationDetail.createTime}</span>
    </span>
    <FormItem label={'低压穿越(LVRT)能力'} >
      {getFieldDecorator('lowPressureCrossing',{
        initialValue: stationDetail.lowPressureCrossing
      })(
        <Select style={{ width: '198px' }} >
          <Option value={true}>是</Option>
          <Option value={false}>否</Option>
        </Select>
      )}
    </FormItem>
    <FormItem label="电站时区" >
      {getFieldDecorator('timeZone',{
        initialValue: stationDetail.timeZone
      })(
        <Select style={{ width: '198px' }} >
          {timeZoneArr.map(e=>(
            <Option key={e.zoneValue} value={e.zoneValue}>{e.zoneName}</Option>
          ))}
        </Select>
      )}
    </FormItem>
  </div>)
}

export default EditOtherInfo;
