import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import {showNoData, hiddenNoData} from '../../../../../constants/echartsNoData';

function ConfluenceTenMin({ deviceTenMin, loading }) {
  const echartBox = document.getElementById('confluence_monitor_tenMin');
  const lineColor = '#666';
  if(echartBox){
    const confluenceChart = echarts.init(echartBox);
    // if(loading){
    //   confluenceChart.showLoading();
    // }else{
    //   confluenceChart.hideLoading();
    // }
    const HLNames = ['HL001', 'HL002', 'HL003', 'HL004', 'HL005', 'HL006', 'HL007', 'HL008', 'HL009', 'HL010', 'HL011', 'HL012', 'HL013', 'HL014', 'HL015', 'HL016']
    
    const HLColors = ['#e08031','#f9b600','#fbe6e3','#999999','#ceebe0','#f8e71c','#50e3c2','#c7ceb2','#7ed321','#d0021b','#024d22','#bd10e0','#8b572a','#9013fe','#45a0b3','#000d34',];
    let dispersionRatio = [], xTime = [], HL = [];
    deviceTenMin.length > 0 && deviceTenMin.forEach((e,index)=>{
      xTime.push(moment(e.utc).format('YYYY-MM-DD HH:mm:ss'));
      dispersionRatio.push(e.dispersionRatio);
    });
    for(let i=0;i<16;i++){
      HL.push();
      HL[i] = deviceTenMin.length > 0 && deviceTenMin.map((e,index)=>{
        console.log(e);
        return e.hLArr[i];
        
      });
    }
    const HLNamesArr = HLNames.map((e,i)=>{
      return {
        name: e,
        nameTextStyle: {
          color: lineColor,
        },
        type: 'line',
        lineStyle: {
          type: 'solid',
          color: HLColors[i],
          width: 1,
        },
        label: {
          normal: {
            show: false
          }
        },
        itemStyle: {
          opacity: 0,
        },
        yAxisIndex: 0,
        data: HL[i],
      }
    });
  
  
    const filterDispersionRatio = deviceTenMin.filter(e=>e.dispersionRatio);
    const confluenceTenMinGraphic = filterDispersionRatio.length===0  ? showNoData : hiddenNoData;
    const option = {
      graphic: confluenceTenMinGraphic,
      title: {
        text: '时序图',
        textStyle: {
          color: lineColor,
          fontSize: 14,
        },
        left: 60
      },
      legend: {
        data:['离散率',...HLNames],
        top: 24,
        itemWidth: 20,
        itemHeight: 4, 
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          crossStyle:{
            color: '#dfdfdf',
            width: 1,
            type: 'dotted',
          }
        },
        position: function (point, params, dom, rect, size) {
          // 固定在顶部
          return [point[0], '10%'];
        },
        formatter: (param) => {
          const HLToolTips = HLNames.map((e,i)=>{
            return `<div style="padding-left: 5px;background:#fff; line-height: 20px;height:20px;" ><span style="display: inline-block; background:${HLColors[i]}; width:6px; height:6px; border-radius:100%;"></span> ${e}: ${param && param[i+1] && param[i+1].value || '--'}</div>`;
          });
          return `<div style="width: 128px; height: 380px;color: #666; line-height: 14px;font-size:12px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;line-height: 25px;height:25px;" >${param && param[0] && param[0].name || '--'}</div>
            <div style="padding-left: 5px;line-height: 20px;height:20px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #3e97d1; width:6px; height:6px; border-radius:100%;"></span> 离散率: ${param && param[0] && param[0].value || '--'}</div>
            ${HLToolTips.join('')}
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
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: lineColor,
        },
      },
      yAxis: [
        {
          name: '电流(A)',
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
          name: '离散率',
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
          name: '离散率',
          nameTextStyle: {
            color: lineColor,
          },
          type: 'line',
          lineStyle: {
            type: 'dotted',
            color: '#3e97d1',
            width: 1,
          },
          // areaStyle: {
          //   normal: {
          //     opacity: 0.2,
          //   }
          // },
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            opacity: 0,
          },
          yAxisIndex: 1,
          data: dispersionRatio,
        },
        ...HLNamesArr,
      ]
    };
    confluenceChart.setOption(option);
    confluenceChart.resize();
    
  }
  return (
    <div id="confluence_monitor_tenMin" style={{height:"335px",marginTop: '20px'}}></div>
  );
}

export default ConfluenceTenMin;