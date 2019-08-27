import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import { dataFormat } from '../../../../utils/utilFunc';
import { themeConfig, chartsNodata } from '../../../../utils/darkConfig';



function SequenceChart({ idName, title, sequenceChartList, currentDeviceName, theme = 'light' }) {
  const echartBox = document.getElementById(idName);
  if (echartBox) {
    let inverterChart = echarts.init(echartBox, themeConfig[theme]);
    if (inverterChart) {
      inverterChart.dispose();
      inverterChart = echarts.init(echartBox, themeConfig[theme]);
    }
    const series = [];
    const time = [];

    sequenceChartList.length > 0 && sequenceChartList[0].pointData.forEach((e) => {
      time.push(moment(e.time).format('MM-DD HH:mm'));
    });
    sequenceChartList.forEach((item) => {
      const data = [];
      item.pointData.forEach((e) => {
        data.push(dataFormat(e.value, '--', 2));
      });
      series.push({
        name: item.pointName,
        type: 'line',
        data: data,
        lineStyle: {
          width: item.pointName === currentDeviceName ? 2 : 1,
        },
        itemStyle: {
          color: item.pointName === currentDeviceName ? '#a42b2c' : '#9b9b9b',
        },
        z: item.pointName === currentDeviceName ? 2 : 1,
      });
    });
    const graphic = chartsNodata(sequenceChartList.length > 0, theme);
    const option = {
      graphic: graphic,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
      },
      legend: {
        top: 24,
        itemWidth: 24,
        itemHeight: 6,
        textStyle: {
          fontSize: 12,
        },
      },
      grid: {
        top: 120,
        bottom: 100,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        confine: true,
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: {
        type: 'category',
        data: time,
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
        },
        axisLabel: {
          formatter: (value) => {
            return value && value.split(' ')[0] + '\n' + value.split(' ')[1];
          },
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
      },
      yAxis: {
        name: '电流(A)',
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: series,
    };
    inverterChart.setOption(option);
    inverterChart.resize();
  }
  return (
    <div id={idName} />
  );
}
export { SequenceChart };

