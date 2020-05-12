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
        yAxisName: '发电量(万kWh)',
        xAxisName: '发电量',
      },
      {
        tab: '辐射总量',
        key: 'PvRadi',
        yAxisName: '辐射总量(MJ/㎡)',
        xAxisName: '辐射总量',
      },
      // {
      //   tab: '等效利用小时数',
      //   key: 'EqpWorkedHour',
      //   yAxisName: '等效利用小时数(h)',
      //   xAxisName: '等效利用小时数',
      // },
      {
        tab: 'PR',
        key: 'pr',
        yAxisName: 'PR(%)',
        xAxisName: 'PR',
      }, {
        tab: '损失电量',
        key: 'LostEqp',
        yAxisName: '损失电量(万kWh)',
        xAxisName: '损失电量',
      },
      {
        tab: '损失电量等效时',
        key: 'LostEqpHour',
        yAxisName: '发电量(h)',
        xAxisName: '损失电量等效时',
      },
    ];


    const selectKey = TabPaneData.filter(e => e.key === this.props.targetShowType);
    const { yAxisName, xAxisName } = selectKey.length > 0 && selectKey[0] || {}
    return (
      <div className={`${styles.targetTabs} ${styles[theme]}`}>
        <div className={styles.tabWrap}>
          {TabPaneData.map(e => {
            return (
              <p key={e.key}
                onClick={() => this.queryTargetData(e.key)}
                className={`${styles.normal} ${this.props.targetShowType === e.key && styles.active}`}
              >{e.tab}</p>)
          })}
        </div>
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
              yAxisName={yAxisName}
              xAxisName={xAxisName}
              dateType={dateType}
              hasData={hasData}
              theme={theme}
            />
            {
              dateType === 'month' &&
              <AllStationMonthPie
                yAxisName={yAxisName}
                xAxisName={xAxisName}
                pieTargetData={pieTargetData}
                barGraphYearOnYear={barGraphYearOnYear}
                theme={theme}
                hasData={pieHasData} />}
          </div>
        </div>
      </div>
    );
  }
}
export default (TargetTabs);
