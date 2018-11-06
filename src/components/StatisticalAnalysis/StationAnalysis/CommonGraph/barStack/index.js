import React from "react";
import echarts from "echarts";
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

class barStack extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  getName = (type) => { // 获取对应的name
    let name = '';
    switch (type) {
      case 'limit': name = '限电'; break;
      case 'electric': name = '变电故障'; break;
      case 'plane': name = '计划停机'; break;
      case 'system': name = '光伏发电系统故障'; break;
      case 'other': name = '场外因素'; break;
      case 'sunny': name = '晴'; break;
      case 'cloudy': name = '阴'; break;
      case 'rain': name = '雨'; break;
      case 'snow': name = '雪'; break;
      case 'haze': name = '霾'; break;
      case 'otherWeather': name = '其他'; break;
    }
    return name;
  }

  drawChart = param => {
    const { graphId, yAxisName, xAxisName, data, title, hasData } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    let color=["#f9b600",'#999999','#199475','#c7ceb2','#a42b2c','#ceebe0']
    // let color = ['#ceebe0', '#c7ceb2', '#199475', '#a42b2c', '#dfdfdf', "#f9b600"]
    let seriesData = [];
    for (var type in data) {
      if (type !== 'date') {
        seriesData.push({
          name: this.getName(type),
          data: data[type],
          type: 'bar',
          stack: "总量",
          barWidth: 13,
        });
      }
    }

    debugger;
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    console.log("90",confluenceTenMinGraphic)
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
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === 0 || params[index].value ? params[index].value : '--'}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span>
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
      series: seriesData
    };
    setTimeout(() => {
      targetChart.resize();
    }, 1000);
    targetChart.setOption(targetMonthOption);
  };
  render() {
    const { graphId} = this.props;
    return <div id={graphId}> </div>;
  }
}
export default barStack;
