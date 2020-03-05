import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class OutputPower extends Component{
  static propTypes = {
    enterpriseId: PropTypes.string,
    outputPowerTime: PropTypes.string,
    hasMultipleType: PropTypes.bool,
    mapStation: PropTypes.array,
    outputPower: PropTypes.array,
    realTimeInfo: PropTypes.object,
    getOutputDiagram: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      outputType: 'pv',
    }
  }

  componentWillReceiveProps(nextProps) {
    const { outputPower, outputPowerTime } = nextProps;
    const preTime = this.props.outputPowerTime;
    if(outputPowerTime !== preTime ){ // 出力图数据刷新
      this.clocker && clearTimeout(this.clocker);
      this.setMonthChart(outputPower);
      this.clocker = setTimeout(this.refreshChart, 10 * 60 * 1000); // 十分钟后继续请求
    }
  }
  
  componentWillUnmount(){
    this.clocker && clearTimeout(this.clocker);
  }

  setMonthChart = (outputPower) => {
    const chartBox = document.getElementById('homeOutputChart');
    const outputChart = echarts.init(chartBox);
    const { mapStation, hasMultipleType } = this.props;
    const { outputType } = this.state;
    let isWind = false;
    if(hasMultipleType){
      outputType === 'wind' && (isWind = true);
    }else{
      isWind = mapStation && mapStation.some(e=>e.stationType === 0);
    }
    let xAxisArr = [], yPowerData = [], yResourceData = [], hasData = false;
    outputPower.forEach(e=>{
      const xTime = e.utc && moment(e.utc).format('HH:mm');
      xAxisArr.push(xTime);
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
        grid: {
          left: 10,
          right: 10,
          height: 110,
          containLabel: true,
        },
        color: ['#d0021b', '#00ffff'],
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
          trigger: 'axis',
          extraCssText: 'background-color: rgba(0, 0, 0, 0.8)',
          padding: 10,
          formatter: params => {
            const currentInfo = params[0] || {};
            const currentData = outputPower[currentInfo.dataIndex] || {};
            return `<div class=${styles.outputTool}>
              <div class=${styles.time}>${currentInfo.name}</div>
              <div class=${styles.text}>${isWind?'风电':'光伏'}功率: ${dataFormat(currentData.stationPower)}MW</div>
              <div class=${styles.text}>${isWind?'风速: ':'辐射: '}${dataFormat(currentData.instantaneous)}${isWind?'m/s':'W/㎡'}</div>
            </div>`
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
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: 'value',
            name: isWind ? 'm/s' : 'W/㎡',
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
            lineStyle: {
              width: 1,
            },
          }, {
            name: isWind?'风速':'辐射',
            type: 'line',
            yAxisIndex: 1,
            data: yResourceData,
            lineStyle: {
              width: 1,
            },
          }
        ]
    }
    outputChart.setOption(option)
  }

  refreshChart = () => { // 刷新chart图表数据
    const { outputPower } = this.props;
    this.setMonthChart(outputPower);
    this.clocker = setTimeout(this.refreshChart, 10 * 60 * 1000);
  }

  changeOutputType = (outputType) => { // 切换电站类型，同时重新请求10min数据。
    const { enterpriseId, getOutputDiagram } = this.props;
    const stationType = outputType === 'wind' ? 0 : 1;
    this.setState({ outputType });
    this.clocker && clearTimeout(this.clocker);
    getOutputDiagram({ enterpriseId, stationType });
  }

  render(){
    const { outputType } = this.state;
    const { realTimeInfo, hasMultipleType, mapStation } = this.props;
    let isWind = false;
    if(hasMultipleType){
      outputType === 'wind' && (isWind = true);
    }else{
      isWind = mapStation && mapStation.some(e=>e.stationType === 0);
    }
    return (
      <section className={styles.outputPower}>
        <h3>{isWind?'风':'光伏'}电站出力</h3>
        {hasMultipleType && <div className={styles.checkTags}>
          <StationTypeTag showTotal={false} activeType={outputType} onChange={this.changeOutputType} />
        </div>}
        <div id="homeOutputChart" className={styles.outputChart}></div>
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
