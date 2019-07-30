import React, { Component } from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import moment from 'moment';
import {showNoData, hiddenNoData} from '../../../../../constants/echartsNoData';

class InverterSeriesTenMin extends Component {
  static propTypes = {
    branchTenMinUnix: PropTypes.number,
    branchTenMin: PropTypes.array,
  }

  state = {
    HLColors: ['#e08031', '#f9b600', '#fbe6e3', '#999999', '#ceebe0', '#f8e71c', '#50e3c2', '#c7ceb2', '#7ed321', '#d0021b', '#024d22', '#bd10e0', '#8b572a', '#9013fe', '#45a0b3', '#000d34'],
  }

  componentDidMount(){
    this.renderChart();
  }

  componentDidUpdate(prevProps){
    const { branchTenMinUnix } = this.props;
    const prevTenMinUnix = prevProps.branchTenMinUnix;
    if (branchTenMinUnix !== prevTenMinUnix) { // 获得数据
      this.renderChart();
    }
  }

  renderChart = () => {
    const { branchTenMin } = this.props;
    const { HLColors } = this.state;
    const echartBox = document.getElementById('seriesInverter_monitor_tenMin');
    const seriesInverterChart = echarts.init(echartBox);
    const { index = [], time = [], rate = []} = branchTenMin;
    const timeFormatArr = time.map(e => moment(e).format('YYYY-MM-DD HH:mm:ss'));
    const hlArr = index.filter(e => e > 0 ); // 取出正确的组串标识对应索引。
    const lineColor = '#666';
    const hlSeries = hlArr.map(e => {
      return {
        name: `HL#${`${e}`.padStart(2, '0')}`,
        nameTextStyle: {
          color: lineColor,
        },
        type: 'line',
        lineStyle: {
          type: 'solid',
          width: 1,
        },
        label: {
          normal: {
            show: false,
          },
        },
        itemStyle: {
          opacity: 0,
        },
        yAxisIndex: 0,
        data: branchTenMin[e],
      };
    });
    const seriesInverterGraphic = time.length===0 ? showNoData : hiddenNoData;
    const option = {
      graphic: seriesInverterGraphic,
      color: ['#3e97d1', ...HLColors],
      legend: {
        data: ['离散率', ...hlArr.map(e => `HL#${`${e}`.padStart(2, '0')}`)],
        top: 24,
        itemWidth: 20,
        itemHeight: 4,
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          crossStyle: {
            color: '#dfdfdf',
            width: 1,
            type: 'dotted',
          },
        },
        position: function (point, params, dom, rect, size) {
          // 固定在顶部
          return [point[0], '10%'];
        },
        formatter: (param) => {
          const HLToolTips = param.map((e, i) => {
            const { seriesName, value } = e;
            let hlColor = '';
            hlArr.forEach((hlName, hlIndex) => {
              if(`HL#${`${e}`.padStart(2, '0')}` === seriesName){
                hlColor = HLColors[hlIndex];
              }
            });
            return `<div style="padding-left: 5px;background:#fff; line-height: 20px;height:20px;" ><span style="display: inline-block; background:${hlColor}; width:6px; height:6px; border-radius:100%;"></span> ${seriesName}: ${(value || value === 0)? value: '--'}</div>`;
          });
          return `<div style="width: 128px; height: ${15+param.length*20}px;color: #666; line-height: 14px;font-size:12px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;line-height: 25px;height:25px;" >${param && param[0] && param[0].name || '--'}</div>
            ${HLToolTips.join('')}
          </div>`;
        },
        extraCssText: 'background: rgba(0,0,0,0);',
      },
      grid: {
        top: 95,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: timeFormatArr,
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
          splitLine: {
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
          axisTick: {
            show: false,
          },
        }, {
          name: '离散率(%)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine: {
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
          axisTick: {
            show: false,
          },
        },
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
            width: 1,
          },
          label: {
            normal: {
              show: false,
            },
          },
          itemStyle: {
            opacity: 0,
          },
          yAxisIndex: 1,
          data: rate,
        },
        ...hlSeries,
      ],
    };
    time.length > 0 && (option.dataZoom = [
      {
        show: true,
        zoomLock: true,
        start: 90,
        end: 100,
      }, {
        type: 'inside',
        start: 90,
        zoomLock: true,
        end: 100,
      },
    ]);
    seriesInverterChart.setOption(option);
    seriesInverterChart.resize();
  }

  render(){
    return (
      <div id="seriesInverter_monitor_tenMin" style={{height: '335px', marginTop: '20px'}} />
    );
  }
}

export default InverterSeriesTenMin;
