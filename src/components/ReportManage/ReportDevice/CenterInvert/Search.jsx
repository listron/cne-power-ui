import React from 'react';
import styles from './centerInvert.scss';
import PropType from 'prop-types';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect/';
import { Button } from 'antd';


class ReportSearch extends React.PureComponent {
  static propTypes = {
    deviceTypes: PropType.array,
    stations: PropType.array,
    changeStore: PropType.func,
    parmas: PropType.object,
  }

  constructor() {
    super();
    this.state = {
      selectStationCode: [],
      selectedDevice: [],
    };
  }


  changeStation = (value) => { //电站选择
    this.setState({ selectStationCode: value });
  }

  selectedDevice = (value) => { // 设备选择
    this.setState({ selectedDevice: value });
  }

  queryList = () => {
    const { parmas, startTime, endTime, dateType, getCenterInverList } = this.props;
    const { selectStationCode, selectedDevice } = this.state;
    const tempStationCode = selectStationCode.length > 0 && selectStationCode[0].stationCode || null;
    const tempDeviceCode = selectedDevice.map(e => e.deviceCode);
    getCenterInverList({ ...parmas, startTime, endTime, dateType, stationCode: tempStationCode, deviceFullcodes: tempDeviceCode });
  }



  render() {
    const { stations } = this.props;
    const { selectStationCode, selectedDevice } = this.state;
    return (
      <div className={styles.reportSearch}>
        <div className={styles.column}>
          <div className={styles.lable}>时间范围</div>
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            onChange={this.changeStation} />
        </div>
        <div className={styles.column}>
          <div className={styles.lable}>电站名称</div>
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            onChange={this.changeStation}
            value={selectStationCode}
          />
        </div>
        <div className={styles.column}>
          <div className={styles.lable}> 设备名称</div>
          <DeviceSelect
            disabled={false}
            stationCode={56}
            deviceTypeCode={201}
            style={{ width: 'auto', minWidth: '198px' }}
            onChange={this.selectedDevice}
            holderText={'请选择'}
            needAllCheck={true}
            multiple={true}
            value={selectedDevice}
          />
        </div>
        <Button type={'primary'} onClick={this.queryList}> 查询</Button>

      </div>
    );
  }
}


export default ReportSearch;
