import React from 'react';
import echarts from 'echarts';
import moment from 'moment';

function InverterTenMin({ deviceTenMin, loading }) {
  const echartBox = document.getElementById('inverter_monitor_tenMin');
  const lineColor = '#999';
  if(echartBox){
    const inverterChart = echarts.init(echartBox);
    // if(loading){
    //   inverterChart.showLoading();
    // }else{
    //   inverterChart.hideLoading();
    // }
    let powerLineData = [], radiationLineData = [], xTime = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e=>{
      //console.log(e.utc);
      //xTime.push(moment(e.utc).format('YYYY-MM-DD hh:mm:ss'));
      xTime.push(moment(moment.utc(e.utc).toDate()).local().format('YYYY-MM-DD HH:mm'));
      powerLineData.push(e.stationPower);
      radiationLineData.push(e.instantaneous);
    });
    
    //console.log(xTime);

    const option = {
      title: {
        text: '时序图',
        textStyle: {
          color: '#999',
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
        }
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
          lineStyle: {
            type: 'dotted',
            color: '#199475',
            width: 1,
          },
          itemStyle:{
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
  }
  return (
    <div id="inverter_monitor_tenMin" style={{height:"335px",width: "100%",marginTop: "10px"}}></div>
  );
}

export default InverterTenMin;