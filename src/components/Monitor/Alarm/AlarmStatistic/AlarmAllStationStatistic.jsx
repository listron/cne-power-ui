import React from "react";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import styles from './alarmStatistic';
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
   // this.props.getDefectTypes({stationType: 2});
    this.props.getStationsAlarmStatistic({
      "stationType":1,
      "stationCode":["360","56","380","340","393","504","350","394","392","301","302","391","401","402","406","407"],
      "startTime":"2018-08-01T10:17:00Z",
      "endTime":"2018-08-27T10:17:00Z"
        })
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
      <div style={{ marginRight: '50px' }}>
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