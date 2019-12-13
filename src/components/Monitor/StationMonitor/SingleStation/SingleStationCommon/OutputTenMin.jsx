

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './singleStationCommon.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

class OutputTenMin extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    powerData: PropTypes.array,
    match: PropTypes.object,
    getMonitorPower: PropTypes.func,
    yXaisName: PropTypes.string,
    chartType: PropTypes.string,
    stationCode: PropTypes.string,
    yAxisUnit: PropTypes.string,
    yAxisValuePoint: PropTypes.any,

  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const { capabilityData, yXaisName, chartType, yAxisUnit, yAxisValuePoint } = nextProps;
    let yAxisType = `功率(${yAxisUnit})`
    const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    const lineColor = '#666';
    const capabilityPower = capabilityData.map(e => (yAxisUnit === 'MW' ? (+e.stationPower) : (+e.stationPower * 1000)).toFixed(yAxisValuePoint));
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
    const color = this.getColor(chartType);
    const capabilityOption = {//出力图
      graphic: capabilityGraphic,
      title: {
        text: '出力图',
        textStyle: {
          color: lineColor,
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
        // data:['功率',yXaisName],
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
        itemWidth: 24,
        itemHeight: 6,
      },
      grid: {
        show: false,
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
            <div style="border-bottom: 1px solid #d4d4d4;padding-left: 5px;" >${param[0] && param[0].name || '--'}</div>
            ${param.map(e => `<div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #199475; width:6px; height:6px; border-radius:100%;"></span> ${e.seriesName}: ${e.value || '--'}</div>`).join('')}
          </div>`;
        },
        extraCssText: 'background: rgba(0,0,0,0);',
      },
      color: color,
      calculable: true,
      xAxis: {
        type: 'category',
        splitNumber: 4,
        boundaryGap: false,
        data: capabilityData && capabilityData.map(e => {
          return moment(moment.utc(e.utc).toDate()).format('MM-DD HH:mm');
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
          name: chartType === 'wind' ? '风速(m/s)' : '斜面辐射(W/m²)',
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
          name: chartType === 'wind' ? '风速' : '斜面辐射',
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
    capabilityDiagram.setOption(capabilityOption);
    capabilityDiagram.resize();
  }


  getColor = (type) => {
    let result = [];
    switch (type) {
      case 'wind':
        result = ['#c57576', '#3e97d1'];
        break;
      default:
        result = ['#c57576', '#199475'];
        break;
    }
    return result;
  }

  render() {
    const { stationCode } = this.props;
    const resourceAnalysis = `/statistical/stationaccount/resource#${stationCode}`;
    return (
      <div className={styles.capabilityDiagramBox} >
        <div id="capabilityDiagram" style={{ width: "100%", height: "100%", borderRight: "2px solid #dfdfdf", color: '#666', paddingTop: "20px" }}><i className="iconfont icon-more"></i></div>
        {stationCode && <Link to={resourceAnalysis} ><i className="iconfont icon-more"></i></Link>}
      </div>
    )
  }
}

export default OutputTenMin;
