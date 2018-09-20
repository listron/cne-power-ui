import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import {showNoData, hiddenNoData} from '../../../../../constants/echartsNoData';

function ConfluenceTenMin({ deviceTenMin, loading }) {
  const echartBox = document.getElementById('confluence_monitor_tenMin');
  const lineColor = '#999';
  if(echartBox){
    const confluenceChart = echarts.init(echartBox);
    // if(loading){
    //   confluenceChart.showLoading();
    // }else{
    //   confluenceChart.hideLoading();
    // }
    // const HLNames = ['HL001', 'HL002', 'HL003', 'HL004', 'HL005', 'HL006', 'HL007', 'HL008', 'HL009', 'HL010', 'HL011', 'HL012', 'HL013', 'HL014', 'HL015', 'HL016']
    let dispersionRatio = [], xTime = [];  //, HL = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach(e=>{
      xTime.push(moment(e.utc).format('YYYY-MM-DD HH:mm:ss'));
      dispersionRatio.push(e.dispersionRatio);
    });
    const filterDispersionRatio = deviceTenMin.filter(e=>e.dispersionRatio);
    const confluenceTenMinGraphic = filterDispersionRatio.length===0  ? showNoData : hiddenNoData;
    const option = {
      graphic: confluenceTenMinGraphic,
      title: {
        text: '时序图',
        textStyle: {
          color: '#666',
          fontSize: 14,
        },
        left: 60
      },
      legend: {
        data:['离散率'],
        top: 24,
      },
      tooltip: {
        show: true,
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
          name: '电流(A)',
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
          name: '离散率',
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
          name: '离散率',
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
          yAxisIndex: 1,
          data: dispersionRatio,
        },
        // {
        //   name: '斜面辐射',
        //   type: 'line',
        //   lineStyle: {
        //     type: 'dashed',
        //   },
        //   label: {
        //     normal: {
        //       show: false
        //     }
        //   },
        //   yAxisIndex: 1,
        //   data: radiationLineData,
        // },
      ]
    };
    confluenceChart.setOption(option);
  }
  return (
    <div id="confluence_monitor_tenMin" style={{height:"335px"}}></div>
  );
}

export default ConfluenceTenMin;