import React, { Component } from "react";
import styles from "./performanceAnalysisTabs.scss";
import { Tabs } from 'antd';
class PerformanceAnalysisTabs extends Component {
  constructor(props, context) {
    super(props, context)
  }
  queryData = (activeKey) => {
    const { contrastSwitch, stationCode, deviceTypeCode, endDate, startDate } = this.props;
    this.props.changePerformanceAnalysisStore({ targetTabs: activeKey })
    const prams = {
      stationCode,
      startDate,
      endDate,
      deviceTypeCode
    }
    if (contrastSwitch) {
      if (activeKey === '1') {
        this.props.getPerformanceContrast({ ...prams })
      } else {
        this.props.getFaultContrast({ ...prams })
      }
    } else {
      if (activeKey === '1') {
        this.props.getPerformance({ ...prams })
      } else {
        this.props.getFault({ ...prams })
      }
    }
  }
  render() {
    const TabPane = Tabs.TabPane;
    const {targetTabs}=this.props;
    return (
      <div className={styles.targetTabs}>
        <Tabs activeKey={targetTabs} onChange={this.queryData} animated={false} >
          <TabPane tab="发电性能" key="1">发电性能</TabPane>
          <TabPane tab="故障情况" key="2">故障情况</TabPane>
        </Tabs>
      </div>
    )
  }
}
export default (PerformanceAnalysisTabs)

