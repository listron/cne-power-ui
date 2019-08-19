

import React, { Component } from 'react';
import { Select } from 'antd';
import eCharts from 'echarts';

import styles from './runSequenceChart.scss';

const { Option } = Select;

export default class RunSequenceChart extends Component {

  componentDidMount() {
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart);
    myChart.setOption(this.drawChart());
  }


  drawChart = () => {
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '40px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          data: [120, '', 100, 134, 90, 230, 210],
        },
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          data: [220, '', '', 234, 290, 330, 310],
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          data: [150, 100, 200, 154, 190, 330, 410],
        },
        {
          name: '直接访问',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          data: [320, 200, '', 334, 390, 330, 320],
        },
        {
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          data: [820, '', 200, 934, 1290, 1330, 1320],
        },
      ],
    };
  };

  handleChange = (value) => {
    console.log(value);
  };

  render() {
    return (
      <div className={styles.runSequenceChart}>
        <div className={styles.sequenceTop}>
          <div className={styles.topTitle}>时序图</div>
          <div className={styles.topSelect}>
            <span>时序图指标</span>
            <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </div>
        </div>
        <div className={styles.sequenceChart} ref={ref => {this.sequenceChart = ref;}} />
      </div>
    );
  }
}
