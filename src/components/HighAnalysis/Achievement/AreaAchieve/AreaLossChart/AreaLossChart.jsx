import React, { Component } from 'react';
import eCharts from 'echarts';
import { Button } from 'antd';
import PropTypes from 'prop-types';

import styles from './areaLossChart.scss';

export default class AreaLossChart extends Component {

  static propTypes = {
  };

  componentDidMount() {
    const { lossChart } = this;
    const myChart = eCharts.init(lossChart);
    myChart.setOption(this.drawChart());
  }

  drawChart = () => {
    return {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          var tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        },
      },
      grid: {
        top: '10%',
        bottom: '10%',
      },
      xAxis: {
        type: 'category',
        splitLine: {show: false},
        data: ['总费用', '房租', '水电费', '交通费', '伙食费', '日用品数'],
      },
      yAxis: [
        {
          type: 'value',
          name: '小时数（h）',
        },
      ],
      series: [
        {
          name: '辅助',
          type: 'bar',
          barWidth: 10,
          stack: '总量',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)',
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)',
            },
          },
          data: [0, 1700, 1400, 1200, 300, 0],
        },
        {
          name: '生活费',
          type: 'bar',
          barWidth: 10,
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
            },
          },
          data: [2900, 1200, 300, 200, 900, 300],
        },
      ],
    };
  };

  render() {
    return (
      <div className={styles.areaLossBox}>
        <div className={styles.areaLossTitle}>
          <span>损失电量分解图</span>
          <Button>根源分析</Button>
        </div>
        <div className={styles.areaLossCenter} ref={ref => {this.lossChart = ref;}} />
      </div>
    );
  }
}
