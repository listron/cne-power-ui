import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './operateAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../../components/Common/TimeSelect/TimeSelectIndex';
import BarGraph from '../CommonGraphs/BarGraph';
import TableGraph from '../CommonGraphs/TableGraph';
import PowerEfficency from '../CommonGraphs/ThreeYaxis';
import UsageRate from './Chart/UsageRate';
import LostPowerType from './Chart/LostPowerType';
import LostPowerTypeRate from './Chart/LostPowerTypeRate';
import LimitPowerRate from './Chart/LimitPowerRate';
import LimitPowerRateTable from './Table/LimitPowerRateTable';
import moment from 'moment';

class OperateAnalysis extends React.Component {
  static propTypes = {
    stationType: PropTypes.string,
    dateType: PropTypes.string,
    year: PropTypes.any,
    selectYear: PropTypes.any,
    month: PropTypes.string,
    stations: PropTypes.object,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    stationCode: PropTypes.number,
    changeOperateStationStore: PropTypes.func,
    getOperatePlanComplete: PropTypes.func,
    getComponentPowerStatistic: PropTypes.func,
    getLimitPowerRate: PropTypes.func,
    getLostPowerType: PropTypes.func,
    getYearLimitPowerRate: PropTypes.func,
    getPlantPower: PropTypes.func,
    getUsageRate: PropTypes.func,
    getPowerEfficiency: PropTypes.func,
    getlostPower: PropTypes.func,
    operateAvalibaData: PropTypes.array, //计划完成是否有数据
    operatePlanCompleteData: PropTypes.object, // 计划完成情况
    powerData: PropTypes.object, // 发电量统计
    efficiencyData: PropTypes.array, // 发电效率
    usageData: PropTypes.array, // 可利用率
    lostPowerData: PropTypes.array, //损失电量
    lostPowerTypeDatas: PropTypes.object, // 电量损失类型
    limitPowerData: PropTypes.array, // 月／日限电率同比
    yearLimitPowerData: PropTypes.array, // 年限电率
    plantPowerData: PropTypes.array, // 月/年/日厂用电情况/厂损情况
    theme: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      selectYear: 0,
    };
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

  getMonthData = (props) => { // 月的时间选择 初始加载
    const { dateType, year, stations, stationCode } = props;
    const choiceYear = year ? year : moment().year();
    const initStations = stations.toJS().filter(e => e.stationType === 1);
    const prams = {
      stationCode: stationCode ? stationCode : initStations[0].stationCode,
      dateType,
      year: choiceYear,
    };
    props.changeOperateStationStore({ ...prams, selectYear: choiceYear });
    props.getOperatePlanComplete({ ...prams, dateType: 'year' });
    props.getComponentPowerStatistic({ ...prams, dateType: 'year' });
    props.getPowerEfficiency({ ...prams, year: [choiceYear] });
    props.getlostPower({ ...prams, year: [choiceYear], dataType: 'lostPower' });
    props.getUsageRate(prams);
    props.getLostPowerType(prams);
    props.getLimitPowerRate(prams);
    props.getPlantPower(prams);
  }

  getDayData = (props) => { // 日的时间选择
    const { dateType, year, month, stations, stationCode } = props;
    const choiceYear = year ? year : moment().year();
    const choiceMonth = month ? month : moment().month();
    const prams = {
      stationCode: stationCode,
      dateType,
      year: choiceYear,
      month: choiceMonth,
    };
    props.getOperatePlanComplete({ ...prams, dateType: 'month' });
    props.getComponentPowerStatistic({ ...prams, dateType: 'month' });
    props.getPowerEfficiency({ ...prams, year: [choiceYear] });
    props.getlostPower({ ...prams, year: [choiceYear + '-' + choiceMonth], dataType: 'lostPower' });
    props.getUsageRate(prams);
    props.getLostPowerType(prams);
    props.getLimitPowerRate(prams);
    props.getPlantPower(prams);

  }

  getYearData = (props) => { // 年的时间选择
    const { dateType, stations, stationCode, startTime, endTime, userId } = props;
    const endYear = endTime ? endTime : +moment().year();
    const startYear = startTime ? startTime : moment().subtract(5, 'year').year();
    const rangeYear = [];
    for (let i = Number(startYear); i < Number(endYear) + 1; i++) {
      rangeYear.push(`${i}`);
    }
    const station = stations.toJS().filter(e => { if (e.stationCode === +stationCode) { return e.stationType; } });
    const prams = {
      stationCode: stationCode,
      dateType,
      year: [startYear, endYear],
    };
    const specilPrams = {
      stationCode: stationCode ? stationCode : stations.toJS()[0].stationCode,
      dateType,
      year: endYear,
    };

    props.getAllStationAvalibaData({ ...prams, 'userId': userId, 'year': rangeYear, stationType: station[0].stationType || 1 });
    props.changeOperateStationStore({ startTime: startYear, endTime: endYear });
    props.getOperatePlanComplete(specilPrams);
    props.getComponentPowerStatistic(specilPrams);
    props.getPowerEfficiency({ ...prams });
    props.getUsageRate(prams);
    props.getlostPower({ ...prams, year: rangeYear, dataType: 'lostPower' });
    props.getLostPowerType(prams);
    props.getYearLimitPowerRate(prams);
    props.getPlantPower(prams);
  }

  getLostPercentage = (molecule, denominator) => {
    // molecule 分子,denominator 分母
    if (molecule && denominator && +denominator === 0) { return 0; }
    return molecule && denominator && +denominator !== 0 && parseFloat((denominator - molecule) / denominator * 100).toFixed(2) || '--';
  }


  stationSelected = (rest) => { // 电站条件查询
    const stationCode = rest[0].stationCode;
    this.props.changeOperateStationStore({ stationCode });
  }

  addXaixsName = (value, dateType) => { // 根据时间增加单位
    let result = '';
    switch (dateType) {
      case 'month':
        result = value + ' 月';
        break;
      case 'year':
        result = value;
        break;
      case 'day':
        result = value + ' 日';
      default:
        break;
    }
    return result;
  }

  changeDate = (data) => { // 改变统计时间
    let year = ' ';
    let month = '';
    if (data.timeStyle === 'day') {
      year = data.startTime.split('-')[0];
      month = data.startTime.split('-')[1];
      this.props.changeOperateStationStore({
        year,
        month,
        dateType: data.timeStyle,
      });
    } else if (data.timeStyle === 'month') {
      this.props.changeOperateStationStore({ year: data.startTime, dateType: data.timeStyle });
    } else {
      this.props.changeOperateStationStore({ startTime: data.startTime, endTime: data.endTime, dateType: data.timeStyle });
    }
  }


  selctYear = (year) => { // 电站看单年的时间选择
    const yearPrams = {
      stationCode: this.props.stationCode,
      dateType: 'year',
      year: year,
    };
    this.props.getOperatePlanComplete(yearPrams);
    this.props.getComponentPowerStatistic(yearPrams);
    this.props.changeOperateStationStore({ selectYear: year });
  }

  render() {
    const { stations, dateType, stationCode, year, month, operateAvalibaData, operatePlanCompleteData, powerData, lostPowerData, efficiencyData, usageData, lostPowerTypeDatas, limitPowerData,
      yearLimitPowerData, plantPowerData, selectYear, startTime, endTime, theme } = this.props;


    let station = '';
    stationCode ? station = stations.toJS().filter(e => e.stationCode === stationCode) : '';

    // 发电效率
    const hours = efficiencyData && efficiencyData.map(e => e.hours) || [];
    const light = efficiencyData && efficiencyData.map(e => e.light) || [];
    const pr = efficiencyData && efficiencyData.map(e => e.pr) || [];
    const PowerEffectiveData = {
      xData: efficiencyData && efficiencyData.map((e, i) => { return this.addXaixsName(e.date, dateType); }),
      yData: {
        barData: { hours },
        lineData: { pr, light },
      },
    };
    const PowerEffectiveHasData = hours.some(e => e || e === 0) || light.some(e => e || e === 0) || pr.some(e => e || e === 0);



    // 可利用率
    const stationUtilization = usageData && usageData.map(e => e.stationUtilization);
    const deviceUtilization = usageData && usageData.map(e => e.deviceUtilization);
    const lineData = {
      xData: usageData && usageData.map((e, i) => { return this.addXaixsName(e.date, dateType); }),
      yData: [
        stationUtilization,
        deviceUtilization,
      ],
    };
    const utilizationData = stationUtilization && stationUtilization.some(e => e || e === 0) || deviceUtilization && deviceUtilization.some(e => e || e === 0);

    // 损失电量
    const currentYear = `${year}`;
    const lastYear = `${year - 1}`;
    const barGraphThatYear = lostPowerData && lostPowerData.map((e, i) => (e.thatYearData)) || [];
    const barGraphLastYear = lostPowerData && lostPowerData.map((e, i) => (e.lastYearData)) || [];
    const barGraphmonth = lostPowerData && lostPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType); });
    const barGraphYearOnYear = lostPowerData && lostPowerData.map((e, i) => (e.yearOnYear)) || [];
    const barGraphRingRatio = lostPowerData && lostPowerData.map((e, i) => (e.ringRatio)) || [];
    const lostPowerHasData = barGraphThatYear.some(e => e || e === 0) || barGraphLastYear.some(e => e || e === 0) || barGraphYearOnYear.some(e => e || e === 0) || barGraphRingRatio.some(e => e || e === 0);

    // 限电率同比
    const thatYearLostPowerRate = limitPowerData && limitPowerData.map((e, i) => (e.thatYearLostPowerRate));
    const lastyearLostPowerRate = limitPowerData && limitPowerData.map((e, i) => (e.lastyearLostPowerRate));
    const lostPowerRateYearOnYear = limitPowerData && limitPowerData.map((e, i) => (e.lostPowerRateYearOnYear));
    const thatYearLostPower = limitPowerData && limitPowerData.map((e, i) => (e.thatYearLostPower));
    const lastyearLostPower = limitPowerData && limitPowerData.map((e, i) => (e.lastyearLostPower));
    const limitPower = {
      xData: limitPowerData && limitPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType); }),
      yData: {
        lineData: {
          thatYearLostPowerRate,
          lastyearLostPowerRate,
          lostPowerRateYearOnYear,
        },
        barData: {
          thatYearLostPower,
          lastyearLostPower,
        },
      },
    };
    const limitPowerHasData = limitPowerData && (thatYearLostPowerRate.some(e => e || e === 0) || lastyearLostPowerRate.some(e => e || e === 0)
      || lostPowerRateYearOnYear.some(e => e || e === 0) || thatYearLostPower.some(e => e || e === 0) || lastyearLostPower.some(e => e || e === 0));


    // 限电率环比
    const limitPowerRate = yearLimitPowerData && yearLimitPowerData.map((e, i) => (e.limitPowerRate));
    const ringRatio = yearLimitPowerData && yearLimitPowerData.map((e, i) => (e.ringRatio));
    const limitPowerBar = yearLimitPowerData && yearLimitPowerData.map((e, i) => (e.limitPower));
    const limitPowerHB = {
      xData: yearLimitPowerData && yearLimitPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType); }),
      yData: {
        lineData: {
          limitPowerRate,
          ringRatio,
        },
        barData: {
          limitPower: limitPowerBar,
        },
      },
    };
    const limitPowerHBHasData = yearLimitPowerData && (limitPowerRate.some(e => e || e === 0) && ringRatio.some(e => e || e === 0)
      || limitPowerBar.some(e => e || e === 0));



    // 能耗分析
    const plantPower = plantPowerData && plantPowerData.map(e => e.plantPower) || [];
    const comPlant = plantPowerData && plantPowerData.map(e => e.comPlant) || [];
    const plantLost = {
      xData: plantPowerData && plantPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType); }),
      yData: [
        plantPower,
        comPlant,
      ],
    };
    const plantLostHasData = plantPower.some(e => e || e === 0) || comPlant.some(e => e || e === 0);
    const sendLine = plantPowerData && plantPowerData.map(e => e.sendLine) || [];
    const plantLoss = plantPowerData && plantPowerData.map(e => e.plantLoss) || [];
    const useLost = {
      xData: plantPowerData && plantPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType); }),
      yData: [
        sendLine,
        plantLoss,
      ],
    };
    const useLostHasData = sendLine.some(e => e || e === 0) || plantLoss.some(e => e || e === 0);
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
            <div className={styles.timeSelectBox}>
              <TimeSelect onChange={this.changeDate} timerText="" />
            </div>
          </div>
          <span className={styles.rightContent}>数据统计截止时间{moment().subtract(1, 'days').format('YYYY年MM月DD日')}</span>
        </div>
        <div className={styles.componentContainer}>
          <div className={styles.title}>
            <div className={styles.stationStatus}>
              <div className={styles.status}>
                <span className={styles.stationIcon}>
                  <i className="iconfont icon-pvlogo" />
                </span>
                {`${station.length > 0 && station[0].stationName}-${station.length > 0 && station[0].provinceName || '--'}`}
                <div className={styles.choiceYear}>
                  {dateType === 'year' && operateAvalibaData && operateAvalibaData.map((item, index) => {
                    if (item.isTrue === false) {
                      return (<span key={index}
                        className={styles.noSelect}
                      >{item.year}</span>);
                    }
                    return (<span key={index}
                      className={+item.year === +selectYear ? 'active' : ''}
                      onClick={() => { this.selctYear(item.year); }}
                    >{item.year}</span>);
                  })
                  }
                </div>
              </div>

              <span className={styles.rightFont}>并网时间:{station.length > 0 && (station[0].onGridTime && moment(station[0].onGridTime).format('YYYY年MM月DD日')) || '--'}</span>
            </div>
            <div className={styles.graph}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.pr || '--'}%</div>
                <div className={styles.stationTargetName}>PR </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.cpr || '--'}%</div>
                <div className={styles.stationTargetName}>CPR </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.theoryPower || '--'}</div>
                <div className={styles.stationTargetName}>理论发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.actualPower || '--'}</div>
                <div className={styles.stationTargetName}>实际发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.lostPower || '--'}</div>
                <div className={styles.stationTargetName}>损失电量 万kWh</div>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer}>
            <div className={styles.cardList}>
              <div className={styles.cardItem + ' ' + styles.lightResourcesn}>
                <div className={styles.innerTop}>
                  <div className={styles.cardTitle}>光资源</div>
                  <div>辐射总量 {powerData.resourceValue || '--'}MJ/㎡</div>
                  <div>理论发电量 {powerData.theoryGen || '--'}万kWh</div>
                </div>
              </div>
              <Icon type="double-right" theme="outlined" />
              <div className={styles.cardItem + ' ' + styles.photovoltaicModule}>
                <div className={styles.innerTop}>
                  <div className={styles.cardTitle}>光伏组件</div>
                  <div>发电量 {powerData.componentGen || '--'}万kWh</div>
                  <div>损耗 {powerData.componentLost || '--'}万kWh</div>
                </div>
                <div className={this.getLostPercentage(powerData.componentGen, powerData.theoryGen) > 12 ? styles.activeInnerBottom : styles.innerBottom}>损耗 {this.getLostPercentage(powerData.componentGen, powerData.theoryGen)}%</div>

              </div>
              <Icon type="double-right" theme="outlined" />
              <div className={styles.cardItem + ' ' + styles.inverter}>
                <div className={styles.innerTop}>
                  <div className={styles.cardTitle}>逆变器</div>
                  <div>发电量 {powerData.inverterGen || '--'}万kWh</div>
                  <div>损耗 {powerData.inverterLost || '--'}万kWh</div>
                </div>
                <div className={this.getLostPercentage(powerData.inverterGen, powerData.componentGen) > 3 ? styles.activeInnerBottom : styles.innerBottom}>损耗 {this.getLostPercentage(powerData.inverterGen, powerData.componentGen)}%</div>
              </div>
              <Icon type="double-right" theme="outlined" />
              <div className={styles.cardItem + ' ' + styles.electricPowerLine}>
                <div className={styles.innerTop}>
                  <div className={styles.cardTitle}>集电线路</div>
                  <div>发电量 {powerData.integratedGen || '--'}万kWh</div>
                  <div>损耗 {powerData && powerData.integratedLost || '--'}万kWh</div>
                </div>
                <div className={this.getLostPercentage(powerData.integratedGen, powerData.inverterGen) > 2 ? styles.activeInnerBottom : styles.innerBottom}>损耗 {this.getLostPercentage(powerData.integratedGen, powerData.inverterGen)}%</div>


              </div>
              <Icon type="double-right" theme="outlined" />
              <div className={styles.cardItem + ' ' + styles.boosterStation}>
                <div className={styles.innerTop}>
                  <div className={styles.cardTitle}>升压站/关口表</div>
                  <div>上网电量 {powerData.internetGen || '--'}万kWh</div>
                  <div>损耗 {powerData.internetLost || '--'}万kWh</div>
                </div>
                <div className={this.getLostPercentage(powerData.internetGen, powerData.integratedGen) > 1 ? styles.activeInnerBottom : styles.innerBottom}>损耗 {this.getLostPercentage(powerData.internetGen, powerData.integratedGen)}%</div>
              </div>
            </div>
          </div>
          <div className={styles.targetGraphContainer}>
            <div className={styles.chartWrap}>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>发电效率分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <PowerEfficency
                    graphId={'powerEfficency'}
                    dateType={dateType}
                    title={'发电效率'}
                    data={PowerEffectiveData}
                    hasData={PowerEffectiveHasData}
                    theme={theme}
                  />
                  <TableGraph
                    tableType={'pr'}
                    dateType={dateType}
                    theme={theme}
                    dataArray={efficiencyData} />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  {lineData && (
                    <UsageRate
                      graphId={'usageRateId'}
                      title={'可利用率'}
                      yAxisName={['电站可利用率', '发电系统可利用率']}
                      type={'useRate'}
                      data={lineData}
                      hasData={utilizationData}
                      theme={theme}
                    />
                  )}
                  <TableGraph
                    tableType={'utilization'}
                    dateType={dateType}
                    theme={theme}
                    dataArray={usageData} />
                </div>
              </div>
            </div>
            <div className={styles.chartWrap}>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>损失电量分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    graphId={'lostPower'}
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'损失电量'}
                    dateType={dateType}
                    title={dateType === 'year' ? '损失电量环比' : '损失电量同比'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={barGraphThatYear}
                    barGraphLastYear={barGraphLastYear}
                    barGraphmonth={barGraphmonth}
                    barGraphYearOnYear={barGraphYearOnYear}
                    barGraphRingRatio={barGraphRingRatio}
                    hasData={lostPowerHasData}
                    theme={theme}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={dateType === 'year' ? 'lostPowerRatio' : 'lostPowerTB'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    dataArray={lostPowerData}
                    theme={theme}
                  />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <LostPowerType
                    yAxisName={'损失电量 (万kWh)'}
                    title={'电量损失类型'}
                    xAxisName={'损失电量'}
                    dateType={dateType}
                    data={lostPowerTypeDatas.lostpower}
                    hasData={false}
                    theme={theme}
                  />
                  <div className={styles.LostPowerTypeRate}>
                    <div className={styles.LostPowerTypeTitle}>
                      <div>
                        电量损失类型占比
                        {dateType === 'year' && ' ( ' + startTime + '-' + endTime + ' )'}
                        {dateType === 'month' && ' ( ' + year + ' 年 )'}
                        {dateType === 'day' && ' ( ' + year + '年' + month + '月 )'}

                      </div>
                      <div>损失电量:万kWh</div>
                    </div>
                    <LostPowerTypeRate
                      data={lostPowerTypeDatas.summary}
                      hasData={false}
                      theme={theme}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <LimitPowerRate
                    graphId={'limitPowerRate'}
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'发电量'}
                    title={dateType === 'year' ? '限电率环比' : '限电率同比'}
                    dateType={dateType}
                    data={dateType === 'year' ? limitPowerHB : limitPower}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    hasData={dateType === 'year' ? limitPowerHBHasData : limitPowerHasData}
                    theme={theme}
                  />
                  {dateType === 'year' ?
                    <TableGraph
                      dateType={dateType}
                      tableType={'powerLimitRatio'}
                      dataArray={yearLimitPowerData}
                      theme={theme}
                    />
                    : <LimitPowerRateTable
                      tableType={'limitPower'}
                      currentYear={currentYear}
                      dateType={dateType}
                      lastYear={lastYear}
                      dataArray={limitPowerData}
                      theme={theme}
                    />
                  }
                </div>
              </div>
            </div>
            <div className={styles.chartWrap}>
              <div className={styles.bgStyle}>
                <div className={styles.fontStyle}>能耗分析</div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraphs}>
                  <UsageRate
                    graphId={'usageRateId2'}
                    title={'厂用电情况'}
                    yAxisName={['厂用电率', '综合厂用电率']}
                    data={plantLost}
                    hasData={plantLostHasData}
                    type={'electricity'}
                    theme={theme}
                  />
                  <UsageRate
                    graphId={'usageRateId3'}
                    title={'厂损情况'}
                    yAxisName={['送出线损率', '厂损率']}
                    data={useLost}
                    hasData={useLostHasData}
                    type={'loss'}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default OperateAnalysis;
