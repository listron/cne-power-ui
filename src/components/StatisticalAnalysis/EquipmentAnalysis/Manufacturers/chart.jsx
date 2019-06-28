import React from "react";
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from "./manufacturers.scss";
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { dataFormats } from '../../../../utils/utilFunc';

/* 
  2 必填   data
    xData=[];
    yData=[]  
  3 必填 type  图表的id名
    efficiency   设备转换效率
    duration  设备故障时长
    frequency  设备故障次数
    capacity   装机容量
*/

class Charts extends React.Component {
  static propTypes = {
    yAxisName: PropTypes.string,
    xAxisName: PropTypes.string,
    dateType: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
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

  getYaxisName = (type) => {
    let result = " ";
    switch (type) {
      case "conversioneff":
        result = '转换效率(%)';
        break;
      case "faultHours":
        result = '故障时长(h/台)';
        break;
      case "faultNum":
        result = '故障次数(次/台)';
        break;
      case "deviceCapacity":
        result = '装机容量(MW)';
        break;
      default:
        result = " ";
    }
    return result;
  };

  getColor = (type) => {
    let result = " ";
    switch (type) {
      case "conversioneff":
        result = '#c7ceb2';
        break;
      case "faultHours":
        result = '#f9b600';
        break;
      case "faultNum":
        result = '#3e97d1';
        break;
      case "deviceCapacity":
        result = '#199475';
        break;
      default:
        result = "";
    }
    return result;
  };

  getTitle = (type, selectOption) => {
    let result = " ";
    switch (type) {
      case "conversioneff":
        result = selectOption === 'manufacturer' ? '各厂家设备转换效率对比图' : '各型号设备转换效率对比图';
        break;
      case "faultHours":
        result = selectOption === 'manufacturer' ? '各厂家设备故障时长对比图' : '各型号设备故障时长对比图';
        break;
      case "faultNum":
        result = selectOption === 'manufacturer' ? '各厂家设备故障次数对比图' : '各型号设备故障次数对比图';
        break;
      case "deviceCapacity":
        result = selectOption === 'manufacturer' ? '各厂家装机容量对比图' : '各型号装机容量对比图';
        break;
      default:
        result = "";
    }
    return result;
  };

  getLengend = (type) => {
    let result = " ";
    switch (type) {
      case "conversioneff":
        result = '设备转换效率';
        break;
      case "faultHours":
        result = '设备故障时长';
        break;
      case "faultNum":
        result = '设备故障次数';
        break;
      case "deviceCapacity":
        result = '装机容量';
        break;
      default:
        result = " ";
    }
    return result;
  }


  getUnit = (type) => {
    let result = " ";
    switch (type) {
      case "conversioneff":
        result = '%';
        break;
      case "faultHours":
        result = 'h/台';
        break;
      case "faultNum":
        result = '次/台';
        break;
      case "deviceCapacity":
        result = 'MW';
        break;
      default:
        result = " ";
    }
    return result;
  }


  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    let replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--') }
    let realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData
  }

  drawChart = (params) => {
    const { data, type, selectOption, loading } = params;
    const manufacturerData = data.map(e => e.manufacturer);
    const deviceModeIdsData = data.map(e => e.deviceModeName);
    const xData = selectOption === 'manufacturer' ? manufacturerData : deviceModeIdsData;
    const yData = data.map(e => e[type]);
    const targetChart = echarts.init(document.getElementById(type));
    loading ? targetChart.showLoading('default', { color: '#199475' }) : targetChart.hideLoading();
    const color = this.getColor(type);
    const lineColor = '#f1f1f1';
    const fontColor = '#999';
    const hasSlider = yData.length > 8;
    const unit = this.getUnit(type);
    const hasData = yData.some(e => e || e === 0);
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    const targetMonthOption = {
      graphic: confluenceTenMinGraphic,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: { color: fontColor },
        },
        show: hasData,
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: function (params) {
          const pointLength = (type === "faultHours" || type === "faultNum") ? 0 : 2;
          let paramsItem = '';
          params.map((item) => {
            return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span>  
                        ${item.seriesName} :${dataFormats(item.value, '--', pointLength, true)} ${unit}</div>`
          });
          return `<div class=${styles.tooltipTitle}> ${params[0].name}</div>${paramsItem}`
        }
      },
      title: {
        text: this.getTitle(type, selectOption),
        left: '23',
        top: 'top',
        textStyle: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'normal',
        }
      },
      color: this.getColor(type),
      grid: {
        bottom: hasSlider ? 140 : 80,
      },
      legend: {
        left: 'center',
        itemWidth: 5,
        itemHeight: 5,
        icon: 'circle',
        textStyle: {
          color: fontColor
        }
      },
      dataZoom: [{
        show: hasSlider,
        type: 'slider',
        realtime: true,
        filterMode: 'filter',
        startValue: 0,
        endValue: hasSlider ? 19 : 100,
        bottom: 40,
        handleSize: '80%',
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        backgroundColor: 'rgba(213,219,228,.8)',
        // handleIcon:'none',
        height: '20px',
        zoomLock: true,
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
      }],
      xAxis: {
        type: 'category',
        data: xData,
        axisPointer: {
          type: 'line',
          snap: true,
          lineStyle: {
            width: 38,
            color: 'rgba(150,150,150,0.3)'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: lineColor,
          }
        },
        axisLabel: {
          color: fontColor,
          rotate: -45,
          height: 10,
          width: 10,
          formatter: (value, index) => {
            const hasChinese = /[\u4e00-\u9fa5]+/.test(value) // 展示文字是否有汉字
            let maxText = hasChinese ? 6 : 10;// 中文最多展示4字, 英文12,超出展示...
            let showText = value;
            if (value && value.length > maxText) {
              showText = `${showText.substring(0, maxText)}...`;
            }
            return showText
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: this.getYaxisName(type),
          axisLabel: { formatter: '{value}', color: fontColor },
          nameTextStyle: { color: fontColor },
          axisLine: {
            show: false,
            lineStyle: {
              color: lineColor,
            }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: lineColor,
              type: 'dashed'
            }
          },
        }
      ],
      series: {
        name: this.getLengend(type),
        type: 'bar',
        data: this.getDefaultData(yData),
        itemStyle: { barBorderRadius: 3 },
        barWidth: 5,
      },
    };
    targetChart.setOption(targetMonthOption, { notMerge: true })
    targetChart.resize();
  }

  render() {
    const { type } = this.props;
    return (
      <div id={type}></div>
    )
  }
}

export default (Charts)
