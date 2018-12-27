import React from "react";
//import styles from './styles.scss';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

/*
 graphId, yAxisName, xAxisName, dateType, title, data, currentYear, lastYear,hasData 
 */
class PlanCompleteRateAnalysisBar extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.drawChart(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps)
  }

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    let replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--') }
    let realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData
  }

  getName = (type, currentYear, lastYear) => { // 获取对应的name
    let name = '';
    switch (type) {
      case 'thatYearLostPower': name = currentYear + '年限电损失'; break;
      case 'lastyearLostPower': name = lastYear + '年限电损失'; break;
      case 'thatYearLostPowerRate': name = currentYear + '年限电率'; break;
      case 'lastyearLostPowerRate': name = lastYear + '年限电率'; break;
      case 'lostPowerRateYearOnYear': name = '限电率同比'; break;
      case 'limitPower': name = '限电损失'; break;
      case 'limitPowerRate': name = '限电率'; break;
      case 'ringRatio': name = '限电率环比'; break;
    }
    return name;
  }

  getColor = (type) => {
    let color = [];
    switch (type) {
      case 'year': color = ['#f9b600', '#3e97d1', '#f9b600']; break;
      case 'month': color = ['#dfdfdf', '#f9b600', '#999999', '#3e97d1', '#e08031']; break;
      case 'day': color = ['#dfdfdf', '#f9b600', '#999999', '#3e97d1', '#e08031']; break;
    }
    return color;
  }

  drawChart = (param) => {
    const { graphId, yAxisName, xAxisName, dateType, title, data, currentYear, lastYear, hasData } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    const color = this.getColor(dateType);
    let seriesData = [];
    const lineData = data.yData.lineData;
    const barData = data.yData.barData;
    const lineColor = '#f1f1f1';
    const fontColor = '#333';
    let targetOption = {};
    for (var bar in barData) {
      var json = {
        name: this.getName(bar, currentYear, lastYear),
        data: this.getDefaultData(barData[bar]),
        type: 'bar',
        barWidth: 13,
      };
      seriesData.push(json);
    }
    for (var line in lineData) {
      var json = {
        name: this.getName(line, currentYear, lastYear),
        data: this.getDefaultData(lineData[line]),
        type: 'line',
        yAxisIndex: 1,
      };
      seriesData.push(json);
    }
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    targetOption = {
      graphic: confluenceTenMinGraphic,
      color: color,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
        textStyle: {
          color: fontColor,
          fontSize: 14,
          fontWeight: 'normal',
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: fontColor
          },
          label: { color: fontColor }
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
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === 0 || params[index].value ? params[index].value : '--'}${params[index].seriesType === 'line' && '%' || ''}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${xAxisName} </span>
          </div>${paramsItem}`
        }
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
          data: data.xData,
          axisPointer: {
            type: 'shadow'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: lineColor,
            }
          },
          axisLabel: {
            color: fontColor,
          },
          axisTick: {
            show: false,
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yAxisName,
          nameTextStyle: {
            color: fontColor,
          },
          splitNumber: 5,
          scale: true,
          axisLabel: {
            color: fontColor,
          },
          axisLine: { show: false, lineStyle: { color: lineColor } },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: lineColor,
              type: 'dashed'
            }
          },
        },
        {
          type: 'value',
          name: dateType === "year" ? '限电率／环比' : '限电率／同比',
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
          axisLine: { show: false, lineStyle: { color: lineColor } },
          splitLine: {
            show: false,
            lineStyle: {
              color: lineColor,
              type: 'dashed'
            }
          },
        }
      ],
      series: seriesData
    };
    setTimeout(() => { targetChart.resize(); }, 1000)
    targetChart.setOption(targetOption, { notMerge: true })

  }
  render() {
    const { graphId, dateType } = this.props;
    return (
      <div id={graphId}> </div>
    )
  }
}
export default (PlanCompleteRateAnalysisBar)