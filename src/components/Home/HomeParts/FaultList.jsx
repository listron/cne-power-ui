import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../constants/echartsNoData';
import echarts from 'echarts';

class FaultList extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool,
    faultNumber: PropTypes.array,
    getFaultNumber: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      faultType: 'wind',
      currentIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps){
    const { faultNumber } = nextProps;
    if(faultNumber.length > 0){ // 得到数据，启动计时器
      this.clocker && clearTimeout(this.clocker);
      this.setFaultChart(0);
      this.clocker = setTimeout(this.showNextFault,10000);
    }
  }

  componentWillUnmount(){
    this.clocker && clearTimeout(this.clocker);
  }

  setFaultChart = (currentIndex) => { // 展示故障chart图
    const chartBox = document.getElementById('homeFaultChart');
    const faultChart = echarts.init(chartBox);
    const { faultNumber } = this.props;
    const currentStation = faultNumber[currentIndex] || {};
    const chartData = currentStation.monthList || [];
    let xAxisArr = [], yFaultData = [], hasData = false;
    chartData.forEach(e=>{
      xAxisArr.push(e.month);
      yFaultData.push(e.number);
      if(e.number || e.number === 0){
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
        top: 28,
        bottom: 28,
      },
      tooltip: {
        extraCssText: 'background-color: rgba(0,0,0,0.8)',
        padding: 10,
        formatter: params => {
          const currentData = chartData[params.dataIndex];
          return `<div class=${styles.faultTool}>
            <div>${currentData.month}月</div>
            <div>故障台次${currentData.number}</div>
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
          name: '次/台',
          nameTextStyle: {
            fontSize: 10,
            color: '#06bdf4',
          },
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
      ],
      series: [
        {
          name: '风电功率',
          type: 'line',
          lineStyle: { color: '#48cf49' },
          data: yFaultData
        }
      ]
    }
    faultChart.setOption(option);
  }

  showNextFault = (targetIndex = 0) => { // 定时执行展示下一个电站故障
    const { faultNumber } = this.props;
    const maxFaultLength = faultNumber.length || 0;
    const nextIndex = (targetIndex + 1) >= maxFaultLength? 0: (targetIndex + 1);
    this.setState({
      currentIndex: nextIndex,
    })
    this.setFaultChart(nextIndex);
    this.clocker = setTimeout(()=>this.showNextFault(nextIndex),10000);
  }

  changeFaultType = (faultType) => { // 切换设备类型
    this.clocker && clearTimeout(this.clocker);
    this.setState({ 
      faultType,
      currentIndex: 0,
    });
    this.props.getFaultNumber(faultType);
  }

  render(){
    const { faultType, currentIndex } = this.state;
    const { faultNumber } = this.props;
    const activeBackground = {backgroundImage: 'url(/img/hover.png)'};
    return (
      <section className={styles.faultList}>
        <h3>本月故障台次 TOP5</h3>
        <div className={styles.checkTags}>
          <StationTypeTag showTotal={false} activeType={faultType} onChange={this.changeFaultType} />
        </div>
        <div className={styles.faultContent}>
          <div className={styles.list}>
            {faultNumber.map((e,i)=>(<span 
              key={e.stationName} 
              className={styles.eachFault} 
              style={currentIndex === i?activeBackground:null}
              >
              <span className={styles.stationName}>{e.stationName}</span>
              <span className={styles.value}>{e.number}</span>
              <span className={styles.text}>次/台</span>
            </span>))}
          </div>
          <div className={styles.chart} id="homeFaultChart"></div>
        </div>
      </section>
    )
  }
}

export default FaultList;
