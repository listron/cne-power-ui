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
    allStationAvalibaData: PropTypes.array,
    productionPlanCompleteData: PropTypes.array,
    singleStationPowerData: PropTypes.array,
    singleStationSalePowerData: PropTypes.array,
    singleStationBuyPowerData: PropTypes.array,
    singleStationPlanRateData: PropTypes.array,
    changeProductionStationStore: PropTypes.func,
    ProductionPlanComplete: PropTypes.func,
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
    const choiceYear = year && year || moment().year();
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
    const { stationCode = null } = stationSelect.length > 0 && stationSelect[0];
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
            return (<Radio.Button value={e.year} key={index} className={`${!e.isTrue && styles.disabled} ${styles.selectButton}`}>{e.year}</Radio.Button>);
          })}
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

  hasData = (dataArray) => {
    let flag = false;
    if (dataArray.length > 0) {
      const temp = [];
      // 日期不做判断   date monthOrDay
      const typeArr = Object.keys(dataArray[0]).filter(e => e !== 'date' && e !== 'monthOrDay');
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
    const { stations, dateType, year, month, stationCode, theme,
      productionPlanCompleteData = [], singleStationPowerData = [], singleStationBuyPowerData = [], singleStationSalePowerData = [], singleStationPlanRateData = [] } = this.props;
    // 截止时间
    const statisticTime = moment().subtract(1, 'days').format('YYYY年MM月DD日');
    // 并网时间
    const stationItems = stations.toJS();
    const station = stationCode && stationItems.filter(e => `${e.stationCode}` === `${stationCode}`) || [];
    const stationItem = stationItems && stationItems.filter(e => (`${e.stationCode}` === `${stationCode}`))[0] || {};
    const { onGridTime, provinceName, stationName } = stationItem;
    const stationGridTime = onGridTime && moment(onGridTime).format('YYYY年MM月DD日') || '--';

    const currentYear = `${year}`;
    const lastYear = `${year - 1}`;
    const { planSummary = {} } = productionPlanCompleteData.length > 0 && productionPlanCompleteData[0];
    const { actualPower = '--', planPower = '--', completeRate = '--', saledPower = '--', buyPower = '--' } = planSummary;
    const initDateType = { 'month': '月', 'year': '', 'day': '日' };

    //计划完成率
    const PowerEffectiveData = {
      xData: singleStationPlanRateData.map((e, i) => (`${e.date}${initDateType[dateType]}`)),
      yData: {
        barData: {
          planPower: singleStationPlanRateData.map(e => e.planPower),
          actualPower: singleStationPlanRateData.map(e => e.actualPower),
        },
        lineData: {
          planRate: singleStationPlanRateData.map(e => e.per),
          resourceValue: singleStationPlanRateData.map(e => e.resourceValue),
        },
      },
    };

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

                  <div className={styles.stationTargetName}>{{ 'month': '年', 'year': '年', 'day': '月' }[dateType]}实际发电量 </div>
                  <div className={styles.stationTargetValue}>{actualPower} <span className={styles.unit}> 万kWh </span></div>
                </div>
                <div className={styles.stationTargetData}>
                  <div className={styles.stationTargetName}>{{ 'month': '年', 'year': '年', 'day': '月' }[dateType]}计划发电量 </div>
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
                  yAxisName={'发电量 (万kWh)'}
                  xAxisName={'发电量'}
                  title={dateType === 'year' ? '发电量环比' : '发电量同比'}
                  dateType={dateType}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphThatYear={singleStationPowerData.map(e => e.thatYearData)}
                  barGraphLastYear={singleStationPowerData.map(e => e.lastYearData)}
                  barGraphmonth={singleStationPowerData.map((e, i) => (`${e.date}${initDateType[dateType]}`))}
                  barGraphYearOnYear={singleStationPowerData.map(e => e.yearOnYear)}
                  barGraphRingRatio={singleStationPowerData.map(e => e.ringRatio)}
                  hasData={this.hasData(singleStationPowerData)}
                  theme={theme}
                />
                {dateType === 'year' &&
                  <TableGraph dateType={dateType} tableType={'powerGenRatio'} currentYear={currentYear} lastYear={lastYear} theme={theme}
                    dataArray={singleStationPowerData} className={styles.tableChart} sortMethod={'ascend'} sortField={'ringRatio'} />
                }

                {dateType === 'month' &&
                  <TableGraph
                    dateType={dateType} tableType={'powerGenTB'} currentYear={currentYear} theme={theme} lastYear={lastYear}
                    dataArray={singleStationPowerData} className={styles.tableChart} sortMethod={'ascend'} sortField={'yearOnYear'} />
                }

                {dateType === 'day' &&
                  <TableGraph
                    dateType={dateType} tableType={'powerGenTB'} currentYear={currentYear} lastYear={lastYear} theme={theme}
                    dataArray={singleStationPowerData} className={styles.tableChart} sortMethod={'ascend'} sortField={'yearOnYear'} />
                }
              </div>
            </div>
            {dateType !== 'day' &&
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'productionPlanCompleteRate'}
                    title="计划完成率"
                    data={PowerEffectiveData}
                    hasData={this.hasData(singleStationPlanRateData)}
                    theme={theme}
                  />
                  {dateType === 'month' &&
                    <TableGraph
                      dateType={dateType} tableType={'plan'} dataArray={singleStationPlanRateData}
                      theme={theme} className={styles.tableChart} sortMethod={'descend'} sortField={'per'} />
                  }
                  {dateType === 'year' &&
                    <TableGraph
                      dateType={dateType} tableType={'plan'} dataArray={singleStationPlanRateData}
                      theme={theme} className={styles.tableChart} sortMethod={'descend'} sortField={'per'} />
                  }

                </div>
              </div> || null}
            <div className={styles.tabContainer}>
              <div className={styles.dataGraphs}>
                <BarGraph
                  yAxisName={'购网电量 (万kWh)'}
                  xAxisName={'购网电量'}
                  dateType={dateType}
                  title={dateType === 'year' ? '购网电量环比' : '购网电量同比'}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphThatYear={singleStationBuyPowerData.map(e => e.thatYearData)}
                  barGraphLastYear={singleStationBuyPowerData.map(e => e.lastYearData)}
                  barGraphmonth={singleStationBuyPowerData.map((e, i) => (`${e.date}${initDateType[dateType]}`))}
                  barGraphYearOnYear={singleStationBuyPowerData.map(e => e.yearOnYear)}
                  barGraphRingRatio={singleStationBuyPowerData.map(e => e.ringRatio)}
                  hasData={this.hasData(singleStationBuyPowerData)}
                  theme={theme}
                />
                {/* 上网电量 */}
                <BarGraph graphId={'savePower'}
                  yAxisName={'上网电量 (万kWh)'}
                  xAxisName={'上网电量'}
                  dateType={dateType}
                  title={dateType === 'year' ? '上网电量环比' : '上网电量同比'}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphThatYear={singleStationSalePowerData.map(e => e.thatYearData)}
                  barGraphLastYear={singleStationSalePowerData.map(e => e.lastYearData)}
                  barGraphmonth={singleStationSalePowerData.map((e, i) => (`${e.date}${initDateType[dateType]}`))}
                  barGraphYearOnYear={singleStationSalePowerData.map(e => e.yearOnYear)}
                  barGraphRingRatio={singleStationSalePowerData.map(e => e.ringRatio)}
                  hasData={this.hasData(singleStationSalePowerData)}
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
