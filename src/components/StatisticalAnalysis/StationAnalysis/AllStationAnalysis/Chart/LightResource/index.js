import React from "react";
//import styles from './styles.scss';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData';

class LightResource extends React.Component {
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
  drawChart = (params) => { 
    const {graphId, yAxisName, xAxisName,title,currentYear,lastYear,lightCompareDataThatYear,lightCompareDataLastYear,lightCompareDataLight,lightCompareDataPower,lightCompareDataDate,hasData} = params;
    const targetChart = echarts.init(document.getElementById(graphId));
    let targetMonthOption={};
    targetChart.resize();
    const color=['#d4d4d4','#a42b2c','#a42b2c','#f9b600'];
    const lineColor = '#f1f1f1';
    const fontColor = '#333';
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    targetMonthOption = {
      graphic: confluenceTenMinGraphic,
      title: {
        text: title,
        left: '23',
        top: 'top',
        textStyle: {
          color: fontColor,
          fontSize: 14,
          fontWeight: 'normal',
        }
      },
      legend: {
        // icon: 'circle',
        left: 'center',
        itemWidth: 8,
        itemHeight: 5,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: fontColor
          },
          label:{color:fontColor}
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
          params.map((item,index)=>{
            return paramsItem+= `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName} :${item.value === 0 || item.value ? item.value : '--'}${item.seriesType==='line'&&'%'||''}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${xAxisName} </span>
            </div>${paramsItem}`
        }
      },
      xAxis: {
        type: 'category',
        data: lightCompareDataDate,
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
      },
      color:color,
      yAxis: [
        {
          type: 'value',
          name: yAxisName,
          // min: 0,
          splitNumber: 5,
          scale: true,
          axisLabel: {
            color:fontColor,
          },
          axisLine: {
            show: false,
            lineStyle:{color:lineColor}
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: fontColor,
              type: 'dashed'
            }
          },
          nameTextStyle:{
            color: fontColor,
            textAlign:'right',
          },
        },
        {
          type: 'value',
          name: '同比',
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
            lineStyle:{color:lineColor}
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: fontColor,
              type: 'dashed'
            }
          },
        }
      ],
      series: [
        {
          name: lastYear,
          type: 'bar',
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth: 5,
          data:this.getDefaultData(lightCompareDataLastYear)
        },
        {
          name: currentYear,
          type: 'bar',
          itemStyle: {
            barBorderRadius: 3,
          },
          barWidth: 5,
          data: this.getDefaultData(lightCompareDataThatYear)
        },
        {
          name: '辐射总量同比',
          type: 'line',
          yAxisIndex: 1,
          data: this.getDefaultData(lightCompareDataLight),
          lineStyle:{
            type:'dotted'
          }
        }, {
          name: '发电量同比',
          type: 'line',
          yAxisIndex: 1,
          data: this.getDefaultData(lightCompareDataPower)
        }
      ]
    };
    targetChart.setOption(targetMonthOption);
    targetChart.resize();
  };

  render() {
    const {graphId} = this.props;
    return (
      <div id={graphId}></div>
    )
  }
}

export default (LightResource)
