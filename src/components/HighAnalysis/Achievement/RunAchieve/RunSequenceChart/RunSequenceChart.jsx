

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import moment from 'moment';
import eCharts from 'echarts';

import styles from './runSequenceChart.scss';

const { Option } = Select;

export default class RunSequenceChart extends Component {

  static propTypes = {
    indicatorsList: PropTypes.array,
    hourOptionValue: PropTypes.string,
    sequenceLoading: PropTypes.bool,
    sequenceData: PropTypes.array,
    sequenceTime: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const { sequenceChart } = this;
    const { sequenceTime, sequenceLoading, sequenceData } = this.props;
    const { sequenceTime: sequenceTimePrev } = prevProps;
    const myChart = eCharts.init(sequenceChart);
    if (sequenceLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!sequenceLoading) {
      myChart.hideLoading();
    }
    if(sequenceTime && sequenceTime !== sequenceTimePrev) {
      eCharts.init(sequenceChart).clear();//清除
      const myChart = eCharts.init(sequenceChart);
      myChart.setOption(this.drawChart(sequenceData));
    }
  }


  drawChart = (sequenceData) => {
    // 数据
    const seriesData = sequenceData && sequenceData.map(cur => ({
      name: cur.deviceName,
      type: 'line',
      symbol: 'none',
      data: cur.dataList && cur.dataList.map(item => (item.value)),
    }));
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: sequenceData && sequenceData.map(cur => (cur.deviceName)),
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '40px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: sequenceData && sequenceData[0].dataList && sequenceData[0].dataList.map(cur => (
          moment(cur.time).format('YYYY-MM-DD')
        )),
      },
      yAxis: {
        name: '功率KW',
        type: 'value',
        splitLine: {
          show: false,
        },
      },
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
      series: seriesData,
    };
  };

  handleChange = (value) => {
    console.log(value);
  };

  render() {
    const { indicatorsList, hourOptionValue } = this.props;
    const optionItem = indicatorsList && indicatorsList.map(cur => {
      return (
        <Option key={`${cur.value}-${cur.name}`} value={cur.value}>{cur.name}</Option>
      );
    });
    return (
      <div className={styles.runSequenceChart}>
        <div className={styles.sequenceTop}>
          <div className={styles.topTitle}>时序图</div>
          <div className={styles.topSelect}>
            <span>时序图指标</span>
            <Select value={hourOptionValue} style={{ width: 120 }} onChange={this.handleChange}>
              {optionItem}
            </Select>
          </div>
        </div>
        <div className={styles.sequenceChart} ref={ref => {this.sequenceChart = ref;}} />
      </div>
    );
  }
}
