import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import {showNoData, hiddenNoData} from '../../../../../constants/echartsNoData';

function BoxtransformerTenMin({ deviceTenMin, loading }) {
  const echartBox = document.getElementById('boxtransformer_monitor_tenMin');
  const lineColor = '#999';
  if(echartBox){
    const boxtransformerChart = echarts.init(echartBox);
    // if(loading){
    //   boxtransformerChart.showLoading();
    // }else{
    //   boxtransformerChart.hideLoading();
    // }
    console.log(deviceTenMin);
    let powerLineData = [], instantaneousData = [], xTime = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e=>{
      xTime.push(moment(e.utc).format('YYYY-MM-DD HH:mm:ss'));
      powerLineData.push(e.stationPower);
      instantaneousData.push(e.instantaneous);
    });
    
    const filterStationPower = deviceTenMin && deviceTenMin.filter(e=>e.stationPower);
    const filterInstantaneous = deviceTenMin && deviceTenMin.filter(e=>e.instantaneous);
    const inverterTenMinGraphic = (deviceTenMin && deviceTenMin.length===0 &&
      filterStationPower.length===0 && filterInstantaneous.length===0) ? showNoData : hiddenNoData;
    const option = {
      graphic: inverterTenMinGraphic,
      title: {
        text: '时序图',
        textStyle: {
          color: '#666',
          fontSize: 14,
        },
        left: 60
      },
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
            backgroundColor: '#666',
          }
        },
        formatter: (param) => {
          console.log(param);
          return `<div style="width: 128px; height: 75px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;" >${param[0].name}</div>
            <div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #199475; width:6px; height:6px; border-radius:100%;"></span> 瞬时辐照: ${param.length>1&&param[1].seriesName==='瞬时辐照'?param[1].value:param.length>0&&param[0].seriesName==='瞬时辐照'?param[0].value:'--'}</div>
            <div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #a42b2c; width:6px; height:6px; border-radius:100%;"></span> 功率: ${param.length>0&&param[0].seriesName==='功率'?(param[0].value || '--'):'--'}</div>
          </div>`;
        },
        extraCssText:'background: rgba(0,0,0,0);',
      },
      grid: {
        top: 95,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xTime,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: lineColor
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
          splitLine:{
            show:false
          },
          axisLine: {
            lineStyle: {
              color: lineColor
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
          splitLine:{
            show:false
          },
          axisLine: {
            lineStyle: {
              color: lineColor
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
          smooth:true,
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
          data: instantaneousData,
        },
      ]
    };
    boxtransformerChart.setOption(option);
    boxtransformerChart.resize();
  }
  return (
    <div id="boxtransformer_monitor_tenMin" style={{height:"335px"}}></div>
  );
}

export default BoxtransformerTenMin;