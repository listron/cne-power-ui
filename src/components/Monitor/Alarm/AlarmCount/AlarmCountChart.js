import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

export const AllStationChart=({sequenceChartList})=>{
    const echartBox = document.getElementById('allStationChart');
    const lineColor = '#666';
    if (echartBox) {
        const inverterChart = echarts.init(echartBox);
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
        <div id="allStationChart" ></div>
      );
}

