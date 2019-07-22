import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import echarts from 'echarts';
import { dataFormat } from '../../../../utils/utilFunc';

class FaultList extends Component {
  static propTypes = {
    faultQueryTime: PropTypes.string,
    enterpriseId: PropTypes.string,
    hasMultipleType: PropTypes.bool,
    faultNumber: PropTypes.array,
    getFaultNumber: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      faultType: 'wind',
      currentIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { faultNumber, faultQueryTime } = nextProps;
    const preFaultTime = this.props.faultQueryTime;
    if(preFaultTime !== faultQueryTime){ // 得到故障数据
      this.clocker && clearTimeout(this.clocker);
      this.setFaultChart(0, faultNumber);
      if(faultNumber.length > 1){ // 故障数据至少2条时启动定时切换。
        this.clocker = setTimeout(() => {
          this.showNextFault(0, faultNumber);
        },10000);
      }
    }
  }

  componentWillUnmount() {
    this.clocker && clearTimeout(this.clocker);
  }

  setFaultChart = (currentIndex, faultNumber) => { // 展示故障chart图
    const chartBox = document.getElementById('homeFaultChart');
    const faultChart = echarts.init(chartBox);
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
        left: 10,
        right: 10,
        top: 28,
        bottom: 28,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        extraCssText: 'background-color: rgba(0,0,0,0.8)',
        padding: 10,
        formatter: params => {
          const currentInfo = params[0] || {};
          const currentData = chartData[currentInfo.dataIndex] || {};
          return `<div class=${styles.faultTool}>
            <div>${currentData.month}月</div>
            <div>故障台次${dataFormat(currentData.number)}</div>
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
            padding: [0, 0, 0, 10],
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

  showNextFault = (targetIndex = 0, faultNumber) => { // 定时执行展示下一个电站故障
    const maxFaultLength = faultNumber.length;
    const nextIndex = (targetIndex + 1) >= maxFaultLength ? 0: (targetIndex + 1);
    this.setState({
      currentIndex: nextIndex,
    })
    this.setFaultChart(nextIndex, faultNumber);
    this.clocker = setTimeout(() => {
      this.showNextFault(nextIndex, faultNumber);
    }, 10000);
  }

  changeFaultType = (faultType) => { // 切换设备类型
    this.clocker && clearTimeout(this.clocker);
    const { enterpriseId, getFaultNumber } = this.props;
    const stationType = faultType === 'wind' ? 0 : 1;
    this.setState({ 
      faultType,
      currentIndex: 0,
    });
    getFaultNumber({ stationType, enterpriseId });
  }

  render(){
    const { faultType, currentIndex } = this.state;
    const { faultNumber, hasMultipleType } = this.props;
    const activeBackground = {backgroundImage: 'url(/img/hover.png)'};
    return (
      <section className={styles.faultList}>
        <h3>本月故障台次 TOP5</h3>
        {hasMultipleType && <div className={styles.checkTags}>
          <StationTypeTag showTotal={false} activeType={faultType} onChange={this.changeFaultType} />
        </div>}
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
