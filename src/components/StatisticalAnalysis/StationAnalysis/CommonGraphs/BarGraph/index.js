import React from 'react';
import styles from './styles.scss';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
import { Gradient1, Gradient2 } from '../../../../../utils/darkConfig';
/*
  双柱单折线组件：
  参数:
  1  必填 -每一个图表的ID：graphId 不能重复
  2. 选填 -第一个y轴的name  yAxisName
  3. 选填 -判断颜色 以及tooltip 的提示框右侧的文字显示  xAxisName
  4. 选填 -判断是单柱 单折线 还是双柱单折线 dateType  month|day 双柱单折线 year 单柱 单折线
  5. 选填 -判断是否有title  title
*/

class BarGraph extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,

  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      prevDateType: '',
    };
  }

  componentDidMount() {
    this.drawCharts(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawCharts(nextProps);
    if (this.props.theme !== nextProps.theme) {
      this.drawCharts(nextProps, true);
    }
  }



  getColor = {
    light: {
      '发电量': ['#dfdfdf', '#199475', '#f9b600'],
      '辐射总量': ['#dfdfdf', '#a42b2c', '#f9b600'],
      '等效利用小时数': ['#dfdfdf', '#ceebe0', '#f9b600'],
      'PR': ['#dfdfdf', '#3e97d1', '#f9b600'],
      '损失电量': ['#dfdfdf', '#c7ceb2', '#f9b600'],
      '损失电量等效时': ['#dfdfdf', '#199475', '#f9b600'],
      '购网电量': ['#dfdfdf', '#199475', '#f9b600'],
      '上网电量': ['#dfdfdf', '#3e97d1', '#f9b600'],
    },
    dark: {
      '发电量': [Gradient1, Gradient2, '#f8b14e'],
      '辐射总量': [Gradient1, Gradient2, '#f8b14e'],
      '等效利用小时数': [Gradient1, Gradient2, '#f8b14e'],
      'PR': [Gradient1, Gradient2, '#f8b14e'],
      '损失电量': [Gradient1, Gradient2, '#f8b14e'],
      '损失电量等效时': [Gradient1, Gradient2, '#f8b14e'],
      '购网电量': [Gradient1, Gradient2, '#f8b14e'],
      '上网电量': [Gradient1, Gradient2, '#f8b14e'],
    },
  }

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    const replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--'); }
    const realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData;
  }


  getYearOption = (param) => {
    const { yAxisName, xAxisName, barGraphThatYear, barGraphmonth, barGraphRingRatio, title, hasData, theme = 'light' } = param;
    const color = this.getColor[theme][xAxisName] || ['#dfdfdf', '#3e97d1', '#f9b600'];
    const lineColor = '#f1f1f1';
    const fontColor = '#333';
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || ' ';
    return {
      graphic: confluenceTenMinGraphic,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
        textStyle: {
          color: fontColor,
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
              ${item.seriesName} :  ${item.value || '--'} 
               ${(item.seriesType === 'line' || xAxisName === 'PR') && '%' || ''}</div>`;
          });
          return (
            `<div class=${styles.tooltipBox}>
                  <div class=${styles.axisValue}><span>${params[0].name}</span><span>${xAxisName}</span></div>
                  <div class=${styles.tooltipContainer}> ${paramsItem}</div>
              </div>`
          );
        },
        padding: 10,
        textStyle: {
          fontSize: 12,
        },
      },
      legend: {
        top: 20,
        left: 'center',
        itemWidth: 8,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          data: barGraphmonth,
          axisPointer: { type: 'shadow' },
          axisLine: {
            lineStyle: {
              // color: lineColor,
            },
          },
          axisLabel: {
            // color: fontColor,
          },
        },
      ],
      color: color.slice(1),
      yAxis: [
        {
          type: 'value',
          name: yAxisName,
          // nameTextStyle: { color: fontColor },
          // axisLabel: { color: fontColor },
          axisLine: {
            show: false,
            lineStyle: {
              // color: lineColor,
            },
          },
          axisTick: { show: false },
          // splitLine: { lineStyle: { color: lineColor, type: 'dashed' } },
          splitLine: { lineStyle: { type: 'dashed' } },
          axisLabel: {
            // color: fontColor,
            formatter: xAxisName === 'PR' ? '{value} %' : '{value}',
          },
        },
        {
          type: 'value',
          name: '环比',
          nameTextStyle: {
            // color: fontColor,
          },
          axisLabel: {
            // color: fontColor,
            formatter: '{value} %',
          },
          axisLine: {
            show: false,
            lineStyle: {
              // color: lineColor,
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: xAxisName,
          type: 'bar',
          data: this.getDefaultData(barGraphThatYear),
          itemStyle: {
            barBorderRadius: 10,
          },
          barWidth: 10,
        },
        {
          name: '环比',
          type: 'line',
          yAxisIndex: 1,
          data: this.getDefaultData(barGraphRingRatio),
        },
      ],
    };
  }


  getMonthOption = (param) => {
    const { yAxisName, xAxisName, barGraphThatYear, barGraphLastYear, barGraphmonth, barGraphYearOnYear, lastYear, currentYear, title, hasData, theme = 'light' } = param;
    const color = this.getColor[theme][xAxisName] || ['#dfdfdf', '#3e97d1', '#f9b600'];
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || ' ';
    return {
      graphic: confluenceTenMinGraphic,
      color: color,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
              ${item.seriesName} :  ${item.value || '--'}  ${(item.seriesType === 'line' || xAxisName === 'PR') && '%' || ''}</div>`;
          });
          return (
            `<div class=${styles.tooltipBox}>
                  <div class=${styles.axisValue}><span>${params[0].name}</span><span>${xAxisName}</span></div>
                  <div class=${styles.tooltipContainer}> ${paramsItem}</div>
              </div>`
          );
        },
      },
      legend: {
        top: title ? 0 : 20,
        left: 'center',
        itemWidth: 8,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          data: barGraphmonth,
          axisPointer: {
            type: 'shadow',
          },
          axisLine: {
            show: true,
            lineStyle: {
              // color: lineColor,
            },
          },
          axisLabel: {
            // color: fontColor,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: yAxisName,
          nameTextStyle: {
            // color: fontColor,
          },
          splitNumber: 5,
          scale: true,
          axisLabel: {
            // color: fontColor,
          },
          axisLine: {
            show: false,
            lineStyle: {
              // color: lineColor,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: { type: 'dashed' },
          },
          axisLabel: {
            formatter: xAxisName === 'PR' ? '{value} %' : '{value}',
          },
        },
        {
          type: 'value',
          name: '同比',
          axisLabel: {
            formatter: '{value} %',
            // color: fontColor,
          },
          max: null,
          axisTick: { show: false },
          axisLine: {
            show: false,
            lineStyle: {
              // color: lineColor,
            },
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: lastYear,
          type: 'bar',
          data: this.getDefaultData(barGraphLastYear),
          itemStyle: { barBorderRadius: 3 },
          barWidth: 5,
        },
        {
          name: currentYear,
          type: 'bar',
          data: this.getDefaultData(barGraphThatYear),
          itemStyle: { barBorderRadius: 3 },
          barWidth: 5,
        },
        {
          name: '同比',
          type: 'line',
          yAxisIndex: 1,
          data: this.getDefaultData(barGraphYearOnYear),
        },
      ],
    };
  }

  drawCharts = (param, themeChange) => {
    const { graphId, dateType, theme } = param;
    const themeColor = theme === 'dark' ? 'darkTheme' : 'lightTheme';
    let targetChart = echarts.init(document.getElementById(graphId), themeColor);
    if (themeChange) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(graphId), themeColor);
    }
    if (dateType !== this.state.prevDateType) {
      targetChart.clear();
    }
    targetChart.resize();
    let targetOption = ' ';
    dateType === 'year' ? targetOption = this.getYearOption(param) : targetOption = this.getMonthOption(param);
    targetChart.setOption(targetOption, { notMerge: true });
    this.setState({ prevDateType: dateType });
  };

  render() {
    const { graphId, theme = 'light' } = this.props;
    return (
      <div id={graphId} className={`${styles.statisticGraph} ${styles[theme]}`}> </div>
    );
  }
}

export default (BarGraph);
