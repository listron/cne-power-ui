import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './alarmStatistic.scss';
import AlarmStatisticByType from './AlarmStatisticByType';
import AlarmStationSelectModal from './AlarmStationSelectModal';
const TabPane = Tabs.TabPane;
class ALarmAllStationStatistic extends React.Component {
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
    if (this.props.showPage === 'multiple') {
      const { stationCode, stations, orderField, orderCommand, pageSize, pageNum, startTime, endTime } = this.props;
      let stationType = this.props.stationType;
      const stationTypeOne = this.stationIsOneType();
      if (stationTypeOne) {
        stationType = stations.getIn([0, 'stationType']);
      }
      // this.props.getStationsAlarmStatistic({
      //   startTime,
      //   endTime,
      //   stationType,
      //   stationCode,
      //   pageSize,
      //   pageNum,
      //   orderField,
      //   orderCommand,
      // });
    }
  }

  onChangeFilter = (obj) => {
    const { stationType, stationCode, startTime, endTime, pageSize, pageNum, orderField, orderCommand } = this.props;
    const filter = {
      stationType,
      stationCode,
      startTime,
      endTime,
      pageSize,
      pageNum,
      orderField,
      orderCommand,
    };
    const newFilter = { ...filter, ...obj, pageNum: 1 };
    this.props.getStationsAlarmStatistic(newFilter);
  }

  onTableChange = (params) => {
    const { stationType, stationCode, startTime, endTime, pageSize, pageNum, orderField, orderCommand } = this.props;
    const filter = {
      stationType,
      stationCode,
      startTime,
      endTime,
      pageSize,
      pageNum,
      orderField,
      orderCommand,
    };
    this.props.getStationsAlarmStatistic({
      ...filter, ...params,
    });
  }

  onChangeStation = (stationCode) => {
    this.props.history.push(`/monitor/alarm/statistic/${stationCode}`);
    this.props.changeAlarmStatisticStore({
      showPage: 'single',
      singleStationCode: stationCode.toString(),
    });
  }


  stationIsOneType() {
    const { stations } = this.props;
    const length = stations.map(e => e.get('stationType')).toSet().size;
    return length === 1;//需求：只有一种类型,不显示tab;两种类型(风电/光伏)才显示tab
  }

  showStationSelect = () => {
    this.setState({
      showStationSelect: true,
    });
  }

  queryTargetData = (activeKey) => {
    const { stationCode, startTime, endTime, pageSize, pageNum, orderField, orderCommand } = this.props;
    this.props.getStationsAlarmStatistic({
      stationType: activeKey,
      stationCode,
      startTime,
      endTime,
      pageSize,
      pageNum,
      orderField,
      orderCommand,
    });
  }
  render() {
    const operations = (
      <div className={styles.operation} style={{ marginRight: '50px', color: '#199475' }} onClick={this.showStationSelect}>
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const { stationType, stations, changeAlarmStatisticStore } = this.props;
    const { showStationSelect } = this.state;
    const stationTypeOne = this.stationIsOneType();
    // console.log(stationTypeOne);
    return (
      <div className={styles.alarmStatistTabs}>
        {stationTypeOne ?
          <div className={styles.AlarmStatisticByTypeBox} >
            <div className={styles.singleAlarmFilter} >{operations}</div>
            <AlarmStatisticByType {...this.props} onChangeFilter={this.onChangeFilter} graphId="station" />
          </div>
          :
          <Tabs type="card" activeKey={stationType} tabBarExtraContent={operations} onChange={this.queryTargetData} >
            <TabPane tab="风电" key="0">
              <AlarmStatisticByType
                {...this.props}
                onChangeFilter={this.onChangeFilter}
                graphId="windStation"
                stations={this.props.stations.filter(item => item.get('stationType') === 0)}
              />
            </TabPane>
            <TabPane tab="光伏" key="1">
              <AlarmStatisticByType
                {...this.props}
                onChangeFilter={this.onChangeFilter}
                graphId="pvStation"
                onTableChange={this.onTableChange}
                stations={this.props.stations.filter(item => item.get('stationType') === 1)}
              />
            </TabPane>
          </Tabs>
        }
        {showStationSelect &&
          <AlarmStationSelectModal
            changeAlarmStatisticStore={changeAlarmStatisticStore}
            stations={stations}
            onClose={() => this.setState({ showStationSelect: false })}
            onChangeStation={this.onChangeStation} />}
      </div>
    );
  }
}
export default withRouter(ALarmAllStationStatistic);
