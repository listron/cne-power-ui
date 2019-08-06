import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import styles from './lost.scss';

class ChartLostRank extends Component {

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
    const rankChart = echarts.init(this.rankRef);
    const dataAxis = [];
    const rankData = [];
    lostRank.forEach(e => {
      dataAxis.push(e.deviceName);
      rankData.push(e.indicatorData);
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
          data: rankData,
        },
      ],
    };
    rankChart.setOption(option);
  }

  render() {
    return (
      <div className={styles.lostRank}>
        <div className={styles.lostTop}>
          <span className={styles.title}>
            风机pba排名
          </span>
          <span className={styles.handle}>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择指标</span>
              <span>指标下拉</span>
            </span>
            <span className={styles.eachHandle}>
              <span className={styles.text}>选择排序</span>
              <span>风机下拉</span>
            </span>
          </span>
        </div>
        <div className={styles.rankChart} ref={(ref)=> {this.rankRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostRank;

