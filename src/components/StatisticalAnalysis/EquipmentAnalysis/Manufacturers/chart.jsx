import React from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from './manufacturers.scss';
import { dataFormats, getDefaultData } from '../../../../utils/utilFunc';
import { gradient, Gradient1, Gradient2, chartsLoading, themeConfig, chartsNodata } from '../../../../utils/darkConfig';
import { runSaga } from 'redux-saga';

/* 
  2 必填   data
    xData=[];
    yData=[]  
  3 必填 type  图表的id名
    efficiency   设备转换效率
    duration  设备故障时长
    frequency  设备故障次数
    capacity   装机容量
*/

class Charts extends React.Component {
  static propTypes = {
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  getColor = {
    light: {
      'conversioneff': '#c7ceb2',
      'faultHours': '#f9b600',
      'faultNum': '#3e97d1',
      'deviceCapacity': '#199475',
    },
    dark: {
      'conversioneff': gradient('#b4ec51', '#429321'),
      'faultHours': Gradient2,
      'faultNum': Gradient1,
      'deviceCapacity': gradient('#b4ec51', '#429321'),
    },
  }

  getParmas = {
    'conversioneff': { yaxisName: '转换效率(%)', legend: '设备转换效率', unit: '%' },
    'faultHours': { yaxisName: '故障时长(h/台)', legend: '设备故障时长', unit: 'h/台' },
    'faultNum': { yaxisName: '故障次数(次/台)', legend: '设备故障次数', unit: '次/台' },
    'deviceCapacity': { yaxisName: '装机容量(MW)', legend: '装机容量', unit: 'MW' },
  }


  getTitle = (type, selectOption) => {
    let result = ' ';
    switch (type) {
      case 'conversioneff':
        result = selectOption === 'manufacturer' ? '各厂家设备转换效率对比图' : '各型号设备转换效率对比图';
        break;
      case 'faultHours':
        result = selectOption === 'manufacturer' ? '各厂家设备故障时长对比图' : '各型号设备故障时长对比图';
        break;
      case 'faultNum':
        result = selectOption === 'manufacturer' ? '各厂家设备故障次数对比图' : '各型号设备故障次数对比图';
        break;
      case 'deviceCapacity':
        result = selectOption === 'manufacturer' ? '各厂家装机容量对比图' : '各型号装机容量对比图';
        break;
      default:
        result = '';
    }
    return result;
  };

  drawChart = (params) => {
    const { data, type, selectOption, loading, theme } = params;
    const manufacturerData = data.map(e => e.manufacturer);
    const deviceModeIdsData = data.map(e => e.deviceModeName);
    const xData = selectOption === 'manufacturer' ? manufacturerData : deviceModeIdsData;
    const yData = data.map(e => e[type]);
    let targetChart = echarts.init(document.getElementById(type), themeConfig[theme]);
    if (targetChart) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(type), themeConfig[theme]);
    }
    chartsLoading(targetChart, loading, theme);
    const hasSlider = yData.length > 8;
    const unit = this.getParmas[type]['unit'];
    const hasData = yData.some(e => e || e === 0);
    const graphic = chartsNodata(hasData, theme);
    const targetMonthOption = {
      graphic: graphic,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const pointLength = (type === 'faultHours' || type === 'faultNum') ? 0 : 2;
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${dataFormats(item.value, '--', pointLength, true)} ${unit} </div>`;
          });
          return (
            `<div class=${styles.tooltipBox}>
               <div class=${styles.axisValue}>${params[0].name}</div>
               <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
          );
        },
        axisPointer: {
          type: 'line',
          snap: true,
          lineStyle: {
            width: 38,
            color: 'rgba(0,0,0,0.3)',
          },
        },
      },

      title: {
        text: this.getTitle(type, selectOption),
        left: '23',
        top: 'top',
        textStyle: {
          fontSize: 12,
        },
      },
      color: this.getColor[theme][type],
      grid: {
        bottom: hasSlider ? 140 : 80,
      },
      legend: {
        left: 'center',
        itemWidth: 5,
        itemHeight: 5,
        icon: 'circle',
      },
      dataZoom: [{
        show: hasSlider,
        type: 'slider',
        realtime: true,
        filterMode: 'filter',
        startValue: 0,
        endValue: hasSlider ? 19 : 100,
        bottom: 40,
        handleSize: '80%',
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        height: '20px',
        zoomLock: true,
      }],
      xAxis: {
        type: 'category',
        data: xData,

        axisLabel: {
          rotate: -45,
          height: 10,
          width: 10,
          formatter: (value, index) => {
            const hasChinese = /[\u4e00-\u9fa5]+/.test(value); // 展示文字是否有汉字
            const maxText = hasChinese ? 6 : 10;// 中文最多展示4字, 英文12,超出展示...
            let showText = value;
            if (value && value.length > maxText) {
              showText = `${showText.substring(0, maxText)}...`;
            }
            return showText;
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        name: this.getParmas[type]['yaxisName'],
        axisLabel: { formatter: '{value}' },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: {
        name: this.getParmas[type]['legend'],
        type: 'bar',
        data: getDefaultData(yData),
        itemStyle: { barBorderRadius: 3 },
        barWidth: 5,
      },
    };
    targetChart.setOption(targetMonthOption, { notMerge: true });
    targetChart.resize();
  }

  render() {
    const { type } = this.props;
    return (
      <div id={type} />
    );
  }
}

export default (Charts);
