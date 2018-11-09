




import React, { Component } from 'react';
import { Button, Input, Form, Select, DatePicker } from 'antd';
import styles from './stationSide.scss';
import moment from 'moment';
import { dataRuleFunc } from './detailInformation';
const FormItem = Form.Item;
const { Option } = Select; 

const EditConnectNetInfo = ({ stationDetail, form, stationBelongInfo }) => {
  const { getFieldDecorator } = form;
  const { managerType, gridVoltageLevel } = stationBelongInfo;
  return (<section className={styles.connectNet}>
    <h3 className={styles.titleText}> 并网信息及电价情况 </h3>
    <FormItem label="通过并网测验" >
      {getFieldDecorator('gridConnectionDetection',{
        initialValue: stationDetail.gridConnectionDetection,
        rules: [{
          required: true, message: '选择是否通过并网测试',
        }]
      })(
        <Select style={{ width: '198px' }} >
          <Option value={true}>是</Option>
          <Option value={false}>否</Option>
        </Select>
      )}
    </FormItem>
    <FormItem label="调度机构名称" >
      {getFieldDecorator('powerDispatchingAgency',{
        initialValue: stationDetail.powerDispatchingAgency,
        rules: [{ max: 30, message: '不超过30字符' }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label="调度机构性质" >
      {getFieldDecorator('agencyType',{
        initialValue: stationDetail.agencyType,
      })(
        <Select style={{ width: '198px' }} >
          {managerType && managerType.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>
    <FormItem label="并网点电站名称" >
      {getFieldDecorator('gridSubstationName',{
        initialValue: stationDetail.gridSubstationName,
        rules: [{ max: 30, message: '不超过30字符' }]
      })(
        <Input />
      )}
    </FormItem>
    <FormItem label={'首次并网时间'} >
      {getFieldDecorator('ongridTime',{
        initialValue: moment(stationDetail.ongridTime)
      })(
        <DatePicker />
      )}
    </FormItem>
    <FormItem label="全部并网时间" >
      {getFieldDecorator('fullOngridTime',{
        initialValue: moment(stationDetail.fullOngridTime)
      })(
        <DatePicker />
      )}
    </FormItem>
    <FormItem label="并网电压等级" >
      {getFieldDecorator('gridVoltageLevel',{
        initialValue: stationDetail.gridVoltageLevel
      })(
        <Select style={{ width: '198px' }} >
          {gridVoltageLevel && gridVoltageLevel.map(e=>(
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      )}
    </FormItem>
    <FormItem label="发电单元个数" >
      {getFieldDecorator('stationUnitCount',{
        initialValue: stationDetail.stationUnitCount,
        rules: [{ validator: dataRuleFunc() }]
      })(
        <Input />
      )}
    </FormItem>
  </section>)
}

export default EditConnectNetInfo;
