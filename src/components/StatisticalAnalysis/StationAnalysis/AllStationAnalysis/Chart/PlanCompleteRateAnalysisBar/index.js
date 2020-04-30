import React from 'react';
//import styles from './styles.scss';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData';
class PlanCompleteRateAnalysisBar extends React.Component {
  static propTypes = {
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
  };
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawCharts(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawCharts(nextProps);
  }

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    const replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--'); }
    const realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData;
  }

  drawCharts = (param) => {
    const { yAxisName, title, xAxisData, planPowerData, actualPowerData, planRateData, hasData } = param;
    const targetChart = echarts.init(this.chart);
    let targetOption = {};
    targetChart.resize();
    const color = ['#d4d4d4', '#f9b600', '#3e97d1'];
    const lineColor = '#f1f1f1';
    const fontColor = '#333';
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || ' ';
    targetOption = {
      graphic: confluenceTenMinGraphic,
      color: color,
      title: {
        text: title,
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
          crossStyle: {
            color: fontColor,
          },
          label: { color: fontColor },
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
            paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName} :${item.value === 0 || item.value ? item.value : '--'}${item.seriesType === 'line' && '%' || ''}</div>`;
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span></div>${paramsItem}`;
        },
      },
      legend: {
        top: 20,
        left: 'center',
        // icon: 'circle',
        itemWidth: 8,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: lineColor,
            },
          },
          axisLabel: {
            color: fontColor,
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
            color: fontColor,
          },
          // min: 0,
          splitNumber: 5,
          scale: true,
          axisLabel: {
            color: fontColor,
          },
          axisLine: {
            show: false,
            lineStyle: { color: lineColor },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            // show:false,
            lineStyle: {
              color: fontColor,
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          name: '完成率',
          nameTextStyle: {
            color: fontColor,
          },
          axisLabel: {
            formatter: '{value} %',
            color: fontColor,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: { color: lineColor },
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: fontColor,
              type: 'dashed',
            },
          },
        },
      ],
      series: [
        {
          name: '计划完成发电量',
          type: 'bar',
          data: this.getDefaultData(planPowerData),
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth: 5,
        },
        {
          name: '实际发电量',
          type: 'bar',
          data: this.getDefaultData(actualPowerData),
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth: 5,
        },
        {
          name: '计划完成率',
          type: 'line',
          yAxisIndex: 1,
          data: this.getDefaultData(planRateData),
        },
      ],
    };
    targetChart.setOption(targetOption, { notMerge: true });
  };
  render() {
    return (
      <div ref={ref => (this.chart = ref)}> </div>

    );
  }
}
export default (PlanCompleteRateAnalysisBar);
