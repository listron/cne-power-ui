import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../Common/StationSelect';
import {Button, DatePicker, Icon} from 'antd';
import moment from 'moment';
import styles from './resources.scss';

const {RangePicker} = DatePicker;

export default class HandleSearch extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    deviceList: PropTypes.array,
    getStationDevice: PropTypes.func,
    getFrequency: PropTypes.func,
    changeWindResourcesStore: PropTypes.func,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    isClick: PropTypes.bool,
    activeKey: PropTypes.number,
    getDirections: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      disableDateFun: (current) => current > moment(),
      downLoadding: false,
    };
  }

  selectStationCode = (stationCodeArr) => {//电站选择
    const {stationCode} = stationCodeArr[0];
    this.props.getStationDevice({stationCode});
  };

  onCalendarChange = (dates) => {
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
  };

  //改时间
  changeTime = (date, dateString) => {
    //暂存时间
    const { changeWindResourcesStore } = this.props;
    changeWindResourcesStore({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  };

  onSearch = () => {
    const {
      deviceList,
      getFrequency,
      activeKey,
      getDirections,
      startTime,
      endTime,
    } = this.props;
    const firstDevice = deviceList[0];
    const deviceFullCode = firstDevice.deviceFullCode;
    // 风能玫瑰图
    if(activeKey === 1) {
      return getDirections({
        startTime,
        endTime,
        deviceFullCode,
      });
    }
    // 风能频率图
    return getFrequency({
      startTime,
      endTime,
      deviceFullCode,
    });
  };

  downPic = () => { // 下载图片
    this.props.changeWindResourcesStore({
      down: true,
    });
    this.setState({
      downLoadding: true,
    });
    setTimeout(() => {
      this.setState({
        downLoadding: false,
      });
    }, 2000);
  };

  render() {
    const {stationCode, stations, startTime, endTime, isClick} = this.props;
    const {disableDateFun, downLoadding} = this.state;
    const dateFormat = 'YYYY.MM.DD';
    const selectStation = stations.filter(e => (e.stationType === 0 && e.isConnected === 1));
    return (
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
            style={{width: '240px'}}
          />
          <Button className={styles.seachBtn} onClick={this.onSearch}>查询</Button>
        </div>
        <Button className={!isClick ? styles.disabledDownload : styles.download} disabled={!isClick}
                onClick={this.downPic}>
          {downLoadding ? <span><Icon type="loading" style={{fontSize: 16}} spin/>图片下载</span> : '图片下载'}
        </Button>
      </div>
    );
  }
}
