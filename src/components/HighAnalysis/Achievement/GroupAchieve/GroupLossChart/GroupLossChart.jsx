import React, { Component } from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';
import eCharts from 'echarts';

import styles from './groupLossChart.scss';

export default class GroupLossChart extends Component {

  static propTypes = {
    lostGenHourInfo: PropTypes.object,
    loseLoading: PropTypes.bool,
    lostTime: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const { groupLossChart } = this;
    const { lostTime, loseLoading, lostGenHourInfo } = this.props;
    const { lostTime: lostTimePrev } = prevProps;
    const myChart = eCharts.init(groupLossChart);
    if (loseLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!loseLoading) {
      myChart.hideLoading();
    }
    if(lostTime && lostTime !== lostTimePrev) {
      eCharts.init(groupLossChart).clear();//清除
      const myChart = eCharts.init(groupLossChart);
      myChart.setOption(this.drawChart(lostGenHourInfo));
    }
  }

  drawChart = (data) => {
    const { dataArr, basicArr } = data;
    return {
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
        data: ['应发小时', '降容损失', '风机故障', '变电故障', '场外因素', '计划停机', '其他损失', '实发小时'],
        axisLabel: {
          interval: 0,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '小时数（h）',
          splitLine: {
            show: false,
          },
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
          data: basicArr,
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
          data: dataArr,
        },
      ],
    };
  };

  render() {
    return (
      <div className={styles.groupLossBox}>
        <div className={styles.groupLossTitle}>
          <span>损失电量分解图</span>
          <Button>查看区域</Button>
        </div>
        <div className={styles.groupLossCenter} ref={ref => {this.groupLossChart = ref;}} />
      </div>
    );
  }
}
