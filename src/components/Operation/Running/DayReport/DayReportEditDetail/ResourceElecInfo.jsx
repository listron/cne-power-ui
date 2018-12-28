
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Icon } from 'antd';
import styles from './reportDetail.scss';
import moment from 'moment';

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
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.editResourceInfo} >
        <Form layout="inline" className={styles.resourceInfoCon} >
          <div className={styles.totalInfo}>
            <div className={styles.tooltip}>综合信息<Icon type="caret-right" theme="outlined" /></div>
            <div className={styles.editPart}>
              <Form.Item label={stationType>0?'日累计辐射':'平均风速'}>
                {getFieldDecorator('resourceValue', {
                  rules: [{ 
                    validator: (rule, value, callback) => {
                      if(requireTargetArr.includes('resourceValue') && !value){
                        callback(`请填写${stationType>0?'日累计辐射':'平均风速'}`);
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > 2 && callback(`不超过2位小数`);
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.resourceValue,
                })(
                  <Input />
                )}
                <span>{stationType>0?radiationUnit:speedUnit}</span>
              </Form.Item>
              <span className={styles.info}>
                <span className={styles.name}>日等效小时数</span>
                <span className={styles.value}>--</span>
              </span>
              <span className={styles.info}>
                <span className={styles.name}>日故障损失电量</span>
                <span className={styles.value}>--</span>
              </span>
              <span className={styles.info}>
                <span className={styles.name}>日限电损失电量</span>
                <span className={styles.value}>--</span>
              </span>
            </div>
          </div>

          <div className={styles.totalInfo}>
            <div className={styles.tooltip}>{stationType>0?'逆变器':'风电机组'}信息<Icon type="caret-right" theme="outlined" /></div>
            <div className={styles.editPart}>
              <Form.Item label={`日发电量`}>
                {getFieldDecorator('genInverter', {
                  rules: [{
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('genInverter') && !value){
                        callback(`请填写${stationType>0?'逆变器':'风电机组'}日发电量`);
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    } 
                  }],
                  initialValue: updateDayReportDetail.genInverter,
                })(
                  <Input placeholder="日发电量" />
                )}
                <span>{genUnit}</span>
              </Form.Item>
              <Form.Item label={`年发电量`}>
                {getFieldDecorator('yearGenInverter', {
                  rules: [{
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('yearGenInverter') && !value){
                        callback(`请填写${stationType>0?'逆变器':'风电机组'}年发电量`);
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    } 
                  }],
                  initialValue: updateDayReportDetail.yearGenInverter,
                })(
                  <Input placeholder="年发电量" />
                )}
                <span>{genUnit}</span>
              </Form.Item>
            </div>
          </div>

          <div className={styles.totalInfo}>
            <div className={styles.tooltip}>集电线路信息<Icon type="caret-right" theme="outlined" /></div>
            <div className={styles.editPart}>
              <Form.Item label="日发电量">
                {getFieldDecorator('genIntegrated', {
                  rules: [{ 
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('genIntegrated') && !value){
                        callback('请填写集电线路日发电量' );
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.genIntegrated,
                })(
                  <Input />
                )}
                <span>{genUnit}</span>
              </Form.Item>
              <Form.Item label="年发电量">
                {getFieldDecorator('yearGenIntegrated', {
                  rules: [{ 
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('yearGenIntegrated') && !value){
                        callback('请填写集电线路年发电量' );
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.yearGenIntegrated,
                })(
                  <Input />
                )}
                <span>{genUnit}</span>
              </Form.Item>
            </div>
          </div>
          
          <div className={styles.totalInfo}>
            <div className={styles.tooltip}>关口表信息<Icon type="caret-right" theme="outlined" /></div>
            <div className={styles.editPart}>
              <Form.Item label="日发电量">
                {getFieldDecorator('genInternet', {
                  rules: [{ 
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('genInternet') && !value){
                        callback('请填写上网电量日发电量' );
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.genInternet,
                })(
                  <Input />
                )}
                <span>{genUnit}</span>
              </Form.Item>
              <Form.Item label="年发电量">
                {getFieldDecorator('yearGenInternet', {
                  rules: [{ 
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('yearGenInternet') && !value){
                        callback('请填写上网电量年发电量' );
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.yearGenInternet,
                })(
                  <Input />
                )}
                <span>{genUnit}</span>
              </Form.Item>
              <Form.Item label="日购网电量">
                {getFieldDecorator('dailyBuyPower', {
                  rules: [{ 
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('dailyBuyPower') && !value){
                        callback('请填写日购网电量' );
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.dailyBuyPower,
                })(
                  <Input />
                )}
                <span>{genUnit}</span>
              </Form.Item>
              <Form.Item label="年购网电量">
                {getFieldDecorator('buyPower', {
                  rules: [{ 
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('buyPower') && !value){
                        callback('请填写年购网电量' );
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.buyPower,
                })(
                  <Input />
                )}
                <span>{genUnit}</span>
              </Form.Item>
            </div>
          </div>
          
          <div className={styles.totalInfo}>
            <div className={styles.tooltip}>{`样板${stationType>0?'逆变器':'风机'}`}<Icon type="caret-right" theme="outlined" /></div>
            <div className={styles.editPart}>
              <Form.Item label={`容量`}>
                {getFieldDecorator('modelInverterCapacity', {
                  rules: [{ 
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('modelInverterCapacity') && !value){
                        callback(`请填写样板${stationType>0?'逆变器':'风机'}容量`);
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > 2 && callback('不超过2位小数');
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.modelInverterCapacity,
                })(
                  <Input />
                )}
                <span>MW</span>
              </Form.Item>
              <Form.Item label={`日发电量`}>
                {getFieldDecorator('modelInverterPowerGen', {
                  rules: [{ 
                    validator: (rule, value, callback)=>{
                      if(requireTargetArr.includes('modelInverterPowerGen') && !value){
                        callback(`请填写样板${stationType>0?'逆变器':'风机'}发电量`);
                      }else if(isNaN(value)){
                        callback('请填写数字');
                      }else{
                        const demicalMax = genUnit === 'kWh'? 2: 4;
                        const demical = `${value}`.split('.')[1];
                        demical && demical.length > demicalMax && callback(`不超过${demicalMax}位小数`);
                      }
                      callback();
                    }
                  }],
                  initialValue: updateDayReportDetail.modelInverterPowerGen,
                })(
                  <Input />
                )}
                <span>{genUnit}</span>
              </Form.Item>
            </div>
          </div>
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
