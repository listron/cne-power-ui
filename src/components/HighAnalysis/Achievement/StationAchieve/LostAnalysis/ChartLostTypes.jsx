import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import echarts from 'echarts';
import styles from './lost.scss';

class ChartLostTypes extends Component {

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
    const typesChart = echarts.init(this.typesRef);
    const dataAxis = [];
    const typesData = [];
    lostRank.forEach(e => {
      dataAxis.push(e.deviceName);
      typesData.push(e.indicatorData);
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
          data: typesData,
        },
      ],
    };
    typesChart.setOption(option);
  }

  render() {
    return (
      <div className={styles.lostTypes}>
        <div className={styles.top}>
          <span className={styles.title}>
            损失电量分解图
          </span>
          <span className={styles.handle}>
            <Button>运行数据</Button>
          </span>
        </div>
        <div className={styles.chart} ref={(ref)=> {this.typesRef = ref;}} />
      </div>
    );
  }
}

export default ChartLostTypes;

