import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, DatePicker } from 'antd';
import StationSelect from '../../../../Common/StationSelect';
import DeviceSelect from '../../../../Common/DeviceSelect/index';
import styles from '../deviceSide.scss';
import WindInstallDate from "./WindInstallDate";
import WindMeasurement from "./WindMeasurement";
import ShowAddDeviceModeModal from "./ShowAddDeviceModeModal";
import Confluence from "./Confluence";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
class AddDeviceForm extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showAddDeviceModeModal: false,
      deviceModeCodeAdd: '',
      manufacturerAdd: '',
      showAddDeviceMode: false,
    }
  }
  componentWillReceiveProps(nextprops) {
    const { deviceNameOk, addDeviceTypeData, addDeviceModeData, addPvDeviceModeData } = nextprops;
    if (deviceNameOk === true && deviceNameOk !== this.props.deviceNameOk) {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (values.deviceTypeCode === 202 || values.deviceTypeCode === 206) {
            let branchCountArr = [];
            for (let i = 0; i < values.branchCount; i++) {
              branchCountArr.push(i + 1)
            }
            if (values.branchCount) {
              values.connectedBranches = branchCountArr.map((e, i) => {
                return values.connectedBranches.includes(e) ? 1 : 0
              })
            }
            
            values.map = {
              componentMode: addPvDeviceModeData.deviceModeCode ? addPvDeviceModeData.deviceModeCode : values.componentMode,
              branchCount: +values.branchCount,
              connectedBranches: values.connectedBranches
            };
          }
          if (values.deviceTypeCode === 304) {
            values.map = { belongMatrix: values.belongMatrix }
          } else if (values.deviceTypeCode === 101) {
            values.map = {
              assemblyTime: moment(values.assemblyTime).format('YYYY-MM-DD'),
              ongridTime: moment(values.ongridTime).format('YYYY-MM-DD'),
              warrantyBegintime: moment(values.warrantyBegintime).format('YYYY-MM-DD'),
              warrantyEndtime: moment(values.warrantyEndtime).format('YYYY-MM-DD'),
              scrapTime: moment(values.scrapTime).format('YYYY-MM-DD'),
              hubHeight: values.hubHeight,
              altitude: values.altitude,
            }
          } else if (values.deviceTypeCode === 501) {
            values.map = {
              altitude: values.altitude,
              towerAssemblyTime: moment(values.towerAssemblyTime).format('YYYY-MM-DD'),
              towerHeight: values.towerHeight,
              windMeasurementEquipment: values.windMeasurementEquipment,
            }
          }
          values.stationCode = `${values.stationCode[0].stationCode}`;
          values.deviceTypeCode = addDeviceTypeData.deviceTypeCode ? `${addDeviceTypeData.deviceTypeCode}` : `${values.deviceTypeCode}`;
          values.deviceModeCode = addDeviceModeData.deviceModeCode ? `${addDeviceModeData.deviceModeCode}` : `${values.deviceModeCode}`;
          this.props.addDeviceDetail({ ...values })
          this.props.changeDeviceManageStore({ addDeviceTypeData: {}, addDeviceModeData: {} })
        }
      });
    }
  }
  selectStation = (stations) => {
    const { getStationDeviceTypes, getDeviceList, queryParams, changeDeviceManageStore } = this.props;
    getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });
    changeDeviceManageStore({
      deviceModels: []
    })
  }
  selectDeviceType = (value) => {
    const { getDeviceModel, getDeviceList, queryParams, stationCode } = this.props;
    getDeviceModel({
      stationCode,
      deviceTypeCode: value,
    });
  }
  submitForm = (e) => {
    this.props.changeDeviceManageStore({ deviceNameOk: null })
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.checkDeviceName({ deviceName: values.deviceName })
      }
    });
  }
  gobackPre = () => {
    this.props.gobackPre()
    this.props.changeDeviceManageStore({ addDeviceTypeData: {}, addDeviceModeData: {} })
  }
  showAddDeviceModeModal = () => {
    this.props.changeDeviceManageStore({ checkDeviceModeOk: null })
    this.setState({
      showAddDeviceModeModal: true
    })
  }
  cancleDeviceModeModal = () => {
    this.setState({
      showAddDeviceModeModal: false,
    })
  }
  saveFormState = (record) => {
    this.setState({ deviceModeCodeAdd: record.addDeviceModeCodeName, manufacturerAdd: record.addManufacturer, showAddDeviceMode: true })
  }
  changeDeviceMode = () => {
  }
  preConnectDevice = (deviceTypeCode) => {
    let preDeviceName='';
    switch (deviceTypeCode) {
      case '101':
      preDeviceName= '集电线路'
      break;
      case '202':
      preDeviceName= '逆变器'
      break;
      case '304':
      preDeviceName= '集电线路'
      break;
      case '207':
      preDeviceName= '箱变'
      break;
      case '206':
      preDeviceName= '交流汇流箱'
      break;
      case '201':
      preDeviceName= '箱变'
      break;
    }
    return preDeviceName

  }
  render() {
    const { showAddDeviceModeModal, showAddDeviceMode, deviceModeCodeAdd, manufacturerAdd } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { stationDevices, deviceModels, form, selectdeviceType, selectStation, pvDeviceModels, connectDevice, addDeviceTypeData, addDeviceModeData } = this.props;
    const stationName = selectStation ? selectStation[0].stationName : '';
    const deviceTypeName = getFieldValue('deviceTypeCode');
    const deviceModeCodeValue = getFieldValue('deviceModeCode');
    const selectDeviceTypeName = typeof (selectdeviceType) === 'number' ? stationDevices.filter((e, i) => (e.deviceTypeCode === selectdeviceType))[0].deviceTypeName : selectdeviceType
    //101是风电机组，箱变304，测风塔501，组串式逆变器、汇流箱：206、202，集中式逆变器：201
    const modelSelectDisable = deviceModels.length === 0;
    const initiDeviceMode = addDeviceModeData.data ? +addDeviceModeData.data : null;
    const manufacturerArr = deviceModels.filter((e, i) => (e.deviceModeCode === deviceModeCodeValue))[0];
    const manufactureName = manufacturerArr && manufacturerArr.manufacturer;
    // 
    const isShow = ['202', '206', '304', '101', '201', '207'].includes(`${selectdeviceType}`);//通用的:关联设备，额定，装机，经纬度
    const isMeteorology = ['203', '501',].includes(`${selectdeviceType}`);//测风塔和气象站呈现经纬度
    const isTemplateMachine = ['201', '304', '206'].includes(`${selectdeviceType}`);//是否呈现样板机的设备
    const isShowSaveButton = ['501', '202', '206', '304', '101',].includes(`${selectdeviceType}`);//显示组件


    return (
      <div className={styles.colStyles}>
        <Form className={styles.editPart}>
          <div className={styles.leftlayout}>
            <div className={styles.defaultConfigStyles}>
              <FormItem label="电站名称" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('stationCode')(
                  <span>{stationName}</span>
                )}
              </FormItem>
              {/*// addDeviceTypeData.deviceTypeCode*/}
              <FormItem label="设备类型" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('deviceTypeCode')(
                  <span>{selectDeviceTypeName}</span>
                )}
              </FormItem>
              <FormItem label="设备名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceName', {
                  rules: [{ required: true, message: '请正确填写,不超过30字', type: "string", max: 30, }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem label="生产厂家" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('manufacturer', {
                  initialValue: manufactureName,
                  rules: [{ required: true, message: '请正确填写', type: "string", max: 30, }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem label="设备型号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceModeCode', {
                  initialValue: initiDeviceMode,
                  rules: [{ required: true, message: '请选择设备型号' }],
                })(
                  <Select className={styles.modelSelect} placeholder="请选择设备型号" onChange={this.changeDeviceMode} disabled={modelSelectDisable}>
                    <Option key={'all'} value={''}>请选择设备设备</Option>
                    {deviceModels.map((e, i) => {
                      if (!e) { return null; } else {
                        return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                      }
                    })}
                  </Select>
                )}
                <span className={styles.fontColor} onClick={this.showAddDeviceModeModal}>添加设备型号</span>
              </FormItem>

            

              <FormItem label="批次号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('lotNumber', {
                  rules: [{ max: 30, message: '不超过30字' }]
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>
            <div className={styles.valueStyles}>
              {isShow && <FormItem label="关联设备" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('parentDeviceFullcode')(
                  <Select placeholder="请选择关联设备" onChange={this.changeConnect} disabled={connectDevice.length === 0}>
                    <Option key={'all'} value={''}>请选择关联设备</Option>
                    {connectDevice.map((e, i) => {
                      if (!e) { return null; } else {
                        return <Option key={e.deviceFullCode} value={e.deviceFullCode}>{e.deviceName}</Option>
                      }
                    })}
                  </Select>
                )}
                <span> {this.preConnectDevice(deviceTypeName+'')}</span>
              </FormItem>}
              {isTemplateMachine && <FormItem label="是否为样板机" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('templateMachine')(
                  <Select>
                    <Option value={'1'}>是</Option>
                    <Option value={'0'}>否</Option>
                  </Select>
                )}
              </FormItem>}
              {isShow && <FormItem label="额定容量" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('ratedPower', {
                  rules: [{ pattern: /^\d+([.]\d{1,2})?$/, message: '保留小数点后两位' }]
                })(
                  <Input placeholder="保留小数点后两位" />
                )}<span className={styles.unitStyle}>kW</span>
              </FormItem>}
              {isShow && <FormItem label="装机容量" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceCapacity', {
                  rules: [{ pattern: /^\d+([.]\d{1,2})?$/, message: '保留小数点后两位' }]
                })(
                  <Input placeholder="保留小数点后两位" />
                )}<span className={styles.unitStyle}>kW</span>
              </FormItem>}
              {(isShow || isMeteorology) && <FormItem label="经度" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('longitude')(
                  <Input placeholder="请输入..." />
                )}<span className={styles.unitStyle}>°</span>
              </FormItem>}
              {(isShow || isMeteorology) && <FormItem label="纬度" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('latitude')(
                  <Input placeholder="请输入..." />
                )}<span className={styles.unitStyle}>°</span>
              </FormItem>}
            </div>
            <div className={styles.systermStyle}>
            <FormItem label="制造商" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('manufactorName')(
                  <Input placeholder="请输入..." />
                )}
              </FormItem>
              <FormItem label="供货商" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('supplierName')(
                  <Input placeholder="请输入..." />
                )}
              </FormItem>
              <FormItem label="是否显示" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('enableDisplay', { initialValue: '1', })(
                  <Select>
                    <Option value={'1'}>是</Option>
                    <Option value={'0'}>否</Option>
                  </Select>
                )}
              </FormItem>
              {!isShowSaveButton && <div className={styles.leftsubmitStyle}>
                <Button onClick={this.gobackPre} className={styles.leftpreStyles}>上一步</Button>
                <Button onClick={this.submitForm} >保存</Button>
              </div>}
            </div>
          </div>
          <div className={styles.rightContainer}>
            {deviceTypeName === 501 && <WindMeasurement {...this.props} form={form} />}
            {deviceTypeName === 304 && <div className={styles.rightStyles}>
              <FormItem label="所属方阵" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('belongMatrix', {
                  rules: [{ max: 30, message: '不超过30字' }]
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>}
            {deviceTypeName === 101 && <WindInstallDate {...this.props} form={form} />}
            {(deviceTypeName === 206 || deviceTypeName === 202) && <Confluence {...this.props} selectStation={selectStation[0].stationCode} pvDeviceModels={pvDeviceModels} form={form} />}
            {isShowSaveButton && <div className={styles.submitStyle}>
              <Button onClick={this.gobackPre} className={styles.preStyles}>上一步</Button>
              <Button onClick={this.submitForm} >保存</Button>
            </div>}
          </div>
        </Form>
        {showAddDeviceModeModal && <ShowAddDeviceModeModal {...this.props} showAddDeviceModeModal={showAddDeviceModeModal} cancleDeviceModeModal={this.cancleDeviceModeModal} saveFormState={this.saveFormState} selectdeviceType={selectdeviceType} />}
      </div>
    )
  }
}
export default Form.create()(AddDeviceForm)
