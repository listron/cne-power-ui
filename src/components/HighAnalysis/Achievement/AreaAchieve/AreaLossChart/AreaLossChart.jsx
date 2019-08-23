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
    selectTime: PropTypes.string,
    dataName: PropTypes.string,
    selectStationCode: PropTypes.array,
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

  drawChart = (lostGenHourInfo) => {
    const { actualGen, theoryGen, detailList } = lostGenHourInfo;
    const xAxisName = detailList && detailList.map(cur => (cur.name)) || [];
    const xAxisBaseValue = detailList && detailList.map(cur => (cur.baseValue)) || [];
    const xAxisValue = detailList && detailList.map(cur => (cur.value)) || [];
    return {
      graphic: !actualGen && !theoryGen && (!detailList || detailList.length === 0) ? showNoData : hiddenNoData,
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
        data: ['应发小时', ...xAxisName, '实发小时'],
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
          data: [0, ...xAxisBaseValue, 0],
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
          data: [theoryGen || '', ...xAxisValue, actualGen || ''],
        },
      ],
    };
  };

  toLostAnalysis = () => {
    console.log('跳');
  };

  titleName = () => {
    const {selectTime, dataName } = this.props;
    if(dataName !== '' && selectTime !== '') {
      return `${dataName}-${selectTime}-损失电量分解图`;
    }
    if(dataName !== '' && selectTime === '') {
      return `${dataName}-损失电量分解图`;
    }
    return '损失电量分解图';
  };

  render() {
    const { selectStationCode } = this.props;
    return (
      <div className={styles.areaLossBox}>
        <div className={styles.areaLossTitle}>
          <span>{this.titleName()}</span>
          <Button disabled={selectStationCode.length === 0} onClick={this.toLostAnalysis}>根源分析</Button>
        </div>
        <div className={styles.areaLossCenter} ref={ref => {this.lossChart = ref;}} />
      </div>
    );
  }
}
