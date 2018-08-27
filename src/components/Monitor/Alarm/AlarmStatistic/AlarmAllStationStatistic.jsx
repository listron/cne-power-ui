import React from "react";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import styles from './alarmStatistic.scss';
import AlarmStatisticByType from './AlarmStatisticByType';
const TabPane = Tabs.TabPane;


class ALarmAllStationStatistic extends React.Component {
  static propTypes = {
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    getStationsAlarmStatistic: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { stationType, stationCode, startTime, endTime } = this.props;
    this.props.getStationsAlarmStatistic({
      stationType,
      stationCode,
      startTime,
      endTime,
    });
  }

  onChangeFilter = (obj) => {
    const { stationType, stationCode, startTime, endTime } = this.props;
    let filter = {
      stationType,
      stationCode,
      startTime,
      endTime,
    }
    let newFiter = Object.assign({}, filter, obj);
    this.props.getStationsAlarmStatistic(newFiter);
  }

  queryTargetData = (activeKey) => {
    const { stationCode, startTime, endTime } = this.props;
    this.props.getStationsAlarmStatistic({
      stationType: activeKey,
      stationCode,
      startTime,
      endTime,
    });
  }

  render() {
    const operations = (
      <div style={{ marginRight: '50px',color:'#199475' }}>
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const { stationType }  = this.props;
    return (
      <div className={styles.alarmStatistTabs}>
        <div className="tabsContainer">
          <Tabs type="card" activeKey={stationType} tabBarExtraContent={operations} onChange={this.queryTargetData} >
            <TabPane tab="风电" key="0">
              <AlarmStatisticByType {...this.props} onChangeFilter={this.onChangeFilter} graphId="windStation" />
            </TabPane>
            <TabPane tab="光伏" key="1">
              <AlarmStatisticByType {...this.props} onChangeFilter={this.onChangeFilter} graphId="pvStation" />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default ALarmAllStationStatistic;