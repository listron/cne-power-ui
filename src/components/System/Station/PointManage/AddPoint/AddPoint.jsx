import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select, Icon } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import StationSelect from '../../../../../components/Common/StationSelect';
import AddNextStep from './AddNextStep';
import styles from '../pointSide.scss';
const { Option } = Select;
class AddPoint extends React.Component {
  static propTypes = {
    changePointManageStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getfactorsDeviceMode: PropTypes.func,
    allStationBaseInfo: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    factorsDeviceModeData: PropTypes.array,
    allFactor: PropTypes.array,
    showPage: PropTypes.string,
    addPoint: PropTypes.func,
    editPoints: PropTypes.func,
    getStandardDesc: PropTypes.func,
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
      payloadData: {},
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
      addDeviceTypeCode: null,
      manufactorId: null,
      deviceModeCode: null,
    });
    getStationDeviceTypes({
      stationCodes: addStationCode,
    });
  }

  selectDeviceType = (value) => {
    const { getfactorsDeviceMode, getStandardDesc } = this.props;
    const { addStationCode } = this.state;
    this.setState({
      addDeviceTypeCode: value,
      manufactorId: null,
      deviceModeCode: null,
    });
    getStandardDesc({
      deviceTypeCode: value,
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
      deviceModeCode: null,
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
    this.format();

  }
  showPre = () => {
    this.setState({
      preStep: true,
    });
  }
  dataFinder = (data, children, contrast) => {
    const arr = data.filter((e) => e[children] === contrast);
    return arr;
  }
  filterData = (dataArr, typeName) => {
    const firstData = dataArr.length ? dataArr[0] : {};
    const data = firstData[typeName];
    return data;
  }


  format = () => {
    const { addStationCode, addDeviceTypeCode, manufactorId, deviceModeCode } = this.state;
    const { allStationBaseInfo, stationDeviceTypes, factorsDeviceModeData, allFactor } = this.props;
    const stationName = this.filterData(this.dataFinder(allStationBaseInfo, 'stationCode', addStationCode), 'stationName');
    const deviceTypeName = this.filterData(this.dataFinder(stationDeviceTypes, 'deviceTypeCode', addDeviceTypeCode), 'deviceTypeName');
    const manufactorName = this.filterData(this.dataFinder(allFactor, 'manufactorId', manufactorId), 'manufactorName');
    const deviceModeName = this.filterData(this.dataFinder(factorsDeviceModeData, 'deviceModeCode', deviceModeCode), 'modeName');
    const data = { stationCode: addStationCode, deviceTypeCode: addDeviceTypeCode, manufactorId, deviceModeCode, stationName, deviceTypeName, deviceModeName, manufactorName };
    this.setState({
      payloadData: data,
    });

  }
  render() {
    const { allStationBaseInfo, stationDeviceTypes, allFactor, factorsDeviceModeData, showPage, addPoint, editPoints, standardDesc } = this.props;
    const { showWarningTip, warningTipText, preStep, addStationCode, addDeviceTypeCode, manufactorId, deviceModeCode, payloadData } = this.state;
    const typeSelectDisable = !addStationCode || stationDeviceTypes.length === 0;
    const modelSelectDisable = !addStationCode || factorsDeviceModeData.length === 0;
    const getSelectedStation = allStationBaseInfo.find(e => e.stationCode === addStationCode);
    const selectedStationInfo = getSelectedStation ? [getSelectedStation] : [];
    const isNextStep = (addStationCode && addDeviceTypeCode && manufactorId && deviceModeCode);
    return (
      <div className={styles.pointAdd}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.pageTop}>
          <span className={styles.text}>新增</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.onWarningTipShow} />
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
                disabled={typeSelectDisable || !allFactor || allFactor.length === 0}
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
        {!preStep && <AddNextStep editPoints={editPoints} addPoint={addPoint} showPage={showPage} showPre={this.showPre} payloadData={payloadData} standardDesc={standardDesc} />}
      </div>
    );
  }
}
export default (AddPoint);
