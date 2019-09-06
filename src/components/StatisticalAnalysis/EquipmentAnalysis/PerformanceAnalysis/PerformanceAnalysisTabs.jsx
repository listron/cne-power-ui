import React, { Component } from 'react';
import styles from './performanceAnalysisTabs.scss';
import { Tabs } from 'antd';
import PerformanceCharts from './PerformanceCharts';
class PerformanceAnalysisTabs extends Component {
  constructor(props, context) {
    super(props, context);
  }
  queryData = (activeKey) => {
    const { contrastSwitch, stationCode, deviceTypeCode, endDate, startDate, contrastStartDate, contrastEndDate, electricLineCode, deviceModeTypeCode } = this.props;
    this.props.changePerformanceAnalysisStore({ targetTabs: activeKey });
    const prams = {
      stationCode,
      startDate,
      endDate,
      deviceTypeCode,
      electricLineCode,
      deviceModeTypeCode,
    };
    if (contrastSwitch) {
      if (activeKey === '1') {
        this.props.getPerformanceContrast({ ...prams, contrastStartDate, contrastEndDate });
      } else {
        this.props.getFaultContrast({ ...prams, contrastStartDate, contrastEndDate });
      }
    } else if (activeKey === '1') {
      this.props.getPerformance({ ...prams });
    } else {
      this.props.getFault({ ...prams });
    }
  }
  showText = (data) => {
    if (data.length > 0) {
      return (
        <div>
          <span className="iconfont icon-ha">
          </span>
          建议关注排名变化较大的:
        <span className={styles.fontColor}>
            {data.slice(0, 5).map((e, i) => {
              if (i === 0) { return `${e}`; }
              return `,${e}`;

            })}
          </span>
          {data.length > 5 ? '等' : ''}设备
        </div>
      );

    }
  }
  showNullValue = (data) => {
    if (data.length > 0) {
      return (
        <div>
          <span className="iconfont icon-ha" />
          建议检查无数据设备传输状态,无数据设备有:
        <span className={styles.fontColor}>
            {data.slice(0, 5).map((e, i) => {
              if (i === 0) { return `${e}`; }
              return `,${e}`;

            })}
          </span>
          {data.length > 5 ? '等' : ''}
        </div>
      );
    }
  }

  render() {
    const TabPane = Tabs.TabPane;
    const { targetTabs, loading, theme } = this.props;
    const { contrastSwitch, contrastEndDate, conversionAvgRate, conversioneffData, faultTimeData, faultNumData, lostPowerData, availabilityData, hourData, contrastAvgRate, contrastConversionAvgRate, conversioneffContrastData, faultTimeContrastData, faultNumContrastData, lostPowerContrastData, availabilityContrastData, hourContrastData, conversDeviceNames, hourDeviceNames, availabilityDeviceNames, lostPowerDeviceNames, faultNumDeviceNames, faultTimeDeviceNames, conversionNullValue, hourNullValue, faultNumNullvalue, faultTimeNullValue } = this.props;
    //转化效率
    const xData = conversioneffData.map(e => e.deviceName) || [];
    const haveSliderConver = xData.length > 20;
    const barData = conversioneffData.map(e => e.conversionRate) || [];
    const lineData = Array(xData.length).fill(conversionAvgRate) || [];
    const conversionHasData = barData.some(e => e || e === 0) || lineData.some(e => e || e === 0);
    //对比转化效率
    const contrastDeviceName = conversioneffContrastData.map(e => e.deviceName) || [];
    const haveSliderContrastCon = contrastDeviceName.length > 20;
    const conversionRate = conversioneffContrastData.map(e => e.conversionRate) || [];
    const contrastConversionRate = conversioneffContrastData.map(e => e.contrastConversionRate) || [];
    const contrastAvgRateData = Array(xData.length).fill(contrastAvgRate) || [];
    const contrastConversionAvgRateData = Array(xData.length).fill(contrastConversionAvgRate) || [];
    const contrastConversionHasData = conversionRate.some(e => e || e === 0) || contrastConversionRate.some(e => e || e === 0) || contrastAvgRateData.some(e => e || e === 0) || contrastConversionAvgRateData.some(e => e || e === 0);

    //等效小时数、故障次数、故障时长
    const hoursDeviceNameData = hourData.map(e => e.deviceName);
    const haveSliderHour = hoursDeviceNameData.length > 20;
    const hoursDataResults = hourData.map(e => e.dataResults);
    const faultNumDeviceNameData = faultNumData.map(e => e.deviceName);
    const haveSliderNum = faultNumDeviceNameData.length > 20;
    const faultNumDataResults = faultNumData.map(e => e.dataResults);
    const faultTimeDeviceNameData = faultTimeData.map(e => e.deviceName);
    const haveSliderTime = faultTimeDeviceNameData.length > 20;
    const faultTimeDataResults = faultTimeData.map(e => e.dataResults);
    const hoursHasData = hoursDataResults.some(e => e || e === 0);
    const faultNumHasData = faultNumDataResults.some(e => e || e === 0);
    const faultTimeHasData = faultTimeDataResults.some(e => e || e === 0);

    //对比等效小时数、
    const contrastHoursDeviceNameData = hourContrastData.map(e => e.deviceName);
    const haveSliderConTrastHour = contrastHoursDeviceNameData.length > 20;
    const contrastHoursResults = hourContrastData.map(e => e.dataResults);
    const contrastHoursDataResults = hourContrastData.map(e => e.contrastDataResults);
    const contrastHoursHasData = contrastHoursResults.some(e => e || e === 0) || contrastHoursDataResults.some(e => e || e === 0);

    //对比故障次数
    const contrastFaultNumDeviceNameData = faultNumContrastData.map(e => e.deviceName);
    const haveSliderConTrastNum = contrastFaultNumDeviceNameData.length > 20;
    const contrastFaultNumResults = faultNumContrastData.map(e => e.dataResults);
    const contrastFaultNumDataResults = faultNumContrastData.map(e => e.contrastDataResults);
    const contrastFaultNumHasData = contrastFaultNumResults.some(e => e || e === 0) || contrastFaultNumDataResults.some(e => e || e === 0);

    //对比故障时长
    const contrastFaultTimeDeviceNameData = faultTimeContrastData.map(e => e.deviceName);
    const haveSliderConTrastTime = contrastFaultTimeDeviceNameData.length > 20;
    const contrastFaultTimeResults = faultTimeContrastData.map(e => e.dataResults);
    const contrastFaultTimeDataResults = faultTimeContrastData.map(e => e.contrastDataResults);
    const contrastFaultTimeHasData = contrastFaultTimeResults.some(e => e || e === 0) || contrastFaultTimeDataResults.some(e => e || e === 0);

    //利用率
    const availabilityDeviceName = availabilityData.map(e => e.deviceName);
    const haveSliderAvailability = availabilityDeviceName.length > 20;
    const availabilityDataResults = availabilityData.map(e => e.availability);
    const availabilityHasData = availabilityDataResults.some(e => e || e === 0);


    //损失电量
    const lostPowerDeviceName = lostPowerData.map(e => e.deviceName);
    const haveSliderLostPower = lostPowerDeviceName.length > 20;
    const lostPowerDataResults = lostPowerData.map(e => e.lossPower);
    const lostPowerHasData = lostPowerDataResults.some(e => e || e === 0);

    //对比利用率及
    const contrastAvailabilityDeviceName = availabilityContrastData.map(e => e.deviceName);
    const haveSliderConAvailability = contrastAvailabilityDeviceName.length > 20;
    const availabilityConData = availabilityContrastData.map(e => e.availability);
    const contrastAvailabilityData = availabilityContrastData.map(e => e.contrastAvailability);
    const contrastAvailabilityHasData = availabilityConData.some(e => e || e === 0) || contrastAvailabilityData.some(e => e || e === 0);

    //对比损失电量
    const contrastLossPowerDeviceName = lostPowerContrastData.map((e, i) => { return e.deviceName; });
    const haveSliderConLostPower = contrastLossPowerDeviceName.length > 20;
    const lostPowerDataCon = lostPowerContrastData.map((e, i) => { return e.lossPower; });
    const contrastLossPowerData = lostPowerContrastData.map((e, i) => { return e.contrastLossPower; });
    const contrastLostPowerHasData = lostPowerDataCon.some(e => e || e === 0) || contrastLossPowerData.some(e => e || e === 0);

    //前五名设备
    // conversDeviceNames, hourDeviceNames, availabilityDeviceNames, lostPowerDeviceNames, faultNumDeviceNames, faultTimeDeviceNames

    const conversionData = contrastEndDate ? {
      xData: contrastDeviceName,
      yData: {
        barData: {
          conversionRate: conversionRate,
          contrastConversionRate: contrastConversionRate,
        },
        lineData: {
          conversionAvgRate: contrastAvgRateData,
          contrastConversionAvgRate: contrastConversionAvgRateData,
        },
      },
    } : {
        xData: xData,
        yData: {
          barData: {
            conversionRate: barData,
          },
          lineData: {
            conversionAvgRate: lineData,
          },
        },
      };
    const hoursData = contrastEndDate ? {
      xData: contrastHoursDeviceNameData,
      yData: {
        barData: {
          hour: contrastHoursResults,
          contrastHoursData: contrastHoursDataResults,
        },

      },
    } : {
        xData: hoursDeviceNameData,
        yData: {
          barData: {
            hour: hoursDataResults,
          },
        },
      };
    const availabilityAnalysis = contrastEndDate ? {
      xData: contrastAvailabilityDeviceName,
      yData: {
        lineData: {
          availability: availabilityConData,
          contrastAvailability: contrastAvailabilityData,
        },
      },
    } : {
        xData: availabilityDeviceName,
        yData: {
          lineData: {
            availability: availabilityDataResults,

          },
        },
      };
    const lossPowerAnalysis = contrastEndDate ? {
      xData: contrastLossPowerDeviceName,
      yData: {
        barData: {
          lostPower: lostPowerDataCon,
          contrastLossPower: contrastLossPowerData,
        },
      },
    } : {
        xData: lostPowerDeviceName,
        yData: {
          barData: {
            lostPower: lostPowerDataResults,

          },
        },
      };
    const faultNumAnalysis = contrastEndDate ? {
      xData: contrastFaultNumDeviceNameData,
      yData: {
        barData: {
          faultNum: contrastFaultNumResults,
          contrastFaultNumData: contrastFaultNumDataResults,
        },

      },
    } : {
        xData: faultNumDeviceNameData,
        yData: {
          barData: {
            faultNum: faultNumDataResults,
          },

        },
      };
    const faultTimeAnalysis = contrastEndDate ? {
      xData: contrastFaultTimeDeviceNameData,
      yData: {
        barData: {
          faultTime: contrastFaultTimeResults,
          contrastFaultTimeData: contrastFaultTimeDataResults,
        },
      },
    } : {
        xData: faultTimeDeviceNameData,
        yData: {
          barData: {
            faultTime: faultTimeDataResults,
          },
        },
      };
    // graphId={"powerEfficency"}
    // title={"发电效率"}
    // data={PowerEffectiveData}
    // hasData={PowerEffectiveHasData}

    return (
      <div className={`${styles.targetTabs} ${styles[theme]}`}>
        <Tabs activeKey={targetTabs} onChange={this.queryData} animated={false} >
          <TabPane tab="发电性能" key="1">
            <div className={styles.chartsContainer}>
              <div className={styles.chart}>
                <PerformanceCharts
                  graphId={'conversioneff'}
                  title={'转换效率'}
                  data={conversionData}
                  hasSlider={contrastSwitch && contrastEndDate ? haveSliderContrastCon : haveSliderConver}
                  hasData={contrastSwitch && contrastEndDate ? contrastConversionHasData : conversionHasData}
                  deviceNames={contrastSwitch && contrastEndDate ? conversDeviceNames : []}
                  loading={loading}
                  theme={theme}
                />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查转换效率低的设备是否故障</div>
                {this.showNullValue(conversionNullValue)}
                {contrastSwitch && contrastEndDate ? this.showText(conversDeviceNames) : ''}
              </div>
              <div className={styles.chart}>
                <PerformanceCharts
                  graphId={'hours'}
                  title={'等效小时数'}
                  data={hoursData}
                  loading={loading}
                  deviceNames={contrastSwitch && contrastEndDate ? hourDeviceNames : []}
                  theme={theme}
                  hasSlider={contrastSwitch && contrastEndDate ? haveSliderConTrastHour : haveSliderHour}
                  hasData={contrastSwitch && contrastEndDate ? contrastHoursHasData : hoursHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查等效小时数较低的逆变器:1.排查逆变器下组串是否正常；2.排查逆变器是否故障；3.排查逆变器转换效率是否正常</div>

                {this.showNullValue(hourNullValue)}
                {contrastSwitch && contrastEndDate ? this.showText(hourDeviceNames) : ''}

              </div>
              <div className={styles.chart}>
                <PerformanceCharts
                  graphId={'availability'}
                  title={'可利用率'}
                  loading={loading}
                  data={availabilityAnalysis}
                  theme={theme}
                  deviceNames={contrastSwitch && contrastEndDate ? availabilityDeviceNames : []}
                  hasSlider={contrastSwitch && contrastEndDate ? haveSliderConAvailability : haveSliderAvailability}
                  hasData={contrastSwitch && contrastEndDate ? contrastAvailabilityHasData : availabilityHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查可利用率较低的设备是否故障</div>
                {this.showText(availabilityDeviceNames)}

              </div>
            </div>
          </TabPane>
          <TabPane tab="故障情况" key="2">
            <div className={styles.chartsContainer}>
              <div className={styles.chart}>
                <PerformanceCharts
                  graphId={'lostPower'}
                  title={'损失电量'}
                  loading={loading}
                  data={lossPowerAnalysis}
                  theme={theme}
                  hasSlider={contrastSwitch && contrastEndDate ? haveSliderConLostPower : haveSliderLostPower}
                  deviceNames={contrastSwitch && contrastEndDate ? lostPowerDeviceNames : []}
                  hasData={contrastSwitch && contrastEndDate ? contrastLostPowerHasData : lostPowerHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查损失电量较多的设备是否故障</div>
                {this.showText(lostPowerDeviceNames)}
              </div>
              <div className={styles.chart}>
                <PerformanceCharts
                  graphId={'faultNum'}
                  title={'设备故障次数'}
                  loading={loading}
                  data={faultNumAnalysis}
                  theme={theme}
                  deviceNames={contrastSwitch && contrastEndDate ? faultNumDeviceNames : []}
                  hasSlider={contrastSwitch && contrastEndDate ? haveSliderConTrastNum : haveSliderNum}
                  hasData={contrastSwitch && contrastEndDate ? contrastFaultNumHasData : faultNumHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查故障次数较多以及故障时长较长的设备</div>

                {this.showNullValue(faultNumNullvalue)}
                {contrastSwitch && contrastEndDate ? this.showText(faultNumDeviceNames) : ''}

              </div>
              <div className={styles.chart}>
                <PerformanceCharts
                  graphId={'faultTime'}
                  title={'设备故障时长'}
                  loading={loading}
                  data={faultTimeAnalysis}
                  theme={theme}
                  deviceNames={contrastSwitch && contrastEndDate ? faultTimeDeviceNames : []}
                  hasSlider={contrastSwitch && contrastEndDate ? haveSliderConTrastTime : haveSliderTime}
                  hasData={contrastSwitch && contrastEndDate ? contrastFaultTimeHasData : faultTimeHasData} />
              </div>
              <div className={styles.textStyle}>
                <div><span className="iconfont icon-ha"></span>建议排查故障次数较多以及故障时长较长的设备</div>

                {this.showNullValue(faultTimeNullValue)}
                {contrastSwitch && contrastEndDate ? this.showText(faultTimeDeviceNames) : ''}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default (PerformanceAnalysisTabs);


