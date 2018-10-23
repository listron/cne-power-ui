import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { Tabs, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './allStationStatistic.scss';
import BarGraph from './CommonGraph/BarGraph/index.js';
import TargetStatisticPieGraph from './TargetStatisticPieGraph.jsx';
import moment from 'moment';
// import AlarmStatisticByType from './AlarmStatisticByType';
import StationSelectModal from './StationSelectModal.jsx';
import TimeSelect from '../../../Common/TimeSelect';
import PlanCompletionRate from './CommonGraph/PlanCompletionRate';
import TargetTabs from './TargetTabs.jsx';
import ChangeStation from '../../../Monitor/StationMonitor/SingleStation/SingleStationCommon/ChangeStation';
import TableGraph from './CommonGraph/TableGraph';
import ThreeYaxis from './CommonGraph/ThreeYaxis';
import PlanCompleteRateAnalysisBar from './CommonGraph/PlanCompleteRateAnalysisBar';
import LightResource from './CommonGraph/LightResource';
import CurrentMonthCompleteRate from './CommonGraph/CurrentMonthCompleteRate';



class AllStationStatistic extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    showPage: PropTypes.string,
    changeAllStationStore: PropTypes.func,
    getSingleStationYearTargetData: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
      showStationList: false,
    };
  }
  componentDidMount() {
    const { year, dateType, stationCode, getSingleStationYearTargetData } = this.props;
    console.log(stationCode);
    const currentYear = moment().format('YYYY');
    const curYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    let time = year ? year : [`${currentYear}`];
    //console.log(time);

    this.props.changeAllStationStore({ year: [`${currentYear}`], month: currentMonth })

    getSingleStationYearTargetData(
      {
        stationCode,
        year: time,
        dateType,
      }
    )



  }

  onClose = () => {
    this.props.changeAllStationStore({
      showPage: 'multiple',
      singleStationCode: ''
    });
  }
  showStationSelect = () => {
    this.setState({
      showStationSelect: true
    });
  }

  hideStationChange = () => {
    this.setState({
      showStationSelect: false
    });
  }


  render() {
    const TabPane = Tabs.TabPane;
    const pathAllStation = "/statistical/stationaccount/allstation";
    const operations = (
      <div className={styles.operation} style={{ marginRight: '50px', color: '#199475' }} onClick={this.showStationSelect}>
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );
    const { stationType, stations, dateType, singleStationCode, singleAlarmSummary } = this.props;
    console.log(stations.toJS());
    const { showStationSelect } = this.state;
    const stationItem = stations.find(station => station.get('stationCode').toString() === singleStationCode).toJS();
    //拿到单电站的类型，弄个数组，把对应的iconfont加上，在下面调用
    console.log(stationItem);
    return (
      <div className={styles.singleStationType}>
        <div className={styles.componentContainer}>
          <div className={styles.title}>
            {showStationSelect &&
              <ChangeStation stations={stations.toJS()} stationName={stationItem.stationName} baseLinkPath="/statistical/stationaccount/allstation" hideStationChange={this.hideStationChange} />
            }
            <div className={styles.titleLeft}>
              <div onClick={() => this.setState({ showStationSelect: true })} className={styles.stationName}>
                <Icon className={styles.icon} type="swap" /><span>{stationItem.stationName}</span>
              </div>
              <div className={styles.stationStatus}>
                <div className={styles.status}>
                  <span className={styles.stationIcon}><i className="iconfont icon-pvlogo"></i></span>
                  {`电站名-区域：${singleAlarmSummary && singleAlarmSummary.stationStatusName ? singleAlarmSummary.stationStatusName : '- -'}`}
                </div>
                <div className={styles.time}>
                  <span className={styles.gridTime}>并网时间：2018年3月10号</span>
                  <span className={styles.deadline}>数据统计截止时间8月20日</span>
                </div>
              </div>
            </div>
            <Link to="/statistical/stationaccount/allstation">
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onClose} />
            </Link>
          </div>
          <TimeSelect text={'统计时间选择'} day={true} {...this.props} />
          <PlanCompletionRate {...this.props} dateType={dateType} />
          <div className={styles.targetGraphContainer}>
            {dateType === 'year' && <div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    graphId={'power'}
                    yAxisName={'发电量 (万kWh)'}
                    xAxisName={'发电量'}
                    dateType={dateType}
                  />
                  <TableGraph />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'yearPowerEfficency'}
                    // dateType={dateType}
                    title='发电效率'
                  />
                  <TableGraph />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    graphId={'yearLostPower'}
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'损失电量'}
                    title={'损失电量同比'}
                    dateType={dateType} />
                  <TableGraph />
                </div>
              </div>
            </div>}
            {dateType === 'month' && <div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>发电量分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    graphId={'power'}
                    yAxisName={'发电量 (万kWh)'}
                    xAxisName={'发电量'}
                    dateType={dateType}
                  />
                  <TargetStatisticPieGraph pieGraphId={'powerPie'} />
                </div>
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>计划完成率分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <PlanCompleteRateAnalysisBar graphId={'planCompleteRate'} yAxisName={'发电量 (万kWh)'} dateType={dateType} title={'计划完成率'} />
                  <TableGraph />
                </div>
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>发电效率分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <LightResource
                    graphId={'MonthlightResource'}
                    yAxisName={'辐射总量 (万kWh)'}
                    xAxisName={'辐射总量'}
                    dateType={dateType}
                    title='光资源同比' />
                  <TableGraph />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'powerEfficency'}
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'发电量'}
                    dateType={dateType}
                    title='发电效率'
                  />
                  <TableGraph />
                </div>
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>损失电量分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    graphId={'lostPower'}
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'损失电量'}
                    title={'损失电量同比'}
                    dateType={dateType} />
                  <TableGraph />
                </div>
              </div>
            </div>}
            {dateType === 'day' && <div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>发电量同比</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    graphId={'dayPower'}
                    yAxisName={'发电量 (万kWh)'}
                    xAxisName={'发电量'}
                    dateType={dateType}
                  />
                  <TableGraph />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <CurrentMonthCompleteRate
                  graphId={'CurrentMonthCompleteRate'}
                  title={'当月累计完成率'}
                  yAxisName={'当月累计完成率'}
                  xAxisName={'累计完成率'}
                />
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>发电量效率分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'dayPowerEfficency'}
                    title='发电效率'
                  />
                  <TableGraph />
                </div>
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>损失电量分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    graphId={'dayLostPower'}
                    yAxisName={'发电量 (万kWh)'}
                    xAxisName={'损失电量同比'}
                    dateType={dateType}
                    title={'损失电量同比'}
                  />
                  <TableGraph />
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div >
    );
  }
}
export default withRouter(AllStationStatistic);
