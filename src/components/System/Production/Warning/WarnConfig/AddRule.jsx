import React, { Component } from "react";
import { Select, Table, Modal, Form, Input, Button, Switch, Radio, Cascader } from 'antd';
import PropTypes from 'prop-types';
import styles from "./warnConfig.scss";
import StationSelect from '../../../../Common/StationSelect';
const Option = Select.Option;
const FormItem = Form.Item;
class AddRule extends Component {
  static propTypes = {
    form: PropTypes.object,
    resetStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    changeWarnStore: PropTypes.func,
    getDeviceModel: PropTypes.func,
    getPoints: PropTypes.func,
    ruleStationDeviceTypes: PropTypes.array,
    ruleDeviceModels: PropTypes.array,
    ruleDevicePoints: PropTypes.array,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      stationCode: null,
      deviceTypeCode: null,
      deviceModeCode: null,
    }
  }

  componentDidMount() { // 初始请求数据

  }

  selectStation = (stations) => { // 选中电站
    const { getStationDeviceTypes, changeWarnStore } = this.props;
    getStationDeviceTypes({
      payload: { stationCodes: stations.length > 0 && stations[0].stationCode || null, },
      resultName: 'ruleStationDeviceTypes'
    });
    this.setState({ stationCode: stations.length > 0 && stations[0].stationCode || null, })
    changeWarnStore({
      ruleDeviceModels: [],
      ruleDevicePoints: [],
    })
  }

  selectDeviceType = (value) => { // 选中设备类型
    const { changeWarnStore, getDeviceModel } = this.props;
    const { stationCode } = this.state;
    getDeviceModel({
      payload: { stationCode, deviceTypeCode: value, },
      resultName: 'ruleDeviceModels'
    });
    this.setState({ deviceTypeCode: value })
    changeWarnStore({
      ruleDevicePoints: [],
    })
  }

  selectDeviceModel = (value) => { // 选中设备型号
    const { getPoints } = this.props;
    const { stationCode, deviceTypeCode } = this.state;
    this.setState({ deviceModeCode: value })
    getPoints({
      payload: { stationCode, deviceTypeCode, deviceModeCode: value },
      resultName: 'ruleDevicePoints'
    });
  }

  selectPoints = (value) => { // 选中测点
    console.log(value)
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { stationCode } = this.state;
    const { allStationBaseInfo, ruleStationDeviceTypes, ruleDeviceModels, ruleDevicePoints } = this.props;
    const typeSelectDisable = ruleStationDeviceTypes.length === 0;
    const modelSelectDisable = ruleDeviceModels.length === 0;
    const pointSelectDisable = ruleDevicePoints.length === 0;
    const getSelectedStation = allStationBaseInfo.find(e => e.stationCode === stationCode);
    const selectedStationInfo = getSelectedStation ? [getSelectedStation] : [];
    return (
      <Form onSubmit={this.handleSubmit} className={styles.addRule} layout="inline">
        <div className={styles.stationsRule}>
          <FormItem label="所属电站" colon={false}>
            {getFieldDecorator('stations', {
              rules: [{ required: true, message: '请选择电站' }],
            })(
              <StationSelect data={allStationBaseInfo} multiple={false} onOK={this.selectStation} />
            )}
          </FormItem>
          <FormItem label="设备类型" colon={false}>
            {getFieldDecorator('deviceTypeCode', {
              rules: [{ required: true, message: '请选择设备类型' }],
            })(
              <Select className={styles.typeSelect} onChange={this.selectDeviceType} placeholder="请选择设备类型" disabled={typeSelectDisable}>
                <Option key={null} value={null}>{'全部设备类型'}</Option>
                {ruleStationDeviceTypes.map(e => {
                  if (!e) { return null; }
                  return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="设备型号" colon={false}>
            {getFieldDecorator('deviceModeCode', {
              rules: [{ required: true, message: '请选择设备型号' }],
            })(
              <Select className={styles.modelSelect} onChange={this.selectDeviceModel} placeholder="请选择设备型号" disabled={modelSelectDisable}>
                <Option key={null} value={null}>{'全部设备型号'}</Option>
                {ruleDeviceModels.map(e => {
                  if (!e) { return null; }
                  return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="设备型号" colon={false}>
            {getFieldDecorator('pointCode', {
              rules: [{ required: true, message: '请选择设备型号' }],
            })(
              <Select className={styles.pointSelect} onChange={this.selectPoints}  placeholder="请选择测点" disabled={pointSelectDisable}>
                <Option key={''} value={''}>{'全部测点'}</Option>
                {ruleDevicePoints.map(e => {
                  if (!e) { return null; }
                  return <Option key={e.devicePointStandardCode} value={e.devicePointStandardCode}>{e.devicePointName}</Option>
                })}
              </Select>
            )}
          </FormItem>

        </div>
      </Form>
    )
  }
}


export default Form.create()(AddRule);