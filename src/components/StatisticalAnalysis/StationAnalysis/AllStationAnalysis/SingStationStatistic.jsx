import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './allStationStatistic.scss';
import BarGraph from '../CommonGraph/BarGraph/index.js';
import TargetStatisticPieGraph from './Chart/TargetStatisticPieGraph.jsx';
import moment from 'moment';
// import TimeSelect from '../../../Common/TimeSelect';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import PlanCompletionRate from './Chart/PlanCompletionRate';
import ChangeStation from '../../../Monitor/StationMonitor/SingleStation/SingleStationCommon/ChangeStation';
import TableGraph from '../CommonGraph/TableGraph';
import ThreeYaxis from '../CommonGraph/ThreeYaxis';
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
    getSingleStationTargetData: PropTypes.func,
    getSingleStationStatisticData: PropTypes.func,
    getSingleStationMonthPieData: PropTypes.func,
    getSingleStationPlanRateData: PropTypes.func,
    getSingleStationPvCompareData: PropTypes.func,
    getSingleStationPowerEffectiveData: PropTypes.func,
    getSingleStationDayCompleteRateData: PropTypes.func,
    getAllStationAvalibaData: PropTypes.func,
    getAllStationStatisticData: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object,
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
//控制单电站点击其他位置，消失浮框
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hiddenStationList, true);
  

  }
  componentWillReceiveProps(nextProps) {
    const { year, userId, dateType, singleStationCode, changeAllStationStore, getSingleStationStatisticData, getAllStationAvalibaData, getSingleStationPowerEffectiveData, getSingleStationPvCompareData, getSingleStationTargetData, getSingleStationPlanRateData, getSingleStationMonthPieData, getSingleStationDayCompleteRateData,stations } = this.props;
    const { stationCode } = this.props.match.params;
    let allStations=stations.toJS();
    let singleStationType=allStations.length>0&&allStations.filter(e=>e.stationCode===Number(stationCode))[0].stationType;
      console.log(singleStationType);
    const currentYear = [moment().format('YYYY')];
    const currentTableYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    const curYearNum = nextProps.year[0].split('-')[0];
    const curMonthNum = nextProps.year[0].split('-')[1];
    // console.log(curYearNum,curMonthNum);
    const curMonth = moment().format('YYYY-MM');
    const curMonthArray = [moment().format('YYYY-MM')]
    const curYear = Number(nextProps.year)
    const curYearPlan = nextProps.year[nextProps.year.length - 1];
    const selectYear = [Number(moment().subtract(5, 'year').format('YYYY')), Number(moment().format('YYYY'))];
    let rangeYear = [];
    for (let i = selectYear[0]; i < selectYear[1] + 1; i++) {
      rangeYear.push(i.toString())
    }
    const nextPropsSelectYear = [Number(nextProps.year[0]), Number(nextProps.year[1])]
    let nextrRangeYear = [];
    for (let i = nextPropsSelectYear[0]; i < nextPropsSelectYear[1] + 1; i++) {
      nextrRangeYear.push(i.toString())
    }
    //月->月
    //if ((dateType==='month'&&nextProps.dateType === 'month')&&(year[0]!==nextProps.year[0]||stationCode!==nextProps.stationCode)) {
    if ((dateType === 'month' && nextProps.dateType === 'month') && (year[0] !== nextProps.year[0] || singleStationCode !== nextProps.singleStationCode)) {

      getSingleStationStatisticData(
        {
          stationCode: nextProps.singleStationCode,
          year: nextProps.year[0],
          dateType,
        }
      )
      //发电量和损失电量两个请求
      getSingleStationTargetData({
        stationCode: nextProps.singleStationCode,
        dateType,
        // dataType:'power',
        year: nextProps.year,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationMonthPieData({
        stationCode: nextProps.singleStationCode,
        year: curYear,
      })
      getSingleStationPlanRateData({
        stationCode: nextProps.singleStationCode,
        year: nextProps.year,
        dateType,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationPvCompareData({
        stationCode: nextProps.singleStationCode,
        year: curYear,
        dateType,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationPowerEffectiveData({
        stationCode: nextProps.singleStationCode,
        year: nextProps.year,
        dateType,
        sort: 'date',
        sortType: 'asc',
      })
    }
    //月/年->日
    if (dateType !== nextProps.dateType && nextProps.dateType === 'day') {
      getSingleStationStatisticData(
        {
          stationCode: nextProps.singleStationCode,
          year: curMonth,
          dateType: nextProps.dateType,
        }
      )
      //发电量和损失电量两个请求
      getSingleStationTargetData({
        stationCode: nextProps.singleStationCode,
        dateType: nextProps.dateType,
        // dataType:'power',
        year: curMonthArray,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationDayCompleteRateData({
        stationCode: nextProps.singleStationCode,
        year: currentTableYear,
        month: currentMonth
      })
      getSingleStationPowerEffectiveData({
        stationCode: nextProps.singleStationCode,
        year: currentYear,
        month: currentMonth,
        dateType: nextProps.dateType,
        sort: 'date',
        sortType: 'asc',
      })
    }
    //日->日
    if ((dateType === 'day' && nextProps.dateType === 'day') && (year[0] !== nextProps.year[0] || singleStationCode !== nextProps.singleStationCode)) {
      getSingleStationStatisticData(
        {
          stationCode: nextProps.singleStationCode,
          year: nextProps.year[0],
          dateType: nextProps.dateType,
        }
      )
      //发电量和损失电量两个请求
      getSingleStationTargetData({
        stationCode: nextProps.singleStationCode,
        dateType: nextProps.dateType,
        // dataType:'power',
        year: nextProps.year,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationDayCompleteRateData({
        stationCode: nextProps.singleStationCode,
        year: curYearNum,
        month: curMonthNum
      })
      getSingleStationPowerEffectiveData({
        stationCode: nextProps.singleStationCode,
        year: [curYearNum],
        month: curMonthNum,
        dateType: nextProps.dateType,
        sort: 'date',
        sortType: 'asc',
      })
    }
    //月/日->年
    if (dateType !== nextProps.dateType && nextProps.dateType === 'year') {
      getAllStationAvalibaData(
        {
          userId: userId,
          year: rangeYear,
          dateType: nextProps.dateType,
          stationCode,
          stationType:singleStationType
        })
      getSingleStationStatisticData(
        {
          stationCode: nextProps.singleStationCode,
          year: currentYear[0],
          dateType: nextProps.dateType,
        }
      )
      getSingleStationTargetData({
        stationCode: nextProps.singleStationCode,
        dateType: nextProps.dateType,
        // dataType:'power',
        year: rangeYear,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationPowerEffectiveData({
        stationCode: nextProps.singleStationCode,
        year: selectYear,
        dateType: nextProps.dateType,
        sort: 'date',
        sortType: 'asc',
      })
      changeAllStationStore({
        selectYear:currentTableYear
      })


    }
    //年/日->月
    if (dateType !== nextProps.dateType && nextProps.dateType === 'month') {
      getSingleStationStatisticData(
        {
          stationCode: nextProps.singleStationCode,
          year: currentYear[0],
          dateType: nextProps.dateType,
        }
      )
      //发电量和损失电量两个请求
      getSingleStationTargetData({
        stationCode: nextProps.singleStationCode,
        dateType: nextProps.dateType,
        // dataType:'power',
        year: currentYear,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationMonthPieData({
        stationCode: nextProps.singleStationCode,
        year: curYear
      })
      getSingleStationPlanRateData({
        stationCode: nextProps.singleStationCode,
        year: currentYear,
        dateType: nextProps.dateType,
        sort: 'date',
        sortType: 'asc',

      })
      getSingleStationPvCompareData({
        stationCode: nextProps.singleStationCode,
        year: curYear,
        dateType: nextProps.dateType,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationPowerEffectiveData({
        stationCode: nextProps.singleStationCode,
        year: currentYear,
        dateType: nextProps.dateType,
        sort: 'date',
        sortType: 'asc',
      })

    }
    //年->年
    if ((dateType === 'year' && nextProps.dateType === 'year') && (nextProps.year[0] !== this.props.year[0] || nextProps.year[1] !== this.props.year[1] || singleStationCode !== nextProps.singleStationCode)) {

      getAllStationAvalibaData(
        {
          userId: userId,
          year: nextrRangeYear,
          dateType: nextProps.dateType,
          stationCode,
          stationType:singleStationType
        })
      getSingleStationStatisticData(
        {
          stationCode: nextProps.singleStationCode,
          year: curYearPlan,
          dateType: nextProps.dateType,
        }
      )
      getSingleStationTargetData({
        stationCode: nextProps.singleStationCode,
        dateType: nextProps.dateType,
        // dataType:'power',
        year: nextrRangeYear,
        sort: 'date',
        sortType: 'asc',
      })
      getSingleStationPowerEffectiveData({
        stationCode: nextProps.singleStationCode,
        year: nextPropsSelectYear,
        dateType: nextProps.dateType,
        sort: 'date',
        sortType: 'asc',
      })

    }
  }
  componentWillUnmount() {
    this.props.changeAllStationStore({
      showPage: 'multiple',
      singleStationCode: '',
      dateType:'month',
      selectYear:''
    });
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hiddenStationList, true);

  }
  onTimeChange=(timeObj)=>{
    // console.log(timeObj);
    timeObj.timeStyle === 'year' ? 
    this.props.changeAllStationStore({ dateType: timeObj.timeStyle, year: [timeObj.startTime, timeObj.endTime],selectYear:timeObj.endTime}) :this.props.changeAllStationStore({ dateType: timeObj.timeStyle, year: [timeObj.startTime] })
  }
  onClose = () => {
    this.props.changeAllStationStore({
      showPage: 'multiple',
      singleStationCode: '',
    });
  }
  showStationSelect = () => {
    this.setState({
      showStationSelect: true
    });
  }
  hiddenStationList=()=>{
    this.setState({
      showStationSelect: false
    });
  }
  hideStationChange = () => {
    this.setState({
      showStationSelect: false
    });
  }
  render() {
    const { stationCode } = this.props.match.params;
    if (stationCode !== singleStationCode) {
      this.props.changeAllStationStore({ singleStationCode: stationCode });
    }
    const { stationType, stations, dateType, singleStationCode, year, singleStationStatisticData, showPage, singleStationPlanRateData, singleStationPvCompareData, singleStationPowerData, singleStationLostPowerData, singleStationMonthPieData, singleStationPlanRate, allStationAvalibaData, singleStationDayCompleteRateData, singleStationPowerEffectiveData,getSingleStationStatisticData ,selectYear,changeAllStationStore} = this.props;
    const statisticTime = moment().subtract(1, 'days').format('YYYY年MM月DD日');
    const currentYear = parseInt(year).toString();
    const lastYear = (parseInt(year) - 1).toString();
  
    //发电量数据
    const barGraphThatYear = singleStationPowerData.map(e=>e.thatYearData) || [];
    const barGraphLastYear = singleStationPowerData.map(e=>e.lastYearData)||[];
    const barGraphmonth = singleStationPowerData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' :''}`))
    const barGraphYearOnYear = singleStationPowerData.map(e=>e.yearOnYear)||[];
    const barGraphRingRatio = singleStationPowerData.map(e=> e.ringRatio)||[];
    const barGraphHasData=barGraphThatYear.some(e=>e||e===0)||barGraphLastYear.some(e=>e||e===0)||barGraphYearOnYear.some(e=>e||e===0)||barGraphRingRatio.some(e=>e||e===0)

    //单电站累计完成率
    const dayCompleteRateThatYearData = singleStationDayCompleteRateData.map(e=>e.thatYearData) || [];
    const dayCompleteRateLastYearData = singleStationDayCompleteRateData.map(e =>e.lastYearData) ||[];
    const dayCompleteRateDateData = singleStationDayCompleteRateData.map((e, i) => (`${e.day}`))
    const dayCompleteRate = singleStationDayCompleteRateData.map(e=>e.yearOnYear)||[];
    const dayCompleteRateHasData=dayCompleteRateThatYearData.some(e=>e||e===0)||dayCompleteRateLastYearData.some(e=>e||e===0)||dayCompleteRate.some(e=>e||e===0)
    //发电量饼图
    const pieData = singleStationMonthPieData.map((e, i) => ({ value: +e.monthPower===0 ?'':e.monthPower, name: `${e.month}月` }));
    const pieCompleteValue = Number(singleStationPlanRate) 
    const pieComplete = [{ value: pieCompleteValue, name: '已完成' }, { value: 100 - pieCompleteValue, name: '未完成' }];
    // console.log(pieData, pieComplete);
    //计划完成率
    //console.log(singleStationPlanRateData);
    const xAxisData = singleStationPlanRateData.map((e, i) => (`${e.date}月`))
    const planPowerData = singleStationPlanRateData.map(e =>e.planPower)||[];
    const actualPowerData = singleStationPlanRateData.map(e =>e.actualPower)||[];
    const planRateData = singleStationPlanRateData.map(e =>e.per) ||[];
    const palnHasData=planPowerData.some(e=>e||e===0)||actualPowerData.some(e=>e||e===0)||planRateData.some(e=>e||e===0)
    //光资源分析
    const lightCompareDataThatYear = singleStationPvCompareData.map(e =>e.thatYearData)||[];
    const lightCompareDataLastYear = singleStationPvCompareData.map(e=>e.lastYearData)||[];
    const lightCompareDataDate = singleStationPvCompareData.map((e, i) => (`${e.monthOrDay}月`))
    const lightCompareDataLight = singleStationPvCompareData.map(e=> e.lightYearOnYear)||[];
    const lightCompareDataPower = singleStationPvCompareData.map(e =>e.powerYearOnYear)||[];
    const lightCompareHasData=lightCompareDataThatYear.some(e=>e||e===0)||lightCompareDataLastYear.some(e=>e||e===0)||lightCompareDataLight.some(e=>e||e===0)||lightCompareDataPower.some(e=>e||e===0)

    //发电效率分析
    const hours=singleStationPowerEffectiveData && singleStationPowerEffectiveData.map(e=> e.hours )||[];
    const light=singleStationPowerEffectiveData && singleStationPowerEffectiveData.map(e=> e.light)||[];
    const pr=singleStationPowerEffectiveData && singleStationPowerEffectiveData.map(e=> e.pr)||[];
    const PowerEffectiveData = {
      xData: singleStationPowerEffectiveData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : ''}`)),
      yData: {
        barData: {hours},
        lineData: {light ,pr }
      }
    }
    const LightHasData=hours.some(e=>e||e===0) ||light.some(e=>e||e===0)||pr.some(e=>e||e===0)
    //损失电量数据
    const lostPowerThatYear = singleStationLostPowerData.map(e =>e.thatYearData) || [];
    const lostPowerLastYear = singleStationLostPowerData.map(e =>e.lastYearData) ||[];
    const lostPowerRingRatio = singleStationLostPowerData.map(e=> e.ringRatio) ||[];
    const lostPowermonth = singleStationLostPowerData.map(e => (`${e.date}${dateType === 'month' ? '月' :  ''}`));
    const lostPowerYearOnYear = singleStationLostPowerData.map(e => e.yearOnYear) ||[];
    const lostHasData=lostPowerThatYear.some(e=>e||e===0)||lostPowerLastYear.some(e=>e||e===0)||lostPowerRingRatio.some(e=>e||e===0)||lostPowerYearOnYear.some(e=>e||e===0)
    const { showStationSelect } = this.state;
    const stationItems = stations&&stations.toJS();
    const stationItem = stationItems.filter(e => (e.stationCode.toString() === singleStationCode))[0];
    const stationGridTime = stationItem.onGridTime ? moment(stationItem.onGridTime).format('YYYY年MM月DD日') : '--';
    //console.log(stationItem);
    //拿到单电站的类型，弄个数组，把对应的iconfont加上，在下面调用
    //console.log(stationItem);
    return (
      <div className={styles.singleStationType}>
        <div className={styles.componentContainer}>
          <div className={styles.title}>
            {showStationSelect &&
              <ChangeStation stations={stationItems} stationName={stationItem.stationName} baseLinkPath="/statistical/stationaccount/allstation" hideStationChange={this.hideStationChange} />
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
                  <span className={styles.deadline}>数据统计截止时间{statisticTime}</span>
                </div>
              </div>
            </div>
            <Link to="/statistical/stationaccount/allstation">
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onClose} />
            </Link>
          </div>
          <TimeSelect onChange={this.onTimeChange} />
          <PlanCompletionRate 
          dateType={dateType} 
          allStationStatisticData={singleStationStatisticData} 
          showPage={showPage} 
          year={year} 
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
                    graphId={'power'}
                    yAxisName={'发电量 (万kWh)'}
                    xAxisName={'发电量'}
                    dateType={dateType}
                    barGraphmonth={barGraphmonth}
                    barGraphThatYear={barGraphThatYear}
                    barGraphRingRatio={barGraphRingRatio}
                    hasData={barGraphHasData}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'powerGenRatio'}
                    dataArray={singleStationPowerData}
                  />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <ThreeYaxis
                    graphId={'yearPowerEfficency'}
                    title="发电效率"
                    data={PowerEffectiveData}
                    hasData={LightHasData}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'pr'}
                    dataArray={singleStationPowerEffectiveData} />
                </div>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.dataGraph}>
                  <BarGraph
                    graphId={'yearLostPower'}
                    yAxisName={'损失电量 (万kWh)'}
                    xAxisName={'损失电量'}
                    title={'损失电量同比'}
                    dateType={dateType}
                    barGraphRingRatio={lostPowerRingRatio}
                    barGraphThatYear={lostPowerThatYear}
                    barGraphmonth={lostPowermonth}
                    hasData={lostHasData}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'lostPowerRatio'}
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
                    hasData={barGraphHasData}
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
                  graphId={'planCompleteRate'} 
                  yAxisName={'发电量 (万kWh)'} 
                  dateType={dateType} 
                  title={'计划完成率'} 
                  xAxisData={xAxisData} 
                  planPowerData={planPowerData} 
                  actualPowerData={actualPowerData} 
                  planRateData={planRateData}
                  hasData={palnHasData} />
                  <TableGraph
                    dateType={dateType}
                    tableType={'plan'}
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
                    lightCompareDataThatYear={lightCompareDataThatYear}
                    lightCompareDataLastYear={lightCompareDataLastYear}
                    lightCompareDataDate={lightCompareDataDate}
                    lightCompareDataLight={lightCompareDataLight}
                    lightCompareDataPower={lightCompareDataPower}
                    hasData={lightCompareHasData}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'lightTB'}
                    currentYear={currentYear}
                    lastYear={lastYear}
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
                    hasData={LightHasData}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'pr'}
                    dataArray={singleStationPowerEffectiveData}
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
                    hasData={lostHasData}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'lostPowerTB'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    dataArray={singleStationLostPowerData} />
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
                    hasData={barGraphHasData}
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
                  dayCompleteRate={dayCompleteRate}
                  dayCompleteRateDateData={dayCompleteRateDateData}
                  dayCompleteRateLastYearData={dayCompleteRateLastYearData}
                  dayCompleteRateThatYearData={dayCompleteRateThatYearData}
                  hasData={dayCompleteRateHasData}
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
                    hasData={LightHasData}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'pr'}
                    dataArray={singleStationPowerEffectiveData}
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
                    hasData={lostHasData}
                  />
                  <TableGraph
                    dateType={dateType}
                    tableType={'lostPowerTB'}
                    currentYear={currentYear}
                    lastYear={lastYear}
                    dataArray={singleStationLostPowerData}
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
