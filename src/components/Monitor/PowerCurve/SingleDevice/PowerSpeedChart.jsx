import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';


class PowerSpeedChart extends Component {
  static propTypes = {
    chartData: PropTypes.array,
    chartId: PropTypes.string,

  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.drawChart((this.props.chartData || []));
  }
  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.chartData || [];
    const { chartId, speedLoadding, pitLoadding } = nextProps;
    const loadding = nextProps.chartId === 'powerSpeedChart' ? nextProps.speedLoadding : nextProps.pitLoadding;
    this.drawChart(theoryPowers, loadding);
  }
  getYaxisName = (title) => {
    let result = ' ';
    switch (title) {
      case 'powerSpeedChart':
        result = ['  功率&转速', '功率(kW)', '转速(rpm)'];
        break;
      case 'pitchange':
        result = ['桨距角&风速', '桨距角(°)', '风速(m/s)'];
        break;
      default:
        result = ' ';
    }
    return result;
  };
  getColor = (title) => {
    let color = '';
    switch (title) {
      case 'powerSpeedChart':
        // color = ['#199475', '#e08031', '#a42b2c'];
        color = ['#e08031', '#199475', '#3E97D1'];
        break;
      case 'pitchange':
        // color = ['#3e97d1', '#bd10e0', '#199475'];
        color = ['#e08031', '#199475', '#3E97D1'];
        break;
      default:
        color = ' ';
    }
    return color;
  }
  drawChart = (params, loadding) => {
    const { chartId } = this.props;
    const powercurveChart = echarts.init(document.getElementById(chartId));
    loadding ? powercurveChart.showLoading('default', { color: '#199475' }) : powercurveChart.hideLoading();
    const filterDeviceName = params.map(e => e.deviceName);
    const filterYaxisData = [];
    const filterXaxisData = [];

    (params && params.length > 0) && params.forEach((e, i) => {
      if (e.powerSpeedData) {
        e.powerSpeedData.forEach((item, i) => {
          item.power ? filterYaxisData.push(item.power) : null;
          item.speed ? filterXaxisData.push(item.speed) : null;
        });
      }
      if (e.pitChangleSpeedData) {
        e.pitChangleSpeedData.forEach((item, i) => {
          item.pitchangle ? filterYaxisData.push(item.pitchangle) : null;
          item.windSpeed ? filterXaxisData.push(item.windSpeed) : null;
        });
      }
    });
    const inverterTenMinGraphic = (filterYaxisData.length === 0 || filterXaxisData.length === 0 || filterDeviceName.length === 0) ? showNoData : hiddenNoData;
    const lineColor = '#666';
    // let color = ['#199475', '#e08031', '#a42b2c'];
    // let color2 = ['#3e97d1', '#bd10e0', '#199475'];
    const option = {
      graphic: inverterTenMinGraphic,
      color: this.getColor(chartId),
      title: {
        text: this.getYaxisName(chartId)[0],
        // x: 'left',
        top: '5%',
        left: '5%',
        textStyle: {
          fontSize: 14,
        },
      },
      legend: {
        right: '8%',
        top: '8%',
        width: '80%',
        itemWidth: 14,
        itemHeight: 6,

        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
      },
      grid: {
        right: '5%',
        top: 70,
        left: '20%',

      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (params) => {
          const info = params.data;
          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
            <div>${params.seriesName}</div>
            </div>
            <div  style='background:#d4d4d4;height:1px;
            width:100%;' ></div>
            <div>${moment(info[2]).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div class=${styles.lineStyle}>${chartId === 'powerSpeedChart' ? '转速' : '风速'}: ${dataFormat(info[0], '--', 2)}</div>
            <div class=${styles.lineStyle}>${chartId === 'powerSpeedChart' ? '功率' : '桨距角'}: ${dataFormat(info[1], '--', 2)}</div>
          </div>`;
        },
        backgroundColor: '#fff',
        axisPointer: {
          // type: 'cross',
          label: {
            backgroundColor: lineColor,
          },
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
        type: 'value',
        nameGap: -40,
        name: this.getYaxisName(chartId)[2],
        nameTextStyle: {
          color: lineColor,
          verticalAlign: 'bottom',
          lineHeight: 40,
          padding: [60, 0, 0, 0],
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          onZero: false,
          lineStyle: {
            color: '#d4d4d4',
          },
        },
        axisLabel: {
          color: lineColor,
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
          name: this.getYaxisName(chartId)[1],
          type: 'value',
          nameTextStyle: {
            color: lineColor,
            align: 'left',
            padding: [0, 0, 0, -50],
          },

          splitLine: {
            show: true,
            lineStyle: {
              color: ['#d4d4d4'],
              type: 'dashed',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
      ],
      series: params.map((e, i) => {
        const lineData = [];
        if (e.powerSpeedData && e.powerSpeedData.length > 0) {
          (e.powerSpeedData).forEach((item, i) => {
            lineData.push([item.speed, item.power, item.time]);
          });
        } else if (e.pitChangleSpeedData && e.pitChangleSpeedData.length > 0) {
          (e.pitChangleSpeedData).forEach((item, i) => {
            lineData.push([item.windSpeed, item.pitchangle, item.time]);
          });
        }
        return {
          name: `${e.deviceName}`,
          type: 'scatter',
          symbolSize: 5,
          emphasis: {
            symbolSize: 8,
          },
          data: lineData,
        };
      }),
    };
    powercurveChart.setOption(option, 'notMerge');
    powercurveChart.resize();
  }
  render() {
    const { chartId } = this.props;
    return (
      <div id={chartId} className={styles.powerSpeedChart}></div>
    );
  }
}
export default (PowerSpeedChart);
