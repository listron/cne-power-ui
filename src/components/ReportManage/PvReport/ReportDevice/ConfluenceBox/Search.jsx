import React from 'react';
import styles from './confluenceBox.scss';
import PropType from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import DeviceSelect from '../../../../Common/DeviceSelect/';
import TimeSelect from '../TimeSelect/index';
import { Button } from 'antd';
import moment from 'moment';


class ReportSearch extends React.PureComponent {
  static propTypes = {
    stations: PropType.array,
    parmas: PropType.object,
    startTime: PropType.string,
    reportTime: PropType.string,
    endTime: PropType.string,
    dateType: PropType.string,
    getConfluenceBoxList: PropType.func,
    changeStore: PropType.func,
    disabledStation: PropType.array,
    theme: PropType.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectStationCode: [],
      selectedDevice: [],
      selectTime: {
        dateType: props.dateType,
        startTime: props.dateType === 'hour' && props.reportTime || props.startTime,
        endTime: props.endTime,
      },
    };
    this.loop = true;
    this.time = null;
  }

  componentWillUnmount() {
    clearTimeout(this.time);
  }
  timeChange = (value) => { // 时间选择
    this.setState({ selectTime: value });
    this.loop = true;
  }

  changeStation = (value) => { //电站选择
    this.loop = true;
    this.setState({ selectStationCode: value, selectedDevice: [] });
  }

  selectedDevice = (value) => { // 设备选择
    this.loop = true;
    this.setState({ selectedDevice: value });
  }

  queryList = () => {
    const { parmas, getConfluenceBoxList, changeStore, reportTime } = this.props;
    const { selectStationCode, selectedDevice, selectTime } = this.state;
    const tempStationCode = selectStationCode.length > 0 && selectStationCode[0].stationCode || null;
    const tempStationName = selectStationCode.length > 0 && selectStationCode[0].stationName || '';
    const tempDeviceCode = selectedDevice.map(e => e.deviceCode);
    const { startTime } = selectTime;
    const tmpParmas = {
      ...parmas,
      stationCode: tempStationCode,
      deviceFullcodes: tempDeviceCode,
      pageSize: 10,
      pageNum: 1,
    };
    if (this.loop) {
      this.loop = false;
      changeStore({ parmas: { ...tmpParmas }, reportTime: startTime || reportTime, stationName: tempStationName });
      getConfluenceBoxList({ ...tmpParmas, reportTime: startTime || reportTime });
      this.time = setTimeout(() => {
        this.loop = true;
      }, 3000);
    }

  }



  render() {
    const { stations, disabledStation, theme } = this.props;
    const { selectStationCode, selectedDevice } = this.state;
    return (
      <div className={`${styles.reportSearch} ${styles[theme]}`}>
        <div className={styles.column}>
          <div className={styles.lable}>时间范围</div>
          <TimeSelect onChange={this.timeChange} showLable={false} theme={theme} />
        </div>
        <div className={styles.column}>
          <div className={styles.lable}>电站名称</div>
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            onChange={this.changeStation}
            value={selectStationCode}
            disabledStation={disabledStation.filter(e => !e.hasDevice).map(e => +e.stationCode)}
            theme={theme}
          />
        </div>
        <div className={`${styles.column} ${styles.device}`}>
          <div className={styles.lable}> 设备名称</div>
          <DeviceSelect
            disabled={selectStationCode.length === 0}
            stationCode={selectStationCode.length > 0 && selectStationCode[0].stationCode || null}
            deviceTypeCode={202}
            style={{ width: 'auto', minWidth: '198px' }}
            onChange={this.selectedDevice}
            holderText={'请选择'}
            needAllCheck={true}
            multiple={true}
            value={selectedDevice}
            theme={theme}
            max={100}
            deviceShowNumber={true}
          />
        </div>
        <Button type={'primary'} onClick={this.queryList} disabled={selectedDevice.length === 0}> 查询</Button>

      </div>
    );
  }
}


export default ReportSearch;
