

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
    // 'light': ['#199475', '#c7ceb2'],

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
    const colorArr = [
      ['#61bcae', '#167e65'],
      ['#90cce3', '#3d9cd9'],
      ['#dfb082', '#d0672f'],
      ['#c895d2', '#9445ab'],
      ['#80c6d4', '#2e91af'],
      ['#e38e8f', '#db4849'],
      ['#c8b9a8', '#94765b'],
      ['#91d1c7', '#3eaa91'],
      ['#e1cb40', '#d39b02'],
      ['#8e89cc', '#3d369a'],
      ['#b8d876', '#69a920'],
      ['#d89a84', '#c05740'],
      ['#e07ea6', '#d73c66'],
      ['#bbc214', '#9aa812'],
      ['#b3afd4', '#54509e'],
      ['#cfbb58', '#aa851e'],
      ['#b694df', '#7d4fd5'],
      ['#d490d8', '#b142c0'],
      ['#e5a9b7', '#d55367'],
      ['#8ebad9', '#4a82c3'],
    ];
    const stationContrastOption = {
      graphic: graphic,
      grid: {
        bottom: 100,
      },
      legend: {
        // width: 560,
        left: '10%',
        top: '93%',
        x: 'center',
        y: 'bottom',
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
      // color: this.getColor[theme],
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
      dataZoom: {
        type: 'slider',
        show: true,
        start: 0,
        end: 45,
        zoomLock: true,
        filterMode: 'empty',
        bottom: 55,
        height: '19px',
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleStyle: {
          width: '16px',
          height: '16px',
          borderRadius: '100%',
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
      },
      series: stationContrastDetail.map((e, i) => {
        const color = colorArr[i];

        return ({
          name: e.stationName,
          type: 'bar',
          data: e.value,
          barWidth: '6px',
          itemStyle: {
            barBorderRadius: 3,
          },
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: color[0], // 0% 处的颜色
            }, {
              offset: 1, color: color[1], // 100% 处的颜色
            }],
            global: false, // 缺省为 false
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
