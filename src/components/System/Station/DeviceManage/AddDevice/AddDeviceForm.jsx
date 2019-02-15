import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select, DatePicker } from 'antd';
import StationSelect from '../../../../Common/StationSelect';
import DeviceSelect from '../../../../Common/DeviceSelect/index';
import styles from '../deviceSide.scss';
import WindInstallDate from "./WindInstallDate";
import WindMeasurement from "./WindMeasurement";
import Confluence from "./Confluence";
const FormItem = Form.Item;
const Option = Select.Option;
class AddDeviceForm extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
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
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModeCode, stationCode, form } = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const deviceTypeName = getFieldValue('deviceTypeCode');
    console.log('deviceTypeName: ', deviceTypeName);
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
                  <StationSelect
                    data={allStationBaseInfo}
                    onOK={this.selectStation}
                    holderText="请选择电站"
                  // value={allStationBaseInfo.filter(e => e.stationCode === stationCode)}
                  />
                )}
              </FormItem>
              <FormItem label="设备类型" colon={false} className={styles.formItemStyle} >
                {getFieldDecorator('deviceTypeCode', {
                  rules: [
                    { message: '请选择设备类型', required: true, },
                  ]
                })(
                  <Select className={styles.typeSelect} onChange={this.selectDeviceType}
                    //  value={deviceTypeCode}
                    placeholder="请选择设备类型"
                    disabled={typeSelectDisable}>
                    <Option key={null} value={null}>{'全部设备类型'}</Option>
                    {stationDeviceTypes.map(e => {
                      if (!e) { return null; }
                      return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem label="设备名称" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceName', {
                  rules: [{ required: true, message: '请正确填写', type: "string", max: 30, }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem label="设备型号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('deviceModeCode', {
                  rules: [{ required: true, message: '请选择设备型号' }],
                })(
                  <Select className={styles.modelSelect} onChange={this.selectDeviceModel} placeholder="请选择设备型号" disabled={modelSelectDisable}>
                    {deviceModels.map(e => {
                      if (!e) { return null; }
                      return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem label="生产厂家" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('manufacturer', {
                  rules: [{ required: true, message: '请正确填写', type: "string", max: 30, }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem label="批次号" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('lotNumber')(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
            </div>
            <div className={styles.valueStyles}>
              <FormItem label="关联设备" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('pareneDeviceName')(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem label="是否为样板机" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('templateMachine')(
                  <Select>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
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
                {getFieldDecorator('enableDisplay')(
                  <Select>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="接入时间" colon={false} className={styles.formItemStyle}>
                {getFieldDecorator('connectTime')(
                  <span>1970-01-01</span>
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
            {(deviceTypeName === 206 || deviceTypeName === 202) && <Confluence form={form} />}
            <div className={styles.submitStyle}>
              <Button className={styles.preStyles}>上一步</Button>
              <Button>保存</Button>
            </div>


          </div>

        </Form>

      </div>
    )
  }
}
export default Form.create()(AddDeviceForm)
//{deviceTypeName===101&& <WindInstallDate form={form} />}
// {(deviceTypeName===206||deviceTypeName===202)&&<Confluence form={form} />}