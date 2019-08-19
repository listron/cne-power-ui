import React, { Component } from 'react';
import eCharts from 'echarts';
import { Button } from 'antd';
import PropTypes from 'prop-types';

import styles from './areaLossChart.scss';
import {hiddenNoData, showNoData} from '../../../../../constants/echartsNoData';

export default class AreaLossChart extends Component {

  static propTypes = {
    lostGenHourInfo: PropTypes.object,
    loseLoading: PropTypes.bool,
    lostTime: PropTypes.number,
    dataSelect: PropTypes.string,
    selectTime: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const { lossChart } = this;
    const { lostTime, loseLoading, lostGenHourInfo } = this.props;
    const { lostTime: lostTimePrev } = prevProps;
    const myChart = eCharts.init(lossChart);
    if (loseLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!loseLoading) {
      myChart.hideLoading();
    }
    if(lostTime && lostTime !== lostTimePrev) {
      eCharts.init(lossChart).clear();//清除
      const myChart = eCharts.init(lossChart);
      myChart.setOption(this.drawChart(lostGenHourInfo));
    }
  }

  drawChart = (data) => {
    const { dataArr, basicArr } = data;
    return {
      graphic: !dataArr || dataArr.length === 0 ? showNoData : hiddenNoData,
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
          name: '小时数',
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
    const { dataSelect, selectTime } = this.props;
    return (
      <div className={styles.areaLossBox}>
        <div className={styles.areaLossTitle}>
          <span>{selectTime === '' ? '损失电量分解图' : `河南-${selectTime}-损失电量分解图`}</span>
          <Button disabled={dataSelect === ''}>根源分析</Button>
        </div>
        <div className={styles.areaLossCenter} ref={ref => {this.lossChart = ref;}} />
      </div>
    );
  }
}
