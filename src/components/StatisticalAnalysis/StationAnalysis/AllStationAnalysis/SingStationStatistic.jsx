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
    SingleStationStatisticData: PropTypes.object,
    singleAlarmSummary: PropTypes.object,
    singleStationCode: PropTypes.string,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    SingleStationPowerData: PropTypes.array,
    SingleStationLostPowerData: PropTypes.array,
    showPage: PropTypes.string,
    dateType: PropTypes.string,
    changeAllStationStore: PropTypes.func,
    getSingleStationTargetData: PropTypes.func,
    getSingleStationStatisticData: PropTypes.func,
    getSingleStationMonthPieData: PropTypes.func,
    getSingleStationPlanRateData: PropTypes.func,
    getSingleStationPvCompareData: PropTypes.func,
    getSingleStationPowerEffectiveData: PropTypes.func,
    getSingleStationDayCompleteRateData: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
      showStationList: false,
    };
  }
  componentDidMount() {
    const { year, dateType, singleStationCode, getSingleStationStatisticData, getSingleStationPvCompareData, getSingleStationPowerEffectiveData, getSingleStationTargetData, getSingleStationPlanRateData, getSingleStationMonthPieData } = this.props;
    //console.log(singleStationCode);
    const currentYear = moment().format('YYYY');
    const curYear = Number(moment().format('YYYY'));
    const curYearArray = [moment().format('YYYY')]
    const currentMonth = Number(moment().format('MM'));
    //let time = year ? year : [`${currentYear}`];
    //console.log(time);

    this.props.changeAllStationStore({ year: [`${currentYear}`], month: currentMonth })

    getSingleStationStatisticData(
      {
        stationCode: singleStationCode,
        year: currentYear,
        dateType,
      }
    )
    //发电量和损失电量两个请求
    getSingleStationTargetData({
      stationCode: singleStationCode,
      dateType,
      // dataType:'power',
      year: curYearArray,
      sort: 'date',
      sortType: 'asc',
    })
    getSingleStationMonthPieData({
      stationCode: singleStationCode,
      year: curYear
    })
    getSingleStationPlanRateData({
      stationCode: singleStationCode,
      year: curYearArray,
      dateType,
      sort: 'date',
      sortType: 'asc',

    })
    getSingleStationPvCompareData({
      stationCode: singleStationCode,
      year: curYear,
      dateType,
      sort: 'date',
      sortType: 'asc',
    })
    getSingleStationPowerEffectiveData({
      stationCode: singleStationCode,
      year: curYearArray,
      dateType,
      sort: 'date',
      sortType: 'asc',
    })

  }
  componentWillReceiveProps(nextProps) {
    const { year, dateType, singleStationCode, getSingleStationStatisticData, getSingleStationPowerEffectiveData, getSingleStationPvCompareData, getSingleStationTargetData, getSingleStationPlanRateData, getSingleStationMonthPieData, getSingleStationDayCompleteRateData } = this.props;
    const currentYear = [moment().format('YYYY')];
    const currentTableYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    const curYearNum=nextProps.year[0].split('-')[0];
    const curMonthNum=nextProps.year[0].split('-')[1];
    // console.log(curYearNum,curMonthNum);

    const curMonth = moment().format('YYYY-MM');
    const curMmonthArray = [moment().format('YYYY-MM')]

    const curYear = Number(nextProps.year)
    const curYearPlan = Number(nextProps.year[nextProps.year.length - 1]);
    const selectYear = [Number(moment().subtract(5, 'year').format('YYYY')), Number(moment().format('YYYY'))];
    let rangeYear = [];
    for (let i = selectYear[0]; i < selectYear[1] + 1; i++) {
      rangeYear.push(i.toString())
    }


    //月->月
    if (dateType === 'month' && nextProps.dateType === 'month') {
      if (nextProps.year[0] !== this.props.year[0]) {
        getSingleStationStatisticData(
          {
            stationCode: singleStationCode,
            year: nextProps.year[0],
            dateType,
          }
        )
        //发电量和损失电量两个请求
        getSingleStationTargetData({
          stationCode: singleStationCode,
          dateType,
          // dataType:'power',
          year: nextProps.year,
          sort: 'date',
          sortType: 'asc',
        })
        getSingleStationMonthPieData({
          stationCode: singleStationCode,
          year: curYear
        })
        getSingleStationPlanRateData({
          stationCode: singleStationCode,
          year: nextProps.year,
          dateType,
          sort: 'date',
          sortType: 'asc',

        })
        getSingleStationPvCompareData({
          stationCode: singleStationCode,
          year: curYear,
          dateType,
          sort: 'date',
          sortType: 'asc',
        })
        getSingleStationPowerEffectiveData({
          stationCode: singleStationCode,
          year: nextProps.year,
          dateType,
          sort: 'date',
          sortType: 'asc',
        })
      }
    }
    //月/年->日
    if (dateType !== nextProps.dateType && nextProps.dateType === 'day') {
      getSingleStationStatisticData(
        {
          stationCode: singleStationCode,
          year: curMonth,
          dateType,
        }
      )
      //发电量和损失电量两个请求
      getSingleStationTargetData({
        stationCode: singleStationCode,
        dateType,
        // dataType:'power',
        year: curMmonthArray,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationDayCompleteRateData({
        stationCode: singleStationCode,
        year: currentTableYear,
        month: currentMonth
      })

      getSingleStationPowerEffectiveData({
        stationCode: singleStationCode,
        year: currentYear,
        month: currentMonth,
        dateType,
        sort: 'date',
        sortType: 'asc',
      })


    }
    //日->日
    if (dateType === 'day' && nextProps.dateType === 'day') {
      if (nextProps.year[0] !== this.props.year[0]) {

        getSingleStationStatisticData(
          {
            stationCode: singleStationCode,
            year: nextProps.year[0],
            dateType,
          }
        )
        //发电量和损失电量两个请求
        getSingleStationTargetData({
          stationCode: singleStationCode,
          dateType,
          // dataType:'power',
          year: nextProps.year,
          sort: 'date',
          sortType: 'asc',
        })
        getSingleStationDayCompleteRateData({
          stationCode: singleStationCode,
          year: curYearNum,
          month: curMonthNum
        })

        getSingleStationPowerEffectiveData({
          stationCode: singleStationCode,
          year: [curYearNum],
          month: curMonthNum,
          dateType,
          sort: 'date',
          sortType: 'asc',
        })
      }
    }

    //月/日->年
    if (dateType !== nextProps.dateType && nextProps.dateType === 'year') {


    }
    //年/日->月
    if (dateType !== nextProps.dateType && nextProps.dateType === 'month') {

    }
    //年->年
    if (dateType === 'year' && nextProps.dateType === 'year') {
      if (nextProps.year[0] !== this.props.year[0] || nextProps.year[1] !== this.props.year[1]) {




      }
    }
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
    const { stationType, stations, dateType, singleStationCode, singleAlarmSummary, year, SingleStationStatisticData, showPage, SingleStationTargetData, SingleStationPlanRateData, SingleStationPvCompareData, getSingleStationPowerEffectiveData, SingleStationPowerData, SingleStationLostPowerData, SingleStationMonthPieData, SingleStationPlanRate, SingleStationDayCompleteRateData, SingleStationPowerEffectiveData } = this.props;
    const currentYear = parseInt(year).toString();
    const lastYear = (parseInt(year) - 1).toString();
    //console.log(currentYear,lastYear);
    //发电量数据
    const barGraphThatYear = SingleStationPowerData.map((e, i) => (e.thatYearData))
    const barGraphLastYear = SingleStationPowerData.map((e, i) => (e.lastYearData))
    const barGraphmonth = SingleStationPowerData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`))
    const barGraphYearOnYear = SingleStationPowerData.map((e, i) => (e.yearOnYear))
    //单电站累计完成率

    const dayCompleteRateThatYearData = SingleStationDayCompleteRateData.map((e, i) => (e.thatYearData))
    const dayCompleteRateLastYearData = SingleStationDayCompleteRateData.map((e, i) => (e.lastYearData))
    const dayCompleteRateDateData = SingleStationDayCompleteRateData.map((e, i) => (`${e.day}日`))
    const dayCompleteRate = SingleStationDayCompleteRateData.map((e, i) => (e.yearOnYear))
    //发电量饼图
    const pieData = SingleStationMonthPieData.map((e, i) => ({ value: Number(e.monthPower), name: `${e.month}月` }));
    const pieCompleteValue = Number(SingleStationPlanRate)
    const pieComplete = [{ value: pieCompleteValue, name: '已完成' }, { value: 100 - pieCompleteValue, name: '未完成' }];
    // console.log(pieData, pieComplete);
    //计划完成率
    console.log(SingleStationPlanRateData);
    const xAxisData = SingleStationPlanRateData.map((e, i) => (`${e.date}月`))
    const planPowerData = SingleStationPlanRateData.map((e, i) => (e.planPower))
    const actualPowerData = SingleStationPlanRateData.map((e, i) => (e.actualPower))
    const planRateData = SingleStationPlanRateData.map((e, i) => (e.per))
    //光资源分析

    const lightCompareDataThatYear = SingleStationPvCompareData.map((e, i) => (e.thatYearData))
    const lightCompareDataLastYear = SingleStationPvCompareData.map((e, i) => (e.lastYearData))
    const lightCompareDataDate = SingleStationPvCompareData.map((e, i) => (`${e.monthOrDay}月`))
    const lightCompareDataLight = SingleStationPvCompareData.map((e, i) => (e.lightYearOnYear))
    const lightCompareDataPower = SingleStationPvCompareData.map((e, i) => (e.powerYearOnYear))

    //发电效率分析
    const PowerEffectiveDateData = SingleStationPowerEffectiveData.map((e, i) => (`${e.date}月`))
    const PowerEffectiveHoursData = SingleStationPowerEffectiveData.map((e, i) => (e.hours))
    const PowerEffectiveLightData = SingleStationPowerEffectiveData.map((e, i) => (e.light))
    const PowerEffectivePrData = SingleStationPowerEffectiveData.map((e, i) => (e.pr))



    //损失电量数据
    const lostPowerThatYear = SingleStationLostPowerData.map((e, i) => (e.thatYearData))
    const lostPowerLastYear = SingleStationLostPowerData.map((e, i) => (e.lastYearData))
    const lostPowermonth = SingleStationLostPowerData.map((e, i) => (`${e.date}月`))
    const lostPowerYearOnYear = SingleStationLostPowerData.map((e, i) => (e.yearOnYear))
    //console.log(singleStationCode);
    //console.log(stations.toJS());
    const { showStationSelect } = this.state;
    const stationItem = stations.find(station => station.get('stationCode').toString() === singleStationCode).toJS();
    //拿到单电站的类型，弄个数组，把对应的iconfont加上，在下面调用
    //console.log(stationItem);





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
                  <span className={styles.deadline}>数据统计截止时间10月24日</span>
                </div>
              </div>
            </div>
            <Link to="/statistical/stationaccount/allstation">
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onClose} />
            </Link>
          </div>
          <TimeSelect text={'统计时间选择'} day={true} {...this.props} />
          <PlanCompletionRate dateType={dateType} AllStationStatisticData={SingleStationStatisticData} showPage={showPage} />
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
                    title="发电效率"
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
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={barGraphThatYear}
                    barGraphLastYear={barGraphLastYear}
                    barGraphmonth={barGraphmonth}
                    barGraphYearOnYear={barGraphYearOnYear}
                  />
                  <TargetStatisticPieGraph pieGraphId={'powerPie'} pieData={pieData} pieComplete={pieComplete} />
                </div>
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>计划完成率分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <PlanCompleteRateAnalysisBar graphId={'planCompleteRate'} yAxisName={'发电量 (万kWh)'} dateType={dateType} title={'计划完成率'} xAxisData={xAxisData} planPowerData={planPowerData} actualPowerData={actualPowerData} planRateData={planRateData} />
                  <TableGraph tableType={'plan'} SingleStationPlanRateData={SingleStationPlanRateData} />
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
                    title="光资源同比"
                    currentYear={currentYear}
                    lastYear={lastYear}
                    lightCompareDataThatYear={lightCompareDataThatYear}
                    lightCompareDataLastYear={lightCompareDataLastYear}
                    lightCompareDataDate={lightCompareDataDate}
                    lightCompareDataLight={lightCompareDataLight}
                    lightCompareDataPower={lightCompareDataPower}
                  />
                  <TableGraph tableType={'light'} currentYear={currentYear}
                    lastYear={lastYear} SingleStationPvCompareData={SingleStationPvCompareData} />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'powerEfficency'}
                    dateType={dateType}
                    title="发电效率"
                    PowerEffectiveDateData={PowerEffectiveDateData}
                    PowerEffectiveHoursData={PowerEffectiveHoursData}
                    PowerEffectiveLightData={PowerEffectiveLightData}
                    PowerEffectivePrData={PowerEffectivePrData}

                  />
                  <TableGraph
                    tableType={'powerEffective'}
                    SingleStationPowerEffectiveData={SingleStationPowerEffectiveData}
                  />
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
                    dateType={dateType}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={lostPowerThatYear}
                    barGraphLastYear={lostPowerLastYear}
                    barGraphmonth={lostPowermonth}
                    barGraphYearOnYear={lostPowerYearOnYear}
                  />
                  <TableGraph tableType={'power'} currentYear={currentYear}
                    lastYear={lastYear} SingleStationLostPowerData={SingleStationLostPowerData} />
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
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={barGraphThatYear}
                    barGraphLastYear={barGraphLastYear}
                    barGraphmonth={barGraphmonth}
                    barGraphYearOnYear={barGraphYearOnYear}
                  />
                  <TableGraph tableType={'power'} currentYear={currentYear}
                    lastYear={lastYear} SingleStationLostPowerData={SingleStationPowerData} />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <CurrentMonthCompleteRate
                  graphId={'CurrentMonthCompleteRate'}
                  title={'当月累计完成率'}
                  yAxisName={'当月累计完成率'}
                  xAxisName={'累计完成率'}
                  lastYear={lastYear}
                  currentYear={lastYear}
                  dayCompleteRate={dayCompleteRate}
                  dayCompleteRateDateData={dayCompleteRateDateData}
                  dayCompleteRateLastYearData={dayCompleteRateLastYearData}
                  dayCompleteRateThatYearData={dayCompleteRateThatYearData}
                />
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>发电量效率分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'dayPowerEfficency'}
                    title="发电效率"
                    PowerEffectiveDateData={PowerEffectiveDateData}
                    PowerEffectiveHoursData={PowerEffectiveHoursData}
                    PowerEffectiveLightData={PowerEffectiveLightData}
                    PowerEffectivePrData={PowerEffectivePrData}
                  />
                  <TableGraph
                    tableType={'powerEffective'}
                    SingleStationPowerEffectiveData={SingleStationPowerEffectiveData}
                  />
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
                    dateType={dateType}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={lostPowerThatYear}
                    barGraphLastYear={lostPowerLastYear}
                    barGraphmonth={lostPowermonth}
                    barGraphYearOnYear={lostPowerYearOnYear}
                  />
                  <TableGraph
                    tableType={'power'} currentYear={currentYear}
                    lastYear={lastYear} SingleStationLostPowerData={SingleStationLostPowerData}
                  />
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
