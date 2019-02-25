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
  componentWillReceiveProps(nextprops){
    console.log('11111111');
    const{deviceNameOk}=nextprops;
    console.log(deviceNameOk);
    if(deviceNameOk!==this.props.deviceNameOk&&deviceNameOk===true){
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let branchCountArr = [];
          for (let i = 0; i < values.branchCount; i++) {
            branchCountArr.push(i + 1)
          }
          if(values.branchCount){
            values.connectedBranches = branchCountArr.map((e, i) => {
              return values.connectedBranches.includes(e) ? 1 : 0
            })
          }
          values.stationCode = values.stationCode[0].stationCode;
          this.props.addDeviceDetail({ ...values })
        }else{
          console.log(err);
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
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let branchCountArr = [];
        for (let i = 0; i < values.branchCount; i++) {
          branchCountArr.push(i + 1)
        }
        values.connectedBranches = branchCountArr.map((e, i) => {
          return values.connectedBranches.includes(e) ? 1 : 0
        })
        values.stationCode = values.stationCode[0].stationCode;
        this.props.checkDeviceName({deviceName:values.deviceName})

        // this.props.addDeviceDetail({ ...values })
      }
    });


  }
  gobackPre = () => {

  }
  showAddDeviceModeModal = () => {
    this.setState({
      showAddDeviceModeModal: true
    })
  }
  cancleDeviceModeModal = () => {
    this.setState({
      showAddDeviceModeModal: false
    })
  }
  saveFormState = (record) => {
    this.setState({ deviceModeCodeAdd: record.deviceModeCode, manufacturerAdd: record.manufacturer, showAddDeviceMode: true })
  }
  render() {
    const { showAddDeviceModeModal, showAddDeviceMode, deviceModeCodeAdd, manufacturerAdd } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModeCode, stationCode, form, selectdeviceType, selectStation, pvDeviceModels,connectDevice,addDeviceTypeData } = this.props;
    const stationName = selectStation ? selectStation[0].stationName : '';
    // const typeSelectDisable = stationDeviceTypes.length === 0;
    const deviceTypeName = getFieldValue('deviceTypeCode');
    const selectDeviceTypeName = typeof (selectdeviceType) === 'number' ? stationDeviceTypes.filter((e, i) => (e.deviceTypeCode === selectdeviceType))[0].deviceTypeName : selectdeviceType

    //101是风电机组，箱变304，测风塔501，组串式逆变器、汇流箱：206、202
    const modelSelectDisable = deviceModels.length === 0;


    return (
      <div className={styles.colStyles}>
        <Form className={styles.editPart}>
          <div className={styles.leftlayout}>
            <div className={styles.defaultConfigStyles}>
              <FormItem label="电站名称" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('stationCode', {
                  rules: [
                    { message: '请选择电站', required: true, },
                  ]
                })(
                  <span>{stationName}</span>
                )}
              </FormItem>
              {/*// addDeviceTypeData.deviceTypeCode*/}
              <FormItem label="设备类型" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('deviceTypeCode', {initialValue:'asd',
                  rules: [
                    { message: '请选择设备类型', required: true, },
                  ]
                })(

                  <span>{selectDeviceTypeName}</span>
                )}
              </FormItem>
              <FormItem label="设备名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceName', {
                  rules: [{ required: true, message: '请正确填写', type: "string", max: 30, }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              {showAddDeviceMode ?
                <FormItem label="设备型号" colon={false} className={styles.formItemStyle}>
                  {getFieldDecorator('deviceModeCodeName')(
                    <span>{deviceModeCodeAdd}</span>
                  )} <span className={styles.fontColor} onClick={this.showAddDeviceModeModal}>添加设备型号</span>
                </FormItem> : <FormItem label="设备型号" colon={false} className={styles.formItemStyle}>
                  {getFieldDecorator('deviceModeCode', {
                    rules: [{ required: true, message: '请选择设备型号' }],
                  })(
                    <Select className={styles.modelSelect} placeholder="请选择设备型号" disabled={modelSelectDisable}>
                      {deviceModels.map(e => {
                        if (!e) { return null; }
                        return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                      })}
                    </Select>
                  )}
                  <span className={styles.fontColor} onClick={this.showAddDeviceModeModal}>添加设备型号</span>
                </FormItem>
              }
              {showAddDeviceMode ?
                <FormItem label="生产厂家" colon={false} className={styles.formItemStyle}>
                  {getFieldDecorator('manufacturerName')(
                    <span>{manufacturerAdd}</span>
                  )}
                </FormItem> : <FormItem label="生产厂家" colon={false} className={styles.formItemStyle}>
                  {getFieldDecorator('manufacturer', {
                    rules: [{ required: true, message: '请正确填写', type: "string", max: 30, }],
                  })(
                    <Input placeholder="不超过30字" />
                  )}
                </FormItem>}
              <FormItem label="批次号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('lotNumber')(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>
            <div className={styles.valueStyles}>
              <FormItem label="关联设备" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('pareneDeviceName')(
                  <Select placeholder="请选择关联设备" disabled={connectDevice.length===0}>
                    {connectDevice.map((e,i)=>{
                      if (!e) { return null; }
                      return <Option key={i} value={e.pareneDeviceName}>{e.pareneDeviceName}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem label="是否为样板机" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('templateMachine')(
                  <Select>
                    <Option value={true}>是</Option>
                    <Option value={false}>否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="额定容量" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('ratedPower')(
                  <Input placeholder="保留小数点后两位" />
                )}kW
              </FormItem>
              <FormItem label="装机容量" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceCapacity')(
                  <Input placeholder="保留小数点后两位" />
                )}<span>kW</span>
              </FormItem>
              <FormItem label="经度" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('longitude')(
                  <Input placeholder="请输入..." />
                )}°
              </FormItem>
              <FormItem label="纬度" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('latitude')(
                  <Input placeholder="请输入..." />
                )}°
              </FormItem>
            </div>
            <div className={styles.systermStyle}>
              <FormItem label="是否显示" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('enableDisplay', { initialValue: true, })(
                  <Select>
                    <Option value={true}>是</Option>
                    <Option value={false}>否</Option>
                  </Select>
                )}
              </FormItem>
            </div>
          </div>
          <div className={styles.rightContainer}>
            {deviceTypeName === 501 && <WindMeasurement form={form} />}
            {deviceTypeName === 304 && <div className={styles.rightStyles}>
              <FormItem label="所属方阵" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('belongMatrix')(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>}
            {deviceTypeName === 101 && <WindInstallDate form={form} />}
            {(deviceTypeName === 206 || deviceTypeName === 202) && <Confluence pvDeviceModels={pvDeviceModels} form={form} />}
            <div className={styles.submitStyle}>
              <Button onClick={this.gobackPre} className={styles.preStyles}>上一步</Button>
              <Button onClick={this.submitForm} >保存</Button>
            </div>
          </div>
        </Form>
        {showAddDeviceModeModal && <ShowAddDeviceModeModal {...this.props} showAddDeviceModeModal={showAddDeviceModeModal} cancleDeviceModeModal={this.cancleDeviceModeModal} saveFormState={this.saveFormState} />}
      </div>
    )
  }
}
export default Form.create()(AddDeviceForm)
//{deviceTypeName===101&& <WindInstallDate form={form} />}
// {(deviceTypeName===206||deviceTypeName===202)&&<Confluence form={form} />}