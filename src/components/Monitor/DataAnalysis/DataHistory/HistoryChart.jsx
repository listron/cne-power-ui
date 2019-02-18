import React, { Component } from 'react';
import echarts from 'echarts';
import styles from './historyStyle.scss';

// const echartBox = document.getElementById(idName);
//     const inverterChart = echarts.init(echartBox);

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
    return (
      <div className={styles.historyChart}>
        chart表格内容区
        <div id="dataHistoryChart" />
      </div>
    )
  }
}

export default HistoryChart;