import React, { Component } from 'react';
import eCharts from 'echarts';
import axios from 'axios';
import PropTypes from 'prop-types';

import styles from './groupAreaChart.scss';

export default class GroupAreaChart extends Component {

  static propTypes = {
  };

  componentDidMount() {
    const { groupChart } = this;
    const myChart = eCharts.init(groupChart);
    axios.get('/mapJson/China.json').then(response => {
      console.log(response, 'response');
      eCharts.registerMap('China', response.data);
      myChart.setOption(this.drawChart());
    });
  }

  drawChart = () => {
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
          name: 'pm2.5',
          type: 'scatter',
          coordinateSystem: 'geo',
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
          各地区分布图
        </div>
        <div className={styles.groupChartCenter} ref={ref => {this.groupChart = ref;}} />
      </div>
    );
  }
}
