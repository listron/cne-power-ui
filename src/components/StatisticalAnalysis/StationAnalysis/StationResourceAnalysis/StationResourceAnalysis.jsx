import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Radio, Select } from 'antd';
import styles from './stationResourceAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../../components/Common/TimeSelect/TimeSelectIndex';
import BarGraph from '../CommonGraphs/BarGraph';
import LightDistribution from './Charts/DistributionMonthBar';
import LightYearDistrubution from './Charts/DistributionYearBar';
import TableGraph from '../CommonGraphs/TableGraph';
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
    const outStationCode = props.location.hash ? props.location.hash.split('#')[1] : null;
    const initStations = stations.filter(e => e.stationType === 1);
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
    const station = stations.filter(e => { if (e.stationCode === +stationCode) { return e.stationType; } });
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

  selectYear = (e) => { // 电站看单年的时间选择
    const specilPrams = {
      stationCode: this.props.stationCode,
      dateType: 'year',
      year: e.target.value,
    };
    this.props.getResourcePlan(specilPrams);
    this.props.changeResourceStore({ selectYear: e.target.value });
  }

  selectProductYear = () => { // 运行分析的时间
    const { resourceAvalibaData = [], selectYear } = this.props;
    if (resourceAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${selectYear}`} buttonStyle="solid" onChange={this.selectYear}>
          {resourceAvalibaData.map((e, index) => {
            return (<Radio.Button value={e.year} key={index} className={`${!e.isTrue && styles.disabled} ${styles.selectButton}`}>{e.year}</Radio.Button>);
          })}
        </Radio.Group>
      );
    }
  }

  hasData = (dataArray, filteArray) => {
    let flag = false;
    if (dataArray.length > 0) {
      const temp = [];
      // 日期不做判断   date monthOrDay
      let filteArr = ['date', 'monthOrDay', 'year'];
      if (Array.isArray(filteArray) && filteArray.length > 0) {
        filteArr = filteArray;
      }
      const typeArr = Object.keys(dataArray[0]).filter(e => !filteArr.includes(e));
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
    const { stations, dateType, stationCode, year, month, selectYear, resourceMonthWeather = {}, resourceDayWeather = {}, startTime, endTime, theme } = this.props;
    const { resourcePlanData = [], PvCompareData = [], resourceMonthLight = [], YearPvCompareData = [], resourceYearLight = [] } = this.props;

    const station = stationCode && stations.filter(e => `${e.stationCode}` === `${stationCode}`) || [];
    const stationItem = station.length > 0 && station[0];
    const { onGridTime, provinceName, stationName } = stationItem;
    const currentYear = `${year}`;
    const lastYear = `${year - 1}`;
    const initDateType = { 'month': '月', 'year': '', 'day': '日' };
    const { resourceValue = '', sunshineHours = '', temperatureAvg = '' } = resourcePlanData.length > 0 && resourcePlanData[0] || {};

    // 光资源同比/环比
    const resourceLight = dateType === 'year' ? YearPvCompareData : PvCompareData;

    // 光资源分布
    const { radiationIntervalList = [] } = resourceMonthLight.length > 0 && resourceMonthLight[0];
    const radiationInterval = radiationIntervalList.map(e => e.radiationInterval);
    const resourceData = {
      xData: radiationInterval,
      yData: {
        barData: radiationIntervalList.map(e => e.radiationSum),
        lineData: radiationIntervalList.map(e => e.ration),
      },
    };

    // 年光资源分布
    const distributionYear = resourceYearLight.map(e => e.date);
    const radiationIntervalLists = resourceYearLight.map(e => e.radiationIntervalList);
    const allData = [], distributionYearData = [];
    radiationIntervalLists.forEach(list => list.forEach(item => allData.push(item)));
    const typeList = radiationInterval.map((item, index) => allData.filter(e => e.radiationInterval === item));
    radiationInterval.forEach((item, index) => {
      distributionYearData.push({
        name: item,
        data: typeList[index].map(e => e.radiationSum),
      });
    });
    const distributionTable = [];
    typeList.forEach((item, index) => {
      if (item.length > 0) {
        const tableList = {};
        tableList.radiationInterval = item[0].radiationInterval;
        item.forEach((list, key) => {
          tableList[distributionYear[key]] = list.radiationSum;
        });
        distributionTable.push(tableList);
      }
    });
    const clientWidth = document.body.clientWidth;
    const yearColumn = [
      {
        title: '瞬时辐射区间',
        dataIndex: 'radiationInterval',
        key: 'radiationInterval',
        fixed: 'left',
        defaultSortOrder: 'ascend',
        sorter: true,
        width: '140px',
        render: text => (text || text === 0) ? text : '--',
      }, {
        title: '辐射总量',
        children: distributionYear.map((item) => {
          return {
            title: item,
            dataIndex: item,
            key: item,
            sorter: true,
            width: '80px',
            render: text => <div className={styles.rightText}>{(text || text === 0) ? text : '--'}</div>,
          };
        }),
      }];

    // 天气情况
    const WeatherStatusDatas = resourceMonthWeather.chartData || [];
    const weatherDate = WeatherStatusDatas.map((e) => (`${e.year}${initDateType[dateType]}`));
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
    const weatherRate = resourceMonthWeather.pitChartData || [];

    // 天气情况日
    const { chartData = [], pitChartData = [] } = resourceDayWeather;
    const WeatherDayHasData = chartData.map(e => e.temp).some(e => e || e === 0);
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
              </div>
              <span className={styles.rightFont}>并网时间:{onGridTime && moment(onGridTime).format('YYYY年MM月DD日') || '--'}</span>
            </div>
            {dateType === 'year' && <div className={styles.yearWrap}>{this.selectProductYear()}</div>}
            <div className={styles.graph}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{resourceValue || '--'}</div>
                <div className={styles.stationTargetName}>斜面辐射总量 MJ/㎡ </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{sunshineHours || '--'}</div>
                <div className={styles.stationTargetName}>日照时数 h </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{temperatureAvg && temperatureAvg.toFixed(2) || '--'}</div>
                <div className={styles.stationTargetName}>平均气温 ℃</div>
              </div>
            </div>

          </div>

          <div className={styles.targetGraphContainer}>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  yAxisName={'辐射总量 (MJ/㎡)'}
                  xAxisName={'辐射总量'}
                  title={dateType === 'year' ? '光资源环比' : '光资源同比'}
                  dateType={dateType}
                  barGraphLastYear={resourceLight.map(e => e.lastYearData)}
                  barGraphThatYear={resourceLight.map(e => e.thatYearData)}
                  barGraphYearOnYear={resourceLight.map(e => e.lightYearOnYear)}
                  barGraphmonth={resourceLight.map((e) => (`${e.monthOrDay || e.year}${initDateType[dateType]}`))}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphRingRatio={resourceLight.map(e => e.ringRatio)}
                  hasData={this.hasData(resourceLight)}
                  theme={theme}
                />
                {dateType === 'year' && <TableGraph
                  tableType={'lightRatio'}
                  dateType={dateType}
                  dataArray={YearPvCompareData}
                  theme={theme}
                  sortMethod={'ascend'} sortField={'thatYearData'}
                />
                }
                {dateType === 'month' && <TableGraph
                  tableType={'lightAnotherTB'} dateType={dateType} dataArray={PvCompareData} currentYear={currentYear}
                  lastYear={lastYear} theme={theme} sortMethod={'ascend'} sortField={'lightYearOnYear'}
                />}
                {dateType === 'day' && <TableGraph
                  tableType={'lightAnotherTB'} dateType={dateType} dataArray={PvCompareData} currentYear={currentYear}
                  lastYear={lastYear} theme={theme} sortMethod={'ascend'} sortField={'lightYearOnYear'}
                />}
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
                    hasData={this.hasData(allData, ['radiationInterval'])}
                    theme={theme}
                  />
                  :
                  <LightDistribution
                    graphId={'LightDistribution'}
                    yAxisName={' 辐射总量(MJ/㎡)'}
                    xAxisName={'瞬时辐射区间'}
                    data={resourceData}
                    hasData={this.hasData(radiationIntervalList, ['radiationInterval'])}
                    title={'光资源分布'}
                    theme={theme}
                    dateType={dateType} />}

                {dateType === 'year' && <TableGraph
                  dateType={dateType} sortMethod={'ascend'} sortField={'radiationInterval'} column={yearColumn}
                  dataArray={distributionTable.map((e, i) => ({ ...e, key: i }))} title={'光资源分布排名'} unit={'瞬时辐射区间:w/㎡ ,辐射总量:MJ/㎡'}
                  scroll={{ x: 'max-content', y: 151 }} className={styles.radiationInterval} />
                }
                {dateType === 'month' && <TableGraph
                  tableType={'lightDistributed'} dateType={dateType} theme={theme} dataArray={radiationIntervalList.map((e, i) => ({ ...e, key: i }))} sortMethod={'ascend'} sortField={'radiationInterval'} />
                }
                {dateType === 'day' && <TableGraph
                  tableType={'lightDistributed'} dateType={dateType} theme={theme} dataArray={radiationIntervalList.map((e, i) => ({ ...e, key: i }))} sortMethod={'ascend'} sortField={'radiationInterval'} />
                }
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
                      xData={chartData.map((e) => (`${e.date}${initDateType[dateType]}`))}
                      yData={chartData}
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
                    data={dateType === 'day' ? pitChartData : weatherRate}
                    yAxisName={'光伏发电系统故障'}
                    hasData={dateType === 'day' ? (weatherRate || false) : (pitChartData || false)}
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
