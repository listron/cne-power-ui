import React from "react";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import { withRouter} from 'react-router-dom';
import styles from './alarmStatistic.scss';
import AlarmStatisticByType from './AlarmStatisticByType';
import AlarmStationSelectModal from './AlarmStationSelectModal';
const TabPane = Tabs.TabPane;
class ALarmAllStationStatistic extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    history: PropTypes.object,
    getStationsAlarmStatistic: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false
    };
  }
  componentDidMount() {
    const { stationCode, startTime, endTime, stations } = this.props;
    let stationType = this.props.stationType;
    const stationTypeOne = this.stationIsOneType();
    if(stationTypeOne) {
      stationType = stations.getIn([0, 'stationType']);
    }
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
    let newFilter = Object.assign({}, filter, obj);
    console.log(newFilter);
    this.props.getStationsAlarmStatistic(newFilter);
  }

  onChangeStation = (stationCode) => {
    this.props.history.push(`/monitor/alarm/statistic/${stationCode}`);
  }


  stationIsOneType() {
    const { stations } = this.props;
    const length = stations.map(station => station.get('stationCode')).toSet().size;
    return length === 1;
  }

  showStationSelect = () => {
    this.setState({
      showStationSelect: true
    });
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
      <div className={styles.operation} style={{ marginRight: '50px',color:'#199475' }} onClick={this.showStationSelect}>
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const { stationType, stations }  = this.props;
    const { showStationSelect } = this.state;
    const stationTypeOne = this.stationIsOneType();
    return (
      <div className={styles.alarmStatistTabs}>
        {stationTypeOne ? 
        <AlarmStatisticByType {...this.props} onChangeFilter={this.onChangeFilter} graphId="station" /> :
        <Tabs type="card" activeKey={stationType} tabBarExtraContent={operations} onChange={this.queryTargetData} >
          <TabPane tab="风电" key="0">
            <AlarmStatisticByType {...this.props} onChangeFilter={this.onChangeFilter} graphId="windStation" />
          </TabPane>
          <TabPane tab="光伏" key="1">
            <AlarmStatisticByType {...this.props} onChangeFilter={this.onChangeFilter} graphId="pvStation" />
          </TabPane>
        </Tabs>
        }
        {showStationSelect&&
          <AlarmStationSelectModal 
            stations={stations} 
            onClose={()=>this.setState({showStationSelect:false})}
            onChangeStation={this.onChangeStation} />}
      </div>
    );
  }
}
export default withRouter(ALarmAllStationStatistic);