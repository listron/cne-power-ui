

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { divideFormarts, multiplyFormarts, powerPoint } from '../../PvCommon/PvDataformat';
import { dataFormats } from '../../../../../utils/utilFunc';
import { themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
class OutputTenMin extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    yXaisName: PropTypes.string,
    stationCode: PropTypes.number,
    yAxisUnit: PropTypes.string,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.theme !== this.props.theme) {
      this.drawChart(nextProps, true);
    } else {
      this.drawChart(nextProps);
    }
  }


  drawChart = (param, themeChange) => {
    const { capabilityData, yAxisUnit, stationCode, theme } = param;
    // const yAxisType = `交流侧功率(${yAxisUnit})`;
    let capabilityDiagram = echarts.init(document.getElementById(`capabilityDiagram_${stationCode}`), themeConfig[theme]);
    if (themeChange) {
      capabilityDiagram.dispose();
      capabilityDiagram = echarts.init(document.getElementById(`capabilityDiagram_${stationCode}`), themeConfig[theme]);
    }

    const capabilityPower = capabilityData.map(e => dataFormats(divideFormarts(e.stationPower, yAxisUnit), '--', 2));
    const capabilityRadiation = capabilityData.map(e => dataFormats(e.instantaneous, '--', 2));
    const filterCapabilityPower = capabilityData.filter(e => e.stationPower);
    const filterCapabilityRadiation = capabilityData.filter(e => e.instantaneous);
    const capabilityGraphic = filterCapabilityPower.length === 0 && filterCapabilityRadiation.length === 0;
    // const graphic = capabilityGraphic && nodataLogo || {};
    // let labelInterval = 46; // 10min数据如果不缺失，此时为6(每小时6条)*8(8小时) - 1(除去间隔本身) = 47 个展示一个
    // const totalLength = capabilityData.length;
    // if (totalLength < 144 && totalLength > 0) { //假如返回数据不全
    //   labelInterval = parseInt(totalLength / 3, 10) - 1;
    // }
    const minPower = Math.min(...capabilityPower);
    const minRadiation = Math.min(...capabilityRadiation);
    const color = theme === 'dark' ? ['#a42b2c', '#00f8ff'] : ['#1e9475', '#f9b600'];
    const capabilityOption = {//出力图
      graphic: {
        type: 'image',
        right: capabilityGraphic && 'center' || 2,
        top: capabilityGraphic && 'center' || 30,
        z: -10,
        $action: 'replace',
        style: {
          image: capabilityGraphic && '/img/noChartData1.png' || '/img/picbg.png',
          width: capabilityGraphic && 60 || 293,
          height: capabilityGraphic && 76 || 120,

        },
      },
      // backgroundColor: 'transparnet',
      legend: {
        itemWidth: 24,
        itemHeight: 6,
        textStyle: {
          color: '#999999',
        },
      },
      grid: {
        show: false,
        bottom: 25,
        // left: 50,
        // right: 17,
        top: 32,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${item.color}"> </span> 
              ${item.seriesName} : ${item.value}${item.seriesName === '辐射' ? 'W/m²' : yAxisUnit}</div>`;
          });
          return (
            `<div class=${styles.tooltipBox}>
                  <div class=${styles.axisValue}>${params[0].name.split(',')[1]}</div>
                  <div class=${styles.tooltipContainer}>${paramsItem}</div>
              </div>`
          );
        },
      },
      color: color,
      xAxis: {
        type: 'category',
        splitNumber: 4,
        // boundaryGap: false,
        data: capabilityData && capabilityData.map(e => {
          return `${moment(e.utc).format('HH')},${moment(e.utc).format('MM-DD HH:mm')}`;
        }),
        axisLabel: {
          // interval: labelInterval,
          interval: 24,
          show: true,
          color: '#999999',
          formatter: (value) => {
            if(value.split(',')[0] !== '00') return value.split(',')[0];
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
        splitLine: {
          show: false,
        },
        nameTextStyle: {
          color: '#999999',
        },
      },
      yAxis: [
        {
          // name: yAxisType,
          type: 'value',
          min: minPower < 0 ? minPower : 0,
          show: true,
          axisLabel: {
            formatter: '{value}',
            show: true,
            color: '#999999',
          },
          nameTextStyle: {
            padding: [0, 0, 0, 20],
            color: '#999999',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false
          }
        },
        {
          name: '辐射(W/m²)',
          nameLabel: '辐射',
          type: 'value',
          show: false,
          min: minRadiation < 0 ? minRadiation : 0,
          axisLabel: {
            formatter: '{value}',
            color: '#999999',
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          nameTextStyle: {
            color: '#999999',
          },
        },
        {
          // name: '辅助',
          type: 'value',
          show: !capabilityGraphic,
          // min: 0,
          // max: 100,
          axisLabel: {
            show: true,
            color: '#999999',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          nameTextStyle: {
            color: '#999999',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '功率',
          nameLabel: '功率',
          type: 'line',
          smooth: true,
          data: capabilityPower,
          yAxisIndex: 0,
          z: 3,
          axisTick: {
            show: false,
          },
          lineStyle: {
            width: 2,
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
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(249, 182, 0, 0.5)', // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(249, 182, 0, 0.2)', // 100% 处的颜色
              }],
              global: false, // 缺省为 false
            },
          },
          lineStyle: {
            width: 2,
          },
        },
      ],
    };
    capabilityDiagram.setOption(capabilityOption);
    capabilityDiagram.resize();
  }



  render() {
    const { stationCode } = this.props;
    return (
      <div id={`capabilityDiagram_${stationCode}`} style={{width: 325, height: 176, color: '#353535', margin: '0 auto'}} />
    );
  }
}

export default OutputTenMin;
