

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

class OutputTenMin extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    yXaisName: PropTypes.string,
    stationCode: PropTypes.number,
    yAxisUnit: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.drawChart(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps)
  }


  drawChart=(param)=>{
    const { capabilityData, yAxisUnit,stationCode } = param;
    let yAxisType = `功率(${yAxisUnit})`
    const capabilityDiagram = echarts.init(document.getElementById(`capabilityDiagram_${stationCode}`));
    const lineColor = '#666';
    const capabilityPower = capabilityData.map(e => (yAxisUnit === 'MW' ? (+e.stationPower) : (+e.stationPower * 1000)));
    const capabilityRadiation = capabilityData.map(e => e.instantaneous);
    const filterCapabilityPower = capabilityData.filter(e => e.stationPower);
    const filterCapabilityRadiation = capabilityData.filter(e => e.instantaneous);
    const capabilityGraphic = (filterCapabilityPower.length === 0 && filterCapabilityRadiation.length === 0) ? showNoData : hiddenNoData;

    let labelInterval = 47 // 10min数据如果不缺失，此时为6(每小时6条)*8(8小时) - 1(除去间隔本身) = 47 个展示一个
    const totalLength = capabilityData.length;
    if (totalLength < 144 && totalLength > 0) { //假如返回数据不全
      labelInterval = parseInt(totalLength / 3) - 1;
    }
    const minPower = Math.min(...capabilityPower);
    const minRadiation = Math.min(...capabilityRadiation);
    const capabilityOption = {//出力图
      graphic: capabilityGraphic,
      legend: {
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
        itemWidth: 24,
        itemHeight: 6,
      },
      grid: {
        show: false,
        bottom:25,
        left:'12%',
        right:'14%',
        top:32,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        backgroundColor: '#fff',
        textStyle: {
          color: lineColor,
          fontSize: '12px',
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: lineColor,
          }
        },
        formatter: param => {
          return `<div style="width: 128px; height: 75px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;" >${param[0] && param[0].name || '--'}</div>
            ${param.map(e => `<div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #199475; width:6px; height:6px; border-radius:100%;"></span> ${e.seriesName}: ${e.value || '--'}</div>`).join('')}
          </div>`;
        },
        extraCssText: 'background: rgba(0,0,0,0);',
      },
      color: ['#c57576', '#199475'],
      xAxis: {
        type: 'category',
        splitNumber: 4,
        boundaryGap: false,
        data: capabilityData && capabilityData.map(e => {
          return moment(moment.utc(e.utc)).format('MM-DD HH:mm');
        }),
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: lineColor,
          interval: labelInterval,
        },
        axisTick: {
          show: false,
        },
        axisPointer: {
          label: {
            show: false,
          }
        },
      },
      yAxis: [
        {
          name: yAxisType,
          type: 'value',
          min: minPower < 0 ? minPower : 0,
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          splitLine: {
            show: false,
          },
        },
        {
          name: '辐射(W/m²)',
          type: 'value',
          min: minRadiation < 0 ? minRadiation : 0,
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          splitLine: {
            show: false,
          },
        }
      ],
      series: [
        {
          name: '功率',
          type: 'line',
          smooth: true,
          data: capabilityPower,
          yAxisIndex: 0,
          areaStyle: {
            color: '#fff2f2',
          },
          axisTick: {
            show: false,
          },
        },
        {
          name: '辐射',
          type: 'line',
          data: capabilityRadiation,
          yAxisIndex: 1,
          axisTick: {
            show: false,
          },
          lineStyle: {
            type: 'dotted',
          },
        }
      ]
    }
    capabilityDiagram.setOption(capabilityOption,'notMerge');
    capabilityDiagram.resize();
  }


  
  render() {
    const { stationCode } = this.props;
    return (
      <div id={`capabilityDiagram_${stationCode}`} style={{ width: 341, height: 176, color: '#666' }}></div>
    )
  }
}

export default OutputTenMin;
