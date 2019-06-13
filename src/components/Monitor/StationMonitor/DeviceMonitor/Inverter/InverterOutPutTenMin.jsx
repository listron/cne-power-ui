import React, { Component } from 'react';
import echarts from 'echarts';
import moment from 'moment';
import PropTypes from 'prop-types';
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
    let powerLineData = [], radiationLineData = [], xTime = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e=>{
      //console.log(e.utc);
      //xTime.push(moment(e.utc).format('YYYY-MM-DD HH:mm:ss'));
      xTime.push(moment(moment.utc(e.utc).toDate()).local().format('YYYY-MM-DD HH:mm'));
      powerLineData.push(e.stationPower);
      radiationLineData.push(e.instantaneous);
    });
    const filterStationPower = deviceTenMin.filter(e=>e.stationPower);
    const filterInstantaneous = deviceTenMin.filter(e=>e.instantaneous);
    const inverterTenMinGraphic = (filterStationPower.length===0 && filterInstantaneous.length===0) ? showNoData : hiddenNoData;
    const option = {
      graphic: inverterTenMinGraphic,
      // title: {
      //   text: '时序图',
      //   textStyle: {
      //     color: lineColor,
      //     fontSize: 14,
      //   },
      //   left: 60
      // },
      legend: {
        data:['功率','瞬时辐照'],
        top: 24,
        itemWidth: 24,
        itemHeight: 6,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        }
      },
      // tooltip: {
      //   show: true,
      // },
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
          if(!param || param.length===0){
            return <div></div>
          }
          let irradiation='',power='';
          const irradiationObj = param.find(e=>e.seriesName==='瞬时辐照');
          const powerObj = param.find(e=>e.seriesName==='功率');
          const tmpIrradiation = irradiationObj && !isNaN(irradiationObj.value);
          const tmpPower = powerObj && !isNaN(powerObj.value);
          if(tmpIrradiation){
            irradiation = `<div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #199475; width:6px; height:6px; border-radius:100%;"></span> 瞬时辐照: ${irradiationObj.value}</div>`;
          }
          if(tmpPower){
            power = `<div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #a42b2c; width:6px; height:6px; border-radius:100%;"></span> 功率: ${powerObj.value}</div>`;
          }
          return `<div style="width: 128px; height: 75px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;" >${param[0] && param[0].name}</div>
            ${irradiation}${power}
          </div>`;
        },
        extraCssText:'background: rgba(0,0,0,0);',
      },
      calculable: true,
      // grid: {
      //   top: 95,
      //   containLabel: true,
      // },
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
          name: '功率',
          type: 'line',
          lineStyle: {
            type: 'solid',
            color: '#c57576',
            width: 1,
          },
          itemStyle:{
            opacity: 0,
          },
          areaStyle: {
            normal: {
              opacity: 0.2,
            }
          },
          label: {
            normal: {
              show: false
            }
          },
          yAxisIndex: 0,
          data: powerLineData,
        },
        {
          name: '瞬时辐照',
          type: 'line',
          lineStyle: {
            type: 'dotted',
            color: '#199475',
            width: 1,
          },
          itemStyle:{
            color: "#199475",
            opacity: 0,
          },
          label: {
            normal: {
              show: false
            }
          },
          yAxisIndex: 1,
          data: radiationLineData,
        },
      ]
    };
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