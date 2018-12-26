import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';



function SequenceChart({ idName, title, sequenceChartList, currentDeviceName, }) {
  const echartBox = document.getElementById(idName);
  const lineColor = '#666';

  if (echartBox) {
    const inverterChart = echarts.init(echartBox);
    const series = [];
    const time = [];

    sequenceChartList.length > 0 && sequenceChartList[0].pointData.forEach((e) => {
      time.push(moment(e.time).format('MM-DD HH:mm'));
    })
    sequenceChartList.forEach((item, index) => {
      const data = [];
      item.pointData.forEach((e) => {
        data.push(e.value)
      })
      series.push({
        name: item.pointName,
        type: 'line',
        data: data,
        lineStyle: {
          width: item.pointName === currentDeviceName ? 2 : 1,
        },
        itemStyle: {
          color: item.pointName === currentDeviceName ? '#a42b2c' : '#9b9b9b'
        },
        z: item.pointName === currentDeviceName ? 2 : 1,
      })
    })
    const inverterTenMinGraphic = sequenceChartList.length > 0 ? hiddenNoData : showNoData;
    const option = {
      graphic: inverterTenMinGraphic,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        }
      },
      legend: {
        top: 24,
        itemWidth: 24,
        itemHeight: 6,
        textStyle: {
          color: lineColor,
          fontSize: 12,
        }
      },
      grid: {
        // containLabel: true,
        top: 120,
        bottom: 100,
        // left: '13%',
        // right: '13%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        backgroundColor: '#fff',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: lineColor,
          }
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        // formatter: function (params) {
        //   let paramsItem = '';
        //   params.forEach((item, index) => {
        //     return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === '0' || params[index].value.toFixed(2) || '--'}</div>`
        //   });
        //   return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:150px;overflow:hidden;"> <span style="float: left">${params[0].name} </span>
        //     </div>${paramsItem}`
        // },
      },
      xAxis: {
        type: 'category',
        data: time,
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: lineColor,
          formatter: (value) => {
            return value.split(' ')[0] + "\n" + value.split(' ')[1]
          }
        },
        axisPointer: {
          label: {
            show: false,
          }
        },
      },
      yAxis: {
        name: '电流(A)',
        nameTextStyle: {
          color: lineColor,
        },
        boundaryGap: false,
        splitLine: {
          show: false
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
      // dataZoom: [{
      //   show: true,
      //   type: 'slider',
      //   realtime: true,
      //   filterMode: 'filter',
      //   startValue: 0,
      //   // endValue: 30,
      //   bottom: 30,
      //   handleSize: '80%',
      //   handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      //   backgroundColor: 'rgba(213,219,228,.8)',
      //   height: '20px',
      //   handleStyle: {
      //     width: '16px',
      //     height: '16px',
      //     borderRadius: '100%',
      //     color: '#fff',
      //     shadowBlur: 3,
      //     shadowColor: 'rgba(0, 0, 0, 0.6)',
      //     shadowOffsetX: 2,
      //     shadowOffsetY: 2
      //   }
      // }],
      series: series
    };
    inverterChart.setOption(option);
    inverterChart.resize();
  }
  return (
    <div id={idName}> </div>
  );
}
export { SequenceChart }

