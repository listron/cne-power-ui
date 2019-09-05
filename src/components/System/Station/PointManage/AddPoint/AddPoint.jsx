import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Icon } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import StationSelect from '../../../../../components/Common/StationSelect';
import AddNextStep from './AddNextStep';
import styles from '../pointSide.scss';
const { Option } = Select;
class AddPoint extends React.Component {
  static propTypes = {
    changePointManageStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      preStep: true,
      addStationCode: null,
      addDeviceTypeCode: null,
      manufactorId: null,
      deviceModeCode: null,
    };
  }
  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    });
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changePointManageStore({
      showPage: 'list',
    });
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  selectStation = (stations) => {
    const { getStationDeviceTypes } = this.props;
    const addStationCode = stations[0] ? stations[0].stationCode : null;
    this.setState({
      addStationCode,
    });
    getStationDeviceTypes({
      stationCodes: addStationCode,
    });
  }

  selectDeviceType = (value) => {
    const { getfactorsDeviceMode } = this.props;
    const { addStationCode } = this.state;
    this.setState({
      addDeviceTypeCode: value,
    });
    getfactorsDeviceMode({
      stationCode: addStationCode,
      deviceTypeCode: value,
      isConnectDevice: 1,
      manufactorId: 0,
      assetsId: '',
    });
  }
  selectfactory = value => {
    const { getfactorsDeviceMode } = this.props;
    const { addStationCode, addDeviceTypeCode } = this.state;
    this.setState({
      manufactorId: value,
    });
    getfactorsDeviceMode({
      stationCode: addStationCode,
      deviceTypeCode: addDeviceTypeCode,
      isConnectDevice: 1,
      manufactorId: value,
      assetsId: '',
    });
  };
  selectDeviceModel = value => {
    this.setState({
      deviceModeCode: value,
    });

  }
  showNext = () => {
    this.setState({
      preStep: false,
    });
  }
  render() {
    const { allStationBaseInfo, stationDeviceTypes, allFactor, factorsDeviceModeData } = this.props;
    const { showWarningTip, warningTipText, preStep, addStationCode, addDeviceTypeCode, manufactorId, deviceModeCode } = this.state;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = factorsDeviceModeData.length === 0;
    const getSelectedStation = allStationBaseInfo.find(e => e.stationCode === addStationCode);
    const selectedStationInfo = getSelectedStation ? [getSelectedStation] : [];
    const isNextStep = (addStationCode && addDeviceTypeCode && manufactorId && deviceModeCode);
    return (
      <div className={styles.pointAdd}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.pageTop}>
          <span className={styles.text}>新增</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        {
          preStep && <div className={styles.preStepBox}>
            <div className={styles.preStepItem}>
              <span className={styles.titleText}>电站名称</span>
              <StationSelect data={allStationBaseInfo} onOK={this.selectStation} value={selectedStationInfo} holderText="请输入电站名称" />
            </div>
            <div className={styles.preStepItem}>
              <span className={styles.titleText}>设备类型</span>
              <Select className={styles.modelSelect}
                onChange={this.selectDeviceType}
                value={addDeviceTypeCode}
                placeholder="请选择设备类型"
                disabled={typeSelectDisable}>
                <Option key={null} value={null}>{'全部设备类型'}</Option>
                {stationDeviceTypes.map(e => {
                  if (!e) { return null; }
                  return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>;
                })}
              </Select>
            </div>
            <div className={styles.preStepItem}>
              <span className={styles.titleText}>生产厂家</span>
              <Select
                className={styles.modelSelect}
                onChange={this.selectfactory}
                value={manufactorId}
                placeholder="请选择设备厂家"
                disabled={!allFactor || allFactor.length === 0}
              >
                <Option key={null} value={null}>{'全部厂家'}</Option>
                {allFactor.map(e => {
                  if (!e) { return null; }
                  return (
                    <Option key={e.manufactorCode} value={e.manufactorId}>
                      {e.manufactorName}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className={styles.preStepItem}>
              <span className={styles.titleText}>设备型号</span>
              <Select
                className={styles.modelSelect}
                onChange={this.selectDeviceModel}
                value={deviceModeCode}
                placeholder="请选择设备型号"
                disabled={modelSelectDisable}
              >
                <Option key={null} value={null}>
                  {'全部设备型号'}
                </Option>
                {factorsDeviceModeData.map(e => {
                  if (!e) {
                    return null;
                  }
                  return (
                    <Option key={e.deviceModeCode} value={e.deviceModeCode}>
                      {e.modeName}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className={styles.preStepItem}>
              <Button disabled={!isNextStep} className={isNextStep ? styles.nextBtn : styles.disabledBtn} onClick={this.showNext}>下一步</Button>
            </div>
          </div>
        }
        {!preStep && <AddNextStep />}
      </div>
    );
  }
}
export default (AddPoint);
