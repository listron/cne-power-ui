
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Form, Input, DatePicker, Button,Row,Col } from 'antd';
import moment from 'moment';
import { iif } from 'rxjs';

class LimitAddForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    stationCode: PropTypes.number,
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
      // if(false){ 
      if(deviceExistInfo.existError){// 设备验证未通过，有未存在设备
        this.setState({
          deviceNameErroShow: true,
          deviceNameErroInfo : `${newDeviceExistInfo.existErrorData.join(',')}不存在!`
        });
        setTimeout(()=>{
          this.setState({
            deviceNameErroShow: false,
          });
        },2000);
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
    const { form, findDeviceExist, stationCode } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { deviceName } = values;
        const tmpDeviceName = deviceName.trim().replace('/\s+/g',',');
        findDeviceExist({
          deviceName: tmpDeviceName,
          stationCode,
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
            <Form.Item label="设备名称" {...formItemLayout1} >
              {getFieldDecorator('deviceName', {
                rules: [{ required: true, message: '设备名称' }],
              })(
                <Input />
              )}
              <span className={styles.lostInputTip}>多个设备请以空格隔开，设备较多时，可填写上级设备</span>
              {deviceNameErroShow && <div className={styles.dataErrorText}><i className="iconfont icon-alert_01" ></i><span>{deviceNameErroInfo}</span></div>}
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="限功率" {...formItemLayout1} >
              {getFieldDecorator('limitPower', {
                rules: [{ required: true, message: '请填写正确的限功率数字!', pattern: /^(-?\d+)(\.\d+)?$/ }],
              })(
                <Input />
              )}
              <span className={styles.lostInputTip}>%</span>
            </Form.Item> 
          </Col>
        </Row>
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="发生时间" {...formItemLayout1} >
              {getFieldDecorator('startTime', {
                rules: [{ required: true, message: '请选择发生时间' }],
              })(
                <DatePicker showTime={true} format="YYYY-MM-DD hh:mm"  />
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="结束时间" {...formItemLayout2} >
              {getFieldDecorator('endTime', {
                // rules: [{ required: true, message: '结束时间' }],
              })(
                <DatePicker showTime={true} format="YYYY-MM-DD hh:mm" />
              )}
              <span className={styles.lostInputTip}>未结束不填写</span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="日损失电量" {...formItemLayout1} >
              {getFieldDecorator('lostPower', {
                rules: [{ required: true, message: '请填写正确的日损失电量!', pattern: /^(-?\d+)(\.\d+)?$/ }],
              })(
                <Input />
              )}
              <span className={styles.lostInputTip}>kWh</span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.reasonBox} >
          <Col span={8}>
            <Form.Item label="原因说明" {...formItemLayout1} >
              {getFieldDecorator('reason', {
                rules: [{ required: true, message: '请填写原因说明' }],
              })(
                <Input.TextArea className={styles.reasonArea} />
              )}
              <span className={styles.lostInputTip}>({getFieldValue('reason')?getFieldValue('reason').length:0}/30)</span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.reasonBox}>
          <Col span={8}>
            <Form.Item label="处理进展及说明" {...formItemLayout1} >
              {getFieldDecorator('process', {
                rules: [{ required: true, message: '请填写处理进展及说明' }],
              })(
                <Input.TextArea className={styles.reasonArea}  />
              )}
              <span className={styles.lostInputTip}>({getFieldValue('process')?getFieldValue('process').length:0}/30)</span>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{marginTop: '0px'}}>
          <Col span={8}>
            <Form.Item {...tailFormItemLayout}>
              <Button onClick={this.confirmAddLimit} className={styles.confirmAddFault} >确定</Button>
              <Button onClick={this.cancelAddLimit} className={styles.cancelAddFault} >取消</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(LimitAddForm);
