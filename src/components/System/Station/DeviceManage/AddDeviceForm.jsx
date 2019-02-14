import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Form, Select } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect/index';
import styles from './deviceSide.scss';
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
    getDeviceList({
      ...queryParams,
      stationCode: stations[0].stationCode,
      deviceTypeCode: null,
      deviceModeCode: null,
      pageNum: 1,
    })
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
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModeCode, stationCode } = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const deviceTypeName = getFieldValue('deviceType');
    const modelSelectDisable = deviceModels.length === 0;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 6 },
    };
    return (
      <div className={styles.colStyles}>
        <Form className={styles.editPart}>
          <div className={styles.defaultConfigStyles}>
            <FormItem {...formItemLayout} label="电站名称" colon={false} >
              {getFieldDecorator('stationName', {
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
            <FormItem {...formItemLayout} label="设备类型" colon={false} >
              {getFieldDecorator('deviceType', {
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
            <FormItem label="设备名称"   {...formItemLayout} colon={false}>
              {getFieldDecorator('deviceName', {
                rules: [{ required: true, message: '请正确填写' }],
              })(
                <Input placeholder="不超过30字" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="设备型号" colon={false}>
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
            <FormItem label="生产厂家"   {...formItemLayout} colon={false}>
              {getFieldDecorator('manufacturer', {
                rules: [{ required: true, message: '请正确填写' }],
              })(
                <Input placeholder="不超过30字" />
              )}
            </FormItem>
            <FormItem label="批次号"   {...formItemLayout} colon={false}>
              {getFieldDecorator('batchNumber')(
                <Input placeholder="不超过30字" />
              )}
            </FormItem>
          </div>
          <div className={styles.valueStyles}>
            <FormItem label="关联设备"   {...formItemLayout} colon={false}>
              {getFieldDecorator('relationDevice')(
                <Input placeholder="不超过30字" />
              )}
            </FormItem>
            <FormItem label="是否为样板机"   {...formItemLayout} colon={false}>
              {getFieldDecorator('relationDevice')(
                <Select>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="额定容量"   {...formItemLayout} colon={false}>
              {getFieldDecorator('rated')(
                <div>
                  <Input placeholder="保留小数点后两位" />
                  <span>kW</span>
                </div>
              )}
            </FormItem>
            <FormItem label="装机容量"   {...formItemLayout} colon={false}>
              {getFieldDecorator('capacity')(
                <div>
                  <Input placeholder="保留小数点后两位" />
                  <span>kW</span>
                </div>
              )}
            </FormItem>
            <FormItem label="经度"   {...formItemLayout} colon={false}>
              {getFieldDecorator('longitude')(
                <div>
                  <Input placeholder="请输入..." />°
                </div>
              )}
            </FormItem>
            <FormItem label="纬度"   {...formItemLayout} colon={false}>
              {getFieldDecorator('latitude')(
                <div>
                  <Input placeholder="请输入..." />°
                </div>
              )}
            </FormItem>
          </div>
          <div className={styles.systermStyle}>
            <Form.Item
              {...formItemLayout}
              label="是否显示"
             
            >
              {getFieldDecorator('display')(
                <Select>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item
            {...formItemLayout}
            label="是否显示"
            
          >
            {getFieldDecorator('connectDate')(
              <span>1970-01-01</span>
            )}
          </Form.Item>

          </div>
        </Form>

      </div>
    )
  }
}
export default Form.create()(AddDeviceForm)