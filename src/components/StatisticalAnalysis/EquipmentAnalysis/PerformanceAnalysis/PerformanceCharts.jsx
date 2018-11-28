import React from "react";
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

/* 
  1 必填   graphId 图表的id名
  2 必填   title  根据title 判断color  ‘发电效率 计划完成率
  3 必填   data  
  data:{
    xData:[];
    yData:{
      xxx:[],  根据后台的数据判断name  如 hours
      xxx:[]
    }
  }
*/

class PerformanceCharts extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
    title: PropTypes.string,
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
  getYaxisName = (title) => {
    let result = " ";
    switch (title) {
      case "转换效率":
        result = "转换效率(%)";
        break;
      case "等效小时数":
        result = "等效小时数(h)";
        break;
      case "可利用率":
        result = "可利用率(%)";
        break;
      case "损失电量":
        result = "损失电量(kWh)";
        break;
      case "设备故障次数":
        result = "故障次数(次)";
        break;
      case "设备故障时长":
        result = "故障时长(h)";
        break;


      default:
        result = " ";
    }
    return result;
  };


  getColor = (title) => {
    let result = '';
    switch (title) {
      case '转换效率':
        result = ['#199475', '#f9b600', '#e08031', '#3e97d1'];
        break;
      case '等效小时数':
        result = ['#dfdfdf', '#f9b600', '#e08031', '#3e97d1'];
        break;
      case "可利用率":
        result = ['#199475', '#f9b600', '#e08031', '#3e97d1'];
        break;
      case "损失电量":
        result = ['#199475', '#f9b600', '#e08031', '#3e97d1'];
        break;
      case "设备故障次数":
        result = ['#199475', '#f9b600', '#e08031', '#3e97d1'];
        break;
      case "设备故障时长":
        result = ['#199475', '#f9b600', '#e08031', '#3e97d1'];
        break;
      default:
        result = '';
    }
    return result;
  };

  getName = (type) => { // 获取对应的name
    let name = '';
    switch (type) {
      case 'conversionRate': name = '转换效率'; break;
      case 'conversionAvgRate': name = '平均转换效率'; break;
      case 'contrastConversionAvgRate': name = '对比周期平均转换效率'; break;
      case 'contrastConversionRate': name = '对比周期转换效率'; break;
      case 'contrastHoursData': name = '对比周期等效小时数'; break;
      case 'contrastFaultNumData': name = '对比周期故障次数'; break;
      case 'contrastFaultTimeData': name = '对比周期故障时长'; break;
      case 'contrastAvailability': name = '对比周期可利用率'; break;
      case 'contrastLossPower': name = '对比周期损失电量'; break;
      case 'hour': name = '等效小时数'; break;
      case 'faultNum': name = '故障次数'; break;
      case 'faultTime': name = '故障时长'; break;
      case 'availability': name = '可利用率'; break;
      case 'lostPower': name = '损失电量'; break;
    }
    return name;
  }

  drawChart = (params) => {
    const { graphId, title, data, hasData, hasSlider,deviceNames } = params;
    const targetChart = echarts.init(document.getElementById(graphId));
    let color = this.getColor(title);
    let seriesData = [];
    const lineData = data && data.yData.lineData;
    const barData = data && data.yData.barData;
    for (var bar in barData) {
      var json = {
        name: this.getName(bar),
        data: barData[bar],
        // markLine: {
        //   data: [
        //       {type: 'average', name: '平均值'}
        //   ]
        // },
        type: 'bar',
        itemStyle: {
          barBorderRadius: 3,
        },
        barWidth: 5,
      };
      seriesData.push(json);
    }
    for (var line in lineData) {
      var json = {
        name: this.getName(line),
        data: lineData[line],
        type: 'line',
      }

      seriesData.push(json);
    }
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    const targetMonthOption = {
      graphic: confluenceTenMinGraphic,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: function (params) {
          let paramsItem = '';
          params.map((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value === 0 || params[index].value ? params[index].value : '--'}${(params[index].seriesName === '计划完成率' || params[index].seriesName === 'pr') && '%' || ''}
            </div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span></div>
           ${paramsItem}`
        }
      },
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
      color: this.getColor(title),
      grid: {
        right: '20%',
        left: '12%'
      },
      legend: {
        icon: 'circle',
        left: 'center',
        itemWidth: 5,
        itemHeight: 5,
      },
      dataZoom:
        [{
          show: hasSlider,
          type: 'slider',
          realtime: true,
          start: 0,
          end: 20,
          bottom: '3px',
          handleSize: '80%',
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          backgroundColor: 'rgba(213,219,228,.8)',
          height: '20px',
          handleStyle: {
            width: '16px',
            height: '16px',
            borderRadius: '100%',
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }

        },
        {
          type: 'inside',
          realtime: true,
          start: 0,
          end: 20,

        }
        ],

      xAxis: {
        type: 'category',
        data: data && data.xData,
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
          // color: function (value, index) {
          //  console.log(value,deviceNames);
          //   return deviceNames.includes(value)===true?'red':"#666"
          // },
          rotate: -30,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: this.getYaxisName(title),
          position: 'left',
          axisLabel: {
            formatter: '{value} '
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

      ],
      series: seriesData || []
    };
    targetChart.setOption(targetMonthOption)
    targetChart.resize();
  }

  render() {
    const { graphId, } = this.props;
    return (
      <div id={graphId}></div>
    )
  }
}

export default (PerformanceCharts)
