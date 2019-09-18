import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../Common/StationSelect';
import { Button, DatePicker, Cascader, Icon, Select, InputNumber, Spin } from 'antd';
import moment from 'moment';
import styles from './resources.scss';

const { RangePicker } = DatePicker;

class HandleSeach extends Component{
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    deviceList: PropTypes.array,
    getStationDevice: PropTypes.func,
    getFrequency: PropTypes.func,
    changeWindResourcesStore: PropTypes.func,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      disableDateFun: (current) => current > moment(),
      saveStartTime: '',
      saveEndTime: '',
    };
  }

  selectStationCode = (stationCodeArr) => {//电站选择
    const { stationCode } = stationCodeArr[0];
    this.props.getStationDevice({ stationCode });
  }

  onCalendarChange = (dates, dateStrings) => {
    if (dates.length === 1) {
      this.setState({ // 时间跨度不超过1年
        disableDateFun: (current) => {
          const maxTime = moment(dates[0]).add(366, 'days');
          const minTime = moment(dates[0]).subtract(366, 'days');
          return current > moment() || current > maxTime || current < minTime;
        },
      });
    } else {
      this.setState({
        disableDateFun: (current) => current > moment(),
      });
    }
  }

    //改时间
    changeTime = (date, dateString) => {
      //暂存时间
      this.setState({
        saveStartTime: dateString[0],
        saveEndTime: dateString[1],
      });
    }

  onSearch = () => {
    const { deviceList, getFrequency, startTime, endTime, changeWindResourcesStore } = this.props;
    const { saveStartTime, saveEndTime } = this.state;
    const fristDevice = deviceList[0];
    const deviceFullCode = fristDevice.deviceFullCode;
    changeWindResourcesStore({
      startTime: saveStartTime,
      endTime: saveEndTime,
    });

    getFrequency({
      startTime,
      endTime,
      deviceFullCode,
    });
  }

  render(){
    const { stationCode, stations, startTime, endTime } = this.props;
    const { disableDateFun } = this.state;
    const dateFormat = 'YYYY.MM.DD';
    const selectStation = stations.filter(e => (e.stationType === 0 && e.isConnected === 1));
    return(
      <div className={styles.handleSeach}>
        <div className={styles.headTop}>
          <label className={styles.nameStyle}>电站</label>
          <StationSelect
            onOK={this.selectStationCode}
            data={selectStation}
            value={stations.filter(e => e.stationCode === stationCode)}
          />
          <label className={styles.nameStyle}>时间</label>
          <RangePicker
            defaultValue={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
            disabledDate={disableDateFun}
            onCalendarChange={this.onCalendarChange}
            format={dateFormat}
            onChange={this.changeTime}
            style={{ width: '240px' }}
          />
          <Button className={styles.seachBtn} onClick={this.onSearch}>查询</Button>
        </div>
      </div>
    );
  }
}

export default HandleSeach;
