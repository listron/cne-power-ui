

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationContrast.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {showNoData, hiddenNoData} from '../../../../constants/echartsNoData';
import {stationContrastBaseInfo} from '../../../../constants/stationContrastBaseInfo';
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
    const stationContrastDiagram = echarts.init(document.getElementById(`stationContrastDiagram_${column}`));
  
    const lineColor = '#666';
    const stationNames = stationContrastDetail.map(e => e.stationName);
    const contrastYears = stationContrastDetail.map(e => e.year);
    const contrastValues = stationContrastDetail.map(e => e.value);
    const capabilityGraphic = stationContrastDetail.length === 0 ? showNoData : hiddenNoData;
    const stationContrastOption = {
      graphic: capabilityGraphic,
      legend: {
        data: ['Forest', 'Steppe',],
      },
      // title: {
      //   text: column,
      //   textStyle: {
      //     color: lineColor,
      //     fontSize: 14,
      //     fontWeight: 'normal',
      //   },
      // },
      // tooltip: {
      //   trigger: 'axis',
      //   show: true,
      //   backgroundColor: '#fff',
      //   textStyle: {
      //     color: lineColor,
      //     fontSize: '12px',
      //   },
      //   axisPointer: {
      //     type: 'cross',
      //     label: {
      //       backgroundColor: lineColor,
      //     }
      //   },
      //   formatter: (param) => {
      //     console.log(param);
      //     return `<div style="width: 128px; height: 75px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
      //       <div style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;" >${param[0] && param[0].name || '--'}</div>
      //       <div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #199475; width:6px; height:6px; border-radius:100%;"></span> 斜面辐射: ${param[1] && param[1].value || '--'}</div>
      //       <div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #a42b2c; width:6px; height:6px; border-radius:100%;"></span> 功率: ${param[0] && param[0].value || '--'}</div>
      //     </div>`;
      //   },
      //   extraCssText:'background: rgba(0,0,0,0);',
      // },
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
          name: stationContrastBaseInfo[column],
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
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
        <div id={`stationContrastDiagram_${column}`} style={{ width: "800px", height: "360px", borderRadius: "4px", paddingTop: "20px" }}></div>
      </div>
    )
  }
}

export default StationContrastDetail;
