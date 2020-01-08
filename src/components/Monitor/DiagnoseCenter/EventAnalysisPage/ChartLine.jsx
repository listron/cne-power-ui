import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { dataFormats } from '@utils/utilFunc';
import styles from './eventAnalysis.scss';

class ChartLine extends PureComponent {

  static propTypes = {
    eventAnalysisInfo: PropTypes.object,
  };

  componentDidMount(){
    const { eventAnalysisInfo } = this.props;
    const { period = [], data = {} } = eventAnalysisInfo || {};
    this.drawChart(period, data);
  }

  componentWillReceiveProps(nextProps){
    const preAnalysiInfo = this.props.eventAnalysisInfo;
    const { eventAnalysisInfo } = nextProps;
    if (eventAnalysisInfo !== preAnalysiInfo) {
      const { period = [], data = {} } = eventAnalysisInfo || {};
      this.drawChart(period, data);
    }
  }

  lineColors = ['#ff9900', '#4d90fd', '#60c060', '#ff8d83', '#00cdff', '#9f98ff', '#d5c503', '#2ad7ab', '#b550b2', '#3e97d1', '#83bcc4', '#cc6500', '#5578c2', '#86acea', '#d3b08e', '#7286f1', '#512ca8', '#33cc27', '#bfbf95', '#986cff'];

  drawChart = (period = [], data = {}) => {
    const lineChart = echarts.init(this.lineRef);
    const { time = [], pointData = [] } = data;
    const legendData = [{
      name: '告警时段',
      icon: 'rect',
    }];
    const markAreaData = period.map(e => {
      const { beginTime, endTime } = e || {};
      return [{
        xAxis: moment(beginTime).format('YYYY-MM-DD HH:mm:ss'),
      }, {
        xAxis: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
      }];
    });
    const series = [{
      name: '告警时段',
      type: 'line',
      data: [],
      markArea: {
        data: markAreaData,
      },
    }];
    const colors = ['#FBE6E3'];
    pointData.forEach((e, i) => {
      const pointName = `${e.deviceName} ${e.pointName}`;
      colors.push(this.lineColors[i % this.lineColors.length]);
      legendData.push({
        name: pointName,
        icon: 'path://M681.38649,914 C682.148892,914 683.387172,914 685.05,914 C685.574671,914 686,914.447715 686,915 C686,915.552285 685.574671,916 685.05,916 C683.395287,916 682.145906,916 681.38649,916 C681.458399,915.583252 681.494354,915.256592 681.494354,915.02002 C681.494354,914.783447 681.458399,914.443441 681.38649,914 Z M671.590869,916 C670.781787,916 669.568164,916 667.95,916 C667.425329,916 667,915.552285 667,915 C667,914.447715 667.425329,914 667.95,914 C669.599694,914 670.766022,914 671.590869,914 C671.520725,914.443358 671.485654,914.776691 671.485654,915 C671.485654,915.221136 671.520725,915.554469 671.590869,916 Z M676.5,919 C674.290861,919 672.5,917.209139 672.5,915 C672.5,912.790861 674.290861,911 676.5,911 C678.709139,911 680.5,912.790861 680.5,915 C680.5,917.209139 678.709139,919 676.5,919 Z',
      });
      series.push({
        name: `${e.deviceName} ${e.pointName || ''}`,
        type: 'line',
        data: e.value,
        showSymbol: false,
        smooth: true,
      });
    });
    const option = {
      legend: {
        data: legendData,
      },
      color: colors,
      grid: {
        show: true,
        borderColor: '#d4d4d4',
        bottom: 60,
        left: '7%',
        right: '7%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        extraCssText: 'padding: 5px 10px; background-color: rgba(0,0,0,0.70); box-shadow:0 1px 4px 2px rgba(0,0,0,0.20); border-radius:2px;',
        formatter: (params = []) => {
          const { name } = params[0] || {};
          return (
            `<section class=${styles.chartTooltip}>
              <h3 class=${styles.tooltipTitle}>${name}</h3>
              ${params.map(e => (
                `<p class=${styles.eachItem}>
                  <span class=${styles.tipIcon}>
                    <span class=${styles.line} style="background-color:${e.color}"></span>
                    <span class=${styles.rect} style="background-color:${e.color}"></span>
                  </span>
                  <span class=${styles.tipName}>${e.seriesName}</span>
                  <span class=${styles.tipValue}>${dataFormats(e.value, '--', 2)}</span>
                </p>`
              )).join('')}
            </section>`
          );
        },
      },
      xAxis: {
        type: 'category',
        data: time.map(e => moment(e).format('YYYY-MM-DD HH:mm:ss')),
        axisLine: {
          show: false,
        },
        axisLabel: {
          // show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series,
    };
    if (pointData.length > 0) {
      option.dataZoom = [
        {
          show: true,
          height: 20,
          bottom: 12,
        }, {
          type: 'inside',
        },
      ];
    }
    lineChart.setOption(option);
  }

  render(){
    return (
      <div className={styles.analysisChart}>
        <div style={{width: '100%', height: '600px'}} ref={(ref) => { this.lineRef = ref; } } />
      </div>
    );
  }
}

export default ChartLine;


