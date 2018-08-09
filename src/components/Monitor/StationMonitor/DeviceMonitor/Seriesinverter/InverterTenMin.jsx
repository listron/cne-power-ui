import React from 'react';
import echarts from 'echarts';

function InverterTenMin({ deviceTenMin }) {
  const echartBox = document.getElementById('inverter_monitor_tenMin');
  const lineColor = '#999';
  if(echartBox){
    const inverterChart = echarts.init(echartBox);
    let powerLineData = [], radiationLineData = [], xTime = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e=>{
      xTime.push(e.localTime);
      powerLineData.push(e.stationPower);
      radiationLineData.push(e.instantaneous);
    });
    const option = {
      legend: {
        data:['功率','斜面辐射']
      },
      tooltip: {
        show: true,
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
          name: '辐射 (W/m²)',
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
          name: '功率 (kW)',
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
          name: '斜面辐射',
          type: 'line',
          lineStyle: {
            type: 'dashed',
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
  }
  return (
    <div id="inverter_monitor_tenMin" style={{height:"335px"}}></div>
  );
}

export default InverterTenMin;