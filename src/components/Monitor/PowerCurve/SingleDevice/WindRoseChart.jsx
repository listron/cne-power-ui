import React, { Component } from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class WindRoseChart extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.drawChart((this.props.rosedata || []))
  }
  componentWillReceiveProps(nextProps) {
    const rosedata = nextProps.rosedata || [];
    this.drawChart(rosedata)
  }
  drawChart = (params) => {
    const windrosechart = echarts.init(document.getElementById('windrosechart'));
    let windDirection = [], windSpeedAvg = [], percent = [], XData = [];
    params.forEach((e, i) => {
      XData.push(i),
        windDirection.push(e.windDirection),
        windSpeedAvg.push([e.windSpeedAvg, i, e.windDirection]),
        percent.push([e.percent, i, e.windDirection])
    })
    const lineColor = '#666';
    let color = ['#199475', 'orange'];
    const option = {
      title: {
        text: '风向玫瑰图',
        padding: [10, 10],
        textStyle: {
          fontSize: 14,
          fontWeight: 'bolder',
          // color: '#666'          // 主标题文字颜色
        },
      },
      color: color,
      legend: {
        show: true,
        top: '5%',
        width: '80%',
        itemWidth: 14,
        itemHeight: 6,
        x: 'right',
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
        data: ['平均风速', '风向占比']
      },
      polar: [{
        center: ['50%', '54%']
      },
      {
        center: ['50%', '54%']
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          snap: true
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',

        formatter: (params) => {

          return `<div class=${styles.formatStyle} >
          <div class=${styles.topStyle}>
            <div>风向:${params[0].value[2]}</div>
          </div>
          <div  style='background:#dfdfdf;height:1px;
          width:100%;' ></div>
          <div class=${styles.lineStyle}>${params[0].marker}平均风速:  ${dataFormat(params[0].value[0])}</div>
          <div class=${styles.lineStyle}>${params[1].marker}风向占比: ${dataFormat(params[1].value[0])}%</div>
        </div>`
        },
      },
      angleAxis: [{
        boundaryGap: false,
        startAngle: 90,
        polarIndex: 0,
        // data: XData,
        axisLabel: {
          formatter: (e) => {
            return windDirection[e]
          }
        }
      },
      {
        boundaryGap: false,
        startAngle: 90,
        polarIndex: 1,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
      ],
      radiusAxis: [{
        min: 0,
        polarIndex: 0,
        max: 'dataMax',
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      }, {
        min: 0,
        polarIndex: 1,
        max: 'dataMax',
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      }],
      series: [{
        coordinateSystem: 'polar',
        polarIndex: 0,
        name: '平均风速',
        type: 'line',
        showSymbol: false,
        data: windSpeedAvg
      }, {
        coordinateSystem: 'polar',
        polarIndex: 1,
        name: '风向占比',
        type: 'line',
        showSymbol: false,
        data: percent
      }],

    };
    windrosechart.setOption(option, 'notMerge');
    windrosechart.resize();
  }
  render() {
    return (
      <div id="windrosechart" className={styles.windrosechart}></div>
    )
  }
}
export default (WindRoseChart)