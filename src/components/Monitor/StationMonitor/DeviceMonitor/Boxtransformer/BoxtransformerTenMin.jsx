import React from 'react';
import echarts from 'echarts';
import moment from 'moment';

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
    let powerLineData = [], instantaneousData = [], xTime = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e=>{
      xTime.push(moment(e.utc).format('YYYY-MM-DD hh:mm:ss'));
      powerLineData.push(e.stationPower);
      instantaneousData.push(e.instantaneous);
    });
    const option = {
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
        }
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
  }
  return (
    <div id="boxtransformer_monitor_tenMin" style={{height:"335px"}}></div>
  );
}

export default BoxtransformerTenMin;