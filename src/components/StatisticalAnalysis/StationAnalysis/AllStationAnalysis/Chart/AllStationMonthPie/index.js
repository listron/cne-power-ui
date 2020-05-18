import React from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData';
import { themeConfig, chartsNodata } from '../../../../../../utils/darkConfig';
import styles from './index.scss';

class AllStationMonthPie extends React.Component {
  static propTypes = {
    allStationMonthpie: PropTypes.string,
  };
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
    if (this.props.theme !== nextProps.theme) {
      this.drawChart(nextProps, true);
    }
  }



  drawChart = (param, themeChange) => {
    const { yAxisName, pieTargetData, hasData, xAxisName, theme } = param;
    let targetPieChart = echarts.init(this.chart, themeConfig[theme]);;
    if (themeChange) {
      targetPieChart.dispose();
      targetPieChart = echarts.init(this.chart, themeConfig[theme]);
    }
    const reg = /\((.+)\)/g;
    const unit = reg.exec(yAxisName)[1] || '';
    targetPieChart.resize();
    const graphic = (hasData || hasData === false) && chartsNodata(hasData, theme) || ' ';
    const darkColor = ['#fd6e8f', '#ee635f', '#fa936b', '#f8b14e', '#4a90e2', '#49b5d2', '#35c3ad', '#1bd77b', '#b4e350', '#e4ef85', '#9b9b9b', '#ceebe0'];
    const lightColor = ['#a42b2c', '#d48265', '#91c7af', '#749f83', '#ca8622', '#efc17e', '#d8907a', '#bda29a', '#546570', '#6e7074', '#9b9b9b', '#ceebe0'];
    const targetPieOption = {
      graphic: graphic,
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          let paramsItem = '';
          paramsItem = `<div class=${styles.tooltipCont}>  ${yAxisName.split('(')[0]}:${params.value}${unit} </div><div class=${styles.tooltipCont}>  ${'占比'}:${params.percent}${'%'} </div>`;
          if (params.seriesName === 'PR') {
            return paramsItem = ` <div class=${styles.tooltipCont}>  ${yAxisName.split('(')[0]}:${params.value}${unit} </div>`;
          }
          return (
            `<div class=${styles.tooltipBox}>
                  <div class=${styles.axisValue}>${params.name}</div>
                  <div class=${styles.tooltipContainer}>
                   <div class=${styles.tooltipCont}>  ${paramsItem} </div>
                  </div>
              </div>`
          );
        },
      },
      series: [
        {
          name: xAxisName,
          type: 'pie',
          color: theme === 'dark' ? darkColor : lightColor,
          radius: ['40%', '55%'],
          center: ['50%', '50%'],
          data: pieTargetData,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    targetPieChart.setOption(targetPieOption, { notMerge: true });
  };

  render() {
    const { theme } = this.props;
    return (
      <div className={styles[theme]} ref={ref => (this.chart = ref)}> </div>
    );
  }
}
export default (AllStationMonthPie);
