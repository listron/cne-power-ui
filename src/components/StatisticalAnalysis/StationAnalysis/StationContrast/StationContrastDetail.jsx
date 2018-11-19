

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationContrast.scss';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { stationContrastBaseInfo, stationContrastDataInfo } from '../../../../constants/stationContrastBaseInfo';
import { Spin } from 'antd';

class StationContrastDetail extends Component {
  static propTypes = {
    stationContrastDetail: PropTypes.array,
    column: PropTypes.string,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.setState = {
      capabilityGraphic: showNoData,
    }
  }
  componentDidMount() {
    const { stationContrastDetail, column } = this.props;
    this.drawChart(stationContrastDetail, column)
  }

  componentWillReceiveProps(nextProps) {
    const { stationContrastDetail, column } = nextProps;
    if (stationContrastDetail && stationContrastDetail.length > 0) {
      this.drawChart(stationContrastDetail, column)
    }
  }
  drawChart = (stationContrastDetail, column) => {
    const stationContrastDiagram = echarts.init(document.getElementById(`stationContrastDiagram_${column}`));
    const columnName = stationContrastBaseInfo[column].substring(0, stationContrastBaseInfo[column].indexOf('（'));
    const columnUnit = stationContrastBaseInfo[column].substring(stationContrastBaseInfo[column].indexOf('（'));

    const lineColor = '#666';
    const stationNames = stationContrastDetail.map(e => e.stationName);
    const contrastYears = stationContrastDetail.map(e => e.years);
    const contrastValues = stationContrastDetail.map(e => e.value);
    const contrastValuesIsNull = contrastValues.every(item => item.every(e => e === null));
    const capabilityGraphic = contrastValuesIsNull ? showNoData : hiddenNoData;
    const color=['#199475','#c7ceb2']
    const stationContrastOption = {
      graphic: capabilityGraphic,
      legend: {
        icon:'circle',
        itemWidth: 5,
        itemHeight: 5,
      },
      title: {
        text: `${columnName}`,
        left: '35px',
        textStyle: {
          color: lineColor,
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      color:color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        backgroundColor: '#fff',
        formatter: function (params) {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div style="text-align:left"> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName} :${item.value === 0 || item.value ? item.value : '--'}${item.seriesType === 'line' && '%' || ''}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:150px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${columnName} </span>
          </div>${paramsItem}`
        },
      },
      xAxis: {
        type: 'category',
        data: contrastYears && contrastYears[0] && contrastYears[0].map(e => e.toString()),
        nameTextStyle: {
          color: lineColor,
        },
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: lineColor,
        },
        axisTick: {
          show: false,
        }
      },
      yAxis: [
        {
          name: `${columnUnit}`,
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
            lineHeight: 30,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          }
        },
      ],
      series: [
        {
          name: stationNames && `${stationNames[0]}`,
          type: 'bar',
          data: contrastValues && contrastValues[0],
          barWidth: '6px',
          itemStyle: {
            barBorderRadius: 3,
          },
        },
        {
          name: stationNames && `${stationNames[1]}`,
          type: 'bar',
          data: contrastValues && contrastValues[1],
          barWidth: '6px',
          itemStyle: {
            barBorderRadius: 3,
          },
        },
      ]
    }
    stationContrastDiagram.setOption(stationContrastOption);
  }

 

  render() {
    const { column, loading, stationContrastDetail } = this.props;
    return (
      <div>
        {/* {stationContrastDetail && stationContrastDetail.length>0 ?
          <div id={`stationContrastDiagram_${column}`} className={styles.stationContrastDetailBox} style={{ width: "848px", height: "364px", borderRadius: "4px", paddingTop: "20px" }}></div>
        : <div className={styles.stationContrastDetailBox}><img src="/img/nodata.png" /></div>
        } */}
        <div id={`stationContrastDiagram_${column}`} className={styles.stationContrastDetailBox} style={{ width: "848px", height: "364px", borderRadius: "4px", paddingTop: "20px" }}></div>
      </div>
    )
  }
}

export default StationContrastDetail;
