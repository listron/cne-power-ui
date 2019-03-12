import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, DatePicker } from 'antd';

import styles from '../deviceSide.scss';
import WindInstallDate from "../AddDevice/WindInstallDate";
import WindMeasurement from "../AddDevice/WindMeasurement";
import EditConflunce from "./EditConflunce";
const FormItem = Form.Item;
const Option = Select.Option;
class EditDeviceForm extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  submitForm = (e) => {
    e.preventDefault();
    const { stationDeviceDetail } = this.props;
    const { deviceTypeCode } = stationDeviceDetail;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (deviceTypeCode === '202' || deviceTypeCode === '206') {
          let branchCountArr = [];
          for (let i = 0; i < values.branchCount; i++) {
            branchCountArr.push(i + 1)
          }
          if (values.branchCount) {
            values.connectedBranches = branchCountArr.map((e, i) => {
              return values.connectedBranches.includes(e) ? 1 : 0
            })
          }
          values.map = { componentMode: values.componentMode, branchCount: +values.branchCount, connectedBranches: values.connectedBranches };
        }
        if (deviceTypeCode === '304') {
          values.map = { belongMatrix: values.belongMatrix }
        } else if (deviceTypeCode === '101') {
          values.map = {
            assemblyTime: values.assemblyTime,
            ongridTime: values.ongridTime,
            warrantyBegintime: values.warrantyBegintime,
            warrantyEndtime: values.warrantyEndtime,
            scrapTime: values.scrapTime,
            hubHeight: values.hubHeight,
          }
        } else if (deviceTypeCode === '501'){
          values.map = {
            altitude: values.altitude,
            towerAssemblyTime: values.towerAssemblyTime,
            towerHeight: values.towerHeight,
            windMeasurementEquipment: values.windMeasurementEquipment,
          }
        }
        values.stationCode = stationDeviceDetail.stationCode;
       if(values.parentDeviceFullcode === stationDeviceDetail.pareneDeviceName){
        values.parentDeviceFullcode=stationDeviceDetail.parentDeviceFullcode
       }

        this.props.editDeviceDetail({ ...values })
      }
    });
    this.props.changeDeviceManageStore({ showPage: 'detail', })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceModeCode, stationCode, form, selectdeviceType, selectStation, stationDeviceDetail, pvDeviceModels, connectDevice } = this.props;
    console.log('stationDeviceDetail: ', stationDeviceDetail);
    const { stationName, manufacturer, deviceModeName, deviceTypeCode, deviceTypeName, deviceFullCode, connectTime, deviceName } = stationDeviceDetail
    const selectDeviceTypeName = typeof (selectdeviceType) === 'number' ? stationDeviceTypes.filter((e, i) => (e.deviceTypeCode === selectdeviceType))[0].deviceTypeName : selectdeviceType
    //101是风电机组，箱变304，测风塔501，组串式逆变器、汇流箱：206、202
    const isShow = ['501', '202', '206', '304', '101'].includes(stationDeviceDetail.deviceTypeCode);
    return (
      <div className={styles.colStyles}>
        <Form className={styles.editPart}>
          <div className={styles.leftlayout}>
            <div className={styles.defaultConfigStyles}>
              <FormItem label="电站名称" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('stationCode', { initialValue: stationDeviceDetail.stationCode, })(
                  <span>{stationName ? stationName : '--'}</span>
                )}
              </FormItem>
              <FormItem label="设备类型" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('deviceTypeCode', { initialValue: stationDeviceDetail.deviceTypeCode, })(

                  <span>{deviceTypeName}</span>
                )}
              </FormItem>
              {deviceTypeCode === '509' ? <FormItem label="设备名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceName', { initialValue: stationDeviceDetail.deviceName, })(
                  <span>{stationDeviceDetail.deviceName}</span>
                )}
              </FormItem> : <FormItem label="设备名称" colon={false} className={styles.formItemStyle}>
                  {getFieldDecorator('deviceName', { initialValue: stationDeviceDetail.deviceName, })(
                    <Input placeholder="不超过30字" />
                  )}
                </FormItem>}
              <FormItem label="设备型号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceModeCode', { initialValue: stationDeviceDetail.deviceModeCode, })(
                  <span>{deviceModeName}</span>
                )}
              </FormItem>
              <FormItem label="生产厂家" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('manufacturer', { initialValue: stationDeviceDetail.manufacturer, })(
                  <span>{manufacturer}</span>
                )}
              </FormItem>
              <FormItem label="批次号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('lotNumber', { initialValue: stationDeviceDetail.lotNumber, })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>
            <div className={styles.valueStyles}>
              <FormItem label="关联设备" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('parentDeviceFullcode', { initialValue: stationDeviceDetail.pareneDeviceName, })(
                  <Select placeholder="请选择关联设备" disabled={connectDevice.length === 0}>
                  <Option key={'all'} value={''}>全部关联设备</Option>
                    {connectDevice.map((e, i) => {
                      if (!e) { return null; }
                      return <Option key={i} value={e.deviceFullCode}>{e.deviceName}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              {isShow && <FormItem label="是否为样板机" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('templateMachine', { initialValue: stationDeviceDetail.templateMachine, })(
                  <Select>
                    <Option value={'1'}>是</Option>
                    <Option value={'0'}>否</Option>
                  </Select>
                )}
              </FormItem>}
              <FormItem label="额定容量" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('ratedPower', { initialValue: stationDeviceDetail.ratedPower, })(
                  <Input placeholder="保留小数点后两位" />
                )}kW
              </FormItem>
              {isShow && <FormItem label="装机容量" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceCapacity', { initialValue: stationDeviceDetail.deviceCapacity, })(
                  <Input placeholder="保留小数点后两位" />
                )}<span>kW</span>
              </FormItem>}
              {isShow && <FormItem label="经度" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('longitude', { initialValue: stationDeviceDetail.longitude, })(
                  <Input placeholder="请输入..." />
                )}°
              </FormItem>}
              {isShow && <FormItem label="纬度" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('latitude', { initialValue: stationDeviceDetail.latitude, })(
                  <Input placeholder="请输入..." />
                )}°
              </FormItem>}
            </div>
            <div className={styles.systermStyle}>
              <FormItem label="设备编号" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('deviceFullCode', { initialValue: stationDeviceDetail.deviceFullCode, })(
                  <span>{deviceFullCode}</span>
                )}
              </FormItem>
              <FormItem label="是否显示" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('enableDisplay', { initialValue: stationDeviceDetail.enableDisplay, })(
                  <Select>
                    <Option value={'1'}>是</Option>
                    <Option value={'0'}>否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="接入日期" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('connectTime', { initialValue: stationDeviceDetail.connectTime, })(
                  <span>{connectTime}</span>
                )}
              </FormItem>
              {!isShow && <div className={styles.submitStyle}>
                <Button onClick={this.submitForm} >保存</Button>
              </div>}
            </div>
          </div>
          {isShow && <div className={styles.rightContainer}>
            {deviceTypeCode === '501' && <WindMeasurement stationDeviceDetail={stationDeviceDetail} form={form} />}
            {deviceTypeCode === '304' && <div className={styles.rightStyles}>
              <FormItem label="所属方阵" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('belongMatrix', { initialValue: stationDeviceDetail.map.belongMatrix, })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>}
            {deviceTypeCode === '101' && <WindInstallDate stationDeviceDetail={stationDeviceDetail} form={form} />}
            {(deviceTypeCode === '206' || deviceTypeCode === '202') && <EditConflunce stationDeviceDetail={stationDeviceDetail} pvDeviceModels={pvDeviceModels} form={form} />}
            <div className={styles.submitStyle}>
              <Button onClick={this.submitForm} >保存</Button>
            </div>
          </div>
          }
        </Form>

      </div>
    )
  }
}
export default Form.create()(EditDeviceForm)