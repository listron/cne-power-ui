import React, {Component} from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig } from '../../../../utils/darkConfig';
import styles from './resources.scss';

// 设置下标
let firstIndex = null;
let lastIndex = null;

class BigFrequencyChats extends Component{
  static propTypes = {
    index: PropTypes.number,
    theme: PropTypes.string,
    likeStatusChange: PropTypes.func,
    deviceList: PropTypes.array,
    curBigChartData: PropTypes.array,
    bigchartLoading: PropTypes.bool,
    saveBtn: PropTypes.bool,
    id: PropTypes.string,
  }

  componentDidMount(){
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

  componentWillReceiveProps(nextProps){
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
    if(this.props.curBigChartData.length !== curBigChartData.length){
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
      // 重置下标
      firstIndex = null;
      lastIndex = null;
      this.renderChart(curBigChartData, saveBtn, deviceName);
    }
  }

  creatOption = (curBigChartData = [], saveBtn, deviceName) => {
    const windSpeedNameData = [], speedFrequencyData = [], eneryFrequencyData = [];
    curBigChartData.forEach((e, index) => {
      if(e.speedFrequency !== null && e.eneryFrequency !== null && firstIndex === null) {
        firstIndex = index;
      }
      if(e.speedFrequency !== null && e.eneryFrequency !== null) {
        lastIndex = index;
      }
    });
    // 截取数据
    const sliceArr = curBigChartData.slice(firstIndex, lastIndex);
    // 遍历数据
    sliceArr.forEach(cur => {
      windSpeedNameData.push(cur.windSpeedName);
      speedFrequencyData.push(cur.speedFrequency);
      eneryFrequencyData.push(cur.eneryFrequency);
    });

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
              color: '#666',
            },
          },
          axisLine: {
            lineStyle: {
                color: '#dfdfdf',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 20,
          interval: 4, // y轴每个数字之间的间隔
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
              color: '#666',
            },
          },
          axisLine: {
            lineStyle: {
                color: '#dfdfdf', // 轴线颜色
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
    myChart.on('click', 'title', ()=>{
      likeStatusChange(index, !saveBtn, curBigChartData);
    });
    myChart.setOption(option);
  }
  render(){
    return (
      <div ref={(ref) => { this.bigChart = ref; }} className={styles.frequencyCharts}></div>
    );
  }
}

export default (BigFrequencyChats);
