import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import styles from './stationResourceAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../../components/Common/TimeSelect/TimeSelectIndex';
import BarGraph from '../CommonGraphs/BarGraph';
import LightDistribution from './Charts/DistributionMonthBar';
import LightYearDistrubution from './Charts/DistributionYearBar';
import TableGraph from '../CommonGraphs/TableGraph';
import YearLightDistributionTable from './Table/yearDistribution';
import WeatherStatus from '../CommonGraphs/barStack';
import WeatherRate from './Charts/WeatherRate';
import WeatherDayStatus from './Charts/WeatherDayChart';
import moment from 'moment';

class StationResourceAnalysis extends React.Component {
  static propTypes = {
    changeResourceStore: PropTypes.func,
    dateType: PropTypes.string,
    month: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    selectYear: PropTypes.any,
    year: PropTypes.any,
    stationCode: PropTypes.any,
    getResourcePlan: PropTypes.func,
    resetStore: PropTypes.func,
    resourceAvalibaData: PropTypes.array, //计划完成是否有数据
    resourcePlanData: PropTypes.array, // 计划完成情况
    PvCompareData: PropTypes.array, //月/日单电站光资源同比
    YearPvCompareData: PropTypes.array, //年单电站光资源
    resourceMonthLight: PropTypes.array, //月/日光资源分布
    resourceYearLight: PropTypes.array, //年光资源分布
    resourceMonthWeather: PropTypes.object, //月/年天气预报
    resourceDayWeather: PropTypes.object, //日天气预报
    location: PropTypes.object, //路径
    hash: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
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
    const outStationCode = props.location.hash ? props.location.hash.split('#')[1] : null;
    const initStations = stations.toJS().filter(e => e.stationType === 1);
    const initStationCode = stationCode ? stationCode : (outStationCode ? outStationCode : initStations[0].stationCode);
    const prams = {
      stationCode: initStationCode,
      dateType,
      year: choiceYear,
    };
    props.changeResourceStore({ ...prams, selectYear: choiceYear });
    props.getResourcePlan({ ...prams, dateType: 'year' });
    props.getResourcePvCompare(prams);
    props.getResourceMonthLight(prams);
    props.getResourceMonthWeather({ ...prams, year: [choiceYear] });
  }


  getDayData = (props) => {
    const { dateType, year, month, stationCode } = props;
    const choiceYear = year ? year : moment().year();
    const choiceMonth = month ? month : moment().month();
    const prams = {
      stationCode: stationCode,
      dateType,
      year: choiceYear,
      month: choiceMonth,
    };
    props.changeResourceStore({ ...prams, selectYear: choiceYear });
    props.getResourcePlan(prams);
    props.getResourcePvCompare(prams);
    props.getResourceMonthLight(prams);
    props.getResourceDayWeather(prams);
  }

  getYearData = (props) => {
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
    props.changeResourceStore({ startTime: startYear, endTime: endYear });
    props.getResourcePlan({ ...prams, year: endYear });
    props.getResourceYearPvCompare(prams);
    props.getResourceYearLight(prams);
    props.getResourceMonthWeather(prams);
  }

  stationSelected = (rest) => { // 电站条件查询
    const stationCode = rest[0].stationCode;
    this.props.changeResourceStore({ stationCode });
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
      this.props.changeResourceStore({
        year,
        month,
        dateType: data.timeStyle,
      });
    } else if (data.timeStyle === 'month') {
      this.props.changeResourceStore({ year: data.startTime, dateType: data.timeStyle });
    } else {
      this.props.changeResourceStore({ startTime: data.startTime, endTime: data.endTime, dateType: data.timeStyle });
    }
  }

  selctYear = (year) => { // 电站看单年的时间选择
    const specilPrams = {
      stationCode: this.props.stationCode,
      dateType: 'year',
      year: year,
    };
    this.props.getResourcePlan(specilPrams);
    this.props.changeResourceStore({ selectYear: year });
  }


  render() {
    const { stations, dateType, stationCode, year, month, resourceAvalibaData, resourcePlanData, PvCompareData, resourceMonthLight, selectYear, resourceMonthWeather, YearPvCompareData, resourceYearLight, resourceDayWeather, startTime, endTime, theme } = this.props;
    let station = '';
    stationCode ? station = stations.toJS().filter(e => e.stationCode === +stationCode) : '';
    const currentYear = `${parseInt(year)}`;
    const lastYear = `${parseInt(year) - 1}`;


    // 光资源同比/环比
    const resourceLight = dateType === 'year' ? YearPvCompareData || [] : PvCompareData || [];
    const lightLastYear = resourceLight ? resourceLight.map(e => e.lastYearData) : [];
    const lightThatYea = resourceLight.map(e => e.thatYearData);
    const lightYearOnYear = resourceLight.map(e => e.lightYearOnYear);
    const lightMonth = resourceLight.map((e, i) => { return this.addXaixsName(e.monthOrDay, dateType); });
    const lightYear = YearPvCompareData && YearPvCompareData.map(e => e.year);
    const lightRingRatio = resourceLight.map(e => e.ringRatio);
    const resourceLightHasData = resourceLight.length > 0;


    // 光资源分布
    const radiationIntervalList = resourceMonthLight && resourceMonthLight.length > 0 && resourceMonthLight[0].radiationIntervalList || [];
    const radiationInterval = radiationIntervalList.map(e => e.radiationInterval);
    const radiationSum = radiationIntervalList.map(e => e.radiationSum);
    const ration = radiationIntervalList.map(e => e.ration);
    const resourceDisData = resourceMonthLight && (radiationSum.some(e => e || e === 0) || ration.some(e => e || e === 0));
    const resourceData = {
      xData: radiationInterval,
      yData: {
        barData: radiationSum,
        lineData: ration,
      },
    };

    // 年光资源分布
    const distributionYear = resourceYearLight && resourceYearLight.map(e => e.date) || [];
    const radiationIntervalLists = resourceYearLight && resourceYearLight.map(e => e.radiationIntervalList) || [];
    const name = radiationIntervalLists.length > 0 && radiationIntervalLists[0].map(e => e.radiationInterval) || [];
    const allData = [];
    radiationIntervalLists.forEach(list => list.forEach(item => allData.push(item)));
    const typeList = name.map((item, index) => {
      return allData.filter(e => e.radiationInterval === item);
    });
    const distributionYearData = [];
    name.forEach((item, index) => {
      distributionYearData.push({
        name: item,
        data: typeList[index].map(e => e.radiationSum),
      });
    });
    const distributionTable = [];
    typeList.forEach((item, index) => {
      const tableList = {};
      tableList.radiationInterval = item[0].radiationInterval;
      item.forEach((list, key) => {
        tableList[distributionYear[key]] = list.radiationSum;
      });
      distributionTable.push(tableList);
    });
    const distributionYearHasData = allData && allData.map(e => e.radiationSum).some(e => e || e === 0);



    // 天气情况
    const WeatherStatusDatas = resourceMonthWeather && resourceMonthWeather.chartData || [];
    const weatherDate = WeatherStatusDatas.map(e => { return this.addXaixsName(e.year, dateType); });
    const otherWeather = [], sunny = [], cloudy = [], rain = [], snow = [], haze = []; //"雪1", "雨2", "霾3", "阴4", "晴5","其他0"
    const weather = [otherWeather, snow, rain, haze, cloudy, sunny];
    WeatherStatusDatas.map((item, index) => {
      if (item.weatherList) {
        item.weatherList.map((list) => {
          weather[+list.weather][index] = list.days;
        });
      }

    });
    const WeatherStatusData = {
      date: weatherDate,
      sunny: weather[5],
      cloudy: weather[4],
      rain: weather[2],
      snow: weather[1],
      haze: weather[3],
      otherWeather: weather[0],
    };
    const WeatherStatusHasData = otherWeather.length > 0 || sunny.length > 0 || cloudy.length > 0 || rain.length > 0 || snow.length > 0 || haze.length > 0;
    const weatherRate = resourceMonthWeather && resourceMonthWeather.pitChartData || [];



    // 天气情况日
    const WeatherDayData = resourceDayWeather && resourceDayWeather.chartData || [];
    const weatherDayRate = resourceDayWeather && resourceDayWeather.pitChartData || [];
    const WeatherDayXData = WeatherDayData.map(e => { return this.addXaixsName(e.day, dateType); });
    const WeatherDayHasData = WeatherDayData.map(e => e.temp).some(e => e || e === 0);

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
              <TimeSelect onChange={this.changeDate} timerText="" theme={theme} />
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
                <div className={styles.choiceYear}>{
                  dateType === 'year' && resourceAvalibaData && resourceAvalibaData.map((item, index) => {
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
                <div className={styles.stationTargetValue}>{resourcePlanData.length > 0 && (resourcePlanData[0].resourceValue || resourcePlanData[0].resourceValue === 0) ? resourcePlanData[0].resourceValue : '--'}</div>
                <div className={styles.stationTargetName}>斜面辐射总量 MJ/㎡ </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{resourcePlanData.length > 0 && (resourcePlanData[0].sunshineHours || resourcePlanData[0].sunshineHours === 0) ? resourcePlanData[0].sunshineHours : '--'}</div>
                <div className={styles.stationTargetName}>日照时数 h </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{resourcePlanData.length > 0 && (resourcePlanData[0].temperatureAvg || resourcePlanData[0].temperatureAvg === 0) ? parseFloat(resourcePlanData[0].temperatureAvg).toFixed(2) : '--'}</div>
                <div className={styles.stationTargetName}>平均气温 ℃</div>
              </div>
            </div>

          </div>

          <div className={styles.targetGraphContainer}>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  graphId={'power'}
                  yAxisName={'辐射总量 (MJ/㎡)'}
                  xAxisName={'辐射总量'}
                  title={dateType === 'year' ? '光资源环比' : '光资源同比'}
                  dateType={dateType}
                  barGraphLastYear={lightLastYear}
                  barGraphThatYear={lightThatYea}
                  barGraphYearOnYear={lightYearOnYear}
                  barGraphmonth={dateType === 'year' ? lightYear : lightMonth}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphRingRatio={lightRingRatio}
                  hasData={resourceLightHasData}
                  theme={theme}
                />
                {dateType === 'year' ?
                  <TableGraph
                    tableType={'lightRatio'}
                    dateType={dateType}
                    dataArray={YearPvCompareData}
                    theme={theme}
                  />
                  :
                  <TableGraph
                    tableType={'lightAnotherTB'}
                    dateType={dateType}
                    dataArray={PvCompareData}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    theme={theme}
                  />
                }
              </div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                {dateType === 'year' ?
                  <LightYearDistrubution
                    xData={distributionYear}
                    yData={distributionYearData}
                    title={'光资源分布'}
                    yAxisName={' 辐射总量(MJ/㎡)'}
                    xAxisName={'瞬时辐射区间'}
                    graphId={'yearLightDistribution'}
                    dateType={dateType}
                    hasData={distributionYearHasData}
                    theme={theme}
                  />
                  :
                  <LightDistribution
                    graphId={'LightDistribution'}
                    yAxisName={' 辐射总量(MJ/㎡)'}
                    xAxisName={'瞬时辐射区间'}
                    data={resourceData}
                    hasData={resourceDisData}
                    title={'光资源分布'}
                    theme={theme}
                    dateType={dateType} />}
                {(dateType === 'year' &&
                  <YearLightDistributionTable
                    dataArray={distributionTable}
                    column={distributionYear}
                    bordered={true}
                    theme={theme}
                  />) ||
                  <TableGraph
                    tableType={'lightDistributed'}
                    dateType={dateType}
                    theme={theme}
                    dataArray={radiationIntervalList}
                  />}
              </div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                {
                  dateType === 'day' ?
                    <WeatherDayStatus
                      graphId={'weatherId'}
                      yAxisName={'℃'}
                      title={'天气情况'}
                      dateType={dateType}
                      xData={WeatherDayXData}
                      yData={WeatherDayData}
                      hasData={WeatherDayHasData}
                      theme={theme}
                    /> : <WeatherStatus
                      graphId={'weatherId'}
                      yAxisName={'天'}
                      title={'天气情况'}
                      dateType={dateType}
                      data={WeatherStatusData}
                      hasData={WeatherStatusHasData}
                      theme={theme}
                    />
                }

                <div className={styles.LostPowerTypeRate}>
                  <div className={styles.LostPowerTypeTitle}>
                    <div>天气情况占比
                      {dateType === 'year' && ' ( ' + startTime + '-' + endTime + ' )'}
                      {dateType === 'month' && ' ( ' + year + ' 年 )'}
                      {dateType === 'day' && ' ( ' + year + '年' + month + '月 )'}
                    </div>
                  </div>
                  <WeatherRate
                    graphId={'weatherRate'}
                    data={dateType === 'day' ? weatherDayRate : weatherRate}
                    yAxisName={'光伏发电系统故障'}
                    hasData={dateType === 'day' ? (weatherRate || false) : (weatherDayRate || false)}
                    xAxisName={'损失电量'}
                    hasData={dateType === 'day' ? WeatherDayHasData : WeatherStatusHasData}
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
export default (StationResourceAnalysis);
