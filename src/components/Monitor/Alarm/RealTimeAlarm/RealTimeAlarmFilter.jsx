import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import DateFilter from '../AlarmFilter/DateFilter';
import StationTypeFilter from '../AlarmFilter/StationTypeFilter';
import StationFilter from '../AlarmFilter/StationFilter';
import DeviceTypeFilter from '../AlarmFilter/DeviceTypeFilter';
import AlarmTypeFilter from '../AlarmFilter/AlarmTypeFilter';
import AlarmLevelFilter from '../AlarmFilter/AlarmLevelFilter';
import FilteredItems from '../AlarmFilter/FilteredItems';
import styles from './alarmFilter.scss';

class RealTimeAlarmFilter extends Component {
  static propTypes = {
    warningLevel: PropTypes.string,
    stationType: PropTypes.string,
    stationCode: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    warningConfigName: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    deviceName: PropTypes.string,
    getRealTimeAlarm: PropTypes.func,
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

  onChangeFilter = (obj) => {
    const { warningLevel, stationCode, deviceTypeCode, warningConfigName, startTime, endTime, deviceName } = this.props;
    let filter = {
      warningLevel,
      stationCode,
      deviceTypeCode,
      warningConfigName,
      startTime,
      endTime,
      deviceName
    }
    let newFiter = Object.assign({}, filter, obj);
    this.props.getRealTimeAlarm(newFiter);
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
          <Button onClick={()=>this.onFilterShowChange('stationName')}>
            发生时间{showFilter==='time'?<Icon type="up" />:<Icon type="down" />}
          </Button>
        </div>
        <div className={styles.filterBox}>
          {showFilter==='time' && <DateFilter {...this.props} onChangeFilter={this.onChangeFilter} />}
          {showFilter==='alarmLevel' && <AlarmLevelFilter {...this.props} onChangeFilter={this.onChangeFilter} />}
          {showFilter==='stationType' && <StationTypeFilter {...this.props} onChangeFilter={this.onChangeFilter} />}
          {showFilter==='stationName' && <StationFilter {...this.props} onChangeFilter={this.onChangeFilter} />}
          {showFilter==='deviceType' && <DeviceTypeFilter {...this.props} onChangeFilter={this.onChangeFilter} />}
          {showFilter==='alarmType' && <AlarmTypeFilter {...this.props} onChangeFilter={this.onChangeFilter} />}
        </div>
        <FilteredItems {...this.props} onChangeFilter={this.onChangeFilter} />
      </div>
    );
  }

}

export default RealTimeAlarmFilter;