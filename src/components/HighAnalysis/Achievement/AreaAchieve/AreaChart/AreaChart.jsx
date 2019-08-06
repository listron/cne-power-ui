import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';

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
    const { capacityInfo } = this.props;
    const childrenArr = capacityInfo.map(cur => {
      const obj = {};
      obj.name = cur.stationName;
      obj.value = cur.stationCapacity;
      return obj;
    });
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
