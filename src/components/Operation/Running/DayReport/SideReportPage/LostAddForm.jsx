
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Form, Input, DatePicker, Button } from 'antd';
import moment from 'moment';

class LostAddForm extends Component {
  static propTypes = {
    deviceExistLoading: PropTypes.bool,
    form: PropTypes.object,
    abnormalInfo: PropTypes.object,
    deviceExistInfo: PropTypes.object,
    faultGenList: PropTypes.array,
    changeFaultList: PropTypes.func,
    findDeviceExist: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      deviceNameErroShow: false, // 设备验证失败的提示框展示与否，
      deviceNameErroInfo: '', // 设备验证失败的提示信息，
    }
  }

  componentWillReceiveProps(nextProp){ // 验证设备是否存在功能。
    const { deviceExistLoading } = this.props;
    const nextDeviceLoading = nextProp.deviceExistLoading;
    const { deviceExistInfo } = nextProp;
    if(deviceExistLoading && !nextDeviceLoading && deviceExistInfo.existError){ // 设备名称验证后
      deviceExistInfo.existError && this.setState({
        deviceNameErroShow: true,
        deviceNameErroInfo : `${deviceExistInfo.existErrorData.join(',')}不存在!`
      })
      !deviceExistInfo.existError && console.log('这个设备验证成功了。')
    }
  }

  confirmAddFault = () => {
    const { form, findDeviceExist, abnormalInfo } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { deviceName } = values;
        const tmpDeviceName = deviceName.trim().replace('/\s+/g',',');
        findDeviceExist({
          deviceName: tmpDeviceName,
          stationCode: abnormalInfo.stationCode,
        })
      }
    });
  }

  cancelAddFault = () => {
    const { faultGenList, changeFaultList } = this.props;
    changeFaultList(faultGenList);
  }

  render(){
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={styles.lostAddForm} >
        <Form.Item label="设备名称">
          {getFieldDecorator('deviceName', {
            rules: [{ required: true, message: '设备名称' }],
          })(
            <Input placeholder="设备名称" />
          )}
        </Form.Item>
        <span>多个设备请以空格隔开，设备较多时，可填写上级设备</span>
        <span></span>
        <Form.Item label="发生时间">
          {getFieldDecorator('startTime', {
            rules: [{ required: true, message: '开始时间' }],
          })(
            <DatePicker placeholder="开始时间" />
          )}
        </Form.Item>
        <Form.Item label="结束时间">
          {getFieldDecorator('endTime', {
            rules: [{ required: true, message: '结束时间' }],
          })(
            <DatePicker placeholder="结束时间" />
          )}
          <span>未结束不填写</span>
        </Form.Item>
        <Form.Item label="日损失电量">
          {getFieldDecorator('lostPower', {
            rules: [{ required: true, message: '日损失电量' }],
          })(
            <Input placeholder="日损失电量" />
          )}
          <span>kWh</span>
        </Form.Item>
        <Form.Item label="原因说明">
          {getFieldDecorator('reason', {
            rules: [{ required: true, message: '原因说明' }],
          })(
            <Input.TextArea placeholder="原因说明" />
          )}
          <span>{getFieldValue('reason')?getFieldValue('reason').length:0}/30</span>
        </Form.Item>
        <Form.Item label="处理进展及说明">
          {getFieldDecorator('process', {
            rules: [{ required: true, message: '处理进展及说明' }],
          })(
            <Input.TextArea placeholder="处理进展及说明" />
          )}
          <span>{getFieldValue('process')?getFieldValue('process').length:0}/30</span>
        </Form.Item>
        <div>
          <Button onClick={this.confirmAddFault}>确定</Button>
          <Button onClick={this.cancelAddFault}>取消</Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(LostAddForm);
