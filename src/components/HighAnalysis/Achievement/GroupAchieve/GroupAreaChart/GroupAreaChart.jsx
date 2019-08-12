import React, { Component } from 'react';
import eCharts from 'echarts';
import axios from 'axios';
import PropTypes from 'prop-types';

import styles from './groupAreaChart.scss';

export default class GroupAreaChart extends Component {

  static propTypes = {
    groupCapacityInfo: PropTypes.array,
    groupCapacityTime: PropTypes.number,
    groupCapacityLoading: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    const { groupChart } = this;
    const { groupCapacityTime, groupCapacityLoading, groupCapacityInfo } = this.props;
    const { groupCapacityTime: groupCapacityTimePrev } = prevProps;
    const myChart = eCharts.init(groupChart);
    if (groupCapacityLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!groupCapacityLoading) {
      myChart.hideLoading();
    }
    if(groupCapacityTime && groupCapacityTime !== groupCapacityTimePrev) {
      eCharts.init(groupChart).clear();//清除
      const myChart = eCharts.init(groupChart);
      axios.get('/mapJson/China.json').then(response => {
        eCharts.registerMap('China', response.data);
        myChart.setOption(this.drawChart(groupCapacityInfo));
      });
    }
  }

  drawChart = (data) => {
    const dataMap = data && data.map(cur => ({
      name: cur.regionName,
      value: [cur.longitude, cur.latitude, cur.stationCapacity],
    }));
    return {
      geo: {
        map: 'China',
        layoutCenter: ['50%', '50%'],
        layoutSize: '100%',
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          normal: {
            areaColor: '#d8eef6',
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            areaColor: '#b2e8fa',
          },
        },
      },
      series: [
        {
          name: '区域分布图',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: dataMap,
          symbolSize: 12,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            emphasis: {
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
        },
      ],
    };
  };

  render() {
    return (
      <div className={styles.groupAreaChart}>
        <div className={styles.groupAreaTitle}>
          各区域分布图
        </div>
        <div className={styles.groupChartCenter} ref={ref => {this.groupChart = ref;}} />
      </div>
    );
  }
}
