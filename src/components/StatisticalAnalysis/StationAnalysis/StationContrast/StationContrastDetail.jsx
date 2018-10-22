

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationContrast.scss';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { stationContrastBaseInfo,stationContrastDataInfo } from '../../../../constants/stationContrastBaseInfo';
import {Spin} from 'antd';

class StationContrastDetail extends Component {
  static propTypes = {
    stationContrastDetail: PropTypes.array,
    column: PropTypes.string,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.setState={
      capabilityGraphic: showNoData,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const { stationContrastDetail, column } = nextProps;
    console.log(column);
    const stationContrastDiagram = echarts.init(document.getElementById(`stationContrastDiagram_${column}`));
    // const tmpstationContrastBaseInfo = Object.keys(stationContrastBaseInfo);
    // console.log(tmpstationContrastBaseInfo);
    const columnName = stationContrastBaseInfo[column].substring(0,stationContrastBaseInfo[column].indexOf('（'));
    const columnUnit = stationContrastBaseInfo[column].substring(stationContrastBaseInfo[column].indexOf('（'));
    
    const lineColor = '#666';
    const stationNames = stationContrastDetail.map(e => e.stationName);
    const contrastYears = stationContrastDetail.map(e => e.years);
    const contrastValues = stationContrastDetail.map(e => e.value);
    console.log(stationNames);
    console.log(contrastYears);
    console.log(contrastValues);
    const contrastValuesIsNull = contrastValues.every(item=>item.every(e=>e===null));
    const capabilityGraphic = contrastValuesIsNull ? showNoData : hiddenNoData;
    const stationContrastOption = {
      graphic: capabilityGraphic,
      legend: {
        data: [{
          name: stationNames[0],
          icon: 'circle',
        },{
          name: stationNames[1],
          icon: 'circle',
        }],
        // textStyle:{
        //   color: lineColor,
        // },
        // itemWidth: 5,
        // itemHeight: 5,        
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
      tooltip: {
        trigger: 'axis',
        show: true,
        backgroundColor: '#fff',
        textStyle: {
          color: lineColor,
          fontSize: '12px',
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: lineColor,
          }
        },
        formatter: (param) => {
          return `<div style="width: 170px; height: 93px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div style="border-bottom: 1px solid #dfdfdf;padding:0px 15px; display:flex;justify-content: space-between;" ><span>${param[0] && param[0].name || '--'}</span><span>${columnName}</span></div>
            <div style="padding: 6px 15px 0px;" ><span style="display: inline-block; margin-right:5px; background:#199475; width:6px; height:6px; border-radius:100%;"></span>${stationNames[0]} ${param[1] && param[1].value || '--'}</div>
            <div style="padding: 6px 15px 0px;" ><span style="display: inline-block; margin-right:5px; background:#c7ceb2; width:6px; height:6px; border-radius:100%;"></span>${stationNames[1]} ${param[0] && param[0].value || '--'}</div>
          </div>`;
        },
        extraCssText:'background: rgba(0,0,0,0);',
      },
      xAxis: {
        type: 'category',
        data: contrastYears && contrastYears[0] && contrastYears[0].map(e=>e.toString()),
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
          // name: '功率',
          type: 'bar',
          data: contrastValues && contrastValues[0],
          barWidth: '6px',
          itemStyle: {
            barBorderRadius: 3,
          },
          color: '#199475',
        },
        {
          // name: '功率',
          type: 'bar',
          data: contrastValues && contrastValues[1],
          barWidth: '6px',
          itemStyle: {
            barBorderRadius: 3,
          },
          color: '#c7ceb2',
        },
      ]
    }
    stationContrastDiagram.setOption(stationContrastOption);
    
    
    
  }

  render() {
    const { column,loading } = this.props;
    return (
      <div className={styles.capabilityDiagramBox} >
        <div id={`stationContrastDiagram_${column}`} style={{ width: "848px", height: "364px", borderRadius: "4px", paddingTop: "20px" }}></div>
      </div>
    )
  }
}

export default StationContrastDetail;
