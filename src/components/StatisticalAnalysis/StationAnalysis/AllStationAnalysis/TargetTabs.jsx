import React from "react";
import PropTypes from "prop-types";
import styles from './targetTabs.scss';
import { Tabs } from 'antd';
import BarGraph from '../CommonGraph/BarGraph/index.js';
import TargetStatisticPieGraph from './Chart/TargetStatisticPieGraph.jsx';

import { getCookie } from '../../../../utils/index.js';
import AllStationMonthPie from './Chart/AllStationMonthPie/index';
//import { getCookie } from '../../../../utils/index.js';
import Cookie from 'js-cookie';
import moment from 'moment';

class TargetTabs extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    stationType: PropTypes.string,
    year:PropTypes.any,
    allStationMonthComplete: PropTypes.string,
    stationCode: PropTypes.array,
    allStationMonthBarData: PropTypes.array,
    allStationMonthPieData: PropTypes.array,
    dateType: PropTypes.string,
    changeAllStationStore: PropTypes.func,
    getAllStationMonthPieData: PropTypes.func,
    getAllStationMonthBarData: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  queryTargetData = (activeKey) => {
    const { changeAllStationStore, getAllStationMonthBarData, getAllStationMonthPieData, year, dateType, stationType } = this.props;
    const userId = Cookie.get('userId');
    changeAllStationStore({targetShowType:activeKey})
    let changeRangYear = [];
    if (dateType === 'year') { 
      for (let i = Number(this.props.year[0]); i < Number(this.props.year[1]) + 1; i++) {
        changeRangYear.push(i.toString())
      }
    }
    getAllStationMonthBarData({
      userId: userId,
      year:dateType==='year'?changeRangYear:year,
      dateType,
      stationType,
      dataType: activeKey
    })
  }

  render() {
    const TabPane = Tabs.TabPane;
    const { dateType, year } = this.props;
    const currentYear = parseInt(year).toString();
    const lastYear = (parseInt(year) - 1).toString();
    const { allStationMonthBarData, allStationMonthPieData, allStationMonthComplete } = this.props;

    const barGraphThatYear = allStationMonthBarData.map(e => e.thatYearData) || [];
    const barGraphPrThatYear = allStationMonthBarData.map(e => e.thatYearData+'%') || [];
    const barGraphLastYear = allStationMonthBarData.map(e => e.lastYearData) || [];
    const barGraphPrLastYear = allStationMonthBarData.map(e => e.lastYearData+'%') || [];
    const barGraphmonth = allStationMonthBarData.map((e, i) => (`${e.month}月`))
    const barGraphYear = allStationMonthBarData.map((e, i) => (`${e.year}年`))
    const barGraphYearOnYear = allStationMonthBarData.map(e => e.yearOnYear) || [];
    const barGraphRingRatio = allStationMonthBarData.map(e => e.ringRatio) || [];
    const hasData = barGraphThatYear.some(e => e || e === 0) || barGraphLastYear.some(e => e || e === 0) || barGraphYearOnYear.some(e => e || e === 0) || barGraphRingRatio.some(e => e || e === 0)

    // console.log(barGraphThatYear,barGraphLastYear,barGraphmonth,barGraphYearOnYear);
    const pieData = allStationMonthPieData.map((e, i) => ({ value: +e.monthPower === 0 ? '' : e.monthPower, name: `${e.month}月` }));
    //const pieData=[{value:22,name:'1月'},{value:28,name:'2月'},{value:52,name:'3月'},{value:42,name:'4月'}];
    const pieCompleteValue = Number(allStationMonthComplete)
    const pieComplete = [{ value: pieCompleteValue, name: '已完成' }, { value: 100 - pieCompleteValue, name: '未完成' }];
    const pieTargetData = allStationMonthBarData.map((e, i) => ({ value: e.thatYearData, name: `${e.month}月` }))
    const pieHasData = pieTargetData.map(e => e.value).some(e => e || e === 0)
    // let test=0;
    // test?console.log('ok'):console.log('no');


    return (
      <div className={styles.targetTabs}>
        <Tabs
        activeKey={this.props.targetShowType}
          animated={false}
          onChange={this.queryTargetData}
        >
          <TabPane tab="发电量" key="EqpGen">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphThatYear={barGraphThatYear}
                  barGraphLastYear={barGraphLastYear}
                  barGraphmonth={dateType === 'year' ? barGraphYear : barGraphmonth}
                  barGraphYearOnYear={barGraphYearOnYear}
                  barGraphRingRatio={barGraphRingRatio}
                  graphId={'power'}
                  yAxisName={'发电量 (万kWh)'}
                  xAxisName={'发电量'}
                  dateType={dateType}
                  hasData={hasData}
                />
                {dateType === 'month' ? <TargetStatisticPieGraph pieGraphId={'powerPie'} yAxisName={'发电量 (万kWh)'} pieData={pieData} pieComplete={pieComplete} hasData={false} /> : ''}
              </div>

            </div>
          </TabPane>
          <TabPane tab="辐射总量" key="PvRadi">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  currentYear={currentYear}
                  lastYear={lastYear}
                  graphId={'radiationBar'}
                  yAxisName={'辐射总量 (MJ/㎡)'}
                  xAxisName={'辐射总量'}
                  dateType={dateType}
                  barGraphThatYear={barGraphThatYear}
                  barGraphLastYear={barGraphLastYear}
                  barGraphmonth={dateType === 'year' ? barGraphYear : barGraphmonth}
                  barGraphYearOnYear={barGraphYearOnYear}
                  barGraphRingRatio={barGraphRingRatio}
                  hasData={hasData} />
                {dateType === 'month' ?
                  <AllStationMonthPie
                    allStationMonthpie={'radiationPie'}
                    yAxisName={'辐射总量 (MJ/㎡)'}
                    pieTargetData={pieTargetData}
                    barGraphYearOnYear={barGraphYearOnYear}
                    hasData={pieHasData} /> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="等效利用小时数" key="EqpWorkedHour">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  currentYear={currentYear}
                  lastYear={lastYear}
                  graphId={'userTime'}
                  yAxisName={'等效利用小时数 (h)'}
                  xAxisName={'等效利用小时数'}
                  dateType={dateType}
                  barGraphThatYear={barGraphThatYear}
                  barGraphLastYear={barGraphLastYear}
                  barGraphmonth={dateType === 'year' ? barGraphYear : barGraphmonth}
                  barGraphYearOnYear={barGraphYearOnYear}
                  barGraphRingRatio={barGraphRingRatio}
                  hasData={hasData} />
                {dateType === 'month' ? <AllStationMonthPie allStationMonthpie={'userTimePie'} yAxisName={'等效利用小时数 (h)'} pieTargetData={pieTargetData} barGraphYearOnYear={barGraphYearOnYear} hasData={pieHasData} /> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="PR" key="pr">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  currentYear={currentYear}
                  lastYear={lastYear}
                  graphId={'PR'}
                  yAxisName={'PR'}
                  xAxisName={'PR'}
                  dateType={dateType}
                  barGraphThatYear={barGraphPrThatYear}
                  barGraphLastYear={barGraphPrLastYear}
                  barGraphmonth={dateType === 'year' ? barGraphYear : barGraphmonth}
                  barGraphYearOnYear={barGraphYearOnYear}
                  barGraphRingRatio={barGraphRingRatio}
                  hasData={hasData} />
                {dateType === 'month' ? <AllStationMonthPie allStationMonthpie={'PRPie'} yAxisName={'PR(%)'} pieTargetData={pieTargetData} barGraphYearOnYear={barGraphYearOnYear}
                  hasData={pieHasData}
                /> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="损失电量" key="LostEqp">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  currentYear={currentYear}
                  lastYear={lastYear}
                  graphId={'lostPower'}
                  yAxisName={'损失电量 (万kWh)'}
                  xAxisName={'损失电量'}
                  dateType={dateType}
                  barGraphThatYear={barGraphThatYear}
                  barGraphLastYear={barGraphLastYear}
                  barGraphmonth={dateType === 'year' ? barGraphYear : barGraphmonth}
                  barGraphYearOnYear={barGraphYearOnYear}
                  barGraphRingRatio={barGraphRingRatio}
                  hasData={hasData} />
                {dateType === 'month' ? <AllStationMonthPie allStationMonthpie={'lostPowerPie'} yAxisName={'损失电量 (万kWh)'} pieTargetData={pieTargetData} barGraphYearOnYear={barGraphYearOnYear} hasData={pieHasData} /> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="损失电量等效时" key="LostEqpHour">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  currentYear={currentYear}
                  lastYear={lastYear}
                  graphId={'lostPowertime'}
                  yAxisName={'发电量 (h)'}
                  xAxisName={'损失电量等效时'}
                  dateType={dateType}
                  barGraphThatYear={barGraphThatYear}
                  barGraphLastYear={barGraphLastYear}
                  barGraphmonth={dateType === 'year' ? barGraphYear : barGraphmonth}
                  barGraphYearOnYear={barGraphYearOnYear}
                  barGraphRingRatio={barGraphRingRatio}
                  hasData={hasData} />
                {dateType === 'month' ?
                  <AllStationMonthPie
                    allStationMonthpie={'lostPowertimePie'}
                    yAxisName={'发电量 (h)'}
                    pieTargetData={pieTargetData}
                    barGraphYearOnYear={barGraphYearOnYear} hasData={pieHasData} /> : ''}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default (TargetTabs)
