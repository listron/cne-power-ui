
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Icon } from 'antd';
// import { styles } from 'ansi-colors';
import styles from './reportDetail.scss';

class ResourceElecInfo extends Component {
  static propTypes = {
    dayReportConfig: PropTypes.array,
    form: PropTypes.object,
    updateDayReportDetail: PropTypes.object,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { updateDayReportDetail, dayReportConfig } = this.props;
    const requireTargetObj = dayReportConfig[1] || {};
    const requireTargetArr = Object.keys(requireTargetObj); // 指标必填项

    const configUtil = dayReportConfig[0] || {};
    const radiationUnit = configUtil.radiation || '';
    const speedUnit = configUtil.speed || '';
    const genUnit = configUtil.power || '';
    const { stationType } = updateDayReportDetail;
    const sourceInfoArr = [
      {name: '日报日期', value: 'reportDate', unit: ''},
      {name: '天气', value: 'weather', unit: ''},
      {name: '温度', value: 'temperature', unit: '℃'},
      {name: '电站名称', value: 'stationName', unit: ''},
      {name: '实际容量', value: 'realCapacity', unit: ''},
      {name: '装机台数', value: 'machineCount', unit: '台'},
    ];
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.editResourceInfo} >
        <h4>资源电量信息<Icon type="caret-right" theme="outlined" /></h4>
        <Form layout="inline" className={styles.resourceInfoCon} >
          {sourceInfoArr.map(e=>{
            const targetValue = updateDayReportDetail[e.value];
            const stationValue = targetValue || targetValue === 0 || '--';
            return (<span key={e.name} className={styles.eachResourceInfo} >
              <span className={styles.eachResourceInfoName}>{e.name}</span>
              <span>{stationValue}</span>
              <span>{e.unit}</span>
            </span>)
          })}
          <Form.Item label="日辐射总量(斜面)">
            {getFieldDecorator('resourceValue', {
              rules: [{ required: requireTargetArr.includes('resourceValue'), message: '请填写日辐射总量' }],
              initialValue: updateDayReportDetail.resourceValue,
            })(
              <Input />
            )}
            <span>{stationType>0?radiationUnit:speedUnit}</span>
          </Form.Item>
          <Form.Item label="日发电量(逆变器)">
            {getFieldDecorator('genInverter', {
              rules: [{ required: requireTargetArr.includes('yearGenInverter'), message: '请填写逆变器日发电量' }],
              initialValue: updateDayReportDetail.genInverter,
            })(
              <Input placeholder="日发电量" />
            )}
            <span>{genUnit}</span>
          </Form.Item>
          <Form.Item label="日发电量(集电线路)">
            {getFieldDecorator('genIntegrated', {
              rules: [{ required: requireTargetArr.includes('yearGenIntegrated'), message: '请填写集电线路日发电量' }],
              initialValue: updateDayReportDetail.genIntegrated,
            })(
              <Input />
            )}
            <span>{genUnit}</span>
          </Form.Item>
          <Form.Item label="日发电量(上网电量)">
            {getFieldDecorator('genInternet', {
              rules: [{ required: requireTargetArr.includes('yearGenInternet'), message: '请填写上网电量日发电量' }],
              initialValue: updateDayReportDetail.genInternet,
            })(
              <Input />
            )}
            <span>{genUnit}</span>
          </Form.Item>
          <Form.Item label="日购网电量">
            {getFieldDecorator('buyPower', {
              rules: [{ required: requireTargetArr.includes('buyPower'), message: '请填写购网电量' }],
              initialValue: updateDayReportDetail.buyPower,
            })(
              <Input />
            )}
            <span>{genUnit}</span>
          </Form.Item>
          <Form.Item label="样本逆变器容量">
            {getFieldDecorator('modelInverterCapacity', {
              rules: [{ required: requireTargetArr.includes('modelInverterCapacity'), message: '请填写样本逆变器容量' }],
              initialValue: updateDayReportDetail.modelInverterCapacity,
            })(
              <Input />
            )}
            <span>kW</span>
          </Form.Item>
          <Form.Item label="样本逆变器发电量">
            {getFieldDecorator('modelInverterPowerGen', {
              rules: [{ required: requireTargetArr.includes('modelInverterPowerGen'), message: '请填写样本逆变器发电量' }],
              initialValue: updateDayReportDetail.modelInverterPowerGen,
            })(
              <Input />
            )}
            <span>{genUnit}</span>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create({
  onValuesChange:(props, changedValues, allValues)=>{
    const { updateDayReportDetail, changeReportDetail } = props;
    changeReportDetail({
      ...updateDayReportDetail,
      ...changedValues,
    });
  }
})(ResourceElecInfo);
