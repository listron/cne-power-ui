import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import echarts from 'echarts';
import styles from './lost.scss';

class ChartLostTrend extends Component {

  static propTypes = {
    lostRank: PropTypes.array, // 损失根源 - 指标排名
    lostRankLoading: PropTypes.bool,
  }

  componentDidMount(){
    this.renderChart(this.props.lostRank);
  }

  componentWillReceiveProps(nextProps){
    const { lostRankLoading, lostRank } = nextProps;
    const preLoading = this.props.lostRankLoading;
    if (preLoading && !lostRankLoading) { // 请求完毕
      this.renderChart(lostRank);
    } else if (!preLoading && lostRankLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    console.log('loading');
  }

  renderChart = (lostRank = []) => {
    const trendChart = echarts.init(this.trendRef);
    const dataAxis = [];
    const trendData = [];
    lostRank.forEach(e => {
      dataAxis.push(e.deviceName);
      trendData.push(e.indicatorData);
    });
    const option = {
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: true,
          textStyle: {
            color: '#fff',
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        z: 10,
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#999',
          },
        },
      },
      series: [
        {
          type: 'bar',
          itemStyle: {
            normal: {
            },
            emphasis: {
            },
          },
          data: trendData,
        },
      ],
    };
    trendChart.setOption(option);
  }

  render() {
    return (
      <div className={styles.lostTrend}>
        <div className={styles.top}>
          <span className={styles.title}>
            PBA趋势
          </span>
          <span className={styles.handle}>
            <Button>按日</Button>
            <Button>按月</Button>
            <Button>按年</Button>
          </span>
        </div>
        <div className={styles.chart} ref={(ref)=> {this.trendRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTrend;

