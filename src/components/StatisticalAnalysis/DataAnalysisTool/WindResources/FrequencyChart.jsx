import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './resources.scss';
import echarts from 'echarts';
import { dataFormats } from '@utils/utilFunc';
import { themeConfig } from '../../../../utils/darkConfig';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class FrequencyChart extends Component{
  static propTypes = {
    frequencyData: PropTypes.array,
    deviceList: PropTypes.array,
    theme: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    saveBtn: PropTypes.bool,
    chartLoading: PropTypes.bool,
    deviceName: PropTypes.string,
    activeCode: PropTypes.string,
    deviceFullCode: PropTypes.string,
    likeStatusChange: PropTypes.func,
    saveImgUrl: PropTypes.func,
    showImg: PropTypes.func,
    getFrequency: PropTypes.func,
    index: PropTypes.number,
    frequencyMaxData: PropTypes.object,
  }
  componentDidMount() {
    const { frequencyData, saveBtn } = this.props;
    const myChart = echarts.init(this.frequencyChart, themeConfig[this.props.theme]); //构建下一个实例
    const option = this.creatOption(frequencyData, saveBtn);
    myChart.setOption(option, true);
  }

  componentWillReceiveProps(nextProps){
    const { saveBtn, frequencyData, activeCode, deviceList, startTime, endTime } = nextProps;
    const requestParams = { startTime, endTime };
    const prevCode = this.props.activeCode;
    if (prevCode === this.props.deviceFullCode) {
      const myChart = echarts.init(this.frequencyChart, themeConfig[nextProps.theme]);
      if (this.props.chartLoading) {
        myChart.hideLoading();
      }
    }
    if ((activeCode !== prevCode && activeCode === this.props.deviceFullCode)) {
      this.renderChart(frequencyData, saveBtn, requestParams);
      const myChart = echarts.init(this.frequencyChart, themeConfig[nextProps.theme]);
      const lightColor = {
        maskColor: 'rgba(255, 255, 255, 0.8)',
        color: '#199475',
      };
      if (this.props.chartLoading) {
        myChart.showLoading('default', lightColor);
      }
      if (this.props.deviceFullCode === deviceList[deviceList.length - 1].deviceFullCode) {//最后一项取消loading
        myChart.hideLoading();
      }
    }
    if (saveBtn !== this.props.saveBtn) {
      this.renderChart(frequencyData, saveBtn, false);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { activeCode, deviceFullCode } = nextProps;
    return activeCode === this.props.deviceFullCode || this.props.deviceFullCode !== deviceFullCode;
  }

  componentWillUnmount() {
    echarts.init(this.frequencyChart, themeConfig[this.props.theme]).dispose();
  }

  creatOption = (frequencyData = [], saveBtn) => {
    const {
      deviceName,
      frequencyMaxData: {
        eneryFrequency,
        speedFrequency,
        windSpeedConfId,
      }} = this.props;
    const windSpeedNameData = [], speedFrequencyData = [], eneryFrequencyData = [];
    frequencyData.forEach(e => {
      // 小于等于最大值
      if(e.windSpeedConfId <= windSpeedConfId) {
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
        top: '10%',
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
          const speendStart = frequencyData[param[0].dataIndex].windSpeedStart;
          const speendEnd = frequencyData[param[0].dataIndex].windSpeedEnd;

          if (tmpSpeed) {
            speed = `<div class=${styles.speedBox}>
              <span class=${styles.speed}></span>
              <span class=${styles.text}>风速频率</span>
              ${dataFormats(speedObject.value, '--', 2)}%
            </div>`;
          }
          if (tmpEnery) {
            enery = `<div class=${styles.eneryBox}>
              <span class=${styles.enery}></span>
              <span class=${styles.text}>风能频率</span>
              ${dataFormats(eneryObject.value, '--', 2)}%
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
        top: '25%',
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
　　　　　　　textStyle: { //textStyle里面写x轴下的字体的样式
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

  renderChart = (frequencyData, saveBtn, isRequest) => {
    const { theme, likeStatusChange, index, saveImgUrl, deviceName, getFrequency, deviceList } = this.props;
    const parms = {
      ...isRequest,
    };
    const myChart = echarts.init(this.frequencyChart, themeConfig[theme]); //构建下一个实例
    myChart.clear();
    const option = this.creatOption(frequencyData, saveBtn );
    myChart.off();
    myChart.on('click', 'title', (payload) => {
      likeStatusChange(index, !saveBtn, frequencyData);
    });

    myChart.on('rendered', () => {
      const imgUrl = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      saveImgUrl && saveImgUrl(deviceName, imgUrl);
    });

    isRequest && setTimeout(() => {
      const continueQuery = index < deviceList.length - 1;
      continueQuery && getFrequency({
        ...parms,
        deviceFullCode: deviceList[index + 1].deviceFullCode,
      });
    }, 50);

    myChart.setOption(option, true);
  }

  render(){
    const { index, showImg } = this.props;
    return(
      <div className={styles.frequencyChart}>
        {showImg && <div className={styles.showModalIcon} onClick={() => showImg(index)}>
          <i className="iconfont icon-enlarge2"></i>
          <i className="iconfont icon-enlarge1"></i>
        </div>}
        <div ref={(ref) => { this.frequencyChart = ref; }} className={styles.frequencyCharts}></div>
      </div>
    );
  }
}
export default (FrequencyChart);
