import React, { Component } from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import { Switch } from 'antd';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class PowercurveChart extends Component {
  static propTypes = {
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
    console.log(checked);
  }
  drawChart = (params) => {
    const singlePowerCurveChart = echarts.init(document.getElementById('singlePowerCurveChart'));
    //横坐标
    // let xData=params.length>0?params[0].actualPowerData.map(e=>e.windSpeedAvg):[];
    let xData=params.length>0?params[0].scatterPointData.map(e=>e.windSpeedAvg):[];
    console.log('xData: ', xData);
    //各种数据
    let scatter = {}, actual = {}, theory = {};
   const test= params.map((e, i) => {
      scatter[e.deviceName] = []; actual[e.deviceName] = []; theory[e.deviceName] = [];
      let allcharts=[];
      e.scatterPointData.forEach((item, i) => {
        scatter[e.deviceName].push([item.windSpeedAvg, item.powerActual, item.time, item.windDirection])
      })
      e.actualPowerData.forEach((item, i) => {
        actual[e.deviceName].push({ value: item.powerAvg, ...item, ...e })
      })
      e.theoryPowerData.forEach((item, i) => {
        theory[e.deviceName].push({ value: item.powerTheory, ...item, ...e })
      })
      // console.log('scatter', scatter);
      // console.log('actual', actual);
      // console.log('theory', theory);
      // console.log('scatter.test1', scatter.test1);
      return  {type:'line',data:actual[e.deviceName]},{type:'line',data:theory[e.deviceName]},{type:'scatter',data:[e.deviceName]}
    })
    console.log('test: ', test);



    const lineColor = '#666';
    // let color = ['#199475'];
    const option = {
      // graphic: inverterTenMinGraphic,
      // color: color,
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
        // top: 'bottom',
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
        height: '200px',
      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (params) => {
          console.log('params: ', params);
          const info = params.data;
          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
              <div>${params.seriesName}</div>
              <div>${dataFormat(info.windSpeedInterval)}</div>
            </div>
            <div  style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
            <div class=${styles.lineStyle}>型号:  ${info.deviceFullCode}</div>
            <div class=${styles.lineStyle}>平均风速:  ${dataFormat(params.name)}</div>
            <div class=${styles.lineStyle}>平均功率: ${dataFormat(params.value)}</div>
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
      },
      yAxis: [
        {
          name: '功率(KW)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine: {
            show: false
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
        }
      ],

       series: [{type:'line',data:actual.test1},{type:'line',data:theory .test1},{type:'scatter',data:scatter.test1}]
      // series: []
    };
    singlePowerCurveChart.setOption(option, 'notMerge');
    singlePowerCurveChart.resize();

  }
  render() {
    console.log('singleDeviceCurveData', this.props.singleDeviceCurveData);
    return (
      <div className={styles.graphStyle}>
        <div id="singlePowerCurveChart" className={styles.singlePowerCurveChart}>
        </div>
        <div className={styles.switchStyle}> <Switch defaultChecked onChange={this.onChange} />  空气密度校正</div>

      </div>
    )
  }
}
export default (PowercurveChart)