import React, { Component } from 'react';
import eCharts from 'echarts';
import PropTypes from 'prop-types';

import styles from './stationPBAChart.scss';

export default class StationPBAChart extends Component {

  static propTypes = {
  };

  componentDidMount() {
    const { sortChart } = this;
    const myChart = eCharts.init(sortChart);
    myChart.setOption(this.drawChart());
  }

  drawChart = () => {
    return {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'PBA',
        },
      ],
      dataZoom: [{
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
      }],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '10',
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0],
          },
          data: [10, 52, 200, 334, 390, 330, 220],
        },
      ],
    };
  };

  render() {
    return (
      <div className={styles.stationSortBox}>
        <div className={styles.stationSortTitle}>
          各电站PBA排名
        </div>
        <div className={styles.stationSortChartCenter} ref={ref => {this.sortChart = ref;}} />
      </div>
    );
  }
}
