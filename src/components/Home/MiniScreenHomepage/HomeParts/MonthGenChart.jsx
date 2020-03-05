import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { dataFormat } from '../../../../utils/utilFunc';

class MonthGenChart extends Component{
  static propTypes = {
    enterpriseId: PropTypes.string,
    hasMultipleType: PropTypes.bool,
    monthPower: PropTypes.array,
    getMonthPower: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      monthType: 'pv'
    }
  }

  componentWillReceiveProps(nextProps){
    const { monthPower } = nextProps;
    this.setMonthChart(monthPower);
  }

  setMonthChart = (monthPower) => {
    const chartBox = document.getElementById('homeMonthElec');
    const monthChart = echarts.init(chartBox);
    let xAxisArr = [], yGenData = [], yRateData = [], hasData = false;
    monthPower.forEach(e=>{
      xAxisArr.push(e.month);
      yGenData.push(e.power);
      yRateData.push(e.rate);
      if(e.power || e.rate || e.power === 0 || e.rate === 0){
        hasData = true;
      }
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
          left: 10,
          right: 10,
          top: 30,
          bottom: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          extraCssText: 'background-color: rgba(0,0,0,0.8)',
          formatter: params => {
            const currentInfo = params[0] || {};
            const currentData = monthPower[currentInfo.dataIndex] || {};
            return `<div class=${styles.monthTool}>
              <div>${currentData.month}月发电量</div>
              <div>${dataFormat(currentData.power)}</div>
              <div>同比${dataFormat(currentData.rate)}%</div>
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
              padding: [0, 0, 0, 15],
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
              padding: [0, 10, 0, 0],
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
    const { enterpriseId, getMonthPower } = this.props
    this.setState({ monthType });
    const stationType = monthType === 'pv' ? 1 : 0;
    getMonthPower({ enterpriseId, stationType });
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
