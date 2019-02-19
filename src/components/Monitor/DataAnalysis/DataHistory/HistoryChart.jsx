import React, { Component } from 'react';
import echarts from 'echarts';
import styles from './historyStyle.scss';

class HistoryChart extends Component {

  componentDidMount() {
    console.log('did mount');
    this.renderChart();
  }

  componentDidUpdate() {
    console.log('update');
  }

  renderChart = () => {
    const chartDOM = document.getElementById('dataHistoryChart');
    if (!chartDOM) { return; }
    const historyChart = echarts.init(chartDOM);
    const option = {};
  }

  render() {
    // height: 150*测点数 + top(70) + bottom(60) + 30*设备数。
    return (
      <div className={styles.historyChart} id="dataHistoryChart" />
    )
  }
}

export default HistoryChart;