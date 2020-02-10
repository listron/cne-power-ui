import React from 'react';
import styles from './styles.scss';
import PropTypes from 'prop-types';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';
import { Select, Button, Input } from 'antd';
const { Option } = Select;

class Filter extends React.Component {
  static propTypes = {}

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { stations, stationCode, deviceTypeCode, deviceFullCodes } = this.props;
    return (<div className={styles.searchBox}>
      <div className={styles.topSearch}>
        <div className={styles.stationSelect}>
          <span className={styles.text}>电站名称</span>
          <StationSelect data={stations.filter((e) => (e.stationType === 1))} onOK={this.selectStation} holderText="请输入电站名称" />
        </div>
        <div className={styles.typeSelect}>
          <span className={styles.text}>设备类型</span>
          <Select
            style={{ width: '200px' }}
            onChange={this.selectDeviceType}
            value={null}
            placeholder="请选择设备类型"
            disabled={stationCode === null}
          >
            <Option key={null} value={null}>{'全部设备类型'}</Option>
            <Option key={'汇流箱'} value={1}>{'汇流箱'}</Option>
            <Option key={'组串式逆变器'} value={2}>{'组串式逆变器'}</Option>

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
            // max={timeInterval === 10 ? 5 : 2}
            deviceShowNumber={true}
            style={{ width: 'auto', minWidth: '198px' }}
            onChange={this.selectedDevice}
          />
        </div>
      </div>

    </div>);
  }
}
export default (Filter);
