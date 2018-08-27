import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Menu, Dropdown, Button, Icon, message, Tabs, DatePicker } from 'antd';
import styles from './alarmStatistic.scss';
import AlarmStatisticTable from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticTable.jsx';
import AlarmStatisticGraph from '../../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticGraph.jsx';
//import StationSelect from './StationSelect.jsx';
import StationFilter from '../AlarmFilter/StationFilter.jsx';

class AlarmStatisticByType extends Component {
  static propTypes = {

  }
  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      key: '1',
      //checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
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
  onTimeChange=(value, dateString)=> {
    console.log('Selected Time: ', value);//[Fri Aug 24 2018 19:37:08 GMT+0800,Mon Sep 17 2018 19:37:08 GMT+0800 (中国标准时间)]
    console.log('Formatted Selected Time: ', dateString);//["2018-08-24 19:37", "2018-09-17 19:37"]
    let startTime=value[0].utc().format();
    let endTime=value[1].utc().format();
    console.log(startTime,endTime);
  }
  onOk=(value)=> {
    console.log('onOk: ', value);
  }
  //设置tabs按钮的
  setkey = (activekey) => {
    this.setState({ key: activekey })
  }

  handleButtonClick = (e) => {
    message.info('Click on left button.');
    console.log('click left button', e);
  }

  handleStationMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }
//筛选时间，出现日期框
  handleDayMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
    e.key === '其他时间段' ? this.onFilterShowChange('timeSelect') : '啥都不干';

  }
  callback = (key) => {
    console.log(key);
  }
  

  render() {
    const { RangePicker } = DatePicker;
    const { showFilter } = this.state;
    let { key } = this.state;
    const TabPane = Tabs.TabPane;
    // const CheckboxGroup = Checkbox.Group;

    //时间筛选
    const dayMenu = (
      <Menu onClick={this.handleDayMenuClick}>
        <Menu.Item key="今天">今天</Menu.Item>
        <Menu.Item key="昨天">昨天</Menu.Item>
        <Menu.Item key="最近7天">最近7天</Menu.Item>
        <Menu.Item key="最近30天">最近30天</Menu.Item>
        <Menu.Item key="其他时间段">其他时间段</Menu.Item>
      </Menu>
    );

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
          <Dropdown.Button
            onClick={this.handleButtonClick}
            overlay={dayMenu}
            trigger={['click']}
            style={{ marginLeft: 8 }}
          >
            统计时间
          </Dropdown.Button>
        </div>
        <div className={styles.filterBox}>
          {/* 自己写的stationSelect组件,没用，暂保留 */}
          {/* {showFilter === 'stationSelect' && <StationSelect {...this.props} />} */}
          {showFilter === 'stationSelect' && <StationFilter {...this.props} />}          
          {
            showFilter === 'timeSelect' &&
            <div><RangePicker
            showTime={{ format: 'HH:mm' }}
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

        </Tabs>,

      </div>
    );
  }
}

export default AlarmStatisticByType;


// const plainOptions = ['Apple', 'Pear', 'Orange'];
// const defaultCheckedList = ['Apple', 'Orange'];


 //筛选电站里的tab和复选框
  // onChange = (checkedList) => {
  //   this.setState({
  //     checkedList,
  //     indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
  //     checkAll: checkedList.length === plainOptions.length,
  //   });
  // }
//复选框全选按钮
  // onCheckAllChange = (e) => {
  //   this.setState({
  //     checkedList: e.target.checked ? plainOptions : [],
  //     indeterminate: false,
  //     checkAll: e.target.checked,
  //   });
  // }