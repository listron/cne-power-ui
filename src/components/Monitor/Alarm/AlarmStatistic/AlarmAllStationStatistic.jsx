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
    endTime: PropTypes.string,
    history: PropTypes.object,
    getStationsAlarmStatistic: PropTypes.func,
    showPage: PropTypes.string,
    changeAlarmStatisticStore: PropTypes.func,
    pvSelectTime: PropTypes.string,
    windSelectTime: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
    };
  }
  componentDidMount() {
    if (this.props.showPage === 'multiple') {
      const { stations } = this.props;
      let stationType = this.props.stationType;
      const stationTypeOne = this.stationIsOneType();
      if (stationTypeOne) {
        stationType = stations.getIn([0, 'stationType']);
      }
    }
  }

  onChangeStation = (stationCode) => {
    this.props.changeAlarmStatisticStore({
      showPage: 'single',
      allChartLoading: false,
      singleStationCode: stationCode.toString(),
    });
    this.props.history.push(`/monitor/alarm/statistic/${stationCode}`);
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
    this.props.changeAlarmStatisticStore({
      stationType: activeKey,
      stationCode: [],
      alarmStatistic: [],
      allChartLoading: false,
      selectedStation: [],
    });
  }
  render() {
    const operations = (
      <div className={styles.operation} onClick={this.showStationSelect}>
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const { stationType, stations } = this.props;
    const { showStationSelect } = this.state;
    const stationTypeOne = this.stationIsOneType();
    return (
      <div className={styles.alarmStatistTabs}>
        {stationTypeOne ?
          <div className={styles.AlarmStatisticByTypeBox} >
            <div className={styles.singleAlarmFilter} >{operations}</div>
            <AlarmStatisticByType
              {...this.props}
              graphId="station" />
          </div>
          :
          <div className={styles.alarmStatisticContent}>
            <div className={styles.alarmStatisticTop}>
              <div className={styles.typeTabs}>
                <p className={`${stationType === '0' && styles.activeKey} `} onClick={() => { this.queryTargetData('0'); }}>风电</p>
                <p className={`${stationType === '1' && styles.activeKey} `} onClick={() => { this.queryTargetData('1'); }}>光伏</p>
              </div>
              {operations}
            </div>
            {stationType === '0' && <div className={styles.dataCenter}>
              <AlarmStatisticByType
                {...this.props}
                graphId="windStation"
                stations={this.props.stations.filter(item => item.get('stationType') === 0)}
              />
            </div>}
            {stationType === '1' && <div className={styles.dataCenter}>
              <AlarmStatisticByType
                {...this.props}
                graphId="pvStation"
                stations={this.props.stations.filter(item => item.get('stationType') === 1)}
              />
            </div>}
          </div>
        }
        {showStationSelect &&
          <AlarmStationSelectModal
            stations={stations}
            onClose={() => this.setState({ showStationSelect: false })}
            onChangeStation={this.onChangeStation}
          />}
      </div>
    );
  }
}
export default withRouter(ALarmAllStationStatistic);
