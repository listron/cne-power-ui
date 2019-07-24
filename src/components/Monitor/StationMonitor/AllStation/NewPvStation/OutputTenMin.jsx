

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
import { divideFormarts, multiplyFormarts, powerPoint } from '../../PvCommon/PvDataformat';
import { dataFormats } from '../../../../../utils/utilFunc';
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
    const themeColor = theme === 'dark' ? 'darkTheme' : 'lightTheme';
    const yAxisType = `交流侧功率(${yAxisUnit})`;
    let capabilityDiagram = echarts.init(document.getElementById(`capabilityDiagram_${stationCode}`), themeColor);
    if (themeChange) {
      capabilityDiagram.dispose();
      capabilityDiagram = echarts.init(document.getElementById(`capabilityDiagram_${stationCode}`), themeColor);
    }
    const capabilityPower = capabilityData.map(e => dataFormats(divideFormarts(e.stationPower, yAxisUnit), '--', 2, true));
    const capabilityRadiation = capabilityData.map(e => dataFormats(e.instantaneous, '--', 2, true));
    const filterCapabilityPower = capabilityData.filter(e => e.stationPower);
    const filterCapabilityRadiation = capabilityData.filter(e => e.instantaneous);
    const capabilityGraphic = (filterCapabilityPower.length === 0 && filterCapabilityRadiation.length === 0) ? showNoData : hiddenNoData;
    let labelInterval = 47; // 10min数据如果不缺失，此时为6(每小时6条)*8(8小时) - 1(除去间隔本身) = 47 个展示一个
    const totalLength = capabilityData.length;
    if (totalLength < 144 && totalLength > 0) { //假如返回数据不全
      labelInterval = parseInt(totalLength / 3, 10) - 1;
    }
    const minPower = Math.min(...capabilityPower);
    const minRadiation = Math.min(...capabilityRadiation);
    const color = theme === 'dark' ? ['#a42b2c', '#00f8ff'] : ['#c57576', '#199475'];
    const capabilityOption = {//出力图
      graphic: capabilityGraphic,
      legend: {
        itemWidth: 24,
        itemHeight: 6,
      },
      grid: {
        show: false,
        bottom: 25,
        left: '13%',
        right: '14%',
        top: 32,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${item.color}"> </span> 
              ${item.seriesName} :  ${item.value}</div>`;
          });
          return (
            `<div class=${styles.tooltipBox}>
                  <div class=${styles.axisValue}>${params[0].name}</div>
                  <div class=${styles.tooltipContainer}> ${paramsItem}</div>
              </div>`
          );
        },
      },
      color: color,
      xAxis: {
        type: 'category',
        splitNumber: 4,
        boundaryGap: false,
        data: capabilityData && capabilityData.map(e => {
          return moment(moment.utc(e.utc).toDate()).format('MM-DD HH:mm');
        }),
        axisLine: {
          lineStyle: {
            // color: '#dfdfdf',
          },
        },
        axisLabel: {
          // color: lineColor,
          interval: labelInterval,
        },
        axisTick: {
          show: false,
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
      },
      yAxis: [
        {
          name: yAxisType,
          type: 'value',
          min: minPower < 0 ? minPower : 0,
          axisLabel: {
            formatter: '{value}',
          },
          nameTextStyle: {
            padding: [0, 0, 0, 20],
          },
          axisLine: {
            show: true,
            lineStyle: {
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
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '功率',
          type: 'line',
          smooth: true,
          data: capabilityPower,
          yAxisIndex: 0,
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
        },
      ],
    };
    capabilityDiagram.setOption(capabilityOption);
    capabilityDiagram.resize();
  }



  render() {
    const { stationCode } = this.props;
    return (
      <div id={`capabilityDiagram_${stationCode}`} style={{ width: 341, height: 176, color: '#666' }}></div>
    );
  }
}

export default OutputTenMin;
