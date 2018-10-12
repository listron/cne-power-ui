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
    const{timeSelect}=this.props;
    return (
      <div className={styles.targetTabs}>
        <Tabs
          defaultActiveKey="1"
          animated={false}
        >
          <TabPane tab="发电量" key="1">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'power'} yAxisName={'发电量 (万kWh)'}  xAxisName={'发电量'} timeSelect={timeSelect} />
                <TargetStatisticPieGraph pieGraphId={'powerPie'} />
              </div>
              <StationStatisticList {...this.props} />
            </div>
          </TabPane>
          <TabPane tab="辐射总量" key="2">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'radiationBar'} yAxisName={'辐射总量 (MJ/㎡)'} xAxisName={'辐射总量'} timeSelect={timeSelect} />
                <AllStationMonthPie allStationMonthpie={'radiationPie'} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="等效利用小时数" key="3">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'userTime'} yAxisName={'等效利用小时数 (h)'}  xAxisName={'等效利用小时数'} timeSelect={timeSelect} />
                <AllStationMonthPie allStationMonthpie={'userTimePie'} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="PR" key="4">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'PR'} yAxisName={'PR'}  xAxisName={'PR'} timeSelect={timeSelect} />
                <AllStationMonthPie allStationMonthpie={'PRPie'} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="损失电量" key="5">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'lostPower'} yAxisName={'损失电量 (万kWh)'}  xAxisName={'损失电量'} timeSelect={timeSelect} />
                <AllStationMonthPie allStationMonthpie={'lostPowerPie'} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="损失电量等效时" key="6">
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'lostPowertime'} yAxisName={'发电量 (h)'}  xAxisName={'损失电量等效时'} timeSelect={timeSelect} />
                <AllStationMonthPie allStationMonthpie={'lostPowertimePie'} />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default (TargetTabs)