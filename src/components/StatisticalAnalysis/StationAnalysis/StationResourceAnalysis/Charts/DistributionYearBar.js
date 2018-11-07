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



  drawChart = param => {
    const { graphId, yAxisName, xAxisName, xData, yData, title,hasData } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    let color = ["#a42b2c", "#d48265", "#91c7af", "#749f83", "#ca8622", "#bda29a", "#546570", "#6e7074", "#9b9b9b", "#ceebe0", "#199475", "#f1f1f1"];
    let seriesData = [];
    yData.forEach(item => {
      seriesData.push({
        name: item.name,
        data: item.data,
        type: 'bar',
        stack: "总量",
        itemStyle: {
          barBorderRadius: 10,
        },
        barWidth: 10,
      });
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
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value}</div>`
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
          color: "#666",
          fontSize: 14,
          fontWeight: "normal"
        }
      },
      color: color,
      legend: {
        left: "center",
        icon: "circle",
        itemWidth: 5,
        itemHeight: 5
      },
      yAxis: {
        type: "value",
        name: yAxisName,
        nameTextStyle: {
          color: "#666"
        },

        axisLabel: {
          color: "#666"
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          // show:false,
          lineStyle: {
            color: "##f1f1f1",
            type: "dashed"
          }
        }
      },
      xAxis: {
        type: "category",
        data: xData,
        axisLine: {
          lineStyle: {
            color: "#dfdfdf"
          }
        },
        axisLabel: {
          color: "#666"
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
