import React from "react";
import echarts from "echarts";
import { setTimeout } from "timers";
import PropTypes from "prop-types";
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

/* 
     1 必填 graphId, 根据ID确定图表
     2 选填 yAxisName, y轴的name
     3 选填 xAxisName,
     4 选填 title,图表的title
     5 必填 data, 数据 data=[[],[]] 其中为line的数据数组
     6 选填 hasData 是否有数据 如果有数据为true，否则为false
*/
class UsageRate extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.array,
    xAxisName: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.object
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

  getColor = xAxisName => {
    let result = "";
    switch (xAxisName) {
      case "可利用率":
        result = ["#e08031", "#3e97d1"];
        break;
      case "厂用电情况":
        result = ["#e08031", "#199475"];
        break;
      case "厂损情况":
        result = ["#e08031", "#3e97d1"];
        break;
      default:
        result = "#ccc";
    }
    return result;
  };

  getYaxisName = yAxisName => {
    let result = "";
    switch (yAxisName) {
      case "可利用率":
        result = ["电站可利用率", "发电系统可利用率"];
        break;
      case "厂用电情况":
        result = ["厂用电率", "综合厂用电率"];
        break;
      case "产损情况":
        result = ["送出线损率", "厂损率"];
        break;
      default:
        result = " ";
    }
    return result;
  };

  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    let replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--') }
    let realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData
  }

  drawChart = param => {
    const {
      graphId,
      yAxisName,
      xAxisName,
      title,
      data,
      hasData
    } = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    let color = this.getColor(xAxisName);
    let yData = (data && data.yData) || [];
    const lineColor = ' #f1f1f1';
    const fontColor = '#333';
    let series = yData.map((item, index) => {
      return {
        name: yAxisName[index],
        type: "line",
        yAxisIndex: index,
        data: this.getDefaultData(item)
      };
    });

    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    const targetMonthOption = {
      graphic: confluenceTenMinGraphic,
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
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: fontColor,
          },
          label: { color: fontColor },
        },
        backgroundColor: "#fff",
        formatter: function (params) {
          let paramsItem = "";
          params.forEach((item, index) => {
            return (paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName
              } :${item.value === 0 || item.value ? item.value : '--'}${'%'}</div>`);
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${
            params[0].name
            } </span>
          </div>
         ${paramsItem}`;
        },
        padding: 10,
        textStyle: {
          color: "rgba(0, 0, 0, 0.65)",
          fontSize: 12
        },
        extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)"
      },
      grid: {
        right: '15%'
      },
      legend: {
        top: title ? 0 : 20,
        left: "center",
        itemWidth: 8,
        itemHeight: 5,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data && data.xData,
        axisPointer: {
          type: "shadow"
        },
        axisLine: {
          show: true,
          onZero: false,
          lineStyle: {
            color: lineColor
          }
        },
        axisLabel: {
          color: fontColor
        },
        axisTick: {
          show: false
        }
      },
      yAxis: [
        {
          type: "value",
          name: yAxisName[0],
          nameTextStyle: {
            color: fontColor,
          },
          axisLabel: {
            color: fontColor,
            formatter: "{value} %"
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: lineColor
            }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        {
          type: "value",
          name: yAxisName[1],
          nameTextStyle: { color: fontColor },
          axisLine: {
            show: true,
            lineStyle: { color: lineColor }
          },
          axisLabel: { color: fontColor, formatter: "{value} %" },
          axisTick: { show: false },
          splitLine: { show: false },
        }
      ],
      series: series
    };
    setTimeout(() => {
      targetChart.resize();
    }, 100);
    targetChart.setOption(targetMonthOption);
  };


  render() {
    const { graphId } = this.props;
    return <div id={graphId} />;
  }
}
export default UsageRate;
