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
    getCheckStatus: PropTypes.func,
    deviceTypeData: PropTypes.array,

  }

  constructor(props, context) {
    super(props, context);
  }
  selectStation = (selectedStationInfo) => {
    const { changeBranchStore, getDeviceType } = this.props;
    const { stationCode } = selectedStationInfo[0];

    changeBranchStore({ stationCode, deviceTypeData: [], deviceNameData: [], deviceBranchInfo: [] });
    getDeviceType({ stationCode });
  }
  selectDeviceType = (deviceTypeCode) => {
    const { changeBranchStore, getDeviceName, stationCode, getCheckStatus } = this.props;
    changeBranchStore({
      deviceTypeCode,
      deviceFullCodes: [],
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
    });
    this.getBranchInfo({
      deviceFullCodes: devices,
    });

  }
  getBranchInfo = (values) => {
    const { getDeviceBranchInfo, stationCode, deviceTypeCode } = this.props;
    getDeviceBranchInfo({ stationCode, deviceTypeCode, ...values });

  }

  render() {
    const { stations, stationCode, deviceTypeCode, deviceFullCodes, deviceTypeData } = this.props;
    console.log('deviceTypeData: ', deviceTypeData);
    // const hasbox = deviceTypeData.map(e => e.deviceTypeCode).includes(202);
    // const hasinverter = deviceTypeData.map(e => e.deviceTypeCode).includes(206);
    // const all = [{ deviceTypeCode: 202, deviceTypeName: '汇流箱' }, { deviceTypeCode: 206, deviceTypeName: '组串式逆变器' }];
    // const deviceTypeArray = hasbox ? (hasinverter ? all : all.shift()) : (hasinverter ? all.pop() : []);
    // console.log('deviceTypeArray: ', deviceTypeArray);

    return (<div className={styles.searchBox}>
      <div className={styles.topSearch}>
        <div className={styles.stationSelect}>
          <span className={styles.text}>电站名称</span>
          <StationSelect
            data={stations.filter((e) => (e.stationType === 1))}
            onOK={this.selectStation}
            value={stations.filter(e => e.stationCode === stationCode)}
            holderText="请输入电站名称" />
        </div>
        <div className={styles.typeSelect}>
          <span className={styles.text}>设备类型</span>
          <Select
            style={{ width: '200px' }}
            onChange={this.selectDeviceType}
            value={null}
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
