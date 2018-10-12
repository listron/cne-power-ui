
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Form, Input, DatePicker, Button,Row,Col } from 'antd';
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
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
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

    return (
      <Form className={styles.lostAddForm} >
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="损失电量类型" {...formItemLayout1} >
              {getFieldDecorator('deviceName', {
                rules: [{ required: true, message: '损失电量类型' }],
              })(
                <Input placeholder="损失电量类型" />
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="设备名称" {...formItemLayout2} >
              {getFieldDecorator('deviceName', {
                rules: [{ required: true, message: '设备名称' }],
              })(
                <Input placeholder="设备名称" />
              )}
              <span className={styles.lostInputTip} >多个设备请以空格隔开，设备较多时，可填写上级设备</span>
              <span></span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="发生时间" {...formItemLayout1} >
              {getFieldDecorator('startTime', {
                rules: [{ required: true, message: '开始时间' }],
              })(
                <DatePicker placeholder="开始时间" showTime={true} format="YYYY-MM-DD hh:mm" />
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="结束时间" {...formItemLayout2} >
              {getFieldDecorator('endTime', {
                // rules: [{ required: true, message: '结束时间' }],
              })(
                <DatePicker placeholder="结束时间"  showTime={true} format="YYYY-MM-DD hh:mm" />
              )}
              <span className={styles.lostInputTip}>未结束不填写</span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="日损失电量" {...formItemLayout1} >
              {getFieldDecorator('lostPower', {
                rules: [{ required: true, message: '日损失电量' }],
              })(
                <Input placeholder="日损失电量" />
              )}
              <span className={styles.lostInputTip}>kWh</span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.reasonBox} >
          <Col span={8}>
            <Form.Item label="原因说明" {...formItemLayout1} >
              {getFieldDecorator('reason', {
                rules: [{ required: true, message: '原因说明' }],
              })(
                <Input.TextArea placeholder="原因说明" className={styles.reasonArea} />
              )}
              <span className={styles.lostInputTip}>({getFieldValue('reason')?getFieldValue('reason').length:0}/30)</span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.reasonBox}>
          <Col span={8}>
            <Form.Item label="处理进展及说明" {...formItemLayout1} >
              {getFieldDecorator('process', {
                rules: [{ required: true, message: '处理进展及说明' }],
              })(
                <Input.TextArea placeholder="处理进展及说明"  className={styles.reasonArea}  />
              )}
              <span className={styles.lostInputTip}>({getFieldValue('process')?getFieldValue('process').length:0}/30)</span>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{marginTop: '0px'}}>
          <Col span={8}>
            <Form.Item {...tailFormItemLayout}>
              <Button onClick={this.confirmAddFault} className={styles.confirmAddFault} >确定</Button>
              <Button onClick={this.cancelAddFault} className={styles.cancelAddFault} >取消</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(LostAddForm);
