import React from "react";
import PropTypes from "prop-types";
import styles from './targetTabs.scss';
import { Tabs } from 'antd';
import BarGraph from './CommonGraph/BarGraph/index.js';
import TargetStatisticPieGraph from './TargetStatisticPieGraph.jsx';
import StationStatisticList from './StationStatisticList.jsx';
import AllStationMonthPie from './CommonGraph/AllStationMonthPie';
import { getCookie } from '../../../../utils/index.js';
import moment from 'moment';

class TargetTabs extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    stationType: PropTypes.string,
    AllStationMonthComplete: PropTypes.string,
    stationCode: PropTypes.array,
    AllStationMonthBarData: PropTypes.array,
    AllStationMonthPieData: PropTypes.array,
    dateType: PropTypes.string,
    changeAllStationStore: PropTypes.func,
    getAllStationMonthPieData: PropTypes.func,
    getAllStationMonthBarData: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  queryTargetData = (activeKey) => {
    const { changeAllStationStore, getAllStationMonthBarData, getAllStationMonthPieData, year, dateType, } = this.props;
    const userId = getCookie('userId');
    console.log(activeKey);
    getAllStationMonthBarData({
      userId: userId,
      year,
      dateType,
      dataType: activeKey

    })
  }

  render() {
    const TabPane = Tabs.TabPane;
    const { dateType,year } = this.props;
   const currentYear=parseInt(year).toString();
   const lastYear=(parseInt(year)-1).toString();
  // console.log(currentYear,lastYear);

    const { AllStationMonthBarData, AllStationMonthPieData, AllStationMonthComplete } = this.props;
    console.log(12345,AllStationMonthBarData,AllStationMonthPieData,AllStationMonthComplete);
    const barGraphThatYear = AllStationMonthBarData.map((e, i) => (e.thatYearData))
    const barGraphLastYear = AllStationMonthBarData.map((e, i) => (e.lastYearData))
    const barGraphmonth = AllStationMonthBarData.map((e, i) => (e.month))
    const barGraphYearOnYear = AllStationMonthBarData.map((e, i) => (e.yearOnYear))
    // console.log(barGraphThatYear,barGraphLastYear,barGraphmonth,barGraphYearOnYear);
    const pieData = AllStationMonthPieData.map((e, i) => ({ value: Number(e.monthPower), name: e.month }));
    //const pieData=[{value:22,name:'1月'},{value:28,name:'2月'},{value:52,name:'3月'},{value:42,name:'4月'}];
    const pieCompleteValue = Number(AllStationMonthComplete)
    const pieComplete = [{ value: pieCompleteValue, name: '已完成' }, { value: 100 - pieCompleteValue, name: '未完成' }];
    // console.log(pieData, pieComplete);
    const pieTargetData=AllStationMonthBarData.map((e,i)=>({value:e.thatYearData,name:e.month}))
   


    return (
      <div className={styles.targetTabs}>
        <Tabs
          defaultActiveKey="1"
          animated={false}
          onChange={this.queryTargetData}
        >
          <TabPane tab="发电量" key="EqpGen">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph currentYear={currentYear} lastYear={lastYear} barGraphThatYear={barGraphThatYear} barGraphLastYear={barGraphLastYear} barGraphmonth={barGraphmonth} barGraphYearOnYear={barGraphYearOnYear} graphId={'power'} yAxisName={'发电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                {dateType === 'month' ? <TargetStatisticPieGraph pieGraphId={'powerPie'} yAxisName={'发电量 (万kWh)'} pieData={pieData} pieComplete={pieComplete} /> : ''}
              </div>
              <StationStatisticList {...this.props} />
            </div>
          </TabPane>
          <TabPane tab="辐射总量" key="PvRadi">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph currentYear={currentYear} lastYear={lastYear} graphId={'radiationBar'} yAxisName={'辐射总量 (MJ/㎡)'} xAxisName={'辐射总量'} dateType={dateType}  barGraphThatYear={barGraphThatYear} barGraphLastYear={barGraphLastYear} barGraphmonth={barGraphmonth} barGraphYearOnYear={barGraphYearOnYear}  />
                {dateType === 'month' ? <AllStationMonthPie allStationMonthpie={'radiationPie'} yAxisName={'辐射总量 (MJ/㎡)'} pieTargetData={pieTargetData} barGraphYearOnYear={barGraphYearOnYear} /> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="等效利用小时数" key="EqpWorkedHour">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph currentYear={currentYear} lastYear={lastYear} graphId={'userTime'} yAxisName={'等效利用小时数 (h)'} xAxisName={'等效利用小时数'} dateType={dateType} barGraphThatYear={barGraphThatYear} barGraphLastYear={barGraphLastYear} barGraphmonth={barGraphmonth} barGraphYearOnYear={barGraphYearOnYear} />
                {dateType === 'month' ? <AllStationMonthPie allStationMonthpie={'userTimePie'} yAxisName={'等效利用小时数 (h)'} pieTargetData={pieTargetData} barGraphYearOnYear={barGraphYearOnYear} /> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="PR" key="pr-pr">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph currentYear={currentYear} lastYear={lastYear} graphId={'PR'} yAxisName={'PR'} xAxisName={'PR'} dateType={dateType} barGraphThatYear={barGraphThatYear} barGraphLastYear={barGraphLastYear} barGraphmonth={barGraphmonth} barGraphYearOnYear={barGraphYearOnYear} />
                {dateType === 'month' ? <AllStationMonthPie allStationMonthpie={'PRPie'} yAxisName={'PR(%)'} pieTargetData={pieTargetData} barGraphYearOnYear={barGraphYearOnYear} /> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="损失电量" key="损失电量">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph currentYear={currentYear} lastYear={lastYear} graphId={'lostPower'} yAxisName={'损失电量 (万kWh)'} xAxisName={'损失电量'} dateType={dateType} barGraphThatYear={barGraphThatYear} barGraphLastYear={barGraphLastYear} barGraphmonth={barGraphmonth} barGraphYearOnYear={barGraphYearOnYear} />
                {dateType === 'month' ? <AllStationMonthPie allStationMonthpie={'lostPowerPie'} yAxisName={'损失电量 (万kWh)'} pieTargetData={pieTargetData} barGraphYearOnYear={barGraphYearOnYear} /> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="损失电量等效时" key="LostEqpHour">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph currentYear={currentYear} lastYear={lastYear} graphId={'lostPowertime'} yAxisName={'发电量 (h)'} xAxisName={'损失电量等效时'} dateType={dateType} barGraphThatYear={barGraphThatYear} barGraphLastYear={barGraphLastYear} barGraphmonth={barGraphmonth} barGraphYearOnYear={barGraphYearOnYear} />
                {dateType === 'month' ? <AllStationMonthPie allStationMonthpie={'lostPowertimePie'} yAxisName={'发电量 (h)'} pieTargetData={pieTargetData} barGraphYearOnYear={barGraphYearOnYear} /> : ''}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default (TargetTabs)
