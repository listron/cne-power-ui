import React, { Component } from "react";
import styles from "./performanceAnalysisTabs.scss";
import { Tabs } from 'antd';
import PerformanceCharts from './PerformanceCharts'
class PerformanceAnalysisTabs extends Component {
  constructor(props, context) {
    super(props, context)
  }
  queryData = (activeKey) => {
    const { contrastSwitch, stationCode, deviceTypeCode, endDate, startDate, contrastStartDate, contrastEndDate, electricLineCode, deviceModeTypeCode } = this.props;
    this.props.changePerformanceAnalysisStore({ targetTabs: activeKey })
    const prams = {
      stationCode,
      startDate,
      endDate,
      deviceTypeCode,
      electricLineCode,
      deviceModeTypeCode
    }
    if (contrastSwitch) {
      if (activeKey === '1') {
        this.props.getPerformanceContrast({ ...prams, contrastStartDate, contrastEndDate })
      } else {
        this.props.getFaultContrast({ ...prams, contrastStartDate, contrastEndDate })
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
    const { targetTabs } = this.props;
    const { conversionAvgRate, conversioneffData } = this.props;
    let xData = conversioneffData && conversioneffData.map((e, i) => { return e.deviceName })||[];
    let barData = conversioneffData && conversioneffData.map((e, i) => { return e.conversionRate })||[];
    let lineData = conversioneffData && conversioneffData.map((e, i) => { return conversionAvgRate })||[];
    let contrastConversionRate = conversioneffData && conversioneffData.map((e, i) => { return '30' })||[];

    const conversionData = {
      xData: xData,
      yData: {
        barData: {
          conversionRate:barData,
          contrastConversionAvgRate:lineData},
        lineData:{
          conversionAvgRate:lineData,
          contrastConversionRate:contrastConversionRate}
      }
    }
    const hoursData = {
      xData: xData,
      yData: {
        barData: {
          hour:barData,
          contrastHoursData:lineData
        },
      
      }
    }
    const availabilityData = {
      xData: xData,
      yData: { 
        lineData:{
          availability:lineData,
          contrastAvailability:contrastConversionRate
        }
      }
    }
    const lossPowerData = {
      xData: xData,
      yData: {
        barData: {
          lossPower:barData,
          contrastLossPower:lineData
        },
      
      }
    }
    const faultNumData = {
      xData: xData,
      yData: {
        barData: {
          faultNum:barData,
          contrastFaultNumData:lineData
        },
      
      }
    }
    const faultTimeData = {
      xData: xData,
      yData: {
        barData: {
          faultTime:barData,
          contrastFaultTimeData:lineData
        },
      
      }
    }
    // graphId={"powerEfficency"}
    // title={"发电效率"}
    // data={PowerEffectiveData}
    // hasData={PowerEffectiveHasData}

    return (
      <div className={styles.targetTabs}>
        <Tabs activeKey={targetTabs} onChange={this.queryData} animated={false} >
          <TabPane tab="发电性能" key="1">
            <div className={styles.chartsContainer}>
              <div className={styles.chart}>
                <PerformanceCharts graphId={'conversioneff'} title={'转换效率'} data={conversionData} hasData={true} />
              </div>
              <div className={styles.chart}>
                <PerformanceCharts graphId={'hours'} title={'等效小时数'} data={hoursData} hasData={true} />
              </div>
              <div className={styles.chart}>
                <PerformanceCharts graphId={'availability'} title={'可利用率'} data={availabilityData} hasData={true} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="故障情况" key="2">
          <div className={styles.chartsContainer}>
          <div className={styles.chart}>
            <PerformanceCharts graphId={'lossPower'} title={'损失电量'} data={lossPowerData} hasData={true} />
          </div>
          <div className={styles.chart}>
            <PerformanceCharts graphId={'faultNum'} title={'设备故障次数'} data={faultNumData} hasData={true} />
          </div>
          <div className={styles.chart}>
            <PerformanceCharts graphId={'faultTime'} title={'设备故障时长'} data={faultTimeData} hasData={true} />
          </div>
        </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default (PerformanceAnalysisTabs)

