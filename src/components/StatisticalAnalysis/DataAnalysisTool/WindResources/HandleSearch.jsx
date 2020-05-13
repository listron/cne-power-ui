import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../Common/StationSelect';
import { Button, DatePicker, Icon } from 'antd';
import moment from 'moment';
import styles from './resources.scss';
import CneButton from '../../../Common/Power/CneButton';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY.MM';

let startDate = '';
let endDate = '';
let modeCode = '';

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
    getFrequencyMax: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      disableDateFun: (current) => {
        return current && current > moment().subtract(1, 'month');
      },
      downLoadding: false,
      timeInfoFlag: false,
      timeInfoText: '时间选择范围不可超过12个月',
    };
  }

  componentWillReceiveProps(nextProps) {
    const prevParamsFlag = startDate === '' && endDate === '' && modeCode === '';
    const currentParamsFlag = nextProps.startTime && nextProps.endTime && nextProps.deviceList !== 0;
    if (prevParamsFlag && currentParamsFlag) {
      startDate = moment(nextProps.startTime).format('YYYY-MM');
      endDate = moment(nextProps.endTime).format('YYYY-MM');
      modeCode = nextProps.deviceList[0].deviceFullCode;
    }
  }

  selectStationCode = (stationCodeArr) => {//电站选择
    const { stationCode } = stationCodeArr[0];
    this.props.getStationDevice({ stationCode });
  };

  onCalendarChange = (dates) => {
    if (dates.length === 1) {
      this.setState({ // 时间跨度不超过12个月
        disableDateFun: (current) => {
          const maxTime = moment(dates[0]).add(12, 'months');
          const minTime = moment(dates[0]).subtract(12, 'months');
          return current > moment() || current > maxTime || current < minTime;
        },
      });
    } else {
      this.setState({
        disableDateFun: (current) => current > moment(),
      });
    }
  };

  setStateFn = (flag = true, text = '时间选择范围不可超过12个月') => {
    this.setState({
      timeInfoFlag: flag,
      timeInfoText: text,
    });
  };

  //改时间
  handlePanelChange = value => {
    const { changeWindResourcesStore, startTime, endTime } = this.props;
    // 选择的时间
    const startValueTime = moment(value[0]).format(dateFormat);
    const endValueTime = moment(value[1]).format(dateFormat);
    // props 时间
    const propsStartTime = moment(startTime).format(dateFormat);
    const propsEndTime = moment(endTime).format(dateFormat);
    // 当前时间
    const currentTime = moment().format(dateFormat);

    // 时间差
    const timeDiff = moment(endValueTime).diff(moment(startValueTime), 'month');
    // 判断开始时间发生改变，结束时间没变
    if (startValueTime !== propsStartTime && propsEndTime === endValueTime && timeDiff > 12) {
      return this.setStateFn();
    }
    // 判断结束时间发生改变，开始时间没变
    if (startValueTime === propsStartTime && propsEndTime !== endValueTime && timeDiff > 12) {
      return this.setStateFn();
    }
    // 判断时间都发生改变
    if (startValueTime !== propsStartTime && propsEndTime !== endValueTime && timeDiff > 12) {
      return this.setStateFn();
    }
    // 如果选择的时间大于当前时间
    if (startValueTime > currentTime || endValueTime > currentTime) {
      return this.setStateFn(true, '当前月以后的月份不可以选择');
    }
    this.setState({ timeInfoFlag: false }, () => {
      changeWindResourcesStore({
        startTime: startValueTime,
        endTime: endValueTime,
      });
    });
  };

  handleOpenChange = () => {
    this.setState({ timeInfoFlag: false });
  };

  onSearch = () => {
    const {
      deviceList,
      getFrequencyMax,
      activeKey,
      getDirections,
      startTime,
      endTime,
      stationCode,
    } = this.props;
    const firstDevice = deviceList[0];
    const deviceFullCode = firstDevice.deviceFullCode;
    // 判断有没有变化
    if (moment(startTime).format('YYYY-MM') === startDate && moment(endTime).format('YYYY-MM') === endDate && deviceFullCode === modeCode) {
      return false;
    }
    // 重新赋值变量
    startDate = moment(startTime).format('YYYY-MM');
    endDate = moment(endTime).format('YYYY-MM');
    modeCode = deviceFullCode;

    // 风能玫瑰图
    if (activeKey === 1) {
      return getDirections({
        startTime,
        endTime,
        deviceFullCode,
      });
    }
    // 风能频率图
    // 现请求风能频率最大值
    return getFrequencyMax({
      startTime,
      endTime,
      deviceFullCode,
      stationCode,
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
    const { stationCode, stations, startTime, endTime, isClick } = this.props;
    const { disableDateFun, downLoadding, timeInfoFlag, timeInfoText } = this.state;
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
            mode={['month', 'month']}
            allowClear={false}
            value={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
            disabledDate={disableDateFun}
            onCalendarChange={this.onCalendarChange}
            format={dateFormat}
            onOpenChange={this.handleOpenChange}
            onPanelChange={this.handlePanelChange}
            style={{ width: '240px' }}
            renderExtraFooter={() => (
              <span className={styles.infoTip}>
                {timeInfoFlag && timeInfoText}
              </span>
            )}
          />
          <CneButton className={styles.seachBtn} onClick={this.onSearch} lengthMode="short">查询</CneButton>
        </div>
        <CneButton disabled={!isClick} className={styles.download} onClick={this.downPic} antdIcon={downLoadding && 'loading' || ''} lengthMode="short">图片下载</CneButton>
      </div>
    );
  }
}
