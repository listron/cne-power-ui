




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import styles from './stationSide.scss';
import { dataRuleFunc } from './detailInformation';
import moment from 'moment';
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
  const { createTime, createUser, userFullname } = stationDetail;
  let createTimeText = createTime?moment(createTime).format('YYYY-MM-DD'): '--';
  let createUserText = createUser || '--';
  return (<section className={styles.otherInfo}>
    <h3 className={styles.titleText}> 其他信息 </h3>
    <FormItem label="有功控制能力" >
      {getFieldDecorator('automaticActiveControl',{
        initialValue: stationDetail.automaticActiveControl,
      })(
        <Select style={{ width: '198px' }} >
          <Option value={1}>是</Option>
          <Option value={0}>否</Option>
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
    <span className={styles.textInfo}>
      <span className={styles.name}>创建人</span>
      <span className={styles.value}>{userFullname || createUserText}</span>
    </span>
    <FormItem label="无功控制能力" >
      {getFieldDecorator('automaticAeactiveContro',{
        initialValue: stationDetail.automaticAeactiveContro,
      })(
        <Select style={{ width: '198px' }} >
          <Option value={1}>是</Option>
          <Option value={0}>否</Option>
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
    <span className={styles.textInfo}>
      <span className={styles.name}>创建时间</span>
      <span className={styles.value}>{createTimeText}</span>
    </span>
    <FormItem label={'低压穿越(LVRT)能力'} >
      {getFieldDecorator('lowPressureCrossing',{
        initialValue: stationDetail.lowPressureCrossing
      })(
        <Select style={{ width: '198px' }} >
          <Option value={1}>是</Option>
          <Option value={0}>否</Option>
        </Select>
      )}
    </FormItem>
    <FormItem label="电站时区" >
      {getFieldDecorator('timeZone',{
        initialValue: stationDetail.timeZone,
        rules: [{ required: true, message: '选择电站时区' }]
      })(
        <Select style={{ width: '198px' }} >
          {timeZoneArr.map(e=>(
            <Option key={e.zoneValue} value={e.zoneValue}>{e.zoneName}</Option>
          ))}
        </Select>
      )}
    </FormItem>
  </section>)
}

export default EditOtherInfo;
