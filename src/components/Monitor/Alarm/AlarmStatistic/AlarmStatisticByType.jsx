import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Icon, Tabs, DatePicker, Select } from 'antd';
import styles from './alarmStatistic.scss';
import AlarmStatisticTable from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticTable.jsx';
import AlarmStatisticGraph from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticGraph.jsx';
import StationFilter from '../AlarmFilter/StationFilter.jsx';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class AlarmStatisticByType extends Component {
  static propTypes = {
    stationCode: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      key: 'graph',
    }
  }
  //点击插入要显示内容
  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if (showFilter === filterText) {
      this.setState({
        showFilter: ''
      })
    } else {
      this.setState({
        showFilter: filterText
      })
    }
  }

  //改变时间的
  onChangeTime = (value, dateString) => {
    let startTime = value[0].utc().format();
    let endTime = value[1].utc().format();

    this.props.onChangeFilter({
      startTime,
      endTime
    });
  }

  
  //设置tabs按钮的
  onChangeTab = (activekey) => {
    this.setState({ key: activekey })
  }

  //筛选时间，出现日期框
  onChangeDuration = (value) => {
    let startTime, endTime;
    if(value === 'other') {
      this.onFilterShowChange('timeSelect');
    } else {
      if(value === 'today') {
        startTime = moment().hour(0).minute(0).second(0).utc().format();
        endTime = moment().utc().format();
      } else if(value === 'yesterday') {
        startTime = moment().subtract(1, 'days').hour(0).minute(0).second(0).utc().format();
        endTime = moment().subtract(1, 'days').hour(23).minute(59).second(59).utc().format();
      } else if(value === 'last7') {
        startTime = moment().subtract(7, 'days').utc().format();
        endTime = moment().utc().format();
      } else if(value === 'last30') {
        startTime = moment().subtract(30, 'days').utc().format();
        endTime = moment().utc().format();
      }
      this.props.onChangeFilter({
        startTime,
        endTime
      });
    }
  }

  render() {
    const { showFilter, key } = this.state;

    //数据导出按钮
    const operations = (
      <div className={styles.exportData}>
        <button style={{
          color: '#199475',
          background: 'rgba(0,0,0,0)',
          borderRadius: '5px',
          border: '1px solid #199475',
        }}>数据导出</button>
      </div >
    );
    return (
      <div className={styles.alarmStatisticType}>
        <div className={styles.filter}>
          <span>筛选条件</span>
          <Button className={styles.stationType} onClick={() => this.onFilterShowChange('stationSelect')}>
            电站类型{showFilter === 'stationSelect' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Select placeholder="统计时间" style={{ width: 120 }} onChange={this.onChangeDuration}>
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
              format="YYYY-MM-DD HH:mm"
              placeholder={['Start Time', 'End Time']}
              onChange={this.onChangeTime}
            /></div>
          }
        </div>}
        <Tabs activeKey={key} tabBarExtraContent={operations} onChange={this.onChangeTab}>
          <TabPane
            tab={<i className="iconfont icon-grid"></i>}
            key="graph"
          >
            <AlarmStatisticGraph  {...this.props} />
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

