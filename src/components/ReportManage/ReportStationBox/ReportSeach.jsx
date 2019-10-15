import React from 'react';
import PropTypes from 'prop-types';
import styles from './reportStationBox.scss';
import { Radio, DatePicker, Button } from 'antd';
import StationSelect from '../../Common/StationSelect';
import moment from 'moment';

const { RangePicker } = DatePicker;

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
    const value = e.target.value;
    const defaultTime = this.setDefaultTime(value);
    this.props.changeStore({
      dateType: value,
      ...defaultTime,
    });

  }
  searchReportData = () => {
    //发送请求以及防抖
    const { startTime, endTime, stationCodes, dateType, orderFiled, orderType, pageNum, pageSize } = this.props;
    const params = { startTime, endTime, stationCodes, dateType, orderFiled, orderType, pageNum, pageSize };
    this.props.getReportStationList({
      ...params,
    });
  }
  disabledDate = (current) => {
    return current > moment();
  }
  render() {
    const { dateType, stations, startTime, endTime } = this.props;
    console.log('dateType: ', dateType);
    console.log('endTime: ', endTime);
    console.log('startTime: ', startTime);
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
              value={[moment(startTime), moment(endTime)]}
              disabledDate={this.disabledDate}
              onChange={this.changeDay}
            />
          )}
          {dateType === 'month' && (
            <RangePicker
              format="YYYY-MM"
              mode={['month', 'month']}
              value={[moment(startTime), moment(endTime)]}
              onChange={this.changeMonth}
            />
          )}
          {dateType === 'year' && (
            <div>
              <DatePicker
                mode="year"
                format="YYYY"
                value={moment(startTime)}
                onChange={this.changeStartTime}
              />
              <span className={styles.yearWidth}>-</span>
              <DatePicker
                mode="year"
                format="YYYY"
                value={moment(endTime)}
                onChange={this.changeEndTime}
              />
            </div>
          )}
          &nbsp;&nbsp; <label >电站名称</label>  &nbsp;&nbsp;
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            multiple={true}
            disabledStation={[360]}
            onChange={this.changeStation} />
          <Button type="primary" className={styles.btnStyle} onChange={this.searchReportData} >查询</Button>
        </div>


      </div>
    );
  }
}
export default (ReportSeach);
