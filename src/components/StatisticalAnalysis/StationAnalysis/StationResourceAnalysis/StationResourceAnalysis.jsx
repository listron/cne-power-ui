import React from "react";
import PropTypes from "prop-types";
import { Select } from 'antd';
import styles from './stationResourceAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../../components/Common/TimeSelect/TimeSelectIndex';
import BarGraph from '../AllStationAnalysis/CommonGraph/BarGraph';
import LightDistribution from './LightDistribution';
import TableGraph from '../AllStationAnalysis/CommonGraph/TableGraph';
import YearLightDistributionTable from './YearLightDistributionTable';
import WeatherStatus from './WeatherStatus';
import LostPowerTypeRate from '../OperateAnalysis/LostPowerTypeRate';
import moment from 'moment';

class ProductionAnalysis extends React.Component {
  static propTypes = {
    changeResourceStore: PropTypes.func,
    dateType: PropTypes.string,
    // year: PropTypes.numb,
    month: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    // stationCode: PropTypes.number,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { stations } = this.props;
    if (stations.toJS().length > 0) {
      this.getMonthData(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dateType, year, month, startTime, endTime, stationCode } = nextProps;
    if (year) {
      if (dateType === "month" && (this.props.year !== year || this.props.stationCode !== stationCode)) {
        this.getMonthData(nextProps)
      } else if (dateType === "month" && this.props.dateType !== 'month') {
        this.getMonthData(nextProps)
      }

      // if (dateType === 'day' && this.props.dateType !== 'day') {
      //   this.getDayData(nextProps)
      // } else {
      //   if (dateType === 'day' && (this.props.month !== month || this.props.year !== year || this.props.stationCode !== stationCode)) {
      //     this.getDayData(nextProps)
      //   }
      // }

      // if (dateType === 'year' && this.props.dateType !== 'year') {
      //   this.getYearData(nextProps)
      // } else {
      //   if (dateType === 'year' && (this.props.startTime !== startTime || this.props.endTime !== endTime || this.props.stationCode !== stationCode)) {
      //     this.getYearData(nextProps)
      //   }
      // }

    } else {
      this.getMonthData(nextProps)
    }
  }

  getMonthData = (props) => { // 月的时间选择 初始加载
    const { dateType, year, stations, stationCode } = props;
    const choiceYear = year ? year : moment().year();
    let prams = {
      stationCode: stationCode ? stationCode : stations.toJS()[0].stationCode,
      dateType,
      year: choiceYear
    }
    let yearPrams = {
      stationCode: stationCode ? stationCode : stations.toJS()[0].stationCode,
      dateType: "year",
      year: choiceYear,
    }
    props.changeResourceStore({ ...prams, selectYear: choiceYear })
    props.getResourcePlan(prams)
    props.getResourcePvCompare(prams)
    props.getResourceMonthLight(prams)
  }

  stationSelected = (rest) => { // 电站条件查询
    const stationCode = rest[0].stationCode
    this.props.changeResourceStore({ stationCode })
  }

  addXaixsName = (value, dateType) => { // 根据时间增加单位
    let result = '';
    switch (dateType) {
      case 'month':
        result = value + ' 月'
        break;
      case 'year':
        result = value
        break;
      case 'day':
        result = value + ' 日';
      default:
        break;
    }
    return result
  }
  changeDate = (data) => { // 改变统计时间
    let year = " ";
    let month = "";
    if (data.timeStyle === 'day') {
      year = data.startTime.split('-')[0]
      month = data.startTime.split('-')[1]
      this.props.changeResourceStore({
        year,
        month,
        dateType: data.timeStyle
      })
    } else if (data.timeStyle === 'month') {
      this.props.changeResourceStore({ year: data.startTime, dateType: data.timeStyle })
    } else {
      this.props.changeResourceStore({ startTime: data.startTime, endTime: data.endTime, dateType: data.timeStyle })
    }
  }

  render() {
    const { stations, dateType, stationCode, year, month, operateAvalibaData, resourcePlanData, PvCompareData, resourceMonthLight, selectYear } = this.props;
    let station = ''
    stationCode ? station = stations.toJS().filter(e => e.stationCode === stationCode) : '';
    // let dataAvalibale = operateAvalibaData && operateAvalibaData.filter(e => e.isTrue === '1') || [];

    // console.log("resourceMonthLight", resourceMonthLight)

    const currentYear = parseInt(year).toString();
    const lastYear = (parseInt(year) - 1).toString();

    // 光资源同比
    const lightLastYear = PvCompareData && PvCompareData.map(e => e.lastYearData ? parseFloat(e.lastYearData).toFixed(2) : "--")
    const lightThatYea = PvCompareData && PvCompareData.map(e => e.thatYearData ? parseFloat(e.thatYearData).toFixed(2) : "--")
    const lightYearOnYear = PvCompareData && PvCompareData.map(e => e.lightYearOnYear ? parseFloat(e.lightYearOnYear).toFixed(2) : "--")
    const lightMonth = PvCompareData && PvCompareData.map((e, i) => { return this.addXaixsName(e.monthOrDay, dateType) });

    // 光资源分布

    return (
      <div className={styles.singleStationType}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
              <span className={styles.text}>条件查询</span>
              <StationSelect
                data={stations.toJS()}
                holderText={"电站名-区域"}
                value={station.length > 0 ? station : []}
                // multiple={true}
                onChange={this.stationSelected}
              />
            </div>
            <div className={styles.timeSelectBox}>
              <TimeSelect onChange={this.changeDate} />
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
                {`${station && station[0].stationName}-${station && station[0].regionName || "--"}`}
                <span className={styles.plan}>计划完成情况 (
                {dateType === "day" && year + '年' + month + '月'}
                  {dateType === "month" && year + '年'})
                </span>
                <div className={styles.choiceYear}>{
                  dateType === "year" && dataAvalibale.length > 0 && dataAvalibale.map((item, index) => {
                    return (<span key={index}
                      className={+item.year === +selectYear ? "active" : ''}
                      onClick={() => { this.selctYear(item.year) }}
                    >{item.year}</span>)
                  })
                }
                </div>
              </div>

              <span className={styles.rightFont}>并网时间:{moment(station && station[0].onGridTime).format('YYYY年MM月DD日') || "--"}</span>
            </div>
            <div className={styles.graph}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{resourcePlanData && resourcePlanData[0].resourceValue}</div>
                <div className={styles.stationTargetName}>斜面辐射总量 MJ/㎡ </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{resourcePlanData && resourcePlanData[0].sunshineHours}</div>
                <div className={styles.stationTargetName}>日照时数 h </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{resourcePlanData && resourcePlanData[0].temperatureAvg}</div>
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
                  dateType={dateType}
                  barGraphLastYear={lightLastYear}
                  barGraphThatYear={lightThatYea}
                  barGraphYearOnYear={lightYearOnYear}
                  barGraphmonth={lightMonth}
                />
                <TableGraph
                  tableType={'lightAnotherTB'}
                  title={"光资源同比"}
                  dateType={dateType}
                  dataArray={PvCompareData}
                  currentYear={currentYear}
                  lastYear={lastYear}
                />
              </div>
            </div>


            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <LightDistribution graphId={'LightDistribution'} yAxisName={'发电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                {dateType === 'year' ? <YearLightDistributionTable /> :
                  <TableGraph
                    tableType={'lightDistributed'}
                    dateType={dateType}
                    dataArray={resourceMonthLight}
                  />}
              </div>
            </div>

            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <WeatherStatus graphId={'weatherId'} yAxisName={'损失电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <div className={styles.LostPowerTypeRate}>
                  <div className={styles.LostPowerTypeTitle}>
                    <div>天气情况占比{}</div>

                  </div>
                  <LostPowerTypeRate graphId={'weatherRate'} />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}
export default (ProductionAnalysis);