import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { dataFormat } from '../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../constants/echartsNoData';

class OutputPower extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool,
    mapStation: PropTypes.array,
    outputPower: PropTypes.array,
    realTimeInfo: PropTypes.object,
    getOutputDiagram: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      outputType: 'wind'
    }
  }

  componentWillReceiveProps(nextProps){
    const { outputPower } = nextProps;
    if(outputPower.length > 0){
      const chartBox = document.getElementById('homeOutputChart');
      const outputChart = echarts.init(chartBox);
      this.setMonthChart(outputChart);
    }
  }

  setMonthChart = (outputChart) => {
    const { outputPower, mapStation, hasMultipleType } = this.props;
    const { outputType } = this.state;
    let isWind = false;
    if(hasMultipleType){
      outputType === 'wind' && (isWind = true);
    }else{
      isWind = mapStation.some(e=>e.stationType === 0);
    }
    let xAxisArr = [], yPowerData = [], yResourceData = [], hasData = false;
    outputPower.forEach(e=>{
      xAxisArr.push(e.utc);
      yPowerData.push(e.stationPower);
      yResourceData.push(e.instantaneous);
      if(e.stationPower || e.instantaneous || e.stationPower === 0 || e.instantaneous === 0){
        hasData = true;
      }
    })
    const graphic = hasData ? hiddenNoData : showNoData;
    const option = {
        graphic,
        title: {
          show: false,
        },
        color: ['#00ffff', '#d0021b'],
        legend: {
          textStyle: {
            color: '#06bdf4',
            fontSize: 12,
          },
          icon: 'circle',
          itemWidth: 5,
          itemHeight: 5,
        },
        tooltip: {
          extraCssText: 'background-color: rgba(0,0,0,0.8)',
          padding: 10,
          formatter: params => {
            const currentData = outputPower[params.dataIndex];
            return `<div class=${styles.outputTool}>
              <div>${currentData.utc}</div>
              <div>${isWind?'风电':'光伏'}功率 ${currentData.stationPower}月发电量</div>
              <div>${isWind?'m/s':'W/㎡'}${currentData.instantaneous}</div>
            </div>`
          },
          padding: 10
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
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#06bdf4',
              fontSize: 12,
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '功率MW',
            nameTextStyle: {
              fontSize: 12,
              color: '#06bdf4',
            },
            axisLabel: {
              color: '#06bdf4',
              fontSize: 12,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: 'value',
            name: 'm/s',
            nameTextStyle: {
              fontSize: 12,
              color: '#06bdf4',
            },
            axisLabel: {
              color: '#06bdf4',
              fontSize: 12,
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
            name: isWind?'风电功率':'光伏功率',
            type: 'line',
            data: yPowerData,
          },
          {
            name: isWind?'风速':'辐射',
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
    const { realTimeInfo, hasMultipleType, mapStation } = this.props;
    let isWind = false;
    if(hasMultipleType){
      outputType === 'wind' && (isWind = true);
    }else{
      isWind = mapStation.some(e=>e.stationType === 0);
    }
    return (
      <section className={styles.outputPower}>
        <h3>{isWind?'风':'光伏'}电站出力</h3>
        <div className={styles.checkTags}>
          <StationTypeTag showTotal={false} activeType={outputType} onChange={this.changeOutputType} />
        </div>
        <div id="homeOutputChart" className={styles.outputChart} ></div>
        <div className={styles.totalPower}>
          <span className={styles.text}>全部电站功率 : </span>
          <span className={styles.highlight}>{dataFormat(realTimeInfo.allStationPower)}</span>
          <span className={styles.text}>MW</span>
        </div>
      </section>
    )
  }
}

export default OutputPower;
