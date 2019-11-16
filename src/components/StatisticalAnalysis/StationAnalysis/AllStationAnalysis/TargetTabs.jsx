import React from 'react';
import PropTypes from 'prop-types';
import styles from './targetTabs.scss';
import { Tabs } from 'antd';
import BarGraph from '../CommonGraphs/BarGraph/index.js';
import TargetStatisticPieGraph from './Chart/TargetStatisticPieGraph.jsx';
import AllStationMonthPie from './Chart/AllStationMonthPie/index';
import Cookie from 'js-cookie';

class TargetTabs extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    stationType: PropTypes.any,
    year: PropTypes.any,
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
    super(props, context);
  }
  queryTargetData = (activeKey) => {
    const { changeAllStationStore, getAllStationMonthBarData, getAllStationMonthPieData, year, dateType, stationType } = this.props;
    const userId = Cookie.get('userId');
    changeAllStationStore({ targetShowType: activeKey });
    const changeRangYear = [];
    if (dateType === 'year') {
      for (let i = Number(this.props.year[0]); i < Number(this.props.year[1]) + 1; i++) {
        changeRangYear.push(i.toString());
      }
    }
    getAllStationMonthBarData({
      userId: userId,
      year: dateType === 'year' ? changeRangYear : year,
      dateType,
      stationType,
      dataType: activeKey,
    });
  }

  render() {
    const TabPane = Tabs.TabPane;
    const { dateType, year, theme, allStationMonthBarData = [] } = this.props;
    const currentYear = `${year}`;
    const lastYear = `${year - 1}`;
    const barGraphThatYear = allStationMonthBarData.map(e => e.thatYearData);
    const barGraphLastYear = allStationMonthBarData.map(e => e.lastYearData);
    const barGraphmonth = allStationMonthBarData.map((e, i) => (`${e.month}月`));
    const barGraphYear = allStationMonthBarData.map((e, i) => (`${e.year}`));
    const barGraphYearOnYear = allStationMonthBarData.map(e => e.yearOnYear);
    const barGraphRingRatio = allStationMonthBarData.map(e => e.ringRatio);
    const hasData = barGraphThatYear.some(e => e || e === 0) || barGraphLastYear.some(e => e || e === 0) || barGraphYearOnYear.some(e => e || e === 0) || barGraphRingRatio.some(e => e || e === 0);
    const pieTargetData = allStationMonthBarData.map((e, i) => ({ value: e.thatYearData, name: `${e.month}月` }));
    const pieHasData = pieTargetData.map(e => e.value).some(e => e || e === 0);
    const TabPaneData = [
      {
        tab: '发电量',
        key: 'EqpGen',
        graphId: 'power',
        yAxisName: '发电量(万kWh)',
        xAxisName: '发电量',
        pieGraphId: 'powerPie',
      },
      {
        tab: '辐射总量',
        key: 'PvRadi',
        graphId: 'radiationBar',
        yAxisName: '辐射总量(MJ/㎡)',
        xAxisName: '辐射总量',
        pieGraphId: 'radiationPie',
      },
      // {
      //   tab: '等效利用小时数',
      //   key: 'EqpWorkedHour',
      //   graphId: 'userTime',
      //   yAxisName: '等效利用小时数(h)',
      //   xAxisName: '等效利用小时数',
      //   pieGraphId: 'userTimePie',
      // },
      {
        tab: 'PR',
        key: 'pr',
        graphId: 'PR',
        yAxisName: 'PR(%)',
        xAxisName: 'PR',
        pieGraphId: 'PRPie',
      }, {
        tab: '损失电量',
        key: 'LostEqp',
        graphId: 'lostPower',
        yAxisName: '损失电量(万kWh)',
        xAxisName: '损失电量',
        pieGraphId: 'lostPowerPie',
      },
      {
        tab: '损失电量等效时',
        key: 'LostEqpHour',
        graphId: 'lostPowertime',
        yAxisName: '发电量(h)',
        xAxisName: '损失电量等效时',
        pieGraphId: 'lostPowertimePie',
      },
    ];


    return (
      <div className={`${styles.targetTabs} ${styles[theme]}`}>
        <Tabs
          activeKey={this.props.targetShowType}
          animated={false}
          onChange={this.queryTargetData}
        >
          {TabPaneData.map((item, index) => {
            return (
              <TabPane tab={item.tab} key={item.key}>
                <div className={styles.tabContainer}>
                  <div className={`${styles.dataGraph} ${dateType === 'month' && styles.selectMonth}`}>
                    <BarGraph
                      currentYear={currentYear}
                      lastYear={lastYear}
                      barGraphThatYear={barGraphThatYear}
                      barGraphLastYear={barGraphLastYear}
                      barGraphmonth={dateType === 'year' ? barGraphYear : barGraphmonth}
                      barGraphYearOnYear={barGraphYearOnYear}
                      barGraphRingRatio={barGraphRingRatio}
                      graphId={item.graphId}
                      yAxisName={item.yAxisName}
                      xAxisName={item.xAxisName}
                      dateType={dateType}
                      hasData={hasData}
                      theme={theme}
                    />
                    {
                      dateType === 'month' &&
                      <AllStationMonthPie
                        allStationMonthpie={item.pieGraphId}
                        yAxisName={item.yAxisName}
                        xAxisName={item.xAxisName}
                        pieTargetData={pieTargetData}
                        barGraphYearOnYear={barGraphYearOnYear}
                        theme={theme}
                        hasData={pieHasData} />}

                  </div>
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}
export default (TargetTabs);
