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
    let xAxisArr = [], yGenData = [], yRateData = [], hasData = false;
    monthPower.forEach(e=>{
      xAxisArr.push(e.month);
      yGenData.push(e.power);
      yRateData.push(e.rate);
      hasData = !!e.power || !!e.rate || e.power === 0 || e.rate === 0;
    });
    const option = {
        graphic: hasData ? hiddenNoData : showNoData,
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
          extraCssText: 'background-color: rgba(0,0,0,0.8)',
          formatter: params => {
            const currentData = monthPower[params.dataIndex];
            return `<div class=${styles.chartTool}>
              <div>${currentData.month}月发电量</div>
              <div>${currentData.power}</div>
              <div>同比${currentData.rate}%</div>
            </div>`
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
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#06bdf4',
              },
            },
            axisLabel: {
              color: '#06bdf4',
              fontSize: 10,
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '万kWh',
            nameTextStyle: {
              fontSize: 10,
              color: '#06bdf4',
              padding: [0, 40, 0, 0],
            },
            nameGap: 8,
            axisLabel: {
              color: '#06bdf4',
              fontSize: 10,
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
              fontSize: 10,
              color: '#06bdf4',
              padding: [0, 0, 0, 30],
            },
            nameGap: 8,
            axisLabel: {
              color: '#06bdf4',
              formatter: '{value}%'
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
            lineStyle: { color: '#48cf49' },
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
