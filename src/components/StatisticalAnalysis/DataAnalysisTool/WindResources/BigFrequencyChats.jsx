import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig } from '../../../../utils/darkConfig';
import styles from './resources.scss';

class BigFrequencyChats extends Component {
  static propTypes = {
    index: PropTypes.number,
    theme: PropTypes.string,
    likeStatusChange: PropTypes.func,
    deviceList: PropTypes.array,
    curBigChartData: PropTypes.array,
    bigchartLoading: PropTypes.bool,
    saveBtn: PropTypes.bool,
    id: PropTypes.string,
    frequencyMaxData: PropTypes.object,
  }

  componentDidMount() {
    const { curBigChartData, deviceList, index, theme, bigchartLoading } = this.props;
    const curChart = deviceList[index];
    const saveBtn = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';
    const myChart = eCharts.init(this.bigChart, themeConfig[theme]);
    const lightColor = {
      maskColor: 'rgba(255, 255, 255, 0.8)',
      color: '#199475',
    };
    if (bigchartLoading) {
      myChart.showLoading('default', lightColor);
    }
    if (!bigchartLoading) {
      myChart.hideLoading();
    }
    this.renderChart(curBigChartData, saveBtn, deviceName);
  }

  componentWillReceiveProps(nextProps) {
    const { curBigChartData, theme, index, deviceList } = nextProps;
    const { bigChart } = this;
    const curChart = deviceList[index];
    const saveBtn = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';
    const myChart = eCharts.init(bigChart, themeConfig[theme]);
    const lightColor = {
      maskColor: 'rgba(255, 255, 255, 0.8)',
      color: '#199475',
    };
    if (this.props.curBigChartData.length !== curBigChartData.length) {
      myChart.showLoading('default', lightColor);
      this.renderChart(curBigChartData, saveBtn, deviceName);
    }
    if (nextProps.bigchartLoading) {
      myChart.showLoading('default', lightColor);
    }
    if (!nextProps.bigchartLoading) {
      myChart.hideLoading();
    }
    if ((this.props.saveBtn !== saveBtn) || (nextProps.id !== this.props.id)) {
      this.renderChart(curBigChartData, saveBtn, deviceName);
    }
  }

  creatOption = (curBigChartData = [], saveBtn, deviceName) => {
    const {
      frequencyMaxData: {
        eneryFrequency,
        speedFrequency,
        windSpeedConfId,
      }
    } = this.props;
    const windSpeedNameData = [], speedFrequencyData = [], eneryFrequencyData = [];
    curBigChartData.forEach(e => {
      // 小于等于最大值
      if (e.windSpeedConfId <= windSpeedConfId) {
        windSpeedNameData.push(e.windSpeedName);
        speedFrequencyData.push(e.speedFrequency);
        eneryFrequencyData.push(e.eneryFrequency);
      }
    });
    // 取y轴最大值 * 100
    const maxYAxis = eneryFrequency > speedFrequency ? Math.ceil(eneryFrequency * 100) : Math.ceil(speedFrequency * 100);

    const speedLength = speedFrequencyData.filter(e => {
      return e !== null;
    });
    const eneryLength = eneryFrequencyData.filter(e => {
      return e !== null;
    });

    const option = {
      animation: false,
      graphic: (speedLength.length && eneryLength.length) ? hiddenNoData : showNoData,
      color: ['#00cdff', '#ff9000'],
      title: {
        text: [`${deviceName} `, '{b|}'].join(''),
        left: '5%',
        textStyle: {
          fontSize: 14,
          rich: {
            b: {
              height: 20,
              width: 20,
              align: 'center',
              backgroundColor: {
                image: saveBtn ? '/img/mark.png' : '/img/unmark.png',
              },
            },
          },
        },
        triggerEvent: true,
      },
      legend: {
        data: ['风速频率', '风能频率'],
        selectedMode: false,
        top: '5%',
      },
      tooltip: {
        trigger: 'axis',
        padding: 0,
        borderWidth: 0,
        axisPointer: {
          type: 'shadow',
        },
        enterable: true,
        show: true,
        formatter: param => {
          const speedObject = param.find(e => e.seriesName === '风速频率');
          const eneryObject = param.find(e => e.seriesName === '风能频率');
          const tmpSpeed = speedObject && !isNaN(speedObject.value);
          const tmpEnery = eneryObject && !isNaN(eneryObject.value);
          let speed = '', enery = '';
          const speendStart = curBigChartData[param[0].dataIndex].windSpeedStart;
          const speendEnd = curBigChartData[param[0].dataIndex].windSpeedEnd;
          if (tmpSpeed) {
            speed = `<div class=${styles.speedBox}>
              <span class=${styles.speed}></span>
              <span class=${styles.text}>风速频率</span>
              ${speedObject.value}%
            </div>`;
          }
          if (tmpEnery) {
            enery = `<div class=${styles.eneryBox}>
              <span class=${styles.enery}></span>
              <span class=${styles.text}>风能频率</span>
              ${eneryObject.value}%
            </div>`;
          }
          return `<div class=${styles.tipBox}>
            <div class=${styles.title}>风速区间${speendStart}~${speendEnd}</div>
            ${speed}${enery}
          </div>`;
        },
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: windSpeedNameData,
          axisTick: {
            show: false, // 隐藏刻度线
          },
          axisLabel: {
            textStyle: { //textStyle里面写x轴下的字体的样式
              color: '#353535',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: maxYAxis,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
            },
          },
          axisTick: {
            show: false, // 隐藏刻度线
          },
          axisLabel: {
            formatter: '{value}%', // 为y轴数字增加单位
            textStyle: { // textStyle里面写x轴下的字体的样式
              color: '#353535',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#d4d4d4', // 轴线颜色
            },
          },
        },
      ],
      series: [
        {
          name: '风速频率',
          type: 'bar',
          data: speedFrequencyData,
        }, {
          name: '风能频率',
          type: 'bar',
          data: eneryFrequencyData,
        },
      ],
    };
    return option;
  }

  renderChart(curBigChartData, saveBtn, deviceName) {
    const { likeStatusChange, index } = this.props;
    const { bigChart } = this;
    const myChart = eCharts.init(bigChart, themeConfig[this.props.theme]);
    const option = this.creatOption(curBigChartData, saveBtn, deviceName);
    myChart.off();
    myChart.on('click', 'title', () => {
      likeStatusChange(index, !saveBtn, curBigChartData);
    });
    myChart.setOption(option);
  }
  render() {
    return (
      <div ref={(ref) => { this.bigChart = ref; }} className={styles.frequencyCharts}></div>
    );
  }
}

export default (BigFrequencyChats);
