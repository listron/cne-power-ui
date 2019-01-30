import React from "react";
import echarts from "echarts";
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
class UsageRate extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    let replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--') }
    let realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData
  }

  drawChart = param => {
    const { graphId, yAxisName, xAxisName, xData, yData, title, hasData } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    let color = ["#a42b2c", "#d48265", "#91c7af", "#749f83", "#ca8622", "#bda29a", "#546570", "#6e7074", "#9b9b9b", "#ceebe0", "#199475", '#fff'];
    const lineColor = '#f1f1f1';
    const fontColor = '#333';
    let seriesData = [];
    yData.forEach(item => {
      seriesData.push({
        name: item.name,
        data: this.getDefaultData(item.data),
        type: 'bar',
        stack: "总量",
        barWidth: 10,
      });
    })
    seriesData.length > 0 && seriesData.push({
      name: '瞬时辐射区间（w/㎡）',
      type: 'bar',
      stack: "总量",
    })
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    const targetMonthOption = {
      graphic: confluenceTenMinGraphic,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
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
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${xAxisName} </span>
            </div>${paramsItem}`
        }
      },
      title: {
        text: title,
        show: title ? "show" : false,
        left: "23",
        top: "top",
        textStyle: {
          color: fontColor,
          fontSize: 14,
          fontWeight: "normal"
        }
      },
      color: color,
      legend: {
        left: '20%',
        right: '10%',
        icon: "circle",
        itemWidth: 5,
        itemHeight: 5
      },
      yAxis: {
        type: "value",
        name: yAxisName,
        nameTextStyle: {
          color: fontColor
        },
        axisLabel: {
          color: fontColor
        },
        axisLine: {
          show: false,
          lineStyle: { color: lineColor }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: lineColor,
            type: "dashed"
          }
        }
      },
      xAxis: {
        type: "category",
        data: xData,
        axisLine: {
          lineStyle: {
            color: lineColor
          }
        },
        axisLabel: {
          color: fontColor
        }
      },
      series: seriesData
    };
    setTimeout(() => {
      targetChart.resize();
    }, 1000);
    targetChart.setOption(targetMonthOption);
  };
  render() {
    const { graphId } = this.props;
    return <div id={graphId}> </div>;
  }
}
export default UsageRate;
