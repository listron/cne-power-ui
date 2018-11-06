import React from "react";
//import styles from './styles.scss';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData';
class PlanCompleteRateAnalysisBar extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
  };
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.drawCharts(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawCharts(nextProps);
  }

  drawCharts = (param) => {
    const {graphId, yAxisName, title,xAxisData ,planPowerData, actualPowerData ,planRateData,hasData} = param;
    const targetChart = echarts.init(document.getElementById(graphId));
    let targetOption = {};
    targetChart.clear();
    targetChart.resize();
    let color =['#dfdfdf','#f9b600','#3e97d1'];
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    targetOption = {
      graphic: confluenceTenMinGraphic,
      color: color,
      title: {
        text: title,
        left: '23',
        top: 'top',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: function (params) {
          let paramsItem='';
          params.forEach((item,index) => {
             paramsItem+= `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === 0 || params[index].value ? params[index].value : '--'}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span></div>${paramsItem}`
        }
      },
      legend: {
        top: 20,
        left: 'center',
        icon: 'circle',
        itemWidth: 5,
        itemHeight: 5,
      },
      xAxis: [
        {
          type: 'category',
          data:xAxisData,
          // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#dfdfdf',
            }
          },
          axisLabel: {
            color: '#666',
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
            color: '#666',
          },
          // min: 0,
          splitNumber: 5,
          scale: true,
          axisLabel: {
            color: '#666',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            // show:false,
            lineStyle: {
              color: '#666',
              type: 'dashed'
            }
          },
        },
        {
          type: 'value',
          name: '完成率',
          nameTextStyle: {
            color: '#666',
          },
          axisLabel: {
            formatter: '{value} %',
            color: '#666',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#999',
              type: 'dashed'
            }
          },
        }
      ],
      series: [
        {
          name: '计划完成发电量',
          type: 'bar',
          // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          data: planPowerData,
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth: 5,
        },
        {
          name: '实际发电量',
          type: 'bar',
          data: actualPowerData,
          // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth:5,
        },
        {
          name: '计划完成率',
          type: 'line',
          yAxisIndex: 1,
          data: planRateData,
          // data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
        }
      ]
    };
    targetChart.setOption(targetOption)
  };
  render() {
    const { graphId,dateType } = this.props;
    return (

      // <div id={graphId}  style={{ width: '55%', height: "300px", }}> </div>
      <div id={graphId}> </div>

    )
  }
}
export default (PlanCompleteRateAnalysisBar)
