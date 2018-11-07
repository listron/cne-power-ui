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
    let series = yData.map((item, index) => {
      return {
        name: yAxisName[index],
        type: "line",
        yAxisIndex: index,
        data: item
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
          color: "#666",
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
            color: "#999"
          }
        },
        backgroundColor: "#fff",
        formatter: function (params) {
          let paramsItem = "";
          params.forEach((item, index) => {
            return (paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${
              color[index]
              };vertical-align: 3px;margin-right: 3px;"> </span> ${
              params[index].seriesName
              } :${params[index].value === 0 || params[index].value ? params[index].value : '--'}</div>`);
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
        // icon: "circle",
        itemWidth: 5,
        itemHeight: 5
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        // data: [
        //   "1月",
        //   "2月",
        //   "3月",
        //   "4月",
        //   "5月",
        //   "6月",
        //   "7月",
        //   "8月",
        //   "9月",
        //   "10月",
        //   "11月",
        //   "12月"
        // ],
        data: data && data.xData,
        axisPointer: {
          type: "shadow"
        },
        // axisLine: {
        //   show: true,
        //   lineStyle: {
        //     color: "#dfdfdf"
        //   }
        // },
        axisLabel: {
          color: "#666"
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
            color: '#666',
          },
          axisLabel: {
            color: '#666',
            formatter: "{value} %"
          },
          // axisLine: {
          //   show: true,
          //   lineStyle: {
          //     color: "#dfdfdf"
          //   }
          // },
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
          nameTextStyle: {
            color: '#666',
          },
          // axisLine: {
          //   show: true,
          //   lineStyle: {
          //     color: "#dfdfdf"
          //   }
          // },
          axisLabel: {
            color: '#666',
            formatter: "{value} %"
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
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
