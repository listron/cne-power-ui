import React from 'react';
import styles from './styles.scss';
import PropTypes from 'prop-types';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';
import { Select, Button, Input } from 'antd';
const { Option } = Select;

class BranchFilter extends React.Component {
  static propTypes = {
    getDeviceBranchInfo: PropTypes.func,
    changeBranchStore: PropTypes.func,
    getDeviceType: PropTypes.func,
    getDeviceName: PropTypes.func,
    deviceTypeData: PropTypes.array,
    stationsInfo: PropTypes.array,
    deviceTypeCode: PropTypes.number,
  }

  constructor(props, context) {
    super(props, context);
  }
  selectStation = (selectedStationInfo) => {
    const { changeBranchStore, getDeviceType } = this.props;
    const { stationCode } = selectedStationInfo[0];
    changeBranchStore({
      stationCode,
      deviceTypeData: [],
      deviceNameData: [],
      deviceBranchInfo: [],
      focus: false,
      selectDeviceFullCode: false,
      isCheckStatus: false,
      checked: false,

    });
    getDeviceType({ stationCode });
    this.getBranchInfo({ stationCode });
  }
  selectDeviceType = (deviceTypeCode) => {
    const { changeBranchStore, getDeviceName, stationCode } = this.props;
    changeBranchStore({
      deviceTypeCode,
      deviceFullCodes: [],
      focus: false,
      selectDeviceFullCode: false,
      isCheckStatus: false,
      checked: false,
    });
    getDeviceName({
      stationCode,
      deviceTypeCode,
    });
    this.getBranchInfo({ stationCode, deviceTypeCode });
  }
  selectedDevice = (devices) => {
    const { changeBranchStore } = this.props;
    changeBranchStore({
      deviceFullCodes: devices,
      focus: false,
      selectDeviceFullCode: false,
      isCheckStatus: false,
      checked: false,
    });
    this.getBranchInfo({
      deviceFullCodes: devices,
    });

  }
  getBranchInfo = (values) => {
    const { getDeviceBranchInfo, stationCode } = this.props;
    getDeviceBranchInfo({ stationCode, ...values });

  }

  render() {
    const { stationsInfo, stationCode, deviceTypeCode, deviceFullCodes, deviceTypeData } = this.props;
    return (<div className={styles.searchBox}>
      <div className={styles.topSearch}>
        <div className={styles.stationSelect}>
          <span className={styles.text}>电站名称</span>
          <StationSelect
            data={stationsInfo.filter((e) => (e.stationType === 1))}
            onOK={this.selectStation}
            value={stationsInfo.filter(e => e.stationCode === stationCode)}
            holderText="请输入电站名称" />
        </div>
        <div className={styles.typeSelect}>
          <span className={styles.text}>设备类型</span>
          <Select
            style={{ width: '200px' }}
            onChange={this.selectDeviceType}
            value={deviceTypeCode}
            placeholder="请选择设备类型"
            disabled={deviceTypeData.length === 0}
          >
            <Option key={null} value={null}>{'全部设备类型'}</Option>
            {deviceTypeData.map((e, index) => {
              if (!e) return;
              return (
                <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              );
            })}
          </Select>
        </div>
        <div className={styles.deviceSelect}>
          <span className={styles.text}>设备名称</span>
          <DeviceSelect
            disabled={!deviceTypeCode}
            stationCode={stationCode}
            value={deviceFullCodes}
            deviceTypeCode={deviceTypeCode}
            multiple={true}
            deviceShowNumber={true}
            style={{ width: 'auto', minWidth: '198px' }}
            onChange={this.selectedDevice}
          />
        </div>
      </div>

    </div>);
  }
}
export default (BranchFilter);
