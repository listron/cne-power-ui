import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

function InverterTenMin({ sequenceChart }) {
  const echartBox = document.getElementById('inverter_monitor_tenMin');
  const lineColor = '#666';
  if (echartBox) {
    const inverterChart = echarts.init(echartBox);
    let powerLineData = [], radiationLineData = [], radiationLineData1 = [], xTime = [];
    sequenceChart.length > 0 && sequenceChart.forEach(e => {
      xTime.push(moment(moment.utc(e.utc).toDate()).local().format('MM-DD HH:mm'));
      powerLineData.push(e.stationPower);
      radiationLineData.push(e.windSpeed);
      radiationLineData1.push('--');
    });

    const filterStationPower = sequenceChart.filter(e => e.stationPower);
    const filterWindSpeed = sequenceChart.filter(e => e.windSpeed);
    const inverterTenMinGraphic = (filterStationPower.length === 0 && filterWindSpeed.length === 0) ? showNoData : hiddenNoData;
    let color = ['#c57576', '#199475'];
    let labelInterval = 47 // 10min数据如果不缺失，此时为6(每小时6条)*8(8小时) - 1(除去间隔本身) = 47 个展示一个
    const totalLength = sequenceChart.length;
    if (totalLength < 144 && totalLength > 0) { //假如返回数据不全
      labelInterval = parseInt(totalLength / 3) - 1;
    }
    // console.log('labelInterval',labelInterval)
    const option = {
      graphic: inverterTenMinGraphic,
      title: {
        text: '时序图',
        textStyle: {
          color: lineColor,
          fontSize: 14,
        },
        left: 30,
        top: 23,
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
        top: 90,
        bottom: 40,
        left: '13%',
        right: '13%',
      },
      calculable: true,
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
        formatter: function (params) {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName} :${item.value === '0' || item.value || '--'}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:150px;overflow:hidden;"> <span style="float: left">${params[0].name} </span>
            </div>${paramsItem}`
        },
      },
      xAxis: {
        type: 'category',
        splitNumber: 4,
        boundaryGap: false,
        minInterval: labelInterval,
        data: xTime,
        axisLine: {
          lineStyle: {
            color: '#d4d4d4',
          },
        },
        axisLabel: {
          color: lineColor,
          interval: labelInterval,
        },
        axisTick: {
          show: false,
        },
        axisPointer: {
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
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4',
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
          name: '风速(m/s)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4',
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
          itemStyle: {
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
          data: filterStationPower.length > 0 ? powerLineData : radiationLineData1,
        },
        {
          name: '风速',
          type: 'line',
          lineStyle: {
            type: 'dotted',
            color: '#199475',
            width: 1,
          },
          itemStyle: {
            color: "#199475",
            opacity: 0,
          },
          label: {
            normal: {
              show: false
            }
          },
          yAxisIndex: 1,
          data: filterWindSpeed.length > 0 ? radiationLineData : radiationLineData1,
        },
      ]
    };
    inverterChart.setOption(option);
    inverterChart.resize();
  }
  return (
    <div id="inverter_monitor_tenMin" ></div>
  );
}

function SactterChart({ theory, actual }) {
  const echartBox = document.getElementById('wind_monitor');
  const lineColor = '#666';
  if (echartBox) {
    const inverterChart = echarts.init(echartBox);
    let actualData = [], theoryData = [], xData = [], actualData1 = [], theoryData1 = [];
    theory.length > 0 && theory.forEach(e => {
      theoryData.push([e.windSpeed, e.stationPower])
      theoryData1.push('--')
    });
    actual.sort((a, b) => { return a.windSpeed - b.windSpeed })
    actual.length > 0 && actual.forEach(e => {
      actualData.push([e.windSpeed, e.stationPower])
      actualData1.push('--')
    });
    const inverterTenMinGraphic = (actualData.length === 0 && theoryData.length === 0) ? showNoData : hiddenNoData;
    let color = ['#c57576', '#199475'];
    const option = {
      graphic: inverterTenMinGraphic,
      title: {
        text: '24h散点图',
        textStyle: {
          color: lineColor,
          fontSize: 14,
        },
        left: 30,
        top: 23,
      },
      color: color,
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
        bottom: 40,
        right: '20%',
        left: '13%',
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
        formatter: function (params) {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${params[index].seriesName === '历史平均功率' ? '#199475' : '#c57576'};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === '0' || params[index].value[1] || '--'}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:150px;overflow:hidden;"> <span style="float: left">风速：${params[0].axisValue} </span>
            </div>${paramsItem}`
        },
      },
      axisPointer: {
        type: 'line',
        snap: true,
      },
      xAxis: {
        type: 'value',
        // data: xData,
        name: '风速(m/s)',
        nameTextStyle: {
          color: lineColor,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          // onZero: false,
          lineStyle: {
            color: '#d4d4d4',
          },
        },
        axisLabel: {
          color: lineColor,
        },
        axisPointer: {
          label: {
            show: false,
          }
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '功率(kW)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4',
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
          name: '有功功率',
          type: 'scatter',
          label: {
            normal: {
              show: false
            }
          },
          symbolSize: 5,
          data: actualData,
        },
        {
          name: '历史平均功率',
          type: 'line',
          lineStyle: {
            color: '#199475',
            width: 1,
          },
          smooth: true,
          itemStyle: {
            color: "#199475",
            opacity: 0,
          },
          label: {
            normal: {
              show: false
            }
          },
          data: theoryData,
        },
      ]
    };
    inverterChart.setOption(option);
    inverterChart.resize();
  }
  return (
    <div id="wind_monitor" ></div>
  );
}


function SequenceChart({ sequenceChartList }) {
  const echartBox = document.getElementById('sequenceChart');
  const lineColor = '#666';
  if (echartBox) {
    const inverterChart = echarts.init(echartBox);
    let pitchAngle1Data = [], pitchAngle2Data = [], pitchAngle3Data = [], speedData = [], xTime = [], replaceData = [];
    sequenceChartList.length > 0 && sequenceChartList.forEach(e => {
      xTime.push(moment(moment.utc(e.utc).toDate()).local().format('YYYY-MM-DD HH:mm'));
      pitchAngle1Data.push(e.pitchAngle1 && parseInt(e.pitchAngle1).toFixed(2) || '--');
      pitchAngle2Data.push(e.pitchAngle2 && parseInt(e.pitchAngle2).toFixed(2) || '--');
      pitchAngle3Data.push(e.pitchAngle2 && parseInt(e.pitchAngle3).toFixed(2) || '--');
      speedData.push(e.speed);
      replaceData.push('--')
    });
    let labelInterval = 47 // 10min数据如果不缺失，此时为6(每小时6条)*8(8小时) - 1(除去间隔本身) = 47 个展示一个
    const totalLength = SequenceChart.length;
    if (totalLength < 144 && totalLength > 0) { //假如返回数据不全
      labelInterval = parseInt(totalLength / 3) - 1;
    }
    const filterpitchAngle1 = sequenceChartList.filter(e => e.pitchAngle1);
    const filterpitchAngle2 = sequenceChartList.filter(e => e.pitchAngle2);
    const filterpitchAngle3 = sequenceChartList.filter(e => e.pitchAngle3);
    const filterWindSpeed = sequenceChartList.filter(e => e.speed);
    const inverterTenMinGraphic = (filterpitchAngle1.length === 0 && filterWindSpeed.length === 0
      && filterpitchAngle2.length === 0 && filterpitchAngle3.length === 0) ? showNoData : hiddenNoData;
    let color = ['#a42b2c', '#e08031', '#3e97d1', '#199475'];
    const option = {
      graphic: inverterTenMinGraphic,
      title: {
        text: '曲线图',
        textStyle: {
          color: lineColor,
          fontSize: 14,
        },
        left: 30,
        top: 23,
      },
      color: color,

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
        bottom: 40,
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
        formatter: function (params) {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName} :${item.value === '0' || item.value || '--'}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:150px;overflow:hidden;"> <span style="float: left">${params[0].name} </span>
            </div>${paramsItem}`
        },
      },
      xAxis: {
        type: 'category',
        data: xTime,
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#d4d4d4',
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
      yAxis: [
        {
          name: '桨距角(°)',
          nameTextStyle: {
            color: lineColor,
          },
          splitNumber: 4,
          boundaryGap: false,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4',
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
          name: '转速(RPM)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4',
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
          name: '桨距角1',
          type: 'line',
          label: {
            normal: {
              show: false
            }
          },
          yAxisIndex: 0,
          data: filterpitchAngle1.length > 0 ? pitchAngle1Data : replaceData,
        },
        {
          name: '桨距角2',
          type: 'line',
          label: {
            normal: {
              show: false
            }
          },
          yAxisIndex: 0,
          data: filterpitchAngle2.length > 0 ? pitchAngle2Data : replaceData,
        },
        {
          name: '桨距角3',
          type: 'line',
          label: {
            normal: {
              show: false
            }
          },
          yAxisIndex: 0,
          data: filterpitchAngle3.length > 0 ? pitchAngle3Data : replaceData,
        },
        {
          name: '转速',
          type: 'line',
          lineStyle: {
            type: 'dotted',
            // color: '#199475',
            width: 1,
          },
          label: {
            normal: {
              show: false
            }
          },
          yAxisIndex: 1,
          data: filterWindSpeed.length > 0 ? speedData : replaceData,
        },
      ]
    };
    inverterChart.setOption(option);
    inverterChart.resize();
  }
  return (
    <div id="sequenceChart" ></div>
  );
}
export { InverterTenMin, SactterChart, SequenceChart }

