import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData.js';

import styles from './areaChart.scss';

export default class AreaChart extends Component {

  static propTypes = {
    capacityInfo: PropTypes.array,
    capacityTime: PropTypes.number,
    capacityLoading: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    const { areaChart } = this;
    const { capacityTime, capacityLoading, capacityInfo } = this.props;
    const { capacityTime: capacityTimePrev } = prevProps;
    const myChart = eCharts.init(areaChart);
    if (capacityLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!capacityLoading) {
      myChart.hideLoading();
    }
    if(capacityTime && capacityTime !== capacityTimePrev) {
      eCharts.init(areaChart).clear();//清除
      const myChart = eCharts.init(areaChart);
      myChart.setOption(this.drawChart(capacityInfo));
    }
  }


  drawChart = (data) => {
    const childrenArr = data.map(cur => {
      const obj = {};
      obj.name = cur.stationName;
      obj.value = cur.stationCapacity;
      return obj;
    });
    return {
      graphic: !data || data.length === 0 ? showNoData : hiddenNoData,
      series: [{
        type: 'treemap',
        top: '0%',
        left: '2%',
        right: '2%',
        bottom: '0%',
        roam: false,
        breadcrumb: {
          show: false,
        },
        itemStyle: {
          borderWidth: 1,
        },
        nodeClick: 'link',
        data: childrenArr,
      }],
    };
  };

  render() {
    return (
      <div className={styles.areaBox}>
        <div className={styles.areaBoxTitle}>
          各电站装机容量
        </div>
        <div className={styles.areaChartCenter} ref={ref => {this.areaChart = ref;}} />
      </div>
    );
  }
}
