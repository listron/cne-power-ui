import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../constants/echartsNoData';
import echarts from 'echarts';

class FaultList extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool
  }

  constructor(props){
    super(props);
    this.state = {
      faultType: 'all',
    }
  }

  componentWillReceiveProps(nextProps){
    const chartBox = document.getElementById('homeFaultChart');
    if(chartBox){
      const faultChart = echarts.init(chartBox);
      this.setFaultChart(faultChart);
    }
  }

  setFaultChart = (faultChart) => {
    const xAxisArr = [1,2,3,4,5,6,7,8,9,10,11];
    const yFaultData = [12, 24, 18, 17, 11, 12, 20, 9, 11 ,19];
    const graphic = Math.random() > 0.5 ? hiddenNoData : showNoData;
    const option = {
      graphic,
      title: {
        show: false,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisArr,
          axisPointer: {
            type: 'shadow'
          },
          axisLine: {
            lineStyle: {
              color: '#06bdf4',
            },
          },
          axisLabel: {
            color: '#06bdf4',
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '功率MW',
          nameTextStyle: {
            color: '#06bdf4',
          },
          axisLabel: {
            color: '#06bdf4',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#06bdf4',
              type: 'dashed',
              opacity: 0.3,
            }
          },
        },
      ],
      series: [
        {
          name: '风电功率',
          type: 'line',
          data: yFaultData
        }
      ]
    }
    faultChart.setOption(option);
  }

  changeFaultType = (faultType) => {
    this.setState({ faultType });
  }

  render(){
    const { faultType } = this.state;
    const faultList = [
      {stationName: '盐源', value: 8.2 },
      {stationName: '富川', value: 7.2 },
      {stationName: '富川潮汐', value: 7.12 },
      {stationName: '天长', value: 6.98 },
      {stationName: '花灯2起', value: 6.61 },
    ]
    return (
      <section className={styles.faultList}>
        <h3>本月故障台次 TOP5</h3>
        <div className={styles.checkTags}>
          <StationTypeTag showTotal={false} activeType={faultType} onChange={this.changeFaultType} />
        </div>
        <div className={styles.faultContent}>
          <div className={styles.list}></div>
          <div className={styles.chart} id="homeFaultChart"></div>
        </div>
      </section>
    )
  }
}

export default FaultList;
