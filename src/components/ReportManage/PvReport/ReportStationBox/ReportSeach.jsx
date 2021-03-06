import React from 'react';
import PropTypes from 'prop-types';
import styles from './reportStationBox.scss';
import { Radio, DatePicker, Button } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import YearTime from './YearTime.jsx';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM';
class ReportSeach extends React.Component {
  static propTypes = {
    changeStore: PropTypes.func,
    getReportStationList: PropTypes.func,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    stationCodes: PropTypes.array,
    stations: PropTypes.array,
    dateType: PropTypes.string,
    orderFiled: PropTypes.string,
    orderType: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      stationCodes: [],
      dateType: 'day',
      startTime: moment().startOf('year').format('YYYY-MM-DD'),
      endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    };
    this.loop = true;
  }
  setDefaultTime = (type) => {
    const date = [
      { dateType: 'day', time: { startTime: moment().startOf('year').format('YYYY-MM-DD'), endTime: moment().subtract(1, 'day').format('YYYY-MM-DD') } },
      { dateType: 'month', time: { startTime: moment().startOf('year').format('YYYY-MM'), endTime: moment().format('YYYY-MM') } },
      { dateType: 'year', time: { startTime: moment().format('YYYY'), endTime: moment().format('YYYY') } },
    ];
    const defaultArr = date.filter(e => e.dateType === type);
    const defaultTime = defaultArr.length ? defaultArr[0].time : {};
    return defaultTime;
  }
  timeChange = (e) => {
    this.loop = true;
    const value = e.target.value;
    const defaultTime = this.setDefaultTime(value);
    this.setState({
      dateType: value,
      ...defaultTime,
    });
  }
  changeDay = (dates, dateStrings) => {
    this.loop = true;
    this.setState({
      startTime: dateStrings[0],
      endTime: dateStrings[1],
    });

  }
  //改月时间
  onCalendarChange = (dates, dateString) => {
    this.loop = true;
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });

  };
  handlePanelChange = (value, mode) => {
    this.loop = true;
    const { startTime, endTime } = this.props;
    const startValueTime = moment(value[0]).format(dateFormat);
    const endValueTime = moment(value[1]).format(dateFormat);
    // const propsStartTime = moment(startTime).format(dateFormat);
    // const propsEndTime = moment(endTime).format(dateFormat);
    this.setState({
      startTime: startValueTime,
      endTime: endValueTime,
    });
  };
  changeStartTime = (value) => {
    this.loop = true;
    this.setState({
      startTime: value,
    });
  }
  changeEndTime = (value) => {
    this.loop = true;
    this.setState({
      endTime: value,
    });
  }
  searchReportData = () => {
    //发送请求以及防抖
    const { startTime, endTime, stationCodes, dateType } = this.state;
    const { orderFiled, orderType, pageNum, pageSize } = this.props;
    const params = { startTime, endTime, stationCodes, dateType, orderFiled, orderType, pageNum, pageSize };
    if (this.loop) {
      this.loop = false;
      this.props.getReportStationList({
        ...params,
      });
      setTimeout(() => {
        this.loop = true;
      }, 3000);
    }
  }
  disabledDate = (current) => {
    return current > moment();
  }
  changeStation = (value) => {
    this.loop = true;
    const stationCodes = value.map(e => e.stationCode);
    this.setState({
      stationCodes,
    });
  }
  render() {
    const { dateType, startTime, endTime, stationCodes } = this.state;
    const { stations } = this.props;
    const disabledBtn = !stationCodes.length;
    return (
      <div className={styles.topSearch}>
        <div className={styles.timeStyle}>
          <label >时间范围</label>  &nbsp;&nbsp;
          <Radio.Group value={dateType} buttonStyle="solid" onChange={this.timeChange}>
            <Radio.Button value={'year'}>按年</Radio.Button>
            <Radio.Button value={'month'}>按月</Radio.Button>
            <Radio.Button value={'day'}>按日</Radio.Button>
          </Radio.Group>
          &nbsp;&nbsp;
          {dateType === 'day' && (
            <RangePicker
              allowClear={false}
              value={[moment(startTime), moment(endTime)]}
              disabledDate={this.disabledDate}
              onChange={this.changeDay}
            />
          )}
          {dateType === 'month' && (
            <RangePicker
              format="YYYY-MM"
              mode={['month', 'month']}
              allowClear={false}
              // disabledDate={disableDateFun}
              onCalendarChange={this.onCalendarChange}
              value={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
              onPanelChange={this.handlePanelChange}
            />
          )}
          {dateType === 'year' && (
            <div>
              <YearTime
                yearValue={startTime}
                onYearSelect={this.changeStartTime}
              />
              <span className={styles.yearWidth}>-</span>
              <YearTime
                yearValue={endTime}
                onYearSelect={this.changeEndTime}
              />
            </div>
          )}
          &nbsp;&nbsp; <label >电站名称</label>  &nbsp;&nbsp;
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            multiple={true}
            stationShowNumber={true}
            onChange={this.changeStation} />
          <CneButton className={styles.btnStyle} disabled={disabledBtn} onClick={this.searchReportData} >查询</CneButton>
        </div>
      </div>
    );
  }
}
export default (ReportSeach);
