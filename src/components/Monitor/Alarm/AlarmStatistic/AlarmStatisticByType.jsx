import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Icon, Tabs, DatePicker, Select } from 'antd';
import styles from './alarmStatistic.scss';
import AlarmStatisticTable from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticTable.jsx';
import AlarmStatisticGraph from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticGraph.jsx';
import StationFilter from './StationFilter';
import { handleRight } from '@utils/utilFunc';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class AlarmStatisticByType extends Component {
  static propTypes = {
    stations: PropTypes.object,
    stationCode: PropTypes.array,
    stationType: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    exportAlarm: PropTypes.func,
    changeAlarmStatisticStore: PropTypes.func,
    getStationsAlarmStatistic: PropTypes.func,
    pvSelectTime: PropTypes.string,
    windSelectTime: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      key: 'graph',
    };
  }
  //点击插入要显示内容
  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if (showFilter === filterText) {
      this.setState({
        showFilter: '',
      });
    } else {
      this.setState({
        showFilter: filterText,
      });
    }
  }

  //改变时间的
  onChangeTime = (value, dateString) => {
    const { getStationsAlarmStatistic, changeAlarmStatisticStore, stationType, stationCode, pageSize, pageNum, orderField, orderCommand } = this.props;
    const startDate = dateString[0];
    const endDate = dateString[1];
    if (stationType === '1') {
      changeAlarmStatisticStore({
        pvStartTime: startDate,
        pvEndTime: endDate,
      });
    }else{
      changeAlarmStatisticStore({
        windStartTime: startDate,
        windEndTime: endDate,
      });
    }
    // changeAlarmStatisticStore({ startTime: startDate, endTime: endDate });
    if (stationCode.length > 0) {
      getStationsAlarmStatistic({ stationType, stationCode, startTime: startDate, endTime: endDate, pageSize, pageNum, orderField, orderCommand });
    }
  }

  //设置tabs按钮的
  onChangeTab = (key) => {
    const { getStationsAlarmStatistic, changeAlarmStatisticStore, stationType, stationCode, startTime, endTime, pageSize, pageNum, orderField, orderCommand } = this.props;
    if (key === 'graph') {
      changeAlarmStatisticStore({
        pageSize: null,
        pageNum: null,
        orderField: '',
        orderCommand: '',
      });
      if (stationCode.length > 0) {
        getStationsAlarmStatistic({ stationType, stationCode, startTime, endTime, pageSize: null, pageNum: null, orderField: '', orderCommand: '' });
      }
    } else if (key === 'table') {
      changeAlarmStatisticStore({
        pageSize: pageSize !== null ? pageSize : 10,
        pageNum: pageNum !== null ? pageNum : 1,
        orderField: orderField !== '' ? orderField : '',
        orderCommand: orderField !== '' ? orderCommand : '',
      });
      if (stationCode.length > 0) {
        getStationsAlarmStatistic({
          stationType,
          stationCode,
          startTime,
          endTime,
          pageSize: pageSize !== null ? pageSize : 10,
          pageNum: pageNum !== null ? pageNum : 1,
          orderField: orderField !== '' ? orderField : '',
          orderCommand: orderField !== '' ? orderCommand : '',
        });
      }
    }
    this.setState({ key });
  }


  //筛选时间，出现日期框
  onChangeDuration = (value) => {
    const { getStationsAlarmStatistic, changeAlarmStatisticStore, stationType, stationCode, pageSize, pageNum, orderField, orderCommand } = this.props;
    let startDate, endDate;
    if (value === 'other') {
      this.onFilterShowChange('timeSelect');
    } else {
      if (value === 'today') {
        startDate = moment().hour(0).minute(0).second(0).utc().format();
        endDate = moment().utc().format();
      } else if (value === 'yesterday') {
        startDate = moment().subtract(1, 'days').startOf('day').format();
        endDate = moment().subtract(1, 'days').endOf('day').format();
      } else if (value === 'last7') {
        startDate = moment().subtract(6, 'days').hour(0).minute(0).second(0).utc().format();
        endDate = moment().utc().format();
      } else if (value === 'last30') {
        startDate = moment().subtract(29, 'days').hour(0).minute(0).second(0).utc().format();
        endDate = moment().utc().format();
      }
      // changeAlarmStatisticStore({
      //   startTime: startDate,
      //   endTime: endDate,
      // });
      if (stationType === '1') {
        changeAlarmStatisticStore({
          pvStartTime: startDate,
          pvEndTime: endDate,
        });
      }else{
        changeAlarmStatisticStore({
          windStartTime: startDate,
          windEndTime: endDate,
        });
      }
      if (stationCode.length > 0) {
        getStationsAlarmStatistic({ stationType, stationCode, startTime: startDate, endTime: endDate, pageSize, pageNum, orderField, orderCommand });
      }
    }
  }
  onCalendarChange = (dates) => {
    if (dates.length === 1) {
      this.start = dates[0].format('YYYY-MM-DD');
    } else {
      this.start = null;
    }
  }
  exportAlarm = () => {
    const { stationCode, startTime, endTime, stationType } = this.props;
    this.props.exportAlarm({//导出
      stationCode,
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).endOf('day').utc().format(),
      stationType,
    });
  }
  disabledDate = (current) => {
    if (this.start) {
      const end = moment(this.start).add(30, 'days');
      return current > moment.min(moment().endOf('day'), end);
    }
    return current && current > moment().endOf('day');

  }
  render() {
    const { showFilter, key } = this.state;
    const alarmStatisticOperation = handleRight('alarm_statistics_export');
    //数据导出按钮
    const operations = (
      <div className={styles.exportData}>
        <button className={styles.exportBtn} onClick={this.exportAlarm}>数据导出</button>
      </div >
    );

    return (
      <div className={styles.alarmStatisticType}>
        <div className={styles.filter}>
          <span>筛选条件</span>
          <Button className={styles.stationType} onClick={() => this.onFilterShowChange('stationSelect')}>
            选择电站{showFilter === 'stationSelect' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Select placeholder="统计时间" style={{ width: 120 }} onChange={this.onChangeDuration} defaultValue={'last30'}>
            <Option value="today">今天</Option>
            <Option value="yesterday">昨天</Option>
            <Option value="last7">最近7天</Option>
            <Option value="last30">最近30天</Option>
            <Option value="other">其他时间段</Option>
          </Select>
        </div>
        {showFilter !== '' && <div className={styles.filterBox}>
          {showFilter === 'stationSelect' && <StationFilter {...this.props} />}
          {
            showFilter === 'timeSelect' &&
            <div className={styles.datePicker}><RangePicker
              showTime={false}
              disabledDate={this.disabledDate}
              onCalendarChange={this.onCalendarChange}
              format="YYYY-MM-DD"
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChangeTime}
            /></div>
          }
        </div>}
        <Tabs animated={false} tabBarGutter={0} className={styles.tabContainer} activeKey={key} tabBarExtraContent={alarmStatisticOperation && operations} onChange={this.onChangeTab}>
          <TabPane
            tab={<i className="iconfont icon-drawing"></i>}
            key="graph"
          >
            <AlarmStatisticGraph {...this.props} />
          </TabPane>
          <TabPane
            tab={<i className="iconfont icon-table"></i>}
            key="table"
          >
            <AlarmStatisticTable {...this.props} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default AlarmStatisticByType;

