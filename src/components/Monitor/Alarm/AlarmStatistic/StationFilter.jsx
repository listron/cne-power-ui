import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './alarmFilter.scss';
import { Tabs, Checkbox } from 'antd';
import moment from 'moment';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;


class StationFilter extends Component {
  static propTypes = {
    stationCode: PropTypes.array,
    stations: PropTypes.object,
    changeAlarmStatisticStore: PropTypes.func,
    getStationsAlarmStatistic: PropTypes.func,
    stationType: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    pvStartTime: PropTypes.string,
    pvEndTime: PropTypes.string,
    windStartTime: PropTypes.string,
    windEndTime: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'all',
    };
  }

  onChangeStation = (checkedValue, provinceCode) => {
    const { changeAlarmStatisticStore, getStationsAlarmStatistic, stationType, stations, stationCode, startTime, endTime, pageSize, pageNum, orderField, orderCommand, pvStartTime, pvEndTime, windStartTime, windEndTime } = this.props;
    const provinceStation = stations.groupBy(item=>item.get('provinceCode')).toJS()[provinceCode];
    const newStationCode = stationCode.filter(code => {
      return provinceStation.findIndex(station => station.stationCode.toString() === code) === -1;
    }).concat(checkedValue);
    changeAlarmStatisticStore({
      stationCode: newStationCode,
    });
    const params = { stationCode: newStationCode, stationType, pageSize, pageNum, orderField, orderCommand };
    if (newStationCode.length > 0 ) {
      if (pvStartTime && stationType === '1') {
        getStationsAlarmStatistic({
          startTime: pvStartTime,
          endTime: pvEndTime,
          ...params,
        });
      }else if (windStartTime && stationType === '0') {
        getStationsAlarmStatistic({
          startTime: windStartTime,
          endTime: windEndTime,
          ...params,
        });
      }else{
        getStationsAlarmStatistic({
          startTime: moment().subtract(29, 'days').hour(0).minute(0).second(0).utc().format(),
          endTime: moment().endOf('day').utc().format(),
          ...params,
        });
      }
    }else {
      changeAlarmStatisticStore({allChartLoading: false});
    }
  }

  onChangeProvince = (key) => {
    if(key === 'all') {
      this.props.changeAlarmStatisticStore({
        stationCode: [],
      });
    }
    this.setState({
      activeKey: key,
    });
  }

  onCheckAll(e, data) {
    const { stationType, startTime, endTime, pageSize, pageNum, orderField, orderCommand, changeAlarmStatisticStore, getStationsAlarmStatistic, pvStartTime, pvEndTime, windStartTime, windEndTime } = this.props;
    const checkedValue = data.map(item=>item.get('stationCode').toString()).toJS();
    let stationCode = this.props.stationCode;
    let stationArray;
    const params = { stationType, stationCode, pageSize, pageNum, orderField, orderCommand };
    if(e.target.checked) {
      stationArray = stationCode.concat(checkedValue);
      stationCode = Array.from(new Set(stationArray));   
    } else {
      stationArray = stationCode.filter(item => checkedValue.indexOf(item)===-1);
      stationCode = stationArray;
    }
    changeAlarmStatisticStore({
      stationCode,
    });
    if (stationCode.length > 0 ) {
      if ((pvStartTime || pvEndTime) && stationType === '1') {
        getStationsAlarmStatistic({
          startTime: pvStartTime,
          endTime: pvEndTime,
          ...params,
        });
      }else if ((windStartTime || windEndTime) && stationType === '0') {
        getStationsAlarmStatistic({
          startTime: windStartTime,
          endTime: windEndTime,
          ...params,
        });
      }else{
        getStationsAlarmStatistic({
          startTime: moment().subtract(29, 'days').hour(0).minute(0).second(0).utc().format(),
          endTime: moment().endOf('day').utc().format(),
          ...params,
        });
      }
      // getStationsAlarmStatistic({
      // stationType, stationCode, startTime, endTime, pageSize, pageNum, orderField, orderCommand,
      // });
    }else {
      changeAlarmStatisticStore({allChartLoading: false});
    }
  }

  getCheckAll(data) {
    const checkedOption = data.map(item=>item.get('stationCode').toString()).toJS();
    const stationCode = this.props.stationCode;
    let result = true;
    checkedOption.forEach(element => {
      if(stationCode.indexOf(element) === -1) {
        result = false;
        return;
      }
    });
    return result;
  }

  renderProvince(stationData) {
    const stationCode = this.props.stationCode;
    return stationData.map((provinceItem, index) => {
      const options = provinceItem.map(station=>{
        return {
          label: station.get('stationName'),
          value: station.get('stationCode').toString(),
        };
      }).toJS();
      const items = provinceItem.filter(station=>{
        return stationCode.findIndex(code=>code===station.get('stationCode').toString()) > -1;
      });
      const value = items.map(item => {
        return item.get('stationCode').toString();
      }).toJS();
      return (
        <TabPane tab={provinceItem.getIn([0, 'provinceName'])} key={index}>
          <Checkbox onChange={(e)=>this.onCheckAll(e, provinceItem)} checked={this.getCheckAll(provinceItem)}>全部</Checkbox>
          <CheckboxGroup
            options={options}
            value={value}
            onChange={(checkedValue)=>this.onChangeStation(checkedValue, provinceItem.getIn([0, 'provinceCode']).toString())}>
          </CheckboxGroup>
        </TabPane>
      );
    });
  }


  render() {
    const { stations } = this.props;
    const { activeKey } = this.state;
    const provinceStation = stations.groupBy(item=>item.get('provinceCode')).toList();

    return (
      <div className={styles.stationFilter}>
        <Tabs onChange={this.onChangeProvince} activeKey={activeKey} animated={false} >
          <TabPane tab="不限" key="all">
            {null}
          </TabPane>
          {this.renderProvince(provinceStation)}
        </Tabs>
      </div>
    );
  }
}

export default StationFilter;
