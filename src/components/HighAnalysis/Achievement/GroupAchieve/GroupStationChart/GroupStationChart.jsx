import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';

import styles from './groupStationChart.scss';

export default class GroupStationChart extends Component {

  static propTypes = {
    groupRankInfo: PropTypes.array,
    groupRankTime: PropTypes.number,
    groupRankLoading: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    const { groupSortChart } = this;
    const { groupRankTime, groupRankLoading, groupRankInfo } = this.props;
    const { groupRankTime: rankTimePrev } = prevProps;
    const myChart = eCharts.init(groupSortChart);
    if (groupRankLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!groupRankLoading) {
      myChart.hideLoading();
    }
    if(groupRankTime && groupRankTime !== rankTimePrev) {
      eCharts.init(groupSortChart).clear();//清除
      const myChart = eCharts.init(groupSortChart);
      myChart.setOption(this.drawChart(groupRankInfo));
    }
  }

  drawChart = (data) => {
    const dataSeries = data && data.map(cur => {
      const obj = {};
      obj.name = cur.regionName;
      obj.type = 'bar';
      obj.barWidth = '10';
      obj.itemStyle = {
        barBorderRadius: [5, 5, 0, 0],
      };
      obj.data = [cur.indicatorData.value ? cur.indicatorData.value : 0];
      return obj;
    });
    console.log(dataSeries, 'dataSeries');
    console.log(data && data.map(cur => {
      return cur.regionName || '--';
    }), '=====');
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        position: function (pt) {
          return [pt[0], '10%'];
        },
        formatter: (params) => {
          params.forEach(cur => {
            return `<div>
        <span>${cur.name}</span><br />${cur.marker}<span>PBA </span><span>${cur.value}%</span>
      </div>`;
          });
        },
      },
      xAxis: [
        {
          type: 'category',
          data: data && data.map(cur => {
            return cur.regionName || '--';
          }),
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
      <div className={styles.groupSortBox}>
        <div className={styles.groupSortTitle}>
          各电站PBA排名
        </div>
        <div className={styles.groupSortChartCenter} ref={ref => {this.groupSortChart = ref;}} />
      </div>
    );
  }
}
