import React, { Component } from "react";
import { Select, Table, Modal, Form, Input, Button, Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import styles from "./warnConfig.scss";
import StationSelect from '../../../../Common/StationSelect';
import WarnRule from './WarnRule';
import WarningTip from '../../../../Common/WarningTip';
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
    allStationBaseInfo: PropTypes.array,
    addWran: PropTypes.func,
    changeWarnStore: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      stationCode: null,
      deviceTypeCode: null,
      deviceModeCode: null,
      showWarningTip: false,
      warningTipText: '退出后信息将无法保存'
    }
  }
  onCancelEdit = () => { //  推出按钮
    this.setState({ showWarningTip: true })
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
    this.props.form.setFieldsValue({deviceTypeCode:null,deviceModeCode:null,pointCode:'',pointUnit:''})
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
    this.props.form.setFieldsValue({deviceModeCode:null,pointCode:'',pointUnit:''})
  }

  selectDeviceModel = (value) => { // 选中设备型号
    const { getPoints } = this.props;
    const { stationCode, deviceTypeCode } = this.state;
    this.setState({ deviceModeCode: value })
    getPoints({
      payload: { stationCode, deviceTypeCode, deviceModeCode: value },
      resultName: 'ruleDevicePoints'
    });
    this.props.form.setFieldsValue({pointCode:'',pointUnit:''})
  }

  selectPoints = (value) => { // 选中测点
    const unit = value.split('_')[1];
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ pointUnit: unit })
  }


  saveRule = (e) => { // 保存
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const { stations, deviceTypeCode, warningCheckDesc, deviceModeCode, devicePointUnit, pointCode, warnRules, warningLevel, warningEnabled } = values;
        const params = {
          warningTypeCode: 1,
          stationCode: stations[0].stationCode,
          deviceModeCode,
          deviceTypeCode,
          devicePointUnit,
          pointCode:pointCode.split('_')[0],
          warningCheckDesc,
          warningRuler: warnRules[0],
          warningValue: warnRules[1],
          warningDeadZone: warnRules[2],
          warningLevel,
          warningEnabled
        }
        this.props.addWran({
          params: params,
          continueAdd: false,
        })
      }
    });
  }

  addRuleContinue = () => { // 保存并继续添加
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const { stations, deviceTypeCode, warningCheckDesc, deviceModeCode, devicePointUnit, pointCode, warnRules, warningLevel, warningEnabled } = values;
        const params = {
          warningTypeCode: 1,
          stationCode: stations[0].stationCode,
          deviceModeCode,
          deviceTypeCode,
          devicePointUnit,
          pointCode: pointCode.split('_')[1],
          warningCheckDesc,
          warningRuler: warnRules[0],
          warningValue: warnRules[1],
          warningDeadZone: warnRules[2],
          warningLevel,
          warningEnabled
        }
        this.props.addWran({
          params: params,
          continueAdd: true,
        })
        this.props.form.resetFields();
        this.props.form.setFieldsValue({ stations: [] })
      }
    });
  }


  cancelWarningTip = () => { // 取消
    this.setState({ showWarningTip: false })
  }

  confirmWarningTip = () => { // 确定
    this.setState({ showWarningTip: false })
    this.props.changeWarnStore({ showPage: 'home' })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText } = this.state;
    const { allStationBaseInfo, ruleStationDeviceTypes, ruleDeviceModels, ruleDevicePoints } = this.props;
    const typeSelectDisable = ruleStationDeviceTypes.length === 0;
    const modelSelectDisable = ruleDeviceModels.length === 0;
    const pointSelectDisable = ruleDevicePoints.length === 0;
    return (
      <div className={styles.addRule}>
        {showWarningTip &&
          <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.addTop}>
          <span className={styles.text}>新增</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
        </div>
        <Form layout="inline" className={styles.form}>
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
                  {ruleDeviceModels.map(e => {
                    if (!e) { return null; }
                    return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="测点描述" colon={false}>
              {getFieldDecorator('pointCode', {
                rules: [{ required: true, message: '请选择测点' }],
              })(
                <Select className={styles.pointSelect} onChange={this.selectPoints} placeholder="请选择测点" disabled={pointSelectDisable}>
                  {ruleDevicePoints.map(e => {
                    if (!e) { return null; }
                    return <Option key={e.devicePointStandardCode} value={e.devicePointStandardCode+'_'+e.devicePointUnit}>{e.devicePointName}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="测点单位" colon={false} className={styles.unit}>
              {getFieldDecorator('pointUnit', {
                rules: [{ required: false, message: '请选择设备型号' }],
              })(
                <Input type="text" placeholder="测点单位" disabled={pointSelectDisable} />
              )}
            </FormItem>
          </div>
          <div className={styles.rules}>
            <FormItem label="预警描述" colon={false}>
              {getFieldDecorator('warningCheckDesc', {
                rules: [{
                  required: true, message: '请输入预警描述(不能超过30字)',
                  type: "string",
                  max: 30,
                }],
              })(
                <Input type="text" placeholder="不能超过30字" className={styles.warnDescribe} />
              )}
            </FormItem>
            <FormItem label="预警规则" colon={false}>
              {getFieldDecorator('warnRules', {
                initialValue: [1, null, null], // 经度，纬度
                rules: [
                  { required: true, message: '请输入预警规则' },
                  {
                    validator: (rule, value, callback) => {
                      const [warningRuler, warningValue, warningDeadZone] = value;
                      (!warningValue && warningValue!==0) && callback('请输入预警值');
                      (!warningDeadZone && warningValue!==0) && callback('请输入震荡区间');
                      warningValue && warningDeadZone && warningDeadZone >= warningValue && callback('震荡区间的值不能大于预警值');
                      callback();
                    }
                  }],
              })(
                <WarnRule />
              )}
            </FormItem>
            <FormItem label="预警级别" colon={false}>
              {getFieldDecorator('warningLevel', {
                rules: [{ required: true, message: '请选择预警级别' }],
                // initialValue: 1,
              })(
                <Select className={styles.warningLevelSelect} placeholder="请选择">
                  <Option value={1}>{'一级'}</Option>
                  <Option value={2}>{'二级'}</Option>
                  <Option value={3}>{'三级'}</Option>
                  <Option value={4}>{'四级'}</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="是否启用" colon={false}>
              {getFieldDecorator('warningEnabled', {
                rules: [{ required: true, message: '请选择' }],
                // initialValue: 1,
              })(
                <Select className={styles.useSelect} placeholder="请选择" >
                  <Option value={1}>{'是'}</Option>
                  <Option value={0}>{'否'}</Option>
                </Select>
              )}
            </FormItem>
            <div className={styles.buttonGroup}>
              <Button onClick={this.saveRule} className={styles.save}>保存</Button>
              <Button onClick={this.addRuleContinue} >保存并继续添加</Button>
            </div>
          </div>
        </Form>
      </div>

    )
  }
}


export default Form.create()(AddRule);