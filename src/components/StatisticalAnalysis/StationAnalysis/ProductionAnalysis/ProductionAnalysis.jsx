import React from "react";
import PropTypes from "prop-types";
import { Radio } from 'antd';
import styles from './productionAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect';
import BarGraph from '../AllStationAnalysis/CommonGraph/BarGraph';
//import PlanCompleteRateAnalysisBar from '../AllStationAnalysis/CommonGraph/PlanCompleteRateAnalysisBar';
import TableGraph from '../AllStationAnalysis/CommonGraph/TableGraph';
import WaterWave from '../AllStationAnalysis/CommonGraph/PlanCompletionRate/WaterWave';
import ThreeYaxis from '../AllStationAnalysis/CommonGraph/ThreeYaxis';
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
    changeAllStationStore: PropTypes.func,
    ProductionPlanComplete: PropTypes.func,
    getSingleStationProductionData: PropTypes.func,
    getSingleStationPlanRateData: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { getAllStationAvalibaData, stations, userId, stationCode, changeAllStationStore, ProductionPlanComplete, getSingleStationProductionData, getSingleStationPlanRateData, year, dateType, } = this.props;
    stations && stations.toJS().length > 0 ? changeAllStationStore({ stationCode: stations.toJS()[0].stationCode.toString() }) : console.log('no');
    const currentYear = moment().format('YYYY');
    const curYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    let time = year ? year : [`${currentYear}`];
    changeAllStationStore({ year: [`${currentYear}`], month: currentMonth })
    // getAllStationAvalibaData(
    //   {
    //     userId: userId,
    //     year: time,
    //     dateType,
    //     stationCode: stationCode,
    //   }
    // )
    ProductionPlanComplete({
      stationCode: stationCode,
      year: curYear,
      dateType: 'month',


    })
    getSingleStationProductionData({
      stationCode: stationCode,
      dateType: 'month',
      year: [currentYear],

    })
    getSingleStationPlanRateData({
      stationCode: stationCode,
      year: [curYear],
      dateType: 'month'

    })
  }
  componentWillReceiveProps(nextProps) {
    const { year, userId, dateType, stations, changeAllStationStore, ProductionPlanComplete, getAllStationAvalibaData, getSingleStationProductionData, getSingleStationPlanRateData } = this.props;
    // const stationItems = stations.toJS();
    // const stationItem = stationItems && stationItems[0];
    // let stationCode = stationItem && stationItem.stationCode;

    if (stations.toJS().length === 0 && nextProps.stations.toJS().length !== 0) {
      changeAllStationStore({ stationCode: nextProps.stations.toJS()[0].stationCode })
    }


    // // if(stationCode){
    // //   this.props.changeAllStationStore({stationCode})
    // // }
    const currentYear = [moment().format('YYYY')];

    const currentTableYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    const curYearNum = nextProps.year[0].split('-')[0];
    const curMonthNum = nextProps.year[0].split('-')[1];
    console.log(curYearNum,curMonthNum);

    const curMonth = moment().format('YYYY-MM');
    const curMonthArray = [moment().format('YYYY-MM')];
    const curYear = Number(nextProps.year);
    const curYearPlan = nextProps.year[nextProps.year.length - 1];
    const selectYear = [Number(moment().subtract(5, 'year').format('YYYY')), Number(moment().format('YYYY'))];
    let rangeYear = [];
    for (let i = selectYear[0]; i < selectYear[1] + 1; i++) {
      rangeYear.push(i.toString())
    }
    const nextPropsSelectYear = [Number(nextProps.year[0]), Number(nextProps.year[1])]
    let nextRangeYear = [];
    for (let i = nextPropsSelectYear[0]; i < nextPropsSelectYear[1] + 1; i++) {
      nextRangeYear.push(i.toString())
    }
    //月->月
    if (dateType === 'month' && nextProps.dateType === 'month') {
      if (nextProps.year[0] !== this.props.year[0]) {
        ProductionPlanComplete({
          stationCode: nextProps.stationCode,
          year: curYear,
          dateType: 'month',
        })
        getSingleStationProductionData({
          stationCode: nextProps.stationCode,
          dateType: 'month',
          year: nextProps.year,

        })
        getSingleStationPlanRateData({
          stationCode: nextProps.stationCode,
          year: [curYear],
          dateType: 'month'

        })
      }
    }
    //月/年->日
    if (dateType !== nextProps.dateType && nextProps.dateType === 'day') {
      ProductionPlanComplete({
        stationCode: nextProps.stationCode,
        year: curYear,
        month: currentMonth,
        dateType: 'day',
      })
      getSingleStationProductionData({
        stationCode: nextProps.stationCode,
        dateType: 'day',
        year: curMonthArray,

      })


    }
    //日->日
    if (dateType === 'day' && nextProps.dateType === 'day') {
      if (nextProps.year[0] !== this.props.year[0]) {

        ProductionPlanComplete({
          stationCode: nextProps.stationCode,
          year: curYear,
          month: 10,
          dateType: 'day',


        })
        getSingleStationProductionData({
          stationCode: nextProps.stationCode,
          dateType: 'day',
          year: nextProps.year,

        })
      }
    }
    //月/日->年
    if (dateType !== nextProps.dateType && nextProps.dateType === 'year') {
      getAllStationAvalibaData(
        {
          userId: userId,
          year: rangeYear,
          dateType: nextProps.dateType,
          stationCode: nextProps.stationCode
        }
      )
      ProductionPlanComplete({
        stationCode: nextProps.stationCode,
        year: curYear,
        dateType: nextProps.dateType


      })
      getSingleStationProductionData({
        stationCode: nextProps.stationCode,
        dateType: nextProps.dateType,
        year: rangeYear,

      })
      getSingleStationPlanRateData({
        stationCode: nextProps.stationCode,
        year: selectYear,
        dateType: nextProps.dateType,

      })


    }
    //年/日->月
    if (dateType !== nextProps.dateType && nextProps.dateType === 'month') {
      ProductionPlanComplete({
        stationCode: nextProps.stationCode,
        year: curYear,
        dateType: nextProps.dateType,
      })
      getSingleStationProductionData({
        stationCode: nextProps.stationCode,
        dateType: nextProps.dateType,
        year: currentYear,

      })
      getSingleStationPlanRateData({
        stationCode: nextProps.stationCode,
        year: [curYear],
        dateType: nextProps.dateType,

      })

    }
    //年->年
    if (dateType === 'year' && nextProps.dateType === 'year') {
      if (nextProps.year[0] !== this.props.year[0] || nextProps.year[1] !== this.props.year[1]) {
        getAllStationAvalibaData(
          {
            userId: userId,
            year: nextRangeYear,
            dateType,
            stationCode: nextProps.stationCode
          }
        )
        ProductionPlanComplete({
          stationCode: nextProps.stationCode,
          year: Number(nextProps.year[1]),
          dateType,


        })
        getSingleStationProductionData({
          stationCode: nextProps.stationCode,
          year: nextRangeYear,
          dateType,

        })
        getSingleStationPlanRateData({
          stationCode: nextProps.stationCode,
          year: nextPropsSelectYear,
          dateType,
        })
      }
    }
  }
  stationSelected = (stationSelect) => { // 存储选中的电站
    this.props.changeAllStationStore({
      stationCode: stationSelect[0].stationCode
    })
  }
  selectYear=()=>{
    const { allStationAvalibaData } = this.props;
    let yearArray = allStationAvalibaData.map((e, i) => (Number(e.year)));
    let currentYear = Math.max(...yearArray).toString();
    return (
      <Radio.Group defaultValue={currentYear} buttonStyle="solid" onChange={this.handleTime}>
        {allStationAvalibaData.map((e, index) => {
          if (e.isTrue === true) {
            return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}年</Radio.Button>
          } else {
            return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}年</Radio.Button>
          }
        }
        )}
      </Radio.Group>
    )

  }
  handleTime = (e) => {
    const changeYear = Number(e.target.value); 
    const { ProductionPlanComplete, dateType ,stationCode} = this.props;
    ProductionPlanComplete(
      {
        stationCode:stationCode,
        year: changeYear,
        dateType,
      }
    )

  }
  render() {

    const { stationType, stations, dateType, year, changeAllStationStore, allStationAvalibaData, productionPlanCompleteData, singleStationPowerData, singleStationBuyPowerData, singleStationSalePowerData, singleStationPlanRateData } = this.props;
    const statisticTime = moment().subtract(1, 'days').format('YYYY年MM月DD日');
    const stationItem = stations.toJS();
    const stationGridTime = 0 ? stationItem.onGridTime.moment().format('YYYY年MM月DD日') : '--';
    const currentYear = parseInt(year).toString();
    const lastYear = (parseInt(year) - 1).toString();
    const planSummary = productionPlanCompleteData && productionPlanCompleteData[0];
    const actualPower = planSummary && planSummary.actualPower;
    const planPower = planSummary && planSummary.planPower ? planSummary.planPower : '--';
    const completeRate = planSummary && planSummary.completeRate;
    const saledPower = planSummary && planSummary.saledPower;
    const buyPower = planSummary && planSummary.buyPower;
    //发电量
    const barGraphThatYear = singleStationPowerData.map((e, i) => (e.thatYearData || '--'))
    const barGraphLastYear = singleStationPowerData.map((e, i) => (e.lastYearData || '--'))
    const barGraphmonth = singleStationPowerData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`))
    const barGraphYearOnYear = singleStationPowerData.map((e, i) => (e.yearOnYear || '--'))
    const barGraphRingRatio = singleStationPowerData.map((e, i) => (e.ringRatio || '--'))
    //上网电量
    const salePowerThatYear = singleStationSalePowerData.map((e, i) => (e.thatYearData || '--'))
    const salePowerLastYear = singleStationSalePowerData.map((e, i) => (e.lastYearData || '--'))
    const salePowerRingRatio = singleStationSalePowerData.map((e, i) => (e.ringRatio || '--'))
    const salePowermonth = singleStationSalePowerData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`))
    const salePowerYearOnYear = singleStationSalePowerData.map((e, i) => (e.yearOnYear || '--'))


    //购网电量
    const buyPowerThatYear = singleStationBuyPowerData.map((e, i) => (e.thatYearData || '--'))
    const buyPowerLastYear = singleStationBuyPowerData.map((e, i) => (e.lastYearData || '--'))
    const buyPowerRingRatio = singleStationBuyPowerData.map((e, i) => (e.ringRatio || '--'))
    const buyPowermonth = singleStationBuyPowerData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`))
    const buyPowerYearOnYear = singleStationBuyPowerData.map((e, i) => (e.yearOnYear || '--'))

    //计划完成率
    //console.log(singleStationPlanRateData);
    const xAxisData = singleStationPlanRateData.map((e, i) => (`${e.date}月`))
    const planPowerData = singleStationPlanRateData.map((e, i) => (e.planPower || '--'))
    const actualPowerData = singleStationPlanRateData.map((e, i) => (e.actualPower || '--'))
    const planRateData = singleStationPlanRateData.map((e, i) => (e.per || '--'))
    const resourceData = singleStationPlanRateData.map((e, i) => (e.resourceValue || '--'))
    const PowerEffectiveData = {
      xData: singleStationPlanRateData.map((e, i) => (`${e.date}${dateType === 'month' ? '月' : (dateType === 'day' ? '日' : '')}`)),
      yData: {
        barData: {
          planPower: singleStationPlanRateData && singleStationPlanRateData.map((e, i) => (e.planPower ? parseFloat(e.planPower).toFixed(2) : "--")),
          actualPower: singleStationPlanRateData && singleStationPlanRateData.map((e, i) => (e.actualPower ? parseFloat(e.actualPower).toFixed(2) : "--")),
        },
        lineData: {
          planRate: singleStationPlanRateData && singleStationPlanRateData.map((e, i) => (e.planRate ? parseFloat(e.planRate).toFixed(2) : "--")),
          resourceValue: singleStationPlanRateData && singleStationPlanRateData.map((e, i) => (e.resourceValue ? parseFloat(e.resourceValue).toFixed(2) : "--"))
        }
      }
    }

    return (
      <div className={styles.singleStationType}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
              <span className={styles.text}>条件查询</span>
              <StationSelect
                data={stations.toJS()}
                holderText={'电站名-区域'}
                value={this.props.stationCode ? [this.props.stationCode] : []}
                // multiple={true}
                onChange={this.stationSelected}
              />
            </div>
            <TimeSelect day={true} changeAllStationStore={changeAllStationStore} dateType={dateType} />
          </div>
          <span className={styles.rightContent}>数据统计截止时间{statisticTime}</span>
        </div>

        <div className={styles.componentContainer}>
          <div className={styles.title}>
            <div className={styles.stationStatus}>
              <div className={styles.status}>
                <span className={styles.stationIcon}><i className="iconfont icon-pvlogo"></i></span>
                {`电站名-区域：`}
                计划完成情况{dateType === 'year' ? this.selectYear() : `(  ${Number(year)}年  ) `}
              </div>
              <span className={styles.rightFont}>并网时间{stationGridTime}</span>
            </div>
            <div className={styles.graph}>
              <WaterWave percent={completeRate} height={100} />
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{actualPower}</div>
                <div className={styles.stationTargetName}>{dateType === 'month' || dateType === 'year' ? '年' : '月'}实际发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{planPower}</div>
                <div className={styles.stationTargetName}>{dateType === 'month' || dateType === 'year' ? '年' : '月'}计划发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{saledPower}</div>
                <div className={styles.stationTargetName}>上网电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{buyPower}</div>
                <div className={styles.stationTargetName}>购网电量 万kWh</div>
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
                  barGraphRingRatio={barGraphRingRatio} />
                <TableGraph
                  dateType={dateType} tableType={'lostPowerTB'} currentYear={currentYear}
                  lastYear={lastYear} dataArray={singleStationPowerData} />
              </div>
            </div>
            {dateType === 'month' || dateType === 'year' ? <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <ThreeYaxis
                  graphId={'productionPlanCompleteRate'}
                  // dateType={dateType}
                  title="计划完成率"
                  data={PowerEffectiveData}
                />
                <TableGraph dateType={dateType} tableType={'plan'} dataArray={singleStationPlanRateData} />
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