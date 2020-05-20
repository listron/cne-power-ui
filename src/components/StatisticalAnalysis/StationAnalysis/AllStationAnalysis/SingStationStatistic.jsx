import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './allStationStatistic.scss';
import BarGraph from '../CommonGraphs/BarGraph/index.js';
import TargetStatisticPieGraph from './Chart/TargetStatisticPieGraph.jsx';
import moment from 'moment';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import PlanCompletionRate from './Chart/PlanCompletionRate';
import ChangeStation from '../../../Monitor/StationMonitor/SingleStation/SingleStationCommon/ChangeStation';
import TableGraph from '../CommonGraphs/TableGraph';
import ThreeYaxis from '../CommonGraphs/ThreeYaxis';
import PlanCompleteRateAnalysisBar from './Chart/PlanCompleteRateAnalysisBar';
import LightResource from './Chart/LightResource';
import CurrentMonthCompleteRate from './Chart/CurrentMonthCompleteRate/index';

class SingleStationStatistic extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    singleStationStatisticData: PropTypes.object,
    singleStationCode: PropTypes.string,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    singleStationPowerData: PropTypes.array,
    singleStationLostPowerData: PropTypes.array,
    allStationAvalibaData: PropTypes.array,
    singleStationMonthPieData: PropTypes.array,
    showPage: PropTypes.string,
    dateType: PropTypes.string,
    singleStationPlanRate: PropTypes.string,
    singleStationPowerEffectiveData: PropTypes.array,
    singleStationDayCompleteRateData: PropTypes.array,
    singleStationPlanRateData: PropTypes.array,
    singleStationPvCompareData: PropTypes.array,
    changeAllStationStore: PropTypes.func,
    match: PropTypes.object,
    singleYear: PropTypes.any,
    singleRangYear: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
      showStationList: false,
    };
  }

  componentDidMount() {
    this.getMonthData(this.props);
    //控制单电站点击其他位置，消失浮框
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hiddenStationList, true);
  }

  componentWillReceiveProps(nextProps) {
    const { dateType, singleYear, singeleMonth, singleRangYear, singleStationCode } = nextProps;
    if (dateType === 'month' && (this.props.dateType !== 'month' ||
      (this.props.singleYear !== singleYear || this.props.singleStationCode !== singleStationCode))) {
      this.getMonthData(nextProps);
    }

    if (dateType === 'day' && (this.props.dateType !== 'day' ||
      (this.props.singeleMonth !== singeleMonth || this.props.singleYear !== singleYear || this.props.singleStationCode !== singleStationCode))) {
      this.getDayData(nextProps);
    }

    if (dateType === 'year' && (this.props.dateType !== 'year' ||
      (this.props.singleRangYear[0] !== singleRangYear[0] || this.props.singleRangYear[1] !== singleRangYear[1] || this.props.singleStationCode !== singleStationCode))) {
      this.getYearData(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.changeAllStationStore({
      showPage: 'multiple',
      singleStationCode: '',
      dateType: 'month',
      selectYear: '',
      singleStationCode: null,
      singleYear: null, // 年
      singleleMonth: null, // 多年
      singleRangYear: [null, null], // 多年
    });
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hiddenStationList, true);
  }

  onTimeChange = (timeObj) => { // 时间选择
    let singleYear = ' ';
    let singeleMonth = '';
    const { changeAllStationStore } = this.props;
    if (timeObj.timeStyle === 'day') {
      singleYear = timeObj.startTime.split('-')[0];
      singeleMonth = timeObj.startTime.split('-')[1];
      changeAllStationStore({ singleYear, singeleMonth, dateType: timeObj.timeStyle });
    } else if (timeObj.timeStyle === 'month') {
      changeAllStationStore({ singleYear: timeObj.startTime, dateType: timeObj.timeStyle });
    } else {
      changeAllStationStore({ singleRangYear: [timeObj.startTime, timeObj.endTime], dateType: timeObj.timeStyle });
    }
  }

  onClose = () => {
    this.props.changeAllStationStore({
      showPage: 'multiple',
      singleStationCode: null,
    });
  }

  getMonthData = (props) => { // 月的时间选择 初始加载
    const { singleYear, dateType, stations, singleStationCode } = props;
    const choiceYear = singleYear ? singleYear : moment().year();
    const initStations = stations.toJS().filter(e => e.stationType === 1);
    const initStationCode = singleStationCode ? singleStationCode : initStations[0].stationCode;
    const prams = {
      stationCode: initStationCode,
      dateType,
      year: choiceYear,
    };
    props.getSingleStationStatisticData(prams);
    //发电量和损失电量两个请求
    props.getSingleStationTargetData({ ...prams, year: [choiceYear] });
    props.getSingleStationMonthPieData({ ...prams, year: [choiceYear] });
    props.getSingleStationPlanRateData({ ...prams, year: [choiceYear] });
    props.getSingleStationPvCompareData(prams);
    props.getSingleStationPowerEffectiveData({ ...prams, year: [choiceYear] });
    props.changeAllStationStore({ singleYear: choiceYear });
  }

  getDayData = (props) => {
    const { dateType, singleYear, singeleMonth, stations, singleStationCode } = props;
    const choiceYear = singleYear ? singleYear : moment().year();
    const choiceMonth = singeleMonth ? singeleMonth : moment().month() + 1;
    const initStations = stations.toJS().filter(e => e.stationType === 1);
    const initStationCode = singleStationCode ? singleStationCode : initStations[0].stationCode;
    // props.changeResourceStore({ ...prams, selectYear: choiceYear })
    props.getSingleStationStatisticData({
      stationCode: initStationCode,
      year: `${choiceYear}-${choiceMonth}`,
      dateType,
    });
    //发电量和损失电量两个请求
    props.getSingleStationTargetData({
      stationCode: initStationCode,
      year: [`${choiceYear}-${choiceMonth}`],
      dateType,
    });
    props.getSingleStationDayCompleteRateData({
      stationCode: initStationCode,
      year: choiceYear,
      month: choiceMonth,
    });
    props.getSingleStationPowerEffectiveData({
      stationCode: initStationCode,
      year: [choiceYear],
      month: choiceMonth,
      dateType,
    });

  }

  getYearData = (props) => { //年的时间选择
    const { dateType, singleStationCode, singleRangYear, userId, stations } = props;
    const endYear = singleRangYear[1] ? singleRangYear[1] : +moment().year();
    const startYear = singleRangYear[0] ? singleRangYear[0] : moment().subtract(5, 'year').year();
    const rangeYear = [];
    for (let i = Number(startYear); i < Number(endYear) + 1; i++) {
      rangeYear.push(i.toString());
    }
    const station = stations.toJS().filter(e => { if (e.stationCode === +singleStationCode) { return e.stationType; } });
    const prams = {
      stationCode: singleStationCode,
      dateType,
      year: rangeYear,
    };
    props.getAllStationAvalibaData({ ...prams, 'userId': userId, stationType: station[0].stationType || 1 });
    props.changeAllStationStore({ singleRangYear: [startYear, endYear], selectYear: endYear });
    props.getSingleStationStatisticData({ ...prams, year: endYear });
    props.getSingleStationTargetData(prams);
    props.getSingleStationPowerEffectiveData({ ...prams, year: [+startYear, +endYear] });
  }

  showStationSelect = () => {
    this.setState({
      showStationSelect: true,
    });
  }

  hiddenStationList = () => {
    this.setState({
      showStationSelect: false,
    });
  }

  hideStationChange = () => {
    this.setState({
      showStationSelect: false,
    });
  }

  hasData = (dataArray) => {
    let flag = false;
    if (dataArray.length > 0) {
      const temp = [];
      // 日期不做判断   date monthOrDay day
      const typeArr = Object.keys(dataArray[0]).filter(e => e !== 'date' && e !== 'monthOrDay' && e !== 'day');
      typeArr.forEach((e => {
        temp.push(dataArray.map(list => list[e]));
      }));

      temp.forEach(list => {
        if (list.some(e => e || e === 0)) {
          flag = true;
        }
      });
    }
    return flag;
  }

  render() {
    const { stations, dateType, singleStationCode, singleStationStatisticData, showPage, singleStationPlanRateData = [], singleStationPvCompareData = [], singleStationPowerData, singleStationLostPowerData = [], singleStationMonthPieData = [], singleStationPlanRate, allStationAvalibaData, singleStationDayCompleteRateData = [], singleStationPowerEffectiveData = [], getSingleStationStatisticData, selectYear, changeAllStationStore, singleYear, singeleMonth } = this.props;
    const { stationCode } = this.props.match.params;
    if (stationCode !== singleStationCode) {
      changeAllStationStore({ singleStationCode: stationCode });
    }
    const currentYear = `${singleYear}`;
    const lastYear = `${singleYear - 1}`;
    const initDateType = { 'month': '月', 'year': '', 'day': '日' };

    //发电量饼图
    const pieData = singleStationMonthPieData.map((e, i) => ({ value: +e.monthPower === 0 ? '' : e.monthPower, name: `${e.month}月` }));
    const pieComplete = [{ value: +singleStationPlanRate, name: '已完成' }, { value: 100 - singleStationPlanRate, name: '未完成' }];

    //发电效率分析
    const PowerEffectiveData = {
      xData: singleStationPowerEffectiveData.map((e, i) => (`${e.date}${initDateType[dateType]}`)),
      yData: {
        barData: { hours: singleStationPowerEffectiveData.map(e => e.hours) },
        lineData: { light: singleStationPowerEffectiveData.map(e => e.light), pr: singleStationPowerEffectiveData.map(e => e.pr) },
      },
    };
    const { showStationSelect } = this.state;
    const stationItems = stations && stations.toJS();
    const stationItem = stationItems.filter(e => (e.stationCode === +singleStationCode))[0] || {};
    const stationGridTime = stationItem.onGridTime && stationItem.onGridTime && moment(stationItem.onGridTime).format('YYYY年MM月DD日') || '--';
    //拿到单电站的类型，弄个数组，把对应的iconfont加上，在下面调用
    return (
      <div className={styles.singleStationType}>
        <div className={styles.componentContainer}>
          <div className={styles.title}>
            {showStationSelect &&
              <ChangeStation stations={stationItems.filter(e => e.stationType === 1)} stationName={stationItem.stationName} baseLinkPath="/statistical/stationaccount/allstation" hideStationChange={this.hideStationChange} />
            }
            <div className={styles.titleLeft}>
              <div onClick={() => this.setState({ showStationSelect: true })} className={styles.stationName}>
                <Icon className={styles.icon} type="swap" />
              </div>
              <div className={styles.stationStatus} onClick={() => this.setState({ showStationSelect: true })}>
                <div className={styles.status}>
                  <span className={styles.stationIcon}><i className="iconfont icon-pvlogo"></i></span>
                  {stationItem.stationName}--{stationItem.provinceName}
                </div>
                <div className={styles.time}>
                  <span className={styles.gridTime}>并网时间：{stationGridTime}</span>
                  <span className={styles.deadline}>数据统计截止时间{moment().subtract(1, 'days').format('YYYY年MM月DD日')}</span>
                </div>
              </div>
            </div>
            <Link to="/statistical/stationaccount/allstation">
              <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.onClose} />
            </Link>
          </div>
          <TimeSelect onChange={this.onTimeChange} />
          <PlanCompletionRate
            dateType={dateType}
            allStationStatisticData={singleStationStatisticData}
            showPage={showPage}
            year={singleYear}
            singeleMonth={singeleMonth}
            allStationAvalibaData={allStationAvalibaData}
            singleStationCode={singleStationCode}
            getSingleStationStatisticData={getSingleStationStatisticData}
            selectYear={selectYear}
            changeAllStationStore={changeAllStationStore}
          />
          <div className={styles.targetGraphContainer}>
            {dateType === 'year' && <div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    yAxisName={'发电量 (万kWh)'}
                    xAxisName={'发电量'}
                    title={'发电量环比'}
                    dateType={dateType}
                    barGraphmonth={singleStationPowerData.map((e, i) => (`${e.date}${initDateType[dateType]}`))}
                    barGraphThatYear={singleStationPowerData.map(e => e.thatYearData)}
                    barGraphRingRatio={singleStationPowerData.map(e => e.ringRatio)}
                    hasData={this.hasData(singleStationPowerData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'powerGenRatio'}
                    dataArray={singleStationPowerData}
                    sortMethod={'ascend'}
                    sortField={'ringRatio'}
                  />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'yearPowerEfficency'}
                    title="发电效率"
                    data={PowerEffectiveData}
                    hasData={this.hasData(singleStationPowerEffectiveData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'pr'}
                    sortMethod={'ascend'} sortField={'pr'}
                    dataArray={singleStationPowerEffectiveData} />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'损失电量'}
                    title={'损失电量环比'}
                    dateType={dateType}
                    barGraphRingRatio={singleStationLostPowerData.map(e => e.ringRatio)}
                    barGraphThatYear={singleStationLostPowerData.map(e => e.thatYearData)}
                    barGraphmonth={singleStationLostPowerData.map(e => (`${e.date}${initDateType[dateType]}`))}
                    hasData={this.hasData(singleStationLostPowerData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'lostPowerRatio'}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'ringRatio'}
                    dataArray={singleStationLostPowerData} />
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
                    yAxisName={'发电量 (万kWh)'}
                    xAxisName={'发电量'}
                    title={'发电量同比'}
                    dateType={dateType}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={singleStationPowerData.map(e => e.thatYearData)}
                    barGraphLastYear={singleStationPowerData.map(e => e.lastYearData)}
                    barGraphmonth={singleStationPowerData.map((e, i) => (`${e.date}${initDateType[dateType]}`))}
                    barGraphYearOnYear={singleStationPowerData.map(e => e.yearOnYear)}
                    hasData={this.hasData(singleStationPowerData)}
                  />
                  <TargetStatisticPieGraph pieGraphId={'powerPie'} pieData={pieData} pieComplete={pieComplete}
                    hasData={false}
                  />
                </div>
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>计划完成率分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <PlanCompleteRateAnalysisBar
                    yAxisName={'发电量 (万kWh)'}
                    dateType={dateType}
                    title={'计划完成率'}
                    xAxisData={singleStationPlanRateData.map((e, i) => (`${e.date}月`))}
                    planPowerData={singleStationPlanRateData.map(e => e.planPower)}
                    actualPowerData={singleStationPlanRateData.map(e => e.actualPower)}
                    planRateData={singleStationPlanRateData.map(e => e.per)}
                    hasData={this.hasData(singleStationPlanRateData)} />
                  <TableGraph
                    dateType={dateType}
                    tableType={'plan'}
                    sortMethod={'descend'} sortField={'per'}
                    dataArray={singleStationPlanRateData} />
                </div>
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>发电效率分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <LightResource
                    graphId={'MonthlightResource'}
                    yAxisName={'辐射总量 (MJ/㎡)'}
                    xAxisName={'辐射总量'}
                    dateType={dateType}
                    title="光资源同比"
                    currentYear={currentYear}
                    lastYear={lastYear}
                    lightCompareDataThatYear={singleStationPvCompareData.map(e => e.thatYearData)}
                    lightCompareDataLastYear={singleStationPvCompareData.map(e => e.lastYearData)}
                    lightCompareDataDate={singleStationPvCompareData.map((e, i) => (`${e.monthOrDay}月`))}
                    lightCompareDataLight={singleStationPvCompareData.map(e => e.lightYearOnYear)}
                    lightCompareDataPower={singleStationPvCompareData.map(e => e.powerYearOnYear)}
                    hasData={this.hasData(singleStationPvCompareData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'lightTB'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    sortMethod={'descend'} sortField={'powerYearOnYear'}
                    dataArray={singleStationPvCompareData} />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'powerEfficency'}
                    dateType={dateType}
                    title="发电效率"
                    data={PowerEffectiveData}
                    hasData={this.hasData(singleStationPowerEffectiveData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'pr'}
                    dataArray={singleStationPowerEffectiveData}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'pr'}
                  />
                </div>
              </div>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>损失电量分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'损失电量'}
                    title={'损失电量同比'}
                    dateType={dateType}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={singleStationLostPowerData.map(e => e.thatYearData)}
                    barGraphLastYear={singleStationLostPowerData.map(e => e.lastYearData)}
                    barGraphmonth={singleStationLostPowerData.map(e => (`${e.date}${initDateType[dateType]}`))}
                    barGraphYearOnYear={singleStationLostPowerData.map(e => e.yearOnYear)}
                    hasData={this.hasData(singleStationLostPowerData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'lostPowerTB'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    dataArray={singleStationLostPowerData}
                    className={styles.tableChart} sortMethod={'descend'} sortField={'yearOnYear'}
                  />
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
                    yAxisName={'发电量 (万kWh)'}
                    xAxisName={'发电量'}
                    title={'发电量同比'}
                    dateType={dateType}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={singleStationPowerData.map(e => e.thatYearData)}
                    barGraphLastYear={singleStationPowerData.map(e => e.lastYearData)}
                    barGraphmonth={singleStationPowerData.map((e, i) => (`${e.date}${initDateType[dateType]}`))}
                    barGraphYearOnYear={singleStationPowerData.map(e => e.yearOnYear)}
                    hasData={this.hasData(singleStationPowerData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'powerGenTB'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    dataArray={singleStationPowerData} />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <CurrentMonthCompleteRate
                  graphId={'CurrentMonthCompleteRate'}
                  title={'当月累计完成率'}
                  yAxisName={'当月累计完成率'}
                  xAxisName={'累计完成率'}
                  lastYear={lastYear}
                  currentYear={currentYear}
                  dayCompleteRate={singleStationDayCompleteRateData.map(e => e.yearOnYear)}
                  dayCompleteRateDateData={singleStationDayCompleteRateData.map((e, i) => (`${e.day}`))}
                  dayCompleteRateLastYearData={singleStationDayCompleteRateData.map(e => e.lastYearData)}
                  dayCompleteRateThatYearData={singleStationDayCompleteRateData.map(e => e.thatYearData)}
                  hasData={this.hasData(singleStationDayCompleteRateData)}
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
                    data={PowerEffectiveData}
                    hasData={this.hasData(singleStationPowerEffectiveData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'pr'}
                    dataArray={singleStationPowerEffectiveData}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'pr'}
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
                    xAxisName={'损失电量'}
                    dateType={dateType}
                    title={'损失电量同比'}
                    dateType={dateType}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={singleStationLostPowerData.map(e => e.thatYearData)}
                    barGraphLastYear={singleStationLostPowerData.map(e => e.lastYearData)}
                    barGraphmonth={singleStationLostPowerData.map(e => (`${e.date}${initDateType[dateType]}`))}
                    barGraphYearOnYear={singleStationLostPowerData.map(e => e.yearOnYear)}
                    hasData={this.hasData(singleStationLostPowerData)}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'lostPowerTB'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    dataArray={singleStationLostPowerData}
                    className={styles.tableChart} sortMethod={'descend'} sortField={'yearOnYear'}
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
export default withRouter(SingleStationStatistic);
