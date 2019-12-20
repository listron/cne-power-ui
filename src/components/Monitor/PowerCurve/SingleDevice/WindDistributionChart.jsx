import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import styles from './singleDevice.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class WindDistributionChart extends Component {
  static propTypes = {
    winddistributionchartData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const theoryPowers = this.props.winddistributionchartData || [];
    const data = theoryPowers && theoryPowers.sort(this.compare('windSpeedCenter'));
    this.drawChart(data);
  }
  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.winddistributionchartData || [];
    const { windLoadding } = nextProps;
    const data = theoryPowers && theoryPowers.sort(this.compare('windSpeedCenter'));
    this.drawChart(data, windLoadding);
  }

  compare = (key) => {
    return (a, b) => {
      const val1 = +a[key];
      const val2 = +b[key];
      if (val1 < val2) { //正序
        return -1;
      } else if (val1 > val2) {
        return 1;
      }
      return 0;

    };
  }
  drawChart = (params, windLoadding) => {
    const windDistribution = echarts.init(document.getElementById('windDistribution'));
    windLoadding ? windDistribution.showLoading('default', { color: '#199475' }) : windDistribution.hideLoading();
    const filterwindSpeed = [];
    (params && params.length > 0) && params.forEach((e, i) => filterwindSpeed.push(e.windSpeedCenter));

    const filterpercent = [];
    (params && params.length > 0) && params.forEach((e, i) => filterpercent.push(e.precent));

    const inverterTenMinGraphic = (filterwindSpeed.length === 0 && filterpercent.length === 0) ? showNoData : hiddenNoData;
    const lineColor = '#666';
    const option = {
      graphic: inverterTenMinGraphic,
      color: '#c7ceb2',
      title: {
        text: '风频分布',
        padding: [0, 20],

        textStyle: {
          fontSize: 14,
        },
      },
      legend: {
        data: ['频次占比'],
        right: '10%',
        top: '10%',
        width: '80%',
        itemWidth: 14,
        itemHeight: 6,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
      },
      grid: {
        bottom: 90,
        left: '15%',
        // height: '170px',
      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (params) => {

          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
            <div>风速:${dataFormat(params.name, '--', 2)}</div>
            </div>
            <div  style='background:#d4d4d4;height:1px;
            width:100%;' ></div>
            <div class=${styles.lineStyle}>频次占比: ${dataFormat(params.value, '--', 2)}</div>
          </div>`;
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
        name: '风速(m/s)',
        // type: 'category',
        // data: [5, 10, 15, 20, 25],
        data: params.map((e, i) => (e.windSpeedCenter)),
        nameGap: -40,
        nameTextStyle: {
          color: lineColor,
          padding: [60, 0, 0, 0],
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
          name: '频次占比',
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
            formatter: '{value}%',
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#d4d4d4'],
              type: 'dashed',
            },
          },
        },
      ],
      dataZoom: [{
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
      ],
      series: [{
        name: '频次占比',
        type: 'bar',
        barWidth: 10,
        data: filterpercent,
        // data: params.map(e=>(e.percent))
      }],
    };
    windDistribution.setOption(option, 'notMerge');
    windDistribution.resize();

  }
  render() {
    return (
      <div id="windDistribution" className={styles.windDistribution}></div>
    );
  }
}
export default (WindDistributionChart);
