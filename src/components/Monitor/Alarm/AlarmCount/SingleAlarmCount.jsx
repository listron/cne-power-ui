import React from "react";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import styles from './alarmCount.scss';
const TabPane = Tabs.TabPane;


class SingleAlarmCount extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    history: PropTypes.object,
    getStationsAlarmStatistic: PropTypes.func,
    showPage: PropTypes.string,
    changeAlarmStatisticStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
    };
  }
  
  componentDidMount() {
   
  }


 

  render() {
    const operations = (
      <div className={styles.operation} style={{ marginRight: '50px',color:'#199475' }} onClick={this.showStationSelect}>
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );
    return (
      <div className={styles.singleAlarmCount}>
         测试2
      </div>
    );
  }
}
export default SingleAlarmCount;