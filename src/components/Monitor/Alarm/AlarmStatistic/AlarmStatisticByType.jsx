import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Icon, message, Tabs, DatePicker, Select } from 'antd';
import styles from './alarmStatistic.scss';
import AlarmStatisticTable from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticTable.jsx';
import AlarmStatisticGraph from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticGraph.jsx';
import StationFilter from '../AlarmFilter/StationFilter.jsx';

class AlarmStatisticByType extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    onChangeFilter: PropTypes.func,

  }
  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      key: '1',
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
  onTimeChange = (value, dateString) => {
    console.log('Selected Time: ', value);//[Fri Aug 24 2018 19:37:08 GMT+0800,Mon Sep 17 2018 19:37:08 GMT+0800 (中国标准时间)]
    console.log('Formatted Selected Time: ', dateString);//["2018-08-24 19:37", "2018-09-17 19:37"]
    let startTime = value[0].utc().format();
    let endTime = value[1].utc().format();
    console.log(startTime, endTime);

    this.props.onChangeFilter({
      // startTime,
      // endTime
    });
  }
  onOk = (value) => {
    console.log('onOk: ', value);
  }
  //设置tabs按钮的
  setkey = (activekey) => {
    this.setState({ key: activekey })
  }



  handleStationMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }
  //筛选时间，出现日期框
  handleDayMenuClick = (e) => {
    //const{startTime, endTime}=this.props;
    let startTime=moment(0,'HH').utc().format();
    let endTime=moment().utc().format();
    if(e.key === '今天'){
      startTime=moment(0,'HH').utc().format();
      endTime=moment().utc().format();
    }else if(e.key === '昨天'){
    startTime=moment(0,'HH').subtract(1,'day').utc().format();
    endTime=moment().subtract(1,'day').endOf('day').utc().format();     
    }else if(e.key === '最近7天'){
      startTime=moment(0,'HH').subtract(7,'day').utc().format();
      endTime=moment().utc().format();
    }else if(e.key === '最近30天'){
      startTime=moment(0,'HH').subtract(30,'day').utc().format();
      endTime=moment().utc().format();
    }
    e.key === '其他时间段' ? this.onFilterShowChange('timeSelect') : '啥都不干';
   
    this.props.onChangeFilter({
      startTime,
      endTime
    });
  }
  callback = (key) => {
    console.log(key);
  }

  render() {
    const { RangePicker } = DatePicker;
    const Option = Select.Option;
    const { showFilter } = this.state;
    let { key } = this.state;
    const TabPane = Tabs.TabPane;
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
        <div>
          <span> 筛选条件 </span>
          <Button onClick={() => this.onFilterShowChange('stationSelect')}>
            电站类型{showFilter === 'stationSelect' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Select labelInValue defaultValue={{ key: '今天' }} style={{ width: 120 }} onChange={this.handleDayMenuClick}>
            <Option value="今天">今天</Option>
            <Option value="昨天">昨天</Option>
            <Option value="最近7天">最近7天</Option>
            <Option value="最近30天">最近30天</Option>
            <Option value="其他时间段">其他时间段</Option>
          </Select>

        </div>
        <div className={styles.filterBox}>     
          {showFilter === 'stationSelect' && <StationFilter {...this.props} />}
          {
            showFilter === 'timeSelect' &&
            <div><RangePicker
              showTime={false}
              format="YYYY-MM-DD HH:mm"
              placeholder={['Start Time', 'End Time']}
              onChange={this.onTimeChange}
              onOk={this.onOk}
            /></div>
          }
        </div>
        <Tabs activeKey={key} tabBarExtraContent={operations} onChange={this.setkey}>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-grid"></i>
              </span>
            }
            key="1"
          >
            <AlarmStatisticGraph  {...this.props} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-table"></i>
              </span>
            }
            key="2"
          >
            <AlarmStatisticTable {...this.props} />

          </TabPane>

        </Tabs>

      </div>
    );
  }
}

export default AlarmStatisticByType;

