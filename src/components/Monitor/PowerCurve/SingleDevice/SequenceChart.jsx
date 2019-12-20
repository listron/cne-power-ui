import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class SequenceChart extends Component {
  static propTypes = {
    xAxisDate: PropTypes.array,
    sequencechartData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.drawChart((this.props.sequencechartData || []));
  }
  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.sequencechartData || [];
    const { sequenceLoadding } = nextProps;
    this.drawChart(theoryPowers, sequenceLoadding);
  }

  drawChart = (params, sequenceLoadding) => {
    const sequenceChart = echarts.init(document.getElementById('sequenceChart'));
    sequenceLoadding ? sequenceChart.showLoading('default', { color: '#199475' }) : sequenceChart.hideLoading();
    const lineColor = '#666';
    const { xAxisDate } = this.props;
    const color = ['#3e97d1', '#a42b2c', '#199475'];
    const yData = params.map(e => (e.deviceName));
    const inverterTenMinGraphic = (xAxisDate.length === 0) ? showNoData : hiddenNoData;
    const option = {
      graphic: inverterTenMinGraphic,
      title: {
        text: '时序图',
        top: '5%',
        left: '3%',
        textStyle: {
          fontSize: 14,
        },
      },
      color: color,
      legend: {
        show: true,
        right: '10%',
        top: '10%',
        width: '80%',
        bottom: '80%',
        itemWidth: 14,
        itemHeight: 6,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
      },
      grid: {
        // right: '10%',
        top: 70,
        left: '6%',
        height: '190px',
      },
      tooltip: {
        trigger: 'axis',
        enterable: true,
        show: true,
        formatter: (params) => {
          return (
            `<div class=${styles.formatStyle}>
              <div class=${styles.topStyle}>
                <div>${params[0].name}</div>
              </div>
              <div  style='background:#d4d4d4;height:1px;
                width:100%;' ></div>
                ${params.map((e, i) => {
              return `<div class=${styles.lineStyle}>
                  <span class=${styles.itemStyle} style='color: ${e.color}'>○</span>
                   ${e.seriesName}风速: ${dataFormat(e.value, '--', 2)}
                   </div>`;
            }).join('')}
              </div>`);
        },
        backgroundColor: '#fff',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: lineColor,
          },
        },

        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
      },
      xAxis: {
        type: 'category',
        data: xAxisDate,
        boundaryGap: false,
        nameTextStyle: {
          color: lineColor,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
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
      },
      yAxis: [
        {
          type: 'value',
          name: '风速(m/s)',
          nameTextStyle: {
            color: lineColor,
            align: 'left',
            padding: [0, 0, 0, -50],
          },
          splitLine: {
            show: false,
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
            show: false,
          },
        },
      ],
      series: params.map((e, i) => {
        const lineData = [];
        (e.sequenceChartData && e.sequenceChartData.length > 0) && e.sequenceChartData.forEach((item, i) => {
          lineData.push(item.windSpeed);
        }
        );
        return {
          name: `${e.deviceName}`,
          type: 'line',
          data: lineData,
        };
      }),
    };
    if (xAxisDate && xAxisDate.length > 0) {
      option.dataZoom = [{
        show: true,
        type: 'slider',
        realtime: true,
        filterMode: 'filter',
        startValue: 0,
        endValue: 19,
        bottom: 20,
        handleSize: '80%',
        backgroundColor: 'rgba(213,219,228,.8)',
        height: '20px',
        zoomLock: true,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleStyle: {
          width: '16px',
          height: '16px',
          borderRadius: '100%',
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
      },
      ];
    }

    sequenceChart.setOption(option, 'notMerge');
    sequenceChart.resize();

  }
  render() {

    return (
      <div id="sequenceChart" className={styles.sequenceChart}></div>
    );
  }
}
export default (SequenceChart);
// if (params.length > 0) {
//   option.series = params.map((e, i) => {
//     let lineData = [];
//     (e.sequenceChartData && e.sequenceChartData.length > 0) && e.sequenceChartData.forEach((item, i) => {
//       lineData.push(item.windSpeed)
//     }
//     )
//     return {
//       name: `${e.deviceName}`,
//       type: 'line',
//       data: lineData,
//     }
//   })
// }
