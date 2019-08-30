import React from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { dataFormats } from '../../../../utils/utilFunc';
import { Gradient1, Gradient2, chartsLoading, themeConfig, chartsNodata } from '../../../../utils/darkConfig';
/* 
  1 必填   graphId 图表的id名
  2 必填   title  根据title 判断color  ‘发电效率 计划完成率
  3 必填   data  
  data:{
    xData:[];
    yData:{
      xxx:[],  根据后台的数据判断name  如 hours
      xxx:[]
    }
  }
*/

class PerformanceCharts extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
    title: PropTypes.string,
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

  getYaxisName = (title) => {
    let result = ' ';
    switch (title) {
      case '转换效率':
        result = '转换效率(%)';
        break;
      case '等效小时数':
        result = '等效小时数(h)';
        break;
      case '可利用率':
        result = '可利用率(%)';
        break;
      case '损失电量':
        result = '损失电量(kWh)';
        break;
      case '设备故障次数':
        result = '故障次数(次)';
        break;
      case '设备故障时长':
        result = '故障时长(h)';
        break;
      default:
        result = ' ';
    }
    return result;
  };



  getColor = {
    'light': {
      '转换效率': ['#c7ceb2', '#ff9697', '#3e97d1', '#ff9697'],
      '等效小时数': ['#199475', '#ff9697', '#ff9697', '#3e97d1'],
      '可利用率': ['#c7ceb2', '#ff9697', '#f9b600', '#3e97d1'],
      '损失电量': ['#c7ceb2', '#ff9697', '#f9b600', '#3e97d1'],
      '设备故障次数': ['#f9b600', '#ff9697', '#ff9697', '#3e97d1'],
      '设备故障时长': ['#3e97d1', '#ff9697', '#ff9697', '#3e97d1'],
    },
    dark: {
      '转换效率': [Gradient1, Gradient2, Gradient1, Gradient2],
      '等效小时数': [Gradient1, Gradient2, Gradient2, '#3e97d1'],
      '可利用率': ['#f8e71c', '#fd6e8f', '#f9b600', '#3e97d1'],
      '损失电量': ['#f8e71c', '#fd6e8f', '#f9b600', '#3e97d1'],
      '设备故障次数': [Gradient1, Gradient2, '#ff9697', '#3e97d1'],
      '设备故障时长': [Gradient1, Gradient2, '#ff9697', '#3e97d1'],
    },
  }

  getName = (type) => { // 获取对应的name
    let name = '';
    switch (type) {
      case 'conversionRate': name = '转换效率'; break;
      case 'conversionAvgRate': name = '平均转换效率'; break;
      case 'contrastConversionAvgRate': name = '对比周期平均转换效率'; break;
      case 'contrastConversionRate': name = '对比周期转换效率'; break;
      case 'contrastHoursData': name = '对比周期等效小时数'; break;
      case 'contrastFaultNumData': name = '对比周期故障次数'; break;
      case 'contrastFaultTimeData': name = '对比周期故障时长'; break;
      case 'contrastAvailability': name = '对比周期可利用率'; break;
      case 'contrastLossPower': name = '对比周期损失电量'; break;
      case 'hour': name = '等效小时数'; break;
      case 'faultNum': name = '故障次数'; break;
      case 'faultTime': name = '故障时长'; break;
      case 'availability': name = '可利用率'; break;
      case 'lostPower': name = '损失电量'; break;
    }
    return name;
  }

  getUnit = (title) => {
    let result = '';
    switch (title) {
      case '转换效率':
        result = '%';
        break;
      case '等效小时数':
        result = 'h';
        break;
      case '可利用率':
        result = '%';
        break;
      case '损失电量':
        result = 'kWh';
        break;
      case '设备故障次数':
        result = '次';
        break;
      case '设备故障时长':
        result = 'h';
        break;
      default:
        result = '';
    }
    return result;
  }

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    const replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--'); }
    const realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData;
  }

  drawChart = (params) => {
    const { graphId, title, data, hasData, hasSlider, deviceNames, loading, theme } = params;
    let targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetChart) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const seriesData = [];
    const lineData = data && data.yData.lineData;
    const barData = data && data.yData.barData;
    const unit = this.getUnit(title);
    for (var bar in barData) {
      seriesData.push({
        name: this.getName(bar),
        data: this.getDefaultData(barData[bar]),
        type: 'bar',
        itemStyle: {
          barBorderRadius: 3,
        },
        barWidth: 5,
      });
    }
    for (var line in lineData) {
      seriesData.push({
        name: this.getName(line),
        data: this.getDefaultData(lineData[line]),
        type: 'line',
      });
    }
    chartsLoading(targetChart, loading, theme);
    const graphic = chartsNodata(hasData, theme);
    const targetMonthOption = {
      graphic: graphic,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: function (params) {
          let paramsItem = '';
          params.map((item, index) => {
            paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName} :${dataFormats(item.value, '--', 2, true)}${unit}
            </div>`;
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span></div>
           ${paramsItem}`;
        },
      },
      title: {
        text: title,
        left: '23',
        top: 'top',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      color: this.getColor[theme][title],
      grid: {
        right: '5%',
        left: '5%',
        bottom: hasSlider ? 120 : 60,
      },
      legend: {
        left: 'center',
        itemWidth: 8,
        itemHeight: 5,
      },
      dataZoom:
        [{
          show: hasSlider,
          type: 'slider',
          realtime: true,
          filterMode: 'filter',
          startValue: 0,
          endValue: hasSlider ? 19 : 100,
          bottom: 40,
          handleSize: '80%',
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          // handleIcon:'none',
          height: '20px',
          zoomLock: true,
        },
        ],
      xAxis: {
        type: 'category',
        data: data && data.xData,
        axisPointer: {
          type: 'shadow',
        },
        axisLabel: {
          rotate: -30,
          formatter: (value) => {
            const special = deviceNames.includes(value);
            const hasChinese = /[\u4e00-\u9fa5]+/.test(value); // 展示文字是否有汉字
            const maxText = hasChinese ? 6 : 10;// 中文最多展示4字, 英文12,超出展示...
            let showText = value;
            if (value.length > maxText) {
              showText = `${showText.substring(0, maxText)}...`;
            }
            if (special) {
              return '{special|' + showText + '}';
            }
            return '{common|' + showText + '}';

          },
          rich: {
            special: {
              height: 28,
              padding: [0, 10, 0, 10],
              align: 'center',
              color: 'red',
              backgroundColor: '#fbe6e3',
            },
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: this.getYaxisName(title),
          position: 'left',
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
      ],
      series: seriesData || [],
    };
    targetChart.setOption(targetMonthOption, 'notMerge');
    targetChart.resize();
  }

  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId}></div>
    );
  }
}

export default (PerformanceCharts);
