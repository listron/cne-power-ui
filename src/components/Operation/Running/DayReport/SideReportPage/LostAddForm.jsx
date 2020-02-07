
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Form, Input, DatePicker, Button, Row, Col } from 'antd';
import { Select, Cascader } from 'antd';
import InputLimit from '../../../../Common/InputLimit';
import DeviceSelect from '../../../../Common/DeviceSelect';
import moment from 'moment';
const { Option } = Select;

class LostAddForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    stationCode: PropTypes.number,
    stationType: PropTypes.number,
    deviceExistInfo: PropTypes.object,
    faultGenList: PropTypes.array,
    lostGenTypes: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    changeFaultList: PropTypes.func,
    findDeviceExist: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getLostGenType: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectLostTypeName: '', // 暂存的
      deviceNameErroShow: false, // 设备验证失败的提示框展示与否，
      deviceNameErroInfo: '', // 设备验证失败的提示信息，
      deviceTypeCode: null, // 选中的设备类型
    }
  }

  componentDidMount() { // 电站下设备类型获取。
    const { stationCode, getStationDeviceTypes } = this.props;
    getStationDeviceTypes({ stationCodes: stationCode });
  }

  // componentWillReceiveProps(nextProp){ // 验证设备是否存在功能。
  //   const { deviceExistInfo } = this.props;
  //   const newDeviceExistInfo = nextProp.deviceExistInfo;
  //   if(deviceExistInfo.existLoading && !newDeviceExistInfo.existLoading){ // 设备名称验证后
  //     // if(false){
  //     if(newDeviceExistInfo.existError){// 设备验证未通过，有未存在设备
  //       const existErrorData = newDeviceExistInfo.existErrorData || [];
  //       this.setState({
  //         deviceNameErroShow: true,
  //         deviceNameErroInfo : `设备${existErrorData}不存在!`
  //       });
  //       setTimeout(()=>{
  //         this.setState({
  //           deviceNameErroShow: false,
  //         });
  //       },2000);
  //     }else{ // 设备验证通过
  //       const { form, changeFaultList, faultGenList } = this.props;
  //       const { selectLostTypeName } = this.state;
  //       const { getFieldsValue } = form;
  //       const lostInfo = getFieldsValue();
  //       lostInfo.id = `lostAdd${faultGenList.length}`;
  //       lostInfo.handle = true;
  //       lostInfo.faultName = selectLostTypeName;
  //       lostInfo.deviceId = newDeviceExistInfo.existErrorData;
  //       lostInfo.faultId = lostInfo.faultId[lostInfo.faultId.length - 1];
  //       lostInfo.deviceName = [...new Set(lostInfo.deviceName.split(' ').filter(e=>!!e))].join(',');
  //       lostInfo.type = 1;  // 损失type 1 => 后台接收。
  //       changeFaultList([...faultGenList,lostInfo], true);
  //     }
  //   }
  // }

  confirmAddFault = () => {
    const { form, findDeviceExist, stationCode, changeFaultList, faultGenList } = this.props;
    const { deviceTypeCode, selectLostTypeName, deviceTypeName } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let tmpDeviceId = [], tmpDeviceName = [], tmpDeviceCode = [];
        values.id = `lostAdd${faultGenList.length}`;
        values.handle = true;
        values.faultName = selectLostTypeName;
        values.deviceName.forEach(e => {
          tmpDeviceId.push(e.deviceId);
          tmpDeviceName.push(e.deviceName);
          tmpDeviceCode.push(e.deviceCode);
        })
        values.deviceId = tmpDeviceId.join(',');
        values.deviceName = tmpDeviceName.join(',');
        values.deviceCode = tmpDeviceCode.join(',');
        values.faultId = values.faultId[values.faultId.length - 1];
        values.type = 1;  // 损失type 1 => 后台接收。
        values.deviceTypeName = deviceTypeName;
        values.lostPower = values.lostPower && values.lostPower.trim();
        changeFaultList([...faultGenList, values], true);
        // const { deviceName } = values;
        // const tmpDeviceName = deviceName.split(' ').filter(e=>!!e);
        // const newDeviceName = [...new Set(tmpDeviceName)].join(',');
        // findDeviceExist({
        //   deviceName: newDeviceName,
        //   stationCode,
        //   deviceTypeCode,
        // })
      }
    });
  }

  selectDeviceType = (value) => {
    const { stationType, getLostGenType, form, stationDeviceTypes } = this.props;
    getLostGenType({ // 选中电站的所有故障类型
      stationType,
      deviceTypeCode: value
    })
    const { deviceTypeName } = stationDeviceTypes.find(e => e.deviceTypeCode === value);
    // const tmpName = tmpDeviceType && tmpDeviceType.deviceTypeName;
    // if (tmpName === '全场信息汇总') {
    //   form.setFieldsValue({ deviceName: tmpName });
    // }
    form.setFieldsValue({ faultId: null });
    form.setFieldsValue({ deviceName: [] });
    this.setState({
      deviceTypeCode: value,
      deviceTypeName
    })
    return value
  }

  selectLostType = (value, selectOption) => {
    this.setState({
      selectLostTypeName: selectOption[selectOption.length - 1].label,
    })
    return value
  }

  cancelAddFault = () => {
    const { faultGenList, changeFaultList } = this.props;
    changeFaultList(faultGenList, true);
  }

  disabledDate = (start) => {
    return start && start > moment();
  }

  render() {
    const { form, lostGenTypes, stationDeviceTypes, stationCode } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { deviceNameErroShow, deviceNameErroInfo, deviceTypeCode } = this.state;
    const reasonLength = getFieldValue('reason') ? getFieldValue('reason').length : 0;
    const processLength = getFieldValue('process') ? getFieldValue('process').length : 0;
    let tmpGenTypes = [];
    lostGenTypes.forEach(e => e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    const groupedLostGenTypes = [];
    tmpGenTypes.map(ele => {
      if (ele && ele.list && ele.list.length > 0) {
        let innerArr = { children: [] };
        innerArr.label = ele.name;
        innerArr.value = ele.id;
        ele.list.forEach(innerInfo => {
          innerArr.children.push({
            label: innerInfo.name,
            value: innerInfo.id,
          });
        })
        groupedLostGenTypes.push(innerArr);
      }
    })
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
    const tmpDeviceType = stationDeviceTypes.find(e => e.deviceTypeCode === deviceTypeCode);
    const disableDevice = tmpDeviceType && tmpDeviceType.deviceTypeName === '全场信息汇总';
    return (
      <Form className={styles.lostAddForm} >
        <div className={styles.infoTip}>
          <span className={styles.round}>!</span>
          <span>全场损失时,设备类型选择"全场信息汇总",设备总称填写"全场信息汇总"</span>
        </div>
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="设备类型" {...formItemLayout1} >
              {getFieldDecorator('deviceTypeCode', {
                rules: [{ required: true, message: '请选择设备类型' }],
              })(
                <Select placeholder="请选择" onChange={this.selectDeviceType}>
                  {stationDeviceTypes && stationDeviceTypes.length > 0 && stationDeviceTypes.map(e => (
                    <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="损失电量类型" {...formItemLayout1} >
              {getFieldDecorator('faultId', {
                rules: [{ required: true, message: '请选择损失电量类型' }],
              })(
                <Cascader
                  options={groupedLostGenTypes}
                  expandTrigger="hover"
                  placeholder="请选择"
                  className={styles.lostTypeSelector}
                  onChange={this.selectLostType}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.deviceSelect} >
          <Col span={24}>
            <Form.Item label="设备名称" className={styles.deviceSelect} >
              {getFieldDecorator('deviceName', {
                rules: [{ required: true, message: '请选择设备' }],
                initialValue: [],
              })(
                <DeviceSelect
                  // disabled={disableDevice}
                  stationCode={stationCode}
                  deviceTypeCode={deviceTypeCode}
                  multiple={true}
                  style={{ width: 'auto', minWidth: '198px' }}
                // onChange={this.selectedDevice}
                />
              )}
              {/* <span className={styles.lostInputTip}>多个设备请以空格隔开，设备较多时，可填写上级设备</span> */}
              {/* {deviceNameErroShow && <div className={styles.dataErrorText}><i className="iconfont icon-alert_01" ></i><span>{deviceNameErroInfo}</span></div>} */}
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="发生时间" {...formItemLayout1} >
              {getFieldDecorator('startTime', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    const endTime = form.getFieldValue('endTime');
                    const entTimeError = form.getFieldError('endTime');
                    if (!value) {
                      callback('请选择发生时间');
                    } else if (value && endTime) {
                      const timeUnable = value > endTime;
                      const timeEnable = entTimeError && value <= endTime; // 结束时间报错，但开始时间更正可用
                      timeEnable && form.setFields({
                        endTime: {
                          value: endTime,
                          errors: null
                        }
                      });
                      timeUnable && callback('结束时间必须大于开始时间');
                    }
                    callback();
                  } 
                }],
              })(
                <DatePicker
                  disabledDate={this.disabledDate}
                  placeholder="请选择"
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="结束时间" {...formItemLayout2} >
              {getFieldDecorator('endTime', {
                rules: [{
                  validator: (rule, value, callback) => {
                    const startTime = form.getFieldValue('startTime');
                    const startTimeError = form.getFieldError('startTime');
                    if (value && startTime) {
                      const timeUnable = startTime > value;
                      const timeEnable = startTimeError && value >= startTime; // 开始时间报错，但结束时间更正为可用
                      timeEnable && form.setFields({
                        startTime: {
                          value: startTime,
                          errors: null
                        }
                      });
                      timeUnable && callback('结束时间必须大于开始时间');
                    }
                    callback();
                  } 
                }],
              })(
                <DatePicker
                  disabledDate={this.disabledDate}
                  placeholder="结束时间"
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                />
              )}
              <span className={styles.lostInputTip}>未结束不填写</span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.horizontal} >
          <Col span={8}>
            <Form.Item label="日损失电量" {...formItemLayout1} >
              {getFieldDecorator('lostPower', {
                rules: [{
                  validator: (rule, value, callback) => {
                    let truelyValue = value;
                    if(truelyValue.indexOf(" ") >= 0){
                      callback('损失电量请填写数字');
                    }else if (truelyValue && isNaN(truelyValue)) {
                      callback('损失电量请填写数字');
                    } else if (truelyValue) {
                      const demical = `${truelyValue}`.split('.')[1];
                      demical && demical.length > 2 && callback('损失电量不超过2位小数');
                    }
                    callback();
                  }
                }],
              })(
                <Input />
              )}
              <span className={styles.lostInputTip}>kWh</span>
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.reasonBox} >
          <Col span={24}>
            <Form.Item label={
              <div className={styles.reasonText}>
                <div>原因说明</div>
                <div>({reasonLength}/999)</div>
              </div>
            } {...formItemLayout1} >
              {getFieldDecorator('reason', {
                rules: [{ required: true, message: '请填写原因说明' }],
              })(
                <InputLimit size={999} className={styles.reasonArea} numberIsShow={false} width={520} height={60} />
              )}
              {reasonLength >= 999 && <span className={styles.lostInputTip}>字数已超出限制</span>}
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.reasonBox}>
          <Col span={24}>
            <Form.Item label={
              <div className={styles.reasonText}>
                <div>处理进展及说明</div>
                <div>({processLength}/999)</div>
              </div>
            } {...formItemLayout1} >
              {getFieldDecorator('process', {
                rules: [{ required: true, message: '请填写处理进展及说明' }],
              })(
                <InputLimit size={999} className={styles.reasonArea} numberIsShow={false} width={520} height={60} />
              )}
              {processLength >= 999 && <span className={styles.lostInputTip}>字数已超出限制</span>}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginTop: '0px' }}>
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
