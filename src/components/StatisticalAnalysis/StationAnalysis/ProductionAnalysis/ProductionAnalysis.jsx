import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import styles from './productionAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import BarGraph from '../CommonGraphs/BarGraph';
import TableGraph from '../CommonGraphs/TableGraph';
import WaterWave from '../AllStationAnalysis/Chart/PlanCompletionRate/WaterWave';
import ThreeYaxis from '../CommonGraphs/ThreeYaxis';
import moment from 'moment';


class ProductionAnalysis extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    match: PropTypes.object,
    stationType: PropTypes.string,
    allStationAvalibaData: PropTypes.array,
    productionPlanCompleteData: PropTypes.array,
    singleStationPowerData: PropTypes.array,
    singleStationSalePowerData: PropTypes.array,
    singleStationBuyPowerData: PropTypes.array,
    singleStationPlanRateData: PropTypes.array,
    history: PropTypes.object,
    getAllStationAvalibaData: PropTypes.func,
    changeProductionStationStore: PropTypes.func,
    ProductionPlanComplete: PropTypes.func,
    getSingleStationProductionData: PropTypes.func,
    getSingleStationPlanRateData: PropTypes.func,
    location: PropTypes.object, //路径
    hash: PropTypes.string,
    theme: PropTypes.string,
    dateType: PropTypes.string,
    month: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    selectYear: PropTypes.any,
    year: PropTypes.any,
    stationCode: PropTypes.any,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { stations } = this.props;
    if (stations.toJS().length > 0) {
      this.getMonthData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dateType, year, month, startTime, endTime, stationCode, stations } = nextProps;
    if (stations.toJS().length > 0) {
      if (!year) {
        this.getMonthData(nextProps);
      }
      if (dateType === 'month' && (this.props.dateType !== 'month' ||
        (this.props.year !== year || this.props.stationCode !== stationCode))) {
        this.getMonthData(nextProps);
      }

      if (dateType === 'day' && (this.props.dateType !== 'day' ||
        (this.props.month !== month || this.props.year !== year || this.props.stationCode !== stationCode))) {
        this.getDayData(nextProps);
      }

      if (dateType === 'year' && (this.props.dateType !== 'year' ||
        (this.props.startTime !== startTime || this.props.endTime !== endTime || this.props.stationCode !== stationCode))) {
        this.getYearData(nextProps);
      }
    }
  }

  onTimeChange = (timeObj) => {
    let year = ' ';
    let month = '';
    const { changeProductionStationStore } = this.props;
    if (timeObj.timeStyle === 'day') {
      year = timeObj.startTime.split('-')[0];
      month = timeObj.startTime.split('-')[1];
      changeProductionStationStore({
        year,
        month,
        dateType: timeObj.timeStyle,
      });
    } else if (timeObj.timeStyle === 'month') {
      changeProductionStationStore({ year: timeObj.startTime, dateType: timeObj.timeStyle });
    } else {
      changeProductionStationStore({ startTime: timeObj.startTime, endTime: timeObj.endTime, dateType: timeObj.timeStyle });
    }
  }

  getMonthData = (props) => { // 月的时间选择 初始加载
    const { dateType, year, stations, stationCode } = props;
    const choiceYear = year ? year : moment().year();
    const outStationCode = props.location.hash ? props.location.hash.split('#')[1] : null;
    const initStations = stations.toJS().filter(e => e.stationType === 1);
    const initStationCode = stationCode ? stationCode : (outStationCode ? outStationCode : initStations[0].stationCode);
    const prams = {
      stationCode: initStationCode,
      dateType,
      year: choiceYear,
    };
    props.changeProductionStationStore({ ...prams, selectYear: choiceYear });
    props.ProductionPlanComplete(prams);
    props.getSingleStationProductionData({ ...prams, year: [choiceYear] });
    props.getSingleStationPlanRateData({ ...prams, year: [choiceYear] });
  }

  getDayData = (props) => { //日的时间选择
    const { dateType, year, month, stationCode } = props;
    const choiceYear = year ? year : moment().year();
    const choiceMonth = month ? month : moment().month();
    const prams = {
      stationCode: stationCode,
      dateType,
      year: choiceYear,
      month: choiceMonth,
    };
    props.changeProductionStationStore({ ...prams, selectYear: choiceYear });
    props.ProductionPlanComplete(prams);
    props.getSingleStationProductionData({ ...prams, year: [`${choiceYear}-${choiceMonth}`] });
  }

  getYearData = (props) => { //年的时间选择
    const { dateType, stationCode, startTime, endTime, userId, stations } = props;
    const endYear = endTime ? endTime : +moment().year();
    const startYear = startTime ? startTime : moment().subtract(5, 'year').year();
    const rangeYear = [];
    for (let i = Number(startYear); i < Number(endYear) + 1; i++) {
      rangeYear.push(i.toString());
    }
    const station = stations.toJS().filter(e => { if (e.stationCode === +stationCode) { return e.stationType; } });
    const prams = {
      stationCode: stationCode,
      dateType,
      year: [+startYear, +endYear],
    };
    props.getAllStationAvalibaData({ ...prams, 'userId': userId, 'year': rangeYear, stationType: station[0].stationType || 1 });
    props.changeProductionStationStore({ startTime: startYear, endTime: endYear });
    props.ProductionPlanComplete({ ...prams, year: endYear });
    props.getSingleStationProductionData({ ...prams, 'year': rangeYear });
    props.getSingleStationPlanRateData(prams);
  }

  stationSelected = (stationSelect) => { // 存储选中的电站
    const stationCode = stationSelect[0].stationCode;
    this.props.changeProductionStationStore({ stationCode });
  }

  selectProductYear = () => { // 生产计划的时间
    const { allStationAvalibaData, dateType, selectYear } = this.props;
    const yearArray = allStationAvalibaData.map((e, i) => (Number(e.year)));
    const currentYear = Math.max(...yearArray).toString();
    if (dateType === 'year' && allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${selectYear}`} buttonStyle="solid" onChange={this.handleTime}>
          {allStationAvalibaData.map((e, index) => {
            if (e.isTrue === true) {
              return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}</Radio.Button>;
            }
            return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}</Radio.Button>;

          }
          )}
        </Radio.Group>
      );
    }

  }

  handleTime = (e) => { // 计划的时间
    const specilPrams = {
      stationCode: this.props.stationCode,
      dateType: 'year',
      year: e.target.value,
    };
    this.props.ProductionPlanComplete(specilPrams);
    this.props.changeProductionStationStore({ selectYear: e.target.value });
  }

  render() {
    const { stations, dateType, year, month, stationCode, productionPlanCompleteData, singleStationPowerData, singleStationBuyPowerData, singleStationSalePowerData, singleStationPlanRateData, theme } = this.props;
    // 截止时间
    const statisticTime = moment().subtract(1, 'days').format('YYYY年MM月DD日');
    // 并网时间
    const stationItems = stations.toJS();
    const station = stationCode ? stationItems.filter(e => `${e.stationCode}` === `${stationCode}`) : '';
    const stationItem = stationItems && stationItems.filter(e => (`${e.stationCode}` === `${stationCode}`))[0];
    const stationGridTime = stationItem ? moment(stationItem.onGridTime).format('YYYY年MM月DD日') : '--';
    //电站名-区域
    const provinceName = stationItem && stationItem.provinceName;
    const stationName = stationItem && stationItem.stationName;

    const currentYear = `${year}`;
    const lastYear = (year - 1).toString();
    const planSummary = productionPlanCompleteData && productionPlanCompleteData[0];
    const actualPower = planSummary && planSummary.actualPower ? planSummary.actualPower : '--';
    const planPower = planSummary && planSummary.planPower ? planSummary.planPower : '--';
    const completeRate = planSummary && planSummary.completeRate ? planSummary.completeRate : '--';
    const saledPower = planSummary && planSummary.saledPower ? planSummary.saledPower : '--';
    const buyPower = planSummary && planSummary.buyPower ? planSummary.buyPower : '--';
    //发电量
    const barGraphThatYear = singleStationPowerData.map(e => e.thatYearData);
    const barGraphLastYear = singleStationPowerData.map(e => e.lastYearData);
    const barGraphmonth = singleStationPowerData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`));
    const barGraphYearOnYear = singleStationPowerData.map(e => e.yearOnYear);
    const barGraphRingRatio = singleStationPowerData.map(e => e.ringRatio);
    const barbarGraphHasData = barGraphThatYear.some(e => e || e === 0) || barGraphLastYear.some(e => e || e === 0) || barGraphYearOnYear.some(e => e || e === 0) || barGraphRingRatio.some(e => e || e === 0);
    //上网电量
    const salePowerThatYear = singleStationSalePowerData.map(e => e.thatYearData);
    const salePowerLastYear = singleStationSalePowerData.map(e => e.lastYearData);
    const salePowerRingRatio = singleStationSalePowerData.map(e => e.ringRatio);
    const salePowermonth = singleStationSalePowerData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`));
    const salePowerYearOnYear = singleStationSalePowerData.map(e => e.yearOnYear);
    const salePowerHasData = salePowerThatYear.some(e => e || e === 0) || salePowerLastYear.some(e => e || e === 0) || salePowerRingRatio.some(e => e || e === 0) || salePowerYearOnYear.some(e => e || e === 0);

    //购网电量
    const buyPowerThatYear = singleStationBuyPowerData.map(e => e.thatYearData);
    const buyPowerLastYear = singleStationBuyPowerData.map(e => e.lastYearData);
    const buyPowerRingRatio = singleStationBuyPowerData.map(e => e.ringRatio);
    const buyPowermonth = singleStationBuyPowerData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`));
    const buyPowerYearOnYear = singleStationBuyPowerData.map(e => e.yearOnYear);
    const buyPowerHasData = buyPowerThatYear.some(e => e || e === 0) || buyPowerLastYear.some(e => e || e === 0) || buyPowerRingRatio.some(e => e || e === 0) || buyPowerYearOnYear.some(e => e || e === 0);

    //计划完成率
    const planPowers = singleStationPlanRateData && singleStationPlanRateData.map(e => e.planPower) || [];
    const planActualPower = singleStationPlanRateData && singleStationPlanRateData.map(e => e.actualPower) || [];
    const per = singleStationPlanRateData && singleStationPlanRateData.map(e => e.per) || [];
    const resourceValue = singleStationPlanRateData && singleStationPlanRateData.map(e => e.resourceValue) || [];
    const PowerEffectiveData = {
      xData: singleStationPlanRateData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`)),
      yData: {
        barData: { planPower: planPowers, actualPower: planActualPower },
        lineData: { planRate: per, resourceValue },
      },
    };
    const PowerEffectiveHasData = planPowers.some(e => e || e === 0) || planActualPower.some(e => e || e === 0) || per.some(e => e || e === 0) || resourceValue.some(e => e || e === 0);

    return (
      <div className={`${styles.singleStationType} ${styles[theme]}`}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
              <span className={styles.text}>条件查询</span>
              <StationSelect
                data={stations.toJS().filter(e => e.stationType === 1)}
                holderText={'电站名-区域'}
                value={station.length > 0 ? station : []}
                onChange={this.stationSelected}
                theme={theme}
              />
            </div>
            <TimeSelect timerText="" onChange={this.onTimeChange} theme={theme} />
          </div>
          <span className={styles.rightContent}>数据统计截止时间{statisticTime}</span>
        </div>

        <div className={styles.componentContainer}>
          <div className={styles.title}>
            <div className={styles.stationStatus}>
              <div className={styles.status}>
                <span className={styles.stationIcon}><i className="iconfont icon-pvlogo"></i></span>
                {stationName}-{provinceName}    :
                计划完成情况
                {dateType === 'year' && this.selectProductYear()}
                {dateType === 'month' && `(  ${year}年  ) `}
                {dateType === 'day' && `( ${+(year)}年${month}月)`}
              </div>
              <span className={styles.rightFont}>并网时间{stationGridTime}</span>
            </div>
            <div className={styles.graph}>
              <WaterWave percent={completeRate} height={100} theme={theme} />
              <div className={styles.staticWrap}>
                <div className={styles.stationTargetData}>
                  <div className={styles.stationTargetName}>{dateType === 'month' || dateType === 'year' ? '年' : '月'}实际发电量 </div>
                  <div className={styles.stationTargetValue}>{actualPower} <span className={styles.unit}> 万kWh </span></div>
                </div>
                <div className={styles.stationTargetData}>
                  <div className={styles.stationTargetName}>{dateType === 'month' || dateType === 'year' ? '年' : '月'}计划发电量 </div>
                  <div className={styles.stationTargetValue}>{planPower} <span className={styles.unit}> 万kWh </span></div>
                </div>
                <div className={styles.stationTargetData}>
                  <div className={styles.stationTargetName}>上网电量 </div>
                  <div className={styles.stationTargetValue}>{saledPower}  <span className={styles.unit}> 万kWh </span></div>
                </div>
                <div className={styles.stationTargetData}>
                  <div className={styles.stationTargetName}>购网电量 </div>
                  <div className={styles.stationTargetValue}>{buyPower}  <span className={styles.unit}> 万kWh </span></div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.targetGraphContainer}>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  graphId={'power'}
                  yAxisName={'发电量 (万kWh)'}
                  xAxisName={'发电量'}
                  title={dateType === 'year' ? '发电量环比' : '发电量同比'}
                  dateType={dateType}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphThatYear={barGraphThatYear}
                  barGraphLastYear={barGraphLastYear}
                  barGraphmonth={barGraphmonth}
                  barGraphYearOnYear={barGraphYearOnYear}
                  barGraphRingRatio={barGraphRingRatio}
                  hasData={barbarGraphHasData}
                  theme={theme}
                />
                {dateType === 'year' ?
                  <TableGraph dateType={dateType} tableType={'powerGenRatio'} currentYear={currentYear}
                    lastYear={lastYear} dataArray={singleStationPowerData} theme={theme} /> :
                  <TableGraph
                    dateType={dateType} tableType={'powerGenTB'} currentYear={currentYear}
                    lastYear={lastYear} dataArray={singleStationPowerData} theme={theme} />}

              </div>
            </div>
            {dateType === 'month' || dateType === 'year' ? <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <ThreeYaxis
                  graphId={'productionPlanCompleteRate'}
                  title="计划完成率"
                  data={PowerEffectiveData}
                  hasData={PowerEffectiveHasData}
                  theme={theme}
                />
                <TableGraph dateType={dateType} tableType={'plan'} dataArray={singleStationPlanRateData} theme={theme} />
              </div>
            </div> : ''}
            <div className={styles.tabContainer}>
              <div className={styles.dataGraphs}>
                <BarGraph
                  graphId={'buyPower'}
                  yAxisName={'购网电量 (万kWh)'}
                  xAxisName={'购网电量'}
                  dateType={dateType}
                  title={dateType === 'year' ? '购网电量环比' : '购网电量同比'}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphThatYear={buyPowerThatYear}
                  barGraphLastYear={buyPowerLastYear}
                  barGraphmonth={buyPowermonth}
                  barGraphYearOnYear={buyPowerYearOnYear}
                  barGraphRingRatio={buyPowerRingRatio}
                  hasData={buyPowerHasData}
                  theme={theme}
                />
                <BarGraph graphId={'savePower'}
                  yAxisName={'上网电量 (万kWh)'}
                  xAxisName={'上网电量'}
                  dateType={dateType}
                  title={dateType === 'year' ? '上网电量环比' : '上网电量同比'}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphThatYear={salePowerThatYear}
                  barGraphLastYear={salePowerLastYear}
                  barGraphmonth={salePowermonth}
                  barGraphYearOnYear={salePowerYearOnYear}
                  barGraphRingRatio={salePowerRingRatio}
                  hasData={salePowerHasData}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default (ProductionAnalysis);
