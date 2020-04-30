import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Radio } from 'antd';
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
import moment from 'moment';

class OperateAnalysis extends React.Component {
  static propTypes = {
    stationType: PropTypes.string,
    dateType: PropTypes.string,
    year: PropTypes.any,
    selectYear: PropTypes.any,
    month: PropTypes.string,
    stations: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    stationCode: PropTypes.number,
    changeOperateStationStore: PropTypes.func,
    getOperatePlanComplete: PropTypes.func,
    getComponentPowerStatistic: PropTypes.func,
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
    if (stations.length > 0) {
      this.getMonthData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dateType, year, month, startTime, endTime, stationCode, stations } = nextProps;
    if (stations.length > 0) {
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
    const initStations = stations.filter(e => e.stationType === 1);
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
    for (let i = +startYear; i < +endYear + 1; i++) {
      rangeYear.push(`${i}`);
    }
    const station = stations.filter(e => { if (e.stationCode === +stationCode) { return e.stationType; } });
    const prams = {
      stationCode: stationCode,
      dateType,
      year: [startYear, endYear],
    };
    const specilPrams = {
      stationCode: stationCode ? stationCode : stations[0].stationCode,
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
    if (+molecule === 0 || +denominator === 0) { return 0; }
    const perNum = (denominator - molecule) / denominator * 100;
    if ((perNum > 0 && perNum < 100) || perNum === 0) {
      return perNum.toFixed(2);
    }
    return '--';
  }

  stationSelected = (rest) => { // 电站条件查询
    const stationCode = rest[0].stationCode;
    this.props.changeOperateStationStore({ stationCode });
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

  selctYear = (e) => { // 电站看单年的时间选择
    const yearPrams = {
      stationCode: this.props.stationCode,
      dateType: 'year',
      year: e.target.value,
    };
    this.props.getOperatePlanComplete(yearPrams);
    this.props.getComponentPowerStatistic(yearPrams);
    this.props.changeOperateStationStore({ selectYear: e.target.value });
  }

  selectProductYear = () => { // 运行分析的时间
    const { operateAvalibaData = [], selectYear } = this.props;
    if (operateAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${selectYear}`} buttonStyle="solid" onChange={this.selctYear}>
          {operateAvalibaData.map((e, index) => {
            return (<Radio.Button value={e.year} key={index} className={`${!e.isTrue && styles.disabled} ${styles.selectButton}`}>{e.year}</Radio.Button>);
          })}
        </Radio.Group>
      );
    }
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
    const { stations, dateType, stationCode, year, month, startTime, endTime, theme } = this.props;
    const { operatePlanCompleteData = {}, powerData = [], lostPowerData, efficiencyData = [], usageData = [], lostPowerTypeDatas, limitPowerData = [], yearLimitPowerData = [], plantPowerData = [] } = this.props;
    const station = stationCode && stations.filter(e => `${e.stationCode}` === `${stationCode}`) || [];
    const stationItem = station.length > 0 && station[0];
    const { onGridTime, provinceName, stationName } = stationItem;
    const initDateType = { 'month': '月', 'year': '', 'day': '日' };
    const currentYear = `${year}`;
    const lastYear = `${year - 1}`;

    // 发电效率
    const PowerEffectiveData = {
      xData: efficiencyData.map((e) => (`${e.date}${initDateType[dateType]}`)),
      yData: {
        barData: { hours: efficiencyData.map(e => e.hours) },
        lineData: { pr: efficiencyData.map(e => e.pr), light: efficiencyData.map(e => e.light) },
      },
    };

    // 限电率同比
    const limitPower = {
      xData: limitPowerData.map((e) => (`${e.date}${initDateType[dateType]}`)),
      yData: {
        lineData: {
          thatYearLostPowerRate: limitPowerData.map((e) => (e.thatYearLostPowerRate)),
          lastyearLostPowerRate: limitPowerData.map((e) => (e.lastyearLostPowerRate)),
          lostPowerRateYearOnYear: limitPowerData.map((e) => (e.lostPowerRateYearOnYear)),
        },
        barData: {
          thatYearLostPower: limitPowerData.map((e) => (e.thatYearLostPower)),
          lastyearLostPower: limitPowerData.map((e) => (e.lastyearLostPower)),
        },
      },
    };

    // 限电率环比
    const limitPowerHB = {
      xData: yearLimitPowerData && yearLimitPowerData.map((e) => (`${e.date}${initDateType[dateType]}`)),
      yData: {
        lineData: {
          limitPowerRate: yearLimitPowerData.map((e) => (e.limitPowerRate)),
          ringRatio: yearLimitPowerData.map((e) => (e.ringRatio)),
        },
        barData: {
          limitPower: yearLimitPowerData.map((e) => (e.limitPower)),
        },
      },
    };

    // 能耗分析
    const plantLost = {
      xData: plantPowerData.map((e) => (`${e.date}${initDateType[dateType]}`)),
      yData: [plantPowerData.map(e => e.plantPower), plantPowerData.map(e => e.comPlant)],
    };

    const useLost = {
      xData: plantPowerData.map((e) => (`${e.date}${initDateType[dateType]}`)),
      yData: [plantPowerData.map(e => e.sendLine), plantPowerData.map(e => e.plantLoss)],
    };
    return (
      <div className={`${styles.singleStationType} ${styles[theme]}`}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
              <span className={styles.text}>条件查询</span>
              <StationSelect
                data={stations.filter(e => e.stationType === 1)}
                holderText={'电站名-区域'}
                value={station}
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
                <i className={`iconfont icon-pvlogo ${styles.stationIcon}`} />
                {`${stationName}-${provinceName}`}
                {dateType === 'year' && this.selectProductYear()}
              </div>
              <span className={styles.rightFont}>并网时间:{onGridTime && moment(onGridTime).format('YYYY年MM月DD日') || '--'}</span>
            </div>

            <div className={styles.graph}>
              {[
                { name: 'PR', unit: '%', value: 'pr' },
                { name: 'CPR', unit: '%', value: 'cpr' },
                { name: '理论发电量 万kWh', unit: '', value: 'theoryPower' },
                { name: '实际发电量 万kWh', unit: '', value: 'actualPower' },
                { name: '损失电量 万kWh', unit: '', value: 'lostPower' },
              ].map(e => {
                return (
                  <div className={styles.stationTargetData} key={e.value}>
                    <div className={styles.stationTargetValue}>{operatePlanCompleteData[e.value] || '--'}{e.unit}</div>
                    <div className={styles.stationTargetName}>{e.name} </div>
                  </div>
                );
              })
              }
            </div>
          </div>
          <div className={styles.cardContainer}>

            <div className={styles.cardList}>
              <div className={`${styles.cardItem} ${styles.lightResourcesn}`}>
                <div className={styles.innerTop}>
                  <div className={styles.cardTitle}>光资源</div>
                  <div>辐射总量 {powerData.resourceValue || '--'}MJ/㎡</div>
                  <div>理论发电量 {powerData.theoryGen || '--'}万kWh</div>
                </div>
              </div>
              {[
                {
                  'name': 'photovoltaicModule',
                  'cardTitle': '光伏组串',
                  'power': ['发电量', 'componentGen', '万kWh'],
                  'lost': ['损耗', 'componentLost', '万kWh'],
                  'extra': '12',
                  'contrast': 'theoryGen',
                },
                {
                  'name': 'inverter',
                  'cardTitle': '逆变器',
                  'power': ['发电量', 'inverterGen', '万kWh'],
                  'lost': ['损耗', 'inverterLost', '万kWh'],
                  'extra': '3',
                  'contrast': 'componentGen',
                },
                {
                  'name': 'electricPowerLine',
                  'cardTitle': '集电线路',
                  'power': ['发电量', 'integratedGen', '万kWh'],
                  'lost': ['损耗', 'integratedLost', '万kWh'],
                  'extra': '2',
                  'contrast': 'inverterGen',
                },
                {
                  'name': 'boosterStation',
                  'cardTitle': '升压站/关口表',
                  'power': ['上网电量', 'internetGen', '万kWh'],
                  'lost': ['损耗', 'internetLost', '万kWh'],
                  'extra': '1',
                  'contrast': 'integratedGen',
                },
              ].map(list => {
                const [name, value, unit] = list.power;
                const [name2, value2, unit2] = list.lost;
                const lostValue = this.getLostPercentage(powerData[value], powerData[list.contrast]);
                return (
                  <React.Fragment>
                    <Icon type="double-right" theme="outlined" />
                    <div className={`${styles.cardItem} ${styles[list.name]}`}>
                      <div className={styles.innerTop}>
                        <div className={styles.cardTitle}>{list.cardTitle}</div>
                        <div>{name} {powerData[value] || '--'}{unit}</div>
                        <div>{name2} {powerData[value2] || '--'}{unit2}</div>
                      </div>
                      <div className={lostValue > list.extra ? styles.activeInnerBottom : styles.innerBottom}>损耗 {lostValue}%</div>
                    </div>
                  </React.Fragment>
                );
              })
              }
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
                    hasData={this.hasData(efficiencyData)}
                    theme={theme}
                  />
                  {/* 因为排序是内部存储的，排序的结果没有暴露出来 */}
                  {dateType === 'year' && <TableGraph
                    tableType={'pr'} dateType={dateType} dataArray={efficiencyData}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'pr'}
                  />}
                  {dateType === 'month' && <TableGraph
                    tableType={'pr'} dateType={dateType} dataArray={efficiencyData}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'pr'}
                  />}
                  {dateType === 'day' && <TableGraph
                    tableType={'pr'} dateType={dateType} dataArray={efficiencyData}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'pr'}
                  />}

                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <UsageRate
                    graphId={'usageRateId'}
                    title={'可利用率'}
                    yAxisName={['电站可利用率', '发电系统可利用率']}
                    type={'useRate'}
                    data={{
                      xData: usageData.map((e) => (`${e.date}${initDateType[dateType]}`)),
                      yData: [usageData.map(e => e.stationUtilization), usageData.map(e => e.deviceUtilization)],
                    }}
                    hasData={this.hasData(usageData)}
                    theme={theme}
                  />
                  {dateType === 'year' && <TableGraph
                    tableType={'utilization'} dateType={dateType} dataArray={usageData}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'deviceUtilization'}
                  />}
                  {dateType === 'month' && <TableGraph
                    tableType={'utilization'} dateType={dateType} dataArray={usageData}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'deviceUtilization'}
                  />}
                  {dateType === 'day' && <TableGraph
                    tableType={'utilization'} dateType={dateType} dataArray={usageData}
                    className={styles.tableChart} sortMethod={'ascend'} sortField={'deviceUtilization'}
                  />}

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
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'损失电量'}
                    dateType={dateType}
                    title={dateType === 'year' ? '损失电量环比' : '损失电量同比'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    barGraphThatYear={lostPowerData.map((e) => (e.thatYearData))}
                    barGraphLastYear={lostPowerData.map((e) => (e.lastYearData))}
                    barGraphmonth={lostPowerData.map((e) => (`${e.date}${initDateType[dateType]}`))}
                    barGraphYearOnYear={lostPowerData.map((e) => (e.yearOnYear))}
                    barGraphRingRatio={lostPowerData.map((e) => (e.ringRatio))}
                    hasData={this.hasData(lostPowerData)}
                    theme={theme}
                  />
                  {dateType === 'year' && <TableGraph
                    dateType={dateType} tableType={'lostPowerRatio'} currentYear={currentYear} lastYear={lastYear}
                    dataArray={lostPowerData} className={styles.tableChart} sortMethod={'descend'} sortField={'ringRatio'}
                  />}
                  {dateType === 'month' && <TableGraph
                    dateType={dateType} tableType={'lostPowerTB'} currentYear={currentYear} lastYear={lastYear}
                    dataArray={lostPowerData} className={styles.tableChart} sortMethod={'descend'} sortField={'yearOnYear'}
                  />}
                  {dateType === 'day' && <TableGraph
                    dateType={dateType} tableType={'lostPowerTB'} currentYear={currentYear} lastYear={lastYear}
                    dataArray={lostPowerData} className={styles.tableChart} sortMethod={'descend'} sortField={'yearOnYear'}
                  />}
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
                      className={styles.tableChart}
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
                    hasData={dateType === 'year' ? this.hasData(yearLimitPowerData) : this.hasData(limitPowerData)}
                    theme={theme}
                  />
                  {dateType === 'year' && <TableGraph
                    dateType={dateType} tableType={'powerLimitRatio'} dataArray={yearLimitPowerData}
                    className={styles.tableChart} sortMethod={'descend'} sortField={'ringRatio'}
                  />}
                  {dateType === 'month' &&
                    <TableGraph
                      dateType={dateType} tableType={'limitPower'} currentYear={currentYear} lastYear={lastYear}
                      dataArray={limitPowerData} className={styles.tableChart} sortMethod={'descend'} sortField={'lostPowerRateYearOnYear'}
                      scroll={{ y: 170 }}
                    />
                  }
                  {dateType === 'day' &&
                    <TableGraph
                      dateType={dateType} tableType={'limitPower'} currentYear={currentYear} lastYear={lastYear}
                      dataArray={limitPowerData} className={styles.tableChart} sortMethod={'descend'} sortField={'lostPowerRateYearOnYear'}
                      scroll={{ y: 170 }}
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
                    hasData={this.hasData(plantPowerData)}
                    type={'electricity'}
                    theme={theme}
                  />
                  <UsageRate
                    graphId={'usageRateId3'}
                    title={'厂损情况'}
                    yAxisName={['送出线损率', '厂损率']}
                    data={useLost}
                    hasData={this.hasData(plantPowerData)}
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
