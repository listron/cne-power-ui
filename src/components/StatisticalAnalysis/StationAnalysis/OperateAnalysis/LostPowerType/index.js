import React from "react";

import echarts from "echarts";

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
    const { graphId, yAxisName, xAxisName, data, title } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    let color = ["#a42b2c", "#f9b600", "#f9b600", "#199475", "#ceebe0"];
    const targetMonthOption = {
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
        data: data.date,
        axisLine: {
          lineStyle: {
            color: "#dfdfdf"
          }
        },
        axisLabel: {
          color: "#666"
        }
      },
      series: [
        {
          name: "限电",
          type: "bar",
          stack: "总量",
          data: data.limit
        },
        {
          name: "变电故障",
          type: "bar",
          stack: "总量",
          data: data.electric
        },
        {
          name: "计划停机",
          type: "bar",
          stack: "总量",
          data: data.plane
        },
        {
          name: "光伏发电系统故障",
          type: "bar",
          stack: "总量",
          data: data.system
        },
        {
          name: "场外因素",
          type: "bar",
          stack: "总量",
          data: data.other
        }
      ]
    };
    setTimeout(() => {
      targetChart.resize();
    }, 1000);
    targetChart.setOption(targetMonthOption);
  };
  render() {
    const { graphId, dateType } = this.props;
    return <div id={graphId}> </div>;
  }
}
export default UsageRate;
