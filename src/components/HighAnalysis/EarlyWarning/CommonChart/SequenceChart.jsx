import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';



function SequenceChart({ sequenceChartList, currentDeviceName }) {
  const echartBox = document.getElementById('sequenceChart');
  const lineColor = '#666';

  if (echartBox) {
    const inverterChart = echarts.init(echartBox);
    const series = [];
    const time = [];
    sequenceChartList.forEach((item, index) => {
      const data = [];
      item.pointData.forEach((e) => {
        time.push(moment(e.time).format('MM-DD hh:mm'));
        data.push(e.value)
      })
      series.push({
        name: item.pointName,
        type: 'line',
        data: data,
        lineStyle: {
          width: 1,
          // color: item.pointName === currentDeviceName ? '#a42b2c' : '#9b9b9b'
        }
      })
    })
    const inverterTenMinGraphic = series.map(e => e.data).length === 0 || series.map(e => e.data).some(e => e.length > 0) ? hiddenNoData:showNoData ;
    const option = {
      graphic: inverterTenMinGraphic,
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
        top: 90,
        bottom: 100,
        left: '13%',
        right: '13%',
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
        //     return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === '0' || params[index].value || '--'}</div>`
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
          formatter: function (params) {
            return params.slice(5, params.length)
          },
          // interval: labelInterval,
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
      series: series
    };
    inverterChart.setOption(option);
    inverterChart.resize();
  }
  return (
    <div id="sequenceChart" > </div>
  );
}
export { SequenceChart }

