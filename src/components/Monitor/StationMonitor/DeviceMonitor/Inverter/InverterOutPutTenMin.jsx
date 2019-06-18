import React, { Component } from 'react';
import echarts from 'echarts';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './inverter.scss';
import { dataFormat } from '../../../../../utils/utilFunc';
import {showNoData, hiddenNoData} from '../../../../../constants/echartsNoData';


class InverterOutPutTenMin extends Component {
  static propTypes = {
    tenMinChartLoading: PropTypes.bool,
    tenMinUnix: PropTypes.number,
    deviceTenMin: PropTypes.array,
  }

  componentDidUpdate(prevProps){
    const { tenMinUnix, tenMinChartLoading } = this.props;
    const prevTenMinUnix = prevProps.tenMinUnix;
    if (tenMinUnix !== prevTenMinUnix || tenMinChartLoading) { // 获得数据
      this.renderChart();
    }
  }

  renderChart = () => {
    const { deviceTenMin, tenMinChartLoading } = this.props;
    const echartBox = document.getElementById('inverter_monitor_tenMin');
    const inverterChart = echarts.init(echartBox);
    if (tenMinChartLoading) {
      inverterChart.showLoading();
      return;
    } else {
      inverterChart.hideLoading();
    }
    const lineColor = '#666';
    let acPowerData = [], dcPowerData = [], radiationLineData = [], xTime = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e=>{
      xTime.push(moment(e.utc).format('YYYY-MM-DD HH:mm'));
      acPowerData.push(e.acPower); // 交流侧功率
      dcPowerData.push(e.dcPower); // 直流侧功率
      radiationLineData.push(e.instantaneous);
    });
    const filterStationPower = deviceTenMin.filter(e=>e.stationPower);
    const filterInstantaneous = deviceTenMin.filter(e=>e.instantaneous);
    const inverterTenMinGraphic = (filterStationPower.length===0 && filterInstantaneous.length===0) ? showNoData : hiddenNoData;
    const colorGroup = ['#3e97d1', '#a42b2c', '#f9b600'];
    const option = {
      color: colorGroup,
      graphic: inverterTenMinGraphic,
      legend: {
        data:['直流侧功率', '交流侧功率', '瞬时辐照'],
        top: 24,
        itemWidth: 24,
        itemHeight: 6,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        }
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
        formatter: (param) => {
          if (!param || (param.length === 0)){
            return '<div></div>';
          }
          const showTime = param[0] || {};
          return `<div class=${styles.tooltip}>
            <div class=${styles.header}>${showTime.name || ''}</div>
            ${param.map((e, i) => (
              `<div class=${styles.eachInfo}>
                <span class=${styles.extraTip} style="color: ${colorGroup[i]}"></span>
                <span class=${styles.name}>${e.seriesName}</span>
                <span class=${styles.value}>${dataFormat(e.value, '--', 2)}</span>
              </div>`
            )).join('')}
          </div>`
        },
        padding: 0
        // extraCssText:'background: rgba(0,0,0,0);',
      },
      calculable: true,
      xAxis: {
        type: 'category',
        data: xTime,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: lineColor,
        },
        axisPointer:{
          label: {
            show: false,
          }
        },
      },
      yAxis: [
        {
          name: '功率(kW)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine:{
            show:false
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: {
            show: false,
          },
        },
        {
          name: '瞬时辐照(W/m²)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine:{
            show:false
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: {
            show: false,
          },
        }
      ],
      series: [
        {
          name: '直流侧功率',
          type: 'line',
          yAxisIndex: 0,
          data: dcPowerData,
        }, {
          name: '交流侧功率',
          type: 'line',
          yAxisIndex: 1,
          data: acPowerData,
        }, {
          name: '瞬时辐照',
          type: 'line',
          yAxisIndex: 1,
          data: radiationLineData,
        },
      ]
    };
    deviceTenMin.length > 0 && (option.dataZoom = [
      {
        show: true,
        zoomLock: true,
        start: 90,
        end: 100
      }, {
        type: 'inside',
        start: 90,
        zoomLock: true,
        end: 100
      }
    ])
    inverterChart.setOption(option);
    inverterChart.resize();
  }

  render(){
    return (
      <div id="inverter_monitor_tenMin" style={{height:"335px",width: "100%",flex: 1,marginTop: "10px"}}></div>
    );
  }
}

export default InverterOutPutTenMin;