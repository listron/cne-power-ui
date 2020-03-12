
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { dataFormats } from '@utils/utilFunc';
import styles from './eventAnalysis.scss';

class ChartBar extends PureComponent {
  static propTypes = {
    eventAnalysisLoading: PropTypes.bool,
    eventAnalysisInfo: PropTypes.object,
  };

  componentDidMount(){
    const { eventAnalysisInfo } = this.props;
    const { data = [] } = eventAnalysisInfo || {};
    this.drawChart(data);
  }

  componentWillReceiveProps(nextProps){
    const preAnalysiInfo = this.props.eventAnalysisInfo;
    const preLoading = this.props.eventAnalysisLoading;
    const { eventAnalysisInfo, eventAnalysisLoading } = nextProps;
    // if (eventAnalysisLoading && !preLoading) { // 数据加载中
    //   this.chartLoading();
    // }
    if (eventAnalysisInfo !== preAnalysiInfo) {
      const { data = [] } = eventAnalysisInfo || {};
      this.drawChart(data);
    }
  }

  // chartLoading = () => {
  //   const barChart = echarts.init(this.lineRef);
  //   barChart.showLoading();
  // }

  drawChart = (data = []) => {
    const barChart = echarts.init(this.barRef);
    // barChart.hideLoading();
    const xNames = [], baseData = [], theoryData = [], lineData = [];
    data.forEach((e) => {
      xNames.push(e.name);
      baseData.push(e.gen);
      theoryData.push(e.theoryGen);
      lineData.push(e.diff);
    });
    const option = {
      grid: {
        show: true,
        borderColor: '#d4d4d4',
        top: 0,
        bottom: 104,
        left: '7%',
        right: '7%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        extraCssText: 'padding: 5px 10px; background-color: rgba(0,0,0,0.70); box-shadow:0 1px 4px 2px rgba(0,0,0,0.20); border-radius:2px;',
        axisPointer: {
          type: 'none',
          animation: false,
          label: {
            show: true,
            color: '#199475',
            backgroundColor: '#fff',
            fontSize: 14,
            shadowColor: 'rgba(0, 0, 0, 0)',
            shadowBlur: 0,
          },
        },
        formatter: (params = []) => {
          const { name, value: baseValue } = params[0] || {};
          const { value: theoryValue } = params[1] || {};
          const { value: rateValue } = params[2] || {};
          return (
            `<section class=${styles.chartTooltip}>
              <h3 class=${styles.tooltipTitle}>${name}</h3>
              <div>
                <p class=${styles.eachItem}>
                  <span class=${styles.barRect}></span>
                  <span class=${styles.tipName} style="flex: 0 0 176px">逆变器直流发电量(kWh)</span>
                  <span class=${styles.tipValue}>${dataFormats(baseValue, '--', 2, true)}</span>
                </p>
                <p class=${styles.eachItem}>
                  <span class=${styles.barBorderRect}></span>
                  <span class=${styles.tipName} style="flex: 0 0 176px">方阵理论发电量(kWh)</span>
                  <span class=${styles.tipValue}>${dataFormats(theoryValue, '--', 2, true)}</span>
                </p>
                <p class=${styles.eachItem}>
                  <span class=${styles.tipIcon}>
                    <span class=${styles.line} style="background-color: #ff9900"></span>
                    <span class=${styles.rect} style="background-color: #ff9900; border: solid 1px #fff"></span>
                  </span>
                  <span class=${styles.tipName} style="flex: 0 0 176px">对比差值(%)</span>
                  <span class=${styles.tipValue}>${dataFormats(rateValue * 100, '--', 2, true)}</span>
                </p>
              </div>
            </section>`
          );
        },
      },
      xAxis: {
        type: 'category',
        data: xNames,
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 14,
          color: '#353535',
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
        }, {
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
      series: [
        {
          name: '逆变器直流发电量(kWh)',
          type: 'bar',
          itemStyle: {
            color: '#CEEBE0',
          },
          emphasis: {
            itemStyle: {
              color: '#CEEBE0',
            },
          },
          barWidth: 34,
          data: baseData,
        }, {
          name: '方阵理论发电量(kWh)',
          type: 'bar',
          barWidth: 34,
          barGap: '-100%',
          itemStyle: {
            // color: '#FFF',
            color: 'transparent',
            borderWidth: 1,
            borderColor: '#199475',
            barBorderRadius: [2, 2, 0, 0],
          },
          emphasis: {
            itemStyle: {
              borderWidth: 3,
              shadowColor: 'rgba(25,148,117,0.70)',
              shadowBlur: 2,
              shadowOffsetX: 0,
              shadowOffsetY: 2,
            },
          },
          data: theoryData,
        }, {
          name: '对比差值(%)',
          type: 'line',
          data: lineData,
          yAxisIndex: 1,
          itemStyle: {
            color: '#ff9900',
          },
        },
      ],
    };
    if (data.length > 10) {
      const handlerInfo = {
        start: 0,
        end: parseInt(10 / data.length * 100, 10),
        zoomLock: true,
      };
      option.dataZoom = [
        {
          show: true,
          height: 20,
          bottom: 16,
          ...handlerInfo,
        }, {
          type: 'inside',
          ...handlerInfo,
        },
      ];
    }
    barChart.clear();
    barChart.setOption(option);
  }

  render(){
    return (
      <div className={styles.analysisChart}>
        <div style={{width: '100%', height: '560px'}} ref={(ref) => { this.barRef = ref; } } />
      </div>
    );
  }
}

export default ChartBar;

