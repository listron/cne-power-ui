

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationContrast.scss';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { stationContrastBaseInfo, stationContrastDataInfo } from '../../../../constants/stationContrastBaseInfo';
import { Gradient1, Gradient2, barRadius, chartsLoading, themeConfig, chartsNodata } from '../../../../utils/darkConfig';
import { dataFormats } from '../../../../utils/utilFunc';

class StationContrastDetail extends Component {
  static propTypes = {
    stationContrastDetail: PropTypes.array,
    column: PropTypes.string,
    loading: PropTypes.bool,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.setState = {
      capabilityGraphic: showNoData,
    };
  }
  componentDidMount() {
    const { stationContrastDetail, column, theme } = this.props;
    this.drawChart(stationContrastDetail, column, theme);
  }

  componentWillReceiveProps(nextProps) {
    const { stationContrastDetail, column, theme } = nextProps;
    if (stationContrastDetail && stationContrastDetail.length > 0 || theme !== this.props.theme) {
      this.drawChart(stationContrastDetail, column, theme);
    }
  }

  getColor = {
    'light': ['#199475', '#c7ceb2'],
    'dark': [Gradient1, Gradient2],
  }
  drawChart = (stationContrastDetail, column, theme) => {
    let stationContrastDiagram = echarts.init(this.charts, themeConfig[theme]);
    if (stationContrastDiagram) {
      stationContrastDiagram.dispose();
      stationContrastDiagram = echarts.init(this.charts, themeConfig[theme]);
    }
    const columnName = stationContrastBaseInfo[column].name;
    const columnUnit = stationContrastBaseInfo[column].unit;
    const contrastYears = stationContrastDetail.map(e => e.years);
    const contrastValues = stationContrastDetail.map(e => e.value);
    const graphic = chartsNodata(!(contrastValues.every(item => item.every(e => e === null))), theme);
    const stationContrastOption = {
      graphic: graphic,
      legend: {
        itemWidth: 8,
        itemHeight: 5,
      },
      title: {
        text: columnName,
        left: '35px',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      color: this.getColor[theme],
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${dataFormats(item.value, '--', 2)}${item.seriesType === 'line' && '%' || ''}</div>`;
          });
          return (
            `<div class=${styles.tooltipBox}>
                <div class=${styles.axisValue}> <span>${params[0].name}</span> <span>${columnName}</span></div>
                <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
          );
        },
        alwaysShowContent: true,
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: {
        type: 'category',
        data: contrastYears && contrastYears[0],
        axisPointer: {
          type: 'shadow',
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          name: columnUnit,
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
          nameTextStyle: {
            lineHeight: 30,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series: stationContrastDetail.map(e => {
        return ({
          name: e.stationName,
          type: 'bar',
          data: e.value,
          barWidth: '6px',
          itemStyle: {
            barBorderRadius: 3,
          },
        });
      }),
    };
    stationContrastDiagram.setOption(stationContrastOption);
  }



  render() {
    return (
      <div ref={(ref) => { this.charts = ref; }} className={styles.stationContrastDetailBox} />
    );
  }
}

export default StationContrastDetail;
