import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class WindRoseChart extends Component {
  static propTypes = {
    rosedata: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.drawChart((this.props.rosedata || []));
  }
  componentWillReceiveProps(nextProps) {
    const rosedata = nextProps.rosedata || [];
    const { roseLoadding } = nextProps;
    this.drawChart(rosedata, roseLoadding);
  }

  drawChart = (params, roseLoadding) => {
    const windrosechart = echarts.init(document.getElementById('windrosechart'));
    roseLoadding ? windrosechart.showLoading('default', { color: '#199475' }) : windrosechart.hideLoading();
    let windDirection = [], avgWindSpeed = [], percent = [], XData = [];
    params && params.length > 0 && params.forEach((e, i) => {
      XData.push(i),
        windDirection.push(e.windDirection),
        avgWindSpeed.push([dataFormat(e.avgWindSpeed, 0), i, e.windDirection]),
        percent.push([dataFormat(e.percent, 0), i, e.windDirection]);
    });
    const hasData = (windDirection.length === 0 || avgWindSpeed.length === 0) ? showNoData : hiddenNoData;
    const lineColor = '#666';
    const color = ['#199475', 'orange'];
    const option = {
      graphic: hasData,
      title: {
        text: '风向玫瑰图',
        padding: [20, 20],
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
        right: '5%',
        width: '80%',
        itemWidth: 14,
        itemHeight: 6,
        x: 'right',
        selectedMode: false,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
        data: ['平均风速', '风向占比'],
      },
      polar: [{
        center: ['50%', '54%'],
        radius: '60%',
      },
      {
        center: ['50%', '54%'],
        radius: '60%',
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          snap: true,
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: (params) => {
          const speed = params[0].value[0] ? params[0].value[0] : '--';
          const percent = params[1].value[0] ? params[1].value[0] : '--';
          return `<div class=${styles.formatStyle} >
          <div class=${styles.topStyle}>
            <div>风向:${params[0].value[2]}</div>
          </div>
          <div  style='background:#d4d4d4;height:1px;
          width:100%;' ></div>
          <div class=${styles.lineStyle}>  <span class=${styles.itemStyle} style='color: ${color[0]}'>○</span>平均风速:  ${dataFormat(speed, '--', 2)}m/s</div>
          <div class=${styles.lineStyle}> <span class=${styles.itemStyle} style='color: ${color[1]}'>○</span>风向占比: ${dataFormat(percent, '--', 2)}%</div>
        </div>`;
        },
      },
      angleAxis: [{
        clockwise: false,
        boundaryGap: false,
        startAngle: 90,
        polarIndex: 0,
        // data: XData,
        axisLabel: {
          formatter: (e) => {
            return windDirection[e];
          },
        },
        axisTick: {
          show: false,
        },
      }, {
        boundaryGap: false,
        startAngle: 90,
        polarIndex: 1,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      ],
      radiusAxis: [{
        min: 0,
        polarIndex: 0,
        max: 'dataMax',
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      }, {
        min: 0,
        polarIndex: 1,
        max: 'dataMax',
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      }],
      series: [{
        coordinateSystem: 'polar',
        polarIndex: 0,
        name: '平均风速',
        type: 'line',
        showSymbol: false,
        data: avgWindSpeed,
      }, {
        coordinateSystem: 'polar',
        polarIndex: 1,
        name: '风向占比',
        type: 'line',
        showSymbol: false,
        data: percent,
      }],

    };
    windrosechart.setOption(option, 'notMerge');
    windrosechart.resize();
  }
  render() {
    return (
      <div id="windrosechart" className={styles.windrosechart}></div>
    );
  }
}
export default (WindRoseChart);
