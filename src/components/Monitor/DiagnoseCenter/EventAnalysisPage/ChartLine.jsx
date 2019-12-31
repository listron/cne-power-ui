import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import styles from './eventAnalysis.scss';

class ChartLine extends PureComponent {

  static propTypes = {
    eventAnalysisInfo: PropTypes.object,
  };

  componentDidMount(){
    const { eventAnalysisInfo } = this.props;
    const { period = [], data = [] } = eventAnalysisInfo || {};
    this.drawChart(period, data);
  }

  componentWillReceiveProps(nextProps){
    const preAnalysiInfo = this.props.eventAnalysisInfo;
    const { eventAnalysisInfo } = nextProps;
    if (eventAnalysisInfo !== preAnalysiInfo) {
      const { period = [], data = [] } = eventAnalysisInfo || {};
      this.drawChart(period, data);
    }
  }

  drawChart = (period = [], data = {}) => {
    const lineChart = echarts.init(this.lineRef);
    const { time, pointData = [] } = data;
    const series = pointData.map(e => ({
      name: e.deviceName,
      type: 'line',
      data: e.value,
      yAxisIndex: 0,
      axisTick: {
        show: false,
      },
    }));
    const option = {
      legend: {},
      color: ['#c57576', '#119475'],
      grid: {
        show: false,
        bottom: 25,
        left: '13%',
        right: '14%',
        top: 32,
      },
      // tooltip: {
      //   trigger: 'axis',
      //   show: true,
      //   formatter: (params) => {
      //     let paramsItem = '';
      //     params.forEach(item => {
      //       return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${item.color}"> </span> 
      //         ${item.seriesName} :  ${item.value}</div>`;
      //     });
      //     return (
      //       `<div class=${styles.tooltipBox}>
      //             <div class=${styles.axisValue}>${params[0].name}</div>
      //             <div class=${styles.tooltipContainer}> ${paramsItem}</div>
      //         </div>`
      //     );
      //   },
      // },
      xAxis: {
        type: 'category',
        // splitNumber: 4,
        // boundaryGap: false,
        data: time,
        axisLine: {
          lineStyle: {
            // color: '#dfdfdf',
          },
        },
        axisLabel: {
          // color: lineColor,
        },
        axisTick: {
          show: false,
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
          nameTextStyle: {
            padding: [0, 0, 0, 20],
          },
          axisLine: {
            show: true,
            lineStyle: {
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series,
    };
    lineChart.setOption(option);
  }

  render(){
    return (
      <div className={styles.analysisChart}>
        {/* <div>
          <span>告警时段</span>

        </div> */}
        <div style={{width: '1000px', height: '600px'}} ref={(ref) => { this.lineRef = ref; } } />
      </div>
    );
  }
}

export default ChartLine;


