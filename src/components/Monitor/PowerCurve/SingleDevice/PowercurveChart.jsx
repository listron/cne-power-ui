import React, { Component } from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import { Switch } from 'antd';
import moment from 'moment';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class PowercurveChart extends Component {
  static propTypes = {
    singleDeviceCurveData: PropTypes.array,
    deviceFullCode: PropTypes.array,
    getSingleDeviceCurveData: PropTypes.func,
    stationCode: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,

  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.drawChart((this.props.singleDeviceCurveData || []))
  }
  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.singleDeviceCurveData || [];

    this.drawChart(theoryPowers)
  }
  onChange = (checked) => {
    const { stationCode, deviceFullCode, startTime, endTime, } = this.props;
    const params = { stationCode, deviceFullCode, startTime, endTime };
    this.props.getSingleDeviceCurveData({ ...params, correct: checked ? 1 : 0 })


  }
  drawChart = (params) => {
    const singlePowerCurveChart = echarts.init(document.getElementById('singlePowerCurveChart'));
    //横坐标
    let xData = params.length > 0 ? params[0].scatterPointData.map(e => e.windSpeedAvg) : [];
    let ishaveData = [];
    params.length > 0 &&params.forEach((e, i) => {
      if (e.scatterPointData&&e.scatterPointData.length > 0) {
        ishaveData.push(e.scatterPointData)
      }
    })
    const inverterTenMinGraphic = (ishaveData.length === 0) ? showNoData : hiddenNoData;
    //各种数据
    let scatter = [], actual = [], theory = [];
    let series = [];
    params.length > 0 &&params.forEach((e, i) => {
      scatter[e.deviceName] = []; actual[e.deviceName] = []; theory[e.deviceName] = [];
      e.scatterPointData.forEach((item, i) => {
        scatter[e.deviceName].push([item.windSpeedAvg, item.powerActual, item.time, item.windDirection])
      })
      e.actualPowerData.forEach((item, i) => {
        actual[e.deviceName].push({ value: item.powerAvg, ...item, ...e })
      })
      e.theoryPowerData.forEach((item, i) => {
        theory[e.deviceName].push({ value: item.powerTheory, ...item, belong: '理论' })
      })
      series.push(
        {
          type: 'scatter',
          name: `${e.deviceName}散点`,
          data: scatter[e.deviceName],
          symbolSize: 5,
          emphasis: {
            symbolSize: 8,
          },
        },
        { type: 'line', name: `${e.deviceName}实际功率曲线`, data: actual[e.deviceName], },
        { type: 'line', name: `${e.deviceName}理论功率曲线`, data: theory[e.deviceName] }
      )
    })
    const lineColor = '#666';
     let color = ['#e08031','#a42b2c','#199475','#f9b600'];
    const option = {
      graphic: inverterTenMinGraphic,
      color: color,
      title: {
        text: '功率曲线',
        // x:'left',
        textStyle: {
          fontSize: 14
        }
      },
      legend: {
        show: true,
        left: '10%',
        // right:'30%',
        top: 'bottom',
        width: '80%',
        bottom: '80%',
        itemWidth: 14,
        itemHeight: 6,

        textStyle: {
          color: lineColor,
          fontSize: 12,
        }
      },
      grid: {
        right: '10%',
        height: '180px',
      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (params) => {
          const info = params.data;
          if (params.seriesType === "scatter") {
            return ` <div class=${styles.lineStyle}>时间:  ${moment(info[2]).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div class=${styles.lineStyle}>风速:  ${dataFormat(info[0], '--', 2)}</div>
            <div class=${styles.lineStyle}>实际功率: ${dataFormat(info[1], '--')}</div>
            <div class=${styles.lineStyle}>风向: ${dataFormat(info[3], '--')}</div>`
          }
          if (info.belong) {
            return `<div class=${styles.lineStyle}>${params.seriesName}</div>
            <div class=${styles.lineStyle}>风速区间: ${info.windSpeedInterval}</div>
            <div class=${styles.lineStyle}>理论功率: ${dataFormat(info.value, '--')}</div>`
          }
          return `<div class=${styles.formatStyle}>
          <div class=${styles.topStyle}>
            <div style='margin-right:10px'>${params.seriesName}</div>
            <div>型号:${info.deviceFullCode}</div>
          </div>
          <div  style='background:#dfdfdf;height:1px;
          width:100%;' ></div>
          <div class=${styles.lineStyle}>风速区间: ${info.windSpeedInterval}</div>
          <div class=${styles.lineStyle}>平均风速: ${dataFormat(+info.windSpeedAvg, '--', 2)}</div>
          <div class=${styles.lineStyle}>平均功率: ${dataFormat(+info.powerAvg, '--')}</div>
        </div>`
        },
        backgroundColor: '#fff',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: lineColor,
          }
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
      },
      xAxis: {
        // type: 'category',
        // data: [5, 10, 15, 20, 25],
        data: xData,
        name: '风速(m/s)',
        nameTextStyle: {
          color: lineColor,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: lineColor,
        },
        axisPointer: {
          label: {
            show: false,
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#dfdfdf'],
            type: 'dashed',
          }
        },
      },
      yAxis: [
        {
          name: '功率(KW)',
          nameTextStyle: {
            color: lineColor,
          },

          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#dfdfdf'],
              type: 'dashed',
            }
          },
        }
      ],
      series: series,
      // dataset:{
      //   source:allData
      // }
    };
    singlePowerCurveChart.setOption(option, 'notMerge');
    singlePowerCurveChart.resize();
  }
  render() {
    return (
      <div className={styles.graphStyle}>
        <div id="singlePowerCurveChart" className={styles.singlePowerCurveChart}>
        </div>
        <div className={styles.switchStyle}> <Switch onChange={this.onChange} />  空气密度校正</div>
      </div>
    )
  }
}
export default (PowercurveChart)