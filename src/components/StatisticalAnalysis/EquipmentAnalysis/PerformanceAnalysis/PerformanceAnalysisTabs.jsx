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
    const { contrastSwitch, contrastEndDate, conversionAvgRate, conversioneffData, faultTimeData, faultNumData, lostPowerData, availabilityData, hourData, contrastAvgRate, contrastConversionAvgRate, conversioneffContrastData, faultTimeContrastData, faultNumContrastData, lostPowerContrastData, availabilityContrastData, hourContrastData, conversDeviceNames, hourDeviceNames, availabilityDeviceNames, lostPowerDeviceNames, faultNumDeviceNames, faultTimeDeviceNames } = this.props;
    //转化效率
    let xData = conversioneffData && conversioneffData.map((e, i) => { return e.deviceName }) || [];
    let haveSliderConver = xData.length > 20;
    let barData = conversioneffData && conversioneffData.map((e, i) => { return e.conversionRate }) || [];
    let lineData = conversioneffData && conversioneffData.map((e, i) => { return conversionAvgRate }) || [];
    let conversionHasData = xData.some(e => e || e === 0) || barData.some(e => e || e === 0) || lineData.some(e => e || e === 0)
    //对比转化效率
    let contrastDeviceName = conversioneffContrastData && conversioneffContrastData.map((e, i) => { return e.deviceName }) || [];
    let haveSliderContrastCon = contrastDeviceName.length > 20;
    let conversionRate = conversioneffContrastData && conversioneffContrastData.map((e, i) => { return e.conversionRate }) || [];
    let contrastConversionRate = conversioneffContrastData && conversioneffContrastData.map((e, i) => { return e.contrastConversionRate }) || [];
    let contrastAvgRateData = conversioneffContrastData && conversioneffContrastData.map((e, i) => { return contrastAvgRate }) || [];
    let contrastConversionAvgRateData = conversioneffContrastData && conversioneffContrastData.map((e, i) => { return contrastConversionAvgRate }) || [];
    // console.log(contrastDeviceName,conversionRate,contrastConversionRate,contrastAvgRateData,contrastConversionAvgRateData);
    let contrastConversionHasData = contrastDeviceName.some(e => e || e === 0) || conversionRate.some(e => e || e === 0) || contrastConversionRate.some(e => e || e === 0) || contrastAvgRateData.some(e => e || e === 0) || contrastConversionAvgRateData.some(e => e || e === 0);
    //等效小时数、故障次数、故障时长
    let hoursDeviceNameData = hourData && hourData.map((e, i) => { return e.deviceName });
    let haveSliderHour = hoursDeviceNameData.length > 20;
    let hoursDataResults = hourData && hourData.map((e, i) => { return e.dataResults });
    let faultNumDeviceNameData = faultNumData && faultNumData.map((e, i) => { return e.deviceName });
    let haveSliderNum = faultNumDeviceNameData.length > 20;
    let faultNumDataResults = faultNumData && faultNumData.map((e, i) => { return e.dataResults });
    let faultTimeDeviceNameData = faultTimeData && faultTimeData.map((e, i) => { return e.deviceName });
    let haveSliderTime = faultTimeDeviceNameData.length > 20;
    let faultTimeDataResults = faultTimeData && faultTimeData.map((e, i) => { return e.dataResults });
    let hoursHasData = hoursDeviceNameData.some(e => e || e === 0) || hoursDataResults.some(e => e || e === 0);
    let faultNumHasData = faultNumDeviceNameData.some(e => e || e === 0) || faultNumDataResults.some(e => e || e === 0);
    let faultTimeHasData = faultTimeDeviceNameData.some(e => e || e === 0) || faultTimeDataResults.some(e => e || e === 0);
    //对比等效小时数、
    let contrastHoursDeviceNameData = hourContrastData && hourContrastData.map((e, i) => { return e.deviceName });
    let haveSliderConTrastHour = contrastHoursDeviceNameData.length > 20;
    let contrastHoursResults = hourContrastData && hourContrastData.map((e, i) => { return e.dataResults });
    let contrastHoursDataResults = hourContrastData && hourContrastData.map((e, i) => { return e.contrastDataResults });
    let contrastHoursHasData = contrastHoursDeviceNameData.some(e => e || e === 0) || contrastHoursResults.some(e => e || e === 0) || contrastHoursDataResults.some(e => e || e === 0)
    //对比故障次数
    let contrastFaultNumDeviceNameData = faultNumContrastData && faultNumContrastData.map((e, i) => { return e.deviceName });
    let haveSliderConTrastNum = contrastFaultNumDeviceNameData.length > 20;
    let contrastFaultNumResults = faultNumContrastData && faultNumContrastData.map((e, i) => { return e.dataResults });
    let contrastFaultNumDataResults = faultNumContrastData && faultNumContrastData.map((e, i) => { return e.contrastDataResults });
    let contrastFaultNumHasData = contrastFaultNumDeviceNameData.some(e => e || e === 0) || contrastFaultNumResults.some(e => e || e === 0) || contrastFaultNumDataResults.some(e => e || e === 0)
    //对比故障时长
    let contrastFaultTimeDeviceNameData = faultTimeContrastData && faultTimeContrastData.map((e, i) => { return e.deviceName });
    let haveSliderConTrastTime = contrastFaultTimeDeviceNameData.length > 20;
    let contrastFaultTimeResults = faultTimeContrastData && faultTimeContrastData.map((e, i) => { return e.dataResults });
    let contrastFaultTimeDataResults = faultTimeContrastData && faultTimeContrastData.map((e, i) => { return e.contrastDataResults });
    let contrastFaultTimeHasData = contrastFaultTimeDeviceNameData.some(e => e || e === 0) || contrastFaultTimeResults.some(e => e || e === 0) || contrastFaultTimeDataResults.some(e => e || e === 0)
    //利用率
    let availabilityDeviceName = availabilityData && availabilityData.map((e, i) => { return e.deviceName });
    let haveSliderAvailability=availabilityDeviceName.length>20;
    let availabilityDataResults = availabilityData && availabilityData.map((e, i) => { return e.availability });
    let availabilityHasData = availabilityDeviceName.some(e => e || e === 0) || availabilityDataResults.some(e => e || e === 0);
    //损失电量
    let lostPowerDeviceName = lostPowerData && lostPowerData.map((e, i) => { return e.deviceName });
    let haveSliderLostPower=lostPowerDeviceName.length>20;
    let lostPowerDataResults = lostPowerData && lostPowerData.map((e, i) => { return e.lostPower });
    let lostPowerHasData = lostPowerDeviceName.some(e => e || e === 0) || lostPowerDataResults.some(e => e || e === 0);
    //对比利用率及
    let contrastAvailabilityDeviceName = availabilityContrastData && availabilityContrastData.map((e, i) => { return e.deviceName });
    let haveSliderConAvailability=contrastAvailabilityDeviceName.length>20;
    let availabilityConData = availabilityContrastData && availabilityContrastData.map((e, i) => { return e.availability });
    let contrastAvailabilityData = availabilityContrastData && availabilityContrastData.map((e, i) => { return e.contrastAvailability });
    let contrastAvailabilityHasData = contrastAvailabilityDeviceName.some(e => e || e === 0) || availabilityConData.some(e => e || e === 0) || contrastAvailabilityData.some(e => e || e === 0)
    //对比损失电量
    let contrastLossPowerDeviceName = lostPowerContrastData && lostPowerContrastData.map((e, i) => { return e.deviceName });
    let haveSliderConLostPower=contrastLossPowerDeviceName.length>20;
    let lostPowerDataCon = lostPowerContrastData && lostPowerContrastData.map((e, i) => { return e.lostPower });
    let contrastLossPowerData = lostPowerContrastData && lostPowerContrastData.map((e, i) => { return e.contrastLossPower });
    let contrastLostPowerHasData = contrastLossPowerDeviceName.some(e => e || e === 0) || lostPowerDataCon.some(e => e || e === 0) || contrastLossPowerData.some(e => e || e === 0)

    //前五名设备
    // conversDeviceNames, hourDeviceNames, availabilityDeviceNames, lostPowerDeviceNames, faultNumDeviceNames, faultTimeDeviceNames
   
    const conversionData = contrastEndDate ? {
      xData: contrastDeviceName,
      yData: {
        barData: {
          conversionRate: conversionRate,
          contrastConversionAvgRate: contrastConversionAvgRateData
        },
        lineData: {
          conversionAvgRate: contrastAvgRateData,
          contrastConversionRate: contrastConversionRate
        }
      }
    } : {
        xData: xData,
        yData: {
          barData: {
            conversionRate: barData,
          },
          lineData: {
            conversionAvgRate: lineData,
          }
        }
      }
    const hoursData = contrastEndDate ? {
      xData: contrastHoursDeviceNameData,
      yData: {
        barData: {
          hour: contrastHoursResults,
          contrastHoursData: contrastHoursDataResults
        },

      }
    } : {
        xData: hoursDeviceNameData,
        yData: {
          barData: {
            hour: hoursDataResults,
          },
        }
      }
    const availabilityAnalysis = contrastEndDate ? {
      xData: contrastAvailabilityDeviceName,
      yData: {
        lineData: {
          availability: availabilityConData,
          contrastAvailability: contrastAvailabilityData
        }
      }
    } : {
        xData: availabilityDeviceName,
        yData: {
          lineData: {
            availability: availabilityDataResults,

          }
        }
      }
    const lossPowerAnalysis = contrastEndDate ? {
      xData: contrastLossPowerDeviceName,
      yData: {
        barData: {
          lostPower: lostPowerDataCon,
          contrastLossPower: contrastLossPowerData
        },
      }
    } : {
        xData: lostPowerDeviceName,
        yData: {
          barData: {
            lostPower: lostPowerDataResults,

          },
        }
      }
    const faultNumAnalysis = contrastEndDate ? {
      xData: contrastFaultNumDeviceNameData,
      yData: {
        barData: {
          faultNum: contrastFaultNumDataResults,
          contrastFaultNumData: contrastFaultNumResults
        },

      }
    } : {
        xData: faultNumDeviceNameData,
        yData: {
          barData: {
            faultNum: faultNumDataResults,
          },

        }
      }
    const faultTimeAnalysis = contrastEndDate ? {
      xData: contrastFaultTimeDeviceNameData,
      yData: {
        barData: {
          faultTime: contrastFaultTimeDataResults,
          contrastFaultTimeData: contrastFaultTimeResults
        },
      }
    } : {
        xData: faultTimeDeviceNameData,
        yData: {
          barData: {
            faultTime: faultTimeDataResults,
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
                <PerformanceCharts graphId={'conversioneff'} title={'转换效率'} data={conversionData}
                  hasSlider={contrastSwitch&&contrastEndDate ? haveSliderContrastCon : haveSliderConver}
                  hasData={contrastSwitch&&contrastEndDate ? contrastConversionHasData : conversionHasData}
                  deviceNames={conversDeviceNames}
                />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查转换效率低的设备是否故障</div>
                {conversDeviceNames.length>0 ? <div><span className="iconfont icon-ha"></span>建议关注排名变化较大的{conversDeviceNames.map((e, i) => (<span key={e} className={styles.fontColor}>{e},</span>))}设备</div> : ''}
              </div>
              <div className={styles.chart}>
                <PerformanceCharts graphId={'hours'} title={'等效小时数'} data={hoursData}
                  hasSlider={contrastSwitch&&contrastEndDate? haveSliderConTrastHour : haveSliderHour}
                  hasData={contrastSwitch&&contrastEndDate ? contrastHoursHasData : hoursHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查等效小时数较低的逆变器:1.排查逆变器下组串是否正常；2.排查逆变器是否故障；3.排查逆变器转换效率是否正常</div>
                {hourDeviceNames.length>0 ? <div><span className="iconfont icon-ha"></span>建议关注排名变化较大的{hourDeviceNames.map((e, i) => (<span key={e} className={styles.fontColor}>{e},</span>))}设备</div> : ''}
              </div>
              <div className={styles.chart}>
                <PerformanceCharts graphId={'availability'} title={'可利用率'} data={availabilityAnalysis}
                  hasSlider={contrastSwitch&&contrastEndDate ? haveSliderConAvailability : haveSliderAvailability}
                  hasData={contrastSwitch&&contrastEndDate ? contrastAvailabilityHasData : availabilityHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查可利用率较低的设备是否故障</div>
                {availabilityDeviceNames.length>0 ? <div><span className="iconfont icon-ha"></span>建议关注排名变化较大的{availabilityDeviceNames.map((e, i) => (<span key={e} className={styles.fontColor}>{e},</span>))}设备</div> : ''}
              </div>
            </div>
          </TabPane>
          <TabPane tab="故障情况" key="2">
            <div className={styles.chartsContainer}>
              <div className={styles.chart}>
                <PerformanceCharts graphId={'lostPower'} title={'损失电量'} data={lossPowerAnalysis}
                  hasSlider={contrastSwitch&&contrastEndDate ? haveSliderConLostPower : haveSliderLostPower}
                  hasData={contrastSwitch&&contrastEndDate ? contrastLostPowerHasData : lostPowerHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查损失电量较多的设备是否故障</div>
                {lostPowerDeviceNames.length>0 ? <div><span className="iconfont icon-ha"></span>建议关注排名变化较大的{lostPowerDeviceNames.map((e, i) => (<span key={e} className={styles.fontColor}>{e},</span>))}设备</div> : ''}
              </div>
              <div className={styles.chart}>
                <PerformanceCharts graphId={'faultNum'} title={'设备故障次数'} data={faultNumAnalysis}
                  hasSlider={contrastSwitch&&contrastEndDate ? haveSliderConTrastNum : haveSliderNum}
                  hasData={contrastSwitch&&contrastEndDate ? contrastFaultNumHasData : faultNumHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查故障次数较多以及故障时长较长的设备</div>
                {faultNumDeviceNames.length>0 ? <div><span className="iconfont icon-ha"></span>建议关注排名变化较大的{faultNumDeviceNames.map((e, i) => (<span key={e} className={styles.fontColor}>{e},</span>))}设备</div> : ''}
              </div>
              <div className={styles.chart}>
                <PerformanceCharts graphId={'faultTime'} title={'设备故障时长'} data={faultTimeAnalysis}
                  hasSlider={contrastSwitch&&contrastEndDate ? haveSliderConTrastTime : haveSliderTime}
                  hasData={contrastSwitch&&contrastEndDate ? contrastFaultTimeHasData : faultTimeHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查故障次数较多以及故障时长较长的设备</div>
                {faultTimeDeviceNames.length>0 ? <div><span className="iconfont icon-ha"></span>建议关注排名变化较大的{faultTimeDeviceNames.map((e, i) => (<span key={e} className={styles.fontColor}>{e},</span>))}设备</div> : ''}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default (PerformanceAnalysisTabs)

