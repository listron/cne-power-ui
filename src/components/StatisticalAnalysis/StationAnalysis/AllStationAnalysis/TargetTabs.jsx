import React from "react";
import styles from './targetTabs.scss';
import { Tabs } from 'antd';
import BarGraph from './CommonGraph/BarGraph/index.js';
import TargetStatisticPieGraph from './TargetStatisticPieGraph.jsx';
import StationStatisticList from './StationStatisticList.jsx';
import AllStationMonthPie from './CommonGraph/AllStationMonthPie';


class TargetTabs extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const TabPane = Tabs.TabPane;
    const{dateType}=this.props;
    return (
      <div className={styles.targetTabs}>
        <Tabs
          defaultActiveKey="1"
          animated={false}
        >
          <TabPane tab="发电量" key="1">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'power'} yAxisName={'发电量 (万kWh)'}  xAxisName={'发电量'} dateType={dateType} />
                {dateType==='month'?<TargetStatisticPieGraph pieGraphId={'powerPie'} yAxisName={'发电量 (万kWh)'}/>:''}
              </div>
              <StationStatisticList {...this.props} />
            </div>
          </TabPane>
          <TabPane tab="辐射总量" key="2">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'radiationBar'} yAxisName={'辐射总量 (MJ/㎡)'} xAxisName={'辐射总量'} dateType={dateType} />
                {dateType==='month'?<AllStationMonthPie allStationMonthpie={'radiationPie'} yAxisName={'辐射总量 (MJ/㎡)'}/>:''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="等效利用小时数" key="3">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'userTime'} yAxisName={'等效利用小时数 (h)'}  xAxisName={'等效利用小时数'} dateType={dateType} />
                {dateType==='month'?<AllStationMonthPie allStationMonthpie={'userTimePie'} yAxisName={'等效利用小时数 (h)'}/>:''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="PR" key="4">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'PR'} yAxisName={'PR'}  xAxisName={'PR'} dateType={dateType} />
                {dateType==='month'?<AllStationMonthPie allStationMonthpie={'PRPie'} yAxisName={'PR(%)'}/>:''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="损失电量" key="5">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'lostPower'} yAxisName={'损失电量 (万kWh)'}  xAxisName={'损失电量'} dateType={dateType} />
                {dateType==='month'?<AllStationMonthPie allStationMonthpie={'lostPowerPie'} yAxisName={'损失电量 (万kWh)'}/>:''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="损失电量等效时" key="6">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'lostPowertime'} yAxisName={'发电量 (h)'}  xAxisName={'损失电量等效时'} dateType={dateType} />
                {dateType==='month'?<AllStationMonthPie allStationMonthpie={'lostPowertimePie'} yAxisName={'发电量 (h)'}/>:''}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default (TargetTabs)
