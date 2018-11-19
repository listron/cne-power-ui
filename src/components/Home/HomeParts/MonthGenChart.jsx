import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../constants/echartsNoData';

class MonthGenChart extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool,
    monthPower: PropTypes.array,
    getMonthPower: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      monthType: 'wind'
    }
  }

  componentWillReceiveProps(){
    const chartBox = document.getElementById('homeMonthElec');
    if(chartBox){
      const monthChart = echarts.init(chartBox);
      this.setMonthChart(monthChart);
    }
  }

  setMonthChart = (monthChart) => {
    const { monthPower } = this.props;
    console.log(monthPower);
    const xAxisArr = [1,2,3,4,5,6,7,8,9,10,11,12];
    const yGenData = [100,201,341,114,95,276,317,88,19,120,311,102];
    const yRateData = [12,21,31,14,51,16,17,18,29,10,31,27];
    const graphic = Math.random() > 0.5 ? hiddenNoData : showNoData;
    const option = {
        graphic,
        title: {
          show: false,
        },
        legend: {
          show: false,
        },
        grid: {
          top: 30,
          bottom: 30,
        },
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
            name: '万kWh',
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
            name: '同比',
            nameTextStyle: {
              color: '#06bdf4',
            },
            axisLabel: {
              color: '#06bdf4',
              formatter: '{value} %'
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
            name: '发电量',
            type: 'bar',
            data: yGenData,
            itemStyle: {
              barBorderRadius: 6,
              color: '#5b8ba2', 
            },
            emphasis: {
              itemStyle: {
                color: '#48cf49', 
              },
            },
            barWidth: 6,
          },
          {
            name: '同比',
            type: 'line',
            yAxisIndex: 1,
            data: yRateData,
          }
        ]
    }
    monthChart.setOption(option)
  }

  changeMonthType = (monthType) => {
    this.setState({ monthType });
    this.props.getMonthPower({ monthType });
  }


  render(){
    const { monthType } = this.state;
    const { hasMultipleType } = this.props;
    return (<section className={styles.monthGen}>
      <h3>每月发电量</h3>
      {hasMultipleType && <div className={styles.checkTags}>
       <StationTypeTag showTotal={false} activeType={monthType} onChange={this.changeMonthType} />
      </div>}
      <div id="homeMonthElec" className={styles.monthChart} ></div>
    </section>)
  }
}

export default MonthGenChart;
