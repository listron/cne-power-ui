import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tabs, DatePicker, Select } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
import styles from './alarmStatistic.scss';
import AlarmStatisticTable from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticTable.jsx';
import AlarmStatisticGraph from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticGraph.jsx';
import StationSelect from '@components/Common/StationSelect';
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
    theme: PropTypes.string,
    selectedStation: PropTypes.array,
    allChartLoading: PropTypes.bool,
  };

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
  };

  //改变时间的
  onChangeTime = (value, dateString) => {
    const { changeAlarmStatisticStore, stationType} = this.props;
    const startDate = dateString[0];
    const endDate = dateString[1];
    if (stationType === '1') {
      return changeAlarmStatisticStore({
        pvStartTime: startDate,
        pvEndTime: endDate,
        startTime: startDate,
        endTime: endDate,
      });
    }
    return changeAlarmStatisticStore({
      windStartTime: startDate,
      windEndTime: endDate,
      startTime: startDate,
      endTime: endDate,
    });
  };

  //设置tabs按钮的
  onChangeTab = (key) => {
    const { getStationsAlarmStatistic, changeAlarmStatisticStore, stationType, startTime, endTime, pageSize, pageNum, orderField, orderCommand, selectedStation } = this.props;
    // 电站code
    const stationCode = selectedStation.map(cur => cur.stationCode);
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
  };


  //筛选时间，出现日期框
  onChangeDuration = (value) => {
    const { changeAlarmStatisticStore, stationType } = this.props;
    let startDate, endDate;
    // 保留原来时间参数
    const commonFunc = () => {
      stationType === '1' && changeAlarmStatisticStore({
        pvStartTime: startDate,
        pvEndTime: endDate,
      });
      stationType === '0' && changeAlarmStatisticStore({
        windStartTime: startDate,
        windEndTime: endDate,
      });
    };
    // 天数对应方法
    const paramsObj = {
      other: () => {
        this.onFilterShowChange('timeSelect');
        changeAlarmStatisticStore({
          startTime: '',
          endTime: '',
        });
      },
      today: () => {
        startDate = moment().hour(0).minute(0).second(0).utc().format();
        endDate = moment().utc().format();
        commonFunc();
      },
      yesterday: () => {
        startDate = moment().subtract(1, 'days').startOf('day').format();
        endDate = moment().subtract(1, 'days').endOf('day').format();
        commonFunc();
      },
      last7: () => {
        startDate = moment().subtract(6, 'days').hour(0).minute(0).second(0).utc().format();
        endDate = moment().utc().format();
        commonFunc();
      },
      last30: () => {
        startDate = moment().subtract(29, 'days').hour(0).minute(0).second(0).utc().format();
        endDate = moment().utc().format();
        commonFunc();
      },
    };
    paramsObj[value]();
  };

  onCalendarChange = (dates) => {
    if (dates.length === 1) {
      this.start = dates[0].format('YYYY-MM-DD');
    } else {
      this.start = null;
    }
  };

  exportAlarm = () => {
    const { startTime, endTime, stationType, selectedStation } = this.props;
    this.props.exportAlarm({//导出
      stationCode: selectedStation.map(cur => cur.stationCode),
      startTime: moment(startTime).utc().format(),
      endTime: moment(endTime).endOf('day').utc().format(),
      stationType,
    });
  };

  disabledDate = (current) => {
    if (this.start) {
      const end = moment(this.start).add(30, 'days');
      return current > moment.min(moment().endOf('day'), end);
    }
    return current && current > moment().endOf('day');
  };

  // 查询
  onQueryFunc = () => {
    const { getStationsAlarmStatistic, startTime, endTime, selectedStation, stationType, pageSize, pageNum, orderField, orderCommand } = this.props;
    // 选中电站
    const stationCode = selectedStation.map(cur => cur.stationCode);
    getStationsAlarmStatistic({ stationType, stationCode, startTime, endTime, pageSize, pageNum, orderField, orderCommand });
  };

  selectStation = selectedStation => {
    const { changeAlarmStatisticStore } = this.props;
    changeAlarmStatisticStore({
      selectedStation: selectedStation,
    });
  };

  render() {
    const { showFilter, key } = this.state;
    const { stations, selectedStation, theme, startTime, endTime, allChartLoading } = this.props;
    const alarmStatisticOperation = handleRight('alarm_statistics_export');
    //数据导出按钮
    const operations = (
      <div className={styles.exportData}>
        <CneButton
          lengthMode="short"
          className={!allChartLoading ? styles.normalBtn : styles.disableBtn}
          onClick={this.exportAlarm}
        >
          数据导出
        </CneButton>
      </div >
    );

    return (
      <div className={styles.alarmStatisticType}>
        <div className={styles.filter}>
          <span style={{marginRight: '16px'}}>筛选条件</span>
          <StationSelect
            classNameStyle={`${styles.selectModalIcon}`}
            style={{ width: '200px', marginRight: '16px'}}
            multiple={true}
            stationShowNumber={true}
            data={stations.toJS()}
            onOK={this.selectStation}
            value={selectedStation}
            holderText="请输入关键字快速查询"
            theme={theme}
          />
          <Select placeholder="统计时间" style={{ width: 120, marginRight: '16px' }} onChange={this.onChangeDuration} defaultValue={'last7'}>
            <Option value="today">今天</Option>
            <Option value="yesterday">昨天</Option>
            <Option value="last7">最近7天</Option>
            <Option value="last30">最近30天</Option>
            <Option value="other">其他时间段</Option>
          </Select>
          <CneButton
            lengthMode="short"
            className={(selectedStation.length !== 0 && startTime && endTime) ? styles.normalBtn : styles.disableBtn}
            onClick={this.onQueryFunc}
          >
            查询
          </CneButton>
        </div>
        {showFilter !== '' && <div className={styles.filterBox}>
        {
          showFilter === 'timeSelect' &&
          <div className={styles.datePicker}>
            <RangePicker
              showTime={false}
              disabledDate={this.disabledDate}
              onCalendarChange={this.onCalendarChange}
              format="YYYY-MM-DD"
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChangeTime}
            />
          </div>
        }
        </div>}
        <Tabs animated={false} tabBarGutter={0} className={styles.tabContainer} activeKey={key} tabBarExtraContent={alarmStatisticOperation && operations} onChange={this.onChangeTab}>
          <TabPane
            tab={<i className="iconfont icon-drawing" />}
            key="graph"
          >
            <AlarmStatisticGraph {...this.props} />
          </TabPane>
          <TabPane
            tab={<i className="iconfont icon-table" />}
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

