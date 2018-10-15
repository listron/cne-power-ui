
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Form, Input, DatePicker, Button } from 'antd';
import moment from 'moment';

class LimitAddForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    abnormalInfo: PropTypes.object,
    deviceExistInfo: PropTypes.object,
    limitGenList: PropTypes.array,
    changeLimitList: PropTypes.func,
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
    const { deviceExistInfo } = this.props;
    const newDeviceExistInfo = nextProp.deviceExistInfo;
    if(deviceExistInfo.existLoading && !newDeviceExistInfo.existLoading){ // 设备名称验证后
      if(deviceExistInfo.existError){ // 设备验证未通过，有未存在设备
        this.setState({
          deviceNameErroShow: true,
          deviceNameErroInfo : `${deviceExistInfo.existErrorData.join(',')}不存在!`
        })
      }else{ // 设备验证通过
        const { form, changeLimitList, limitGenList } = this.props;
        const { getFieldsValue } = form;
        const limitInfo = getFieldsValue();
        limitInfo.id = `limitAdd${limitGenList.length}`;
        limitInfo.handle = true;
        limitInfo.deviceName = limitInfo.deviceName.trim().replace('/\s+/g',',');
        limitInfo.type = 0;  // 限电type 0 => 后台接收。
        changeLimitList([...limitGenList,limitInfo], true);
      }
    }
  }

  confirmAddLimit = () => {
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

  cancelAddLimit = () => { // 取消限电添加
    const { limitGenList, changeLimitList } = this.props;
    changeLimitList(limitGenList, true);
  }

  render(){
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { deviceNameErroShow, deviceNameErroInfo } = this.state;
    return (
      <Form>
        <Form.Item label="设备名称">
          {getFieldDecorator('deviceName', {
            rules: [{ required: true, message: '设备名称' }],
          })(
            <Input placeholder="设备名称" />
          )}
        </Form.Item>
        <span>多个设备请以空格隔开，设备较多时，可填写上级设备</span>
        {deviceNameErroShow && <span>{deviceNameErroInfo}</span>}
        <Form.Item label="限功率">
          {getFieldDecorator('limitPower', {
            rules: [{ required: true, message: '限功率' }],
          })(
            <Input placeholder="限功率" />
          )}
        </Form.Item>
        <Form.Item label="发生时间">
          {getFieldDecorator('startTime', {
            rules: [{ required: true, message: '发生时间' }],
          })(
            <DatePicker placeholder="发生时间" />
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
        <div>
          <Button onClick={this.confirmAddLimit}>确定</Button>
          <Button onClick={this.cancelAddLimit}>取消</Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(LimitAddForm);
