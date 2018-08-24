import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import DateFilter from '../AlarmFilter/DateFilter';
import StationTypeFilter from '../AlarmFilter/StationTypeFilter';
import StationFilter from '../AlarmFilter/StationFilter';
import DeviceTypeFilter from '../AlarmFilter/DeviceTypeFilter';
import AlarmTypeFilter from '../AlarmFilter/AlarmTypeFilter';
import AlarmLevelFilter from '../AlarmFilter/AlarmLevelFilter';
import RealTimeFilteredItems from './RealTimeFilteredItems';
import styles from './realTimeAlarm.scss';

class RealTimeAlarmFilter extends Component {
  static propTypes = {
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    deviceName: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
    };
  }
  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if(showFilter === filterText) {
      this.setState({
        showFilter: ''
      });
    } else{
      this.setState({
        showFilter: filterText
      });
    }
  }

  render() {
    const { showFilter } = this.state;
    return (
      <div className={styles.alarmFilter}>
        <div className={styles.topSearch}>
          <span className={styles.text}>筛选条件</span>
          <Button onClick={()=>this.onFilterShowChange('alarmLevel')}>
            告警级别{showFilter==='alarmLevel'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('stationType')}>
            电站类型{showFilter==='stationType'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('stationName')}>
            电站名称{showFilter==='stationName'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('deviceType')}>
            设备类型{showFilter==='deviceType'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('alarmType')}>
            告警类型{showFilter==='alarmType'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('time')}>
            发生时间{showFilter==='time'?<Icon type="up" />:<Icon type="down" />}
          </Button>
        </div>
        <div className={styles.filterBox}>
          {showFilter==='time' && <DateFilter {...this.props} />}
          {showFilter==='alarmLevel' && <AlarmLevelFilter {...this.props} />}
          {showFilter==='stationType' && <StationTypeFilter {...this.props} />}
          {showFilter==='stationName' && <StationFilter {...this.props} />}
          {showFilter==='deviceType' && <DeviceTypeFilter {...this.props} />}
          {showFilter==='alarmType' && <AlarmTypeFilter {...this.props} />}
        </div>
        <RealTimeFilteredItems {...this.props} onChangeFilter={this.onChangeFilter} />
      </div>
    );
  }

}

export default RealTimeAlarmFilter;