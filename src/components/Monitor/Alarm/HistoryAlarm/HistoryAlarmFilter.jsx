import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import StartTimeFilter from '../AlarmFilter/StartTimeFilter';
import EndTimeFilter from '../AlarmFilter/EndTimeFilter';
import StationTypeFilter from '../AlarmFilter/StationTypeFilter';
import StationFilter from '../AlarmFilter/StationFilter';
import DeviceTypeFilter from '../AlarmFilter/DeviceTypeFilter';
import AlarmTypeFilter from '../AlarmFilter/AlarmTypeFilter';
import AlarmLevelFilter from '../AlarmFilter/AlarmLevelFilter';
import DealResultFilter from '../AlarmFilter/DealResultFilter';
import HistoryFilteredItems from './HistoryFilteredItems';
import styles from './historyAlarm.scss';

class HistoryAlarmFilter extends Component {
  static propTypes = {
    stations: PropTypes.object,
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    startTime: PropTypes.array,
    endTime: PropTypes.array,
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
    const { stations } = this.props;
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
          <Button onClick={()=>this.onFilterShowChange('startTime')}>
            发生时间{showFilter==='startTime'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('endTime')}>
            结束时间{showFilter==='endTime'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('dealResult')}>
            处理结果{showFilter==='dealResult'?<Icon type="up" />:<Icon type="down" />}
          </Button>
        </div>
        <div className={styles.filterBox}>
          {showFilter==='startTime' && <StartTimeFilter {...this.props} />}
          {showFilter==='endTime' && <EndTimeFilter {...this.props} />}
          {showFilter==='alarmLevel' && <AlarmLevelFilter {...this.props} />}
          {showFilter==='stationType' && stations && stations.size > 0 && <StationTypeFilter {...this.props} />}
          {showFilter==='stationName' && <StationFilter {...this.props} />}
          {showFilter==='deviceType' && <DeviceTypeFilter {...this.props} />}
          {showFilter==='alarmType' && <AlarmTypeFilter {...this.props} />}
          {showFilter==='dealResult' && <DealResultFilter {...this.props} />}
        </div>
        <HistoryFilteredItems {...this.props} />
      </div>
    );
  }

}

export default HistoryAlarmFilter;