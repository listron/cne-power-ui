import React from "react";
import echarts from "echarts";
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

class WeatherDayChart extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  getName = (type) => {
    let name = '';
    switch (type) {
      // "雪1", "雨2", "霾3", "阴4", "晴5","其他0"
      case '5': name = '晴'; break;
      case '4': name = '阴'; break;
      case '2': name = '雨'; break;
      case '1': name = '雪'; break;
      case '3': name = '霾'; break;
      case '0': name = '其他'; break;
      default: name="" ;break;
    }
    return name;
  }

  drawChart = param => {
    const { graphId, yAxisName, xAxisName, yData, xData,title,hasData } = param;
    
    const targetChart = echarts.init(document.getElementById(graphId));
    let color=["#f9b600",'#999999','#199475','#c7ceb2','#a42b2c','#ceebe0']
    let seriesData=yData.map(e=>{
        return {
            name:this.getName(e.weather),
            type:'bar',
            barWidth:13,
            data:[e.temp]
        }
    })
    const confluenceTenMinGraphic = hasData? hiddenNoData :showNoData;
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
              return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value==='0'  || params[index].value || '--'}</div>`
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
    const { graphId, dateType } = this.props;
    return <div id={graphId}> </div>;
  }
}
export default WeatherDayChart;
