import React, { Component } from 'react';
import eCharts from 'echarts';
import PropTypes from 'prop-types';

import styles from './areaChart.scss';

export default class AreaChart extends Component {

  static propTypes = {
    capacityInfo: PropTypes.array,
  };

  componentDidMount() {
    const { areaChart } = this;
    const myChart = eCharts.init(areaChart);
    myChart.setOption(this.drawChart());
  }


  drawChart = () => {
    return {
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
        data: [{
          name: 'nodeA', // First tree
          value: 10,
          children: [{
            name: 'nodeAa', // First leaf of first tree
            value: 4,
          }, {
            name: 'nodeAb', // Second leaf of first tree
            value: 6,
          }],
        }, {
          name: 'nodeB', // Second tree
          value: 20,
          children: [{
            name: 'nodeBa', // First leaf of first tree
            value: 15,
          }, {
            name: 'nodeABb', // Second leaf of first tree
            value: 5,
          }],
        }],
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
