import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../constants/echartsNoData';

class OutputPower extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool,
    outputData: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
      outputType: 'all'
    }
  }

  componentWillReceiveProps(){
    const chartBox = document.getElementById('homeOutputChart');
    if(chartBox){
      const outputChart = echarts.init(chartBox);
      this.setMonthChart(outputChart);
    }
  }

  setMonthChart = (outputChart) => {
    const xAxisArr = ['00:00','06:00','12:00','18:00','24:00'];
    const yPowerData = [12, 24, 18, 17];
    const yResourceData = [3.14, 6.77, 5.74, 4.11];
    const graphic = Math.random() > 0.5 ? hiddenNoData : showNoData;
    const option = {
        graphic,
        title: {
          show: false,
        },
        // legend: {
        //   show: false,
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          backgroundColor: '#fff',
          formatter: function (params) {
            console.log(params);
            return params;
          },
          padding: 10,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontSize: 14,
          },
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
          {
            type: 'value',
            name: 'm/s',
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
              show: false,
            }
          }
        ],
        series: [
          {
            name: '风电功率',
            type: 'line',
            data: yPowerData
          },
          {
            name: '风速',
            type: 'line',
            yAxisIndex: 1,
            data: yResourceData,
          }
        ]
    }
    outputChart.setOption(option)
  }

  changeOutputType = (outputType) => {
    this.setState({ outputType });
  }


  render(){
    const { outputType } = this.state;
    return (
      <section className={styles.outputPower}>
        <h3>风电站出力</h3>
        <div className={styles.checkTags}>
          <StationTypeTag showTotal={false} activeType={outputType} onChange={this.changeOutputType} />
        </div>
        <div id="homeOutputChart" className={styles.outputChart} ></div>
        <div className={styles.totalPower}>
          <span className={styles.text}>全部电站功率:</span>
          <span className={styles.highlight}>4000</span>
          <span className={styles.text}>MW</span>
        </div>
      </section>
    )
  }
}

export default OutputPower;
