import React, { Component } from 'react';
import eCharts from 'echarts';
import PropTypes from 'prop-types';

import styles from './stationPBAChart.scss';

export default class StationPBAChart extends Component {

  static propTypes = {
    indicatorRankInfo: PropTypes.array,
  };

  componentDidMount() {
    const { sortChart } = this;
    const myChart = eCharts.init(sortChart);
    myChart.setOption(this.drawChart());
  }

  drawChart = () => {
    const { indicatorRankInfo } = this.props;
    const dataSeries = indicatorRankInfo && indicatorRankInfo.map(cur => {
      const obj = {};
      obj.name = cur.stationName;
      obj.type = 'bar';
      obj.barWidth = '10';
      obj.itemStyle = {
        barBorderRadius: [5, 5, 0, 0],
      };
      obj.data = [cur.indicatorData.value ? cur.indicatorData.value.toFixed(2) : '0'];
      return obj;
    });
    return {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
        formatter: (params) => {
          return `<div>
        <span>${params[0].name}</span><br />${params[0].marker}<span>PBA </span><span>${params[0].value}%</span>
      </div>`;
        },
      },
      xAxis: [
        {
          type: 'category',
          data: indicatorRankInfo && indicatorRankInfo.map(cur => {
            return cur.stationName || '--';
          }),
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'PBA',
          min: 0,
          max: 100,
          splitLine: {
            show: false,
          },
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
        textStyle: false,
      }],
      series: dataSeries,
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
