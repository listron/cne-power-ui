import React, { Component } from 'react';
import {Radio} from 'antd';
import PropTypes from 'prop-types';
import eCharts from 'echarts';

import styles from './groupTrendChart.scss';

export default class GroupTrendChart extends Component {

  static propTypes = {
    trendInfo: PropTypes.array,
    trendTime: PropTypes.number,
    trendLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      status: '2',
    };
  }

  componentDidUpdate(prevProps) {
    const { groupTrendChart } = this;
    const { trendTime, trendLoading, trendInfo } = this.props;
    const { trendTime: trendTimePrev } = prevProps;
    const myChart = eCharts.init(groupTrendChart);
    if (trendLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!trendLoading) {
      myChart.hideLoading();
    }
    if(trendTime && trendTime !== trendTimePrev) {
      eCharts.init(groupTrendChart).clear();//清除
      const myChart = eCharts.init(groupTrendChart);
      myChart.setOption(this.drawChart(trendInfo));
    }
  }

  drawChart = (data) => {
    return {
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
      grid: {
        top: '10%',
      },
      xAxis: [
        {
          type: 'category',
          data: data && data.map(cur => {
            return cur.efficiencyDate || '--';
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
      }],
      series: [
        {
          name: 'PBA',
          type: 'line',
          barWidth: '10',
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0],
          },
          symbol: 'none',
          data: data && data.map(cur => {
            return cur.indicatorData.value ? cur.indicatorData.value.toFixed(2) : '0';
          }),
        },
      ],
    };
  };

  render() {
    const { status } = this.state;
    return (
      <div className={styles.groupTrendBox}>
        <div className={styles.groupTrendTitle}>
          <span>PBA趋势图</span>
          <Radio.Group value={status} buttonStyle="solid" onChange={this.handleStatusChange}>
            <Radio.Button value="1">按日</Radio.Button>
            <Radio.Button value="2">按月</Radio.Button>
            <Radio.Button value="3">按年</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.trendCenter} ref={ref => {this.groupTrendChart = ref;}} />
      </div>
    );
  }
}
