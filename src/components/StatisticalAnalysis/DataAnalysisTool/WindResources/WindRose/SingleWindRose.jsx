import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import eCharts from 'echarts';
import {themeConfig} from '@utils/darkConfig';

import styles from './windRose.scss';


export default class SingleWindRose extends Component{

  static propTypes = {
    directionsData: PropTypes.array,
    saveBtn: PropTypes.bool,
    theme: PropTypes.string,
    deviceName: PropTypes.string,
    deviceList: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    directionsLoading: PropTypes.bool,
    deviceFullCode: PropTypes.string,
    directionsCode: PropTypes.string,
    getDirections: PropTypes.func,
    index: PropTypes.number,
    likeStatusChange: PropTypes.func,
    saveImgUrl: PropTypes.func,
    showImg: PropTypes.func,
  };

  componentDidMount() {
    const { directionChart } = this;
    const { directionsData, saveBtn, theme } = this.props;
    const myChart = eCharts.init(directionChart, themeConfig[theme]); //构建下一个实例
    const option = this.drawChart(directionsData, saveBtn);
    myChart.setOption(option, true);
  }

  componentWillReceiveProps(nextProps){
    const { directionChart } = this;
    const { saveBtn, directionsData, directionsCode, deviceList, startTime, endTime } = nextProps;
    const requestParams = { startTime, endTime };
    const prevCode = this.props.directionsCode;
    const prevFullCode = this.props.deviceFullCode;
    if (prevCode === prevFullCode) {
      const myChart = eCharts.init(directionChart, themeConfig[nextProps.theme]);
      if (this.props.directionsLoading) {
        myChart.hideLoading();
      }
    }
    if ((directionsCode !== prevCode && directionsCode === prevFullCode)) {
      this.renderChart(directionsData, saveBtn, requestParams);
      const myChart = eCharts.init(directionChart, themeConfig[nextProps.theme]);
      const lightColor = {
        maskColor: 'rgba(255, 255, 255, 0.8)',
        color: '#199475',
      };
      if (this.props.directionsLoading) {
        myChart.showLoading('default', lightColor);
      }
      if (prevFullCode === deviceList[deviceList.length - 1].deviceFullCode) {//最后一项取消loading
        myChart.hideLoading();
      }
    }
    if (saveBtn !== this.props.saveBtn) {
      this.renderChart(directionsData, saveBtn, false);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { directionsCode, deviceFullCode } = nextProps;
    return directionsCode === this.props.deviceFullCode || this.props.deviceFullCode !== deviceFullCode;
  }

  componentWillUnmount() {
    const { directionChart } = this;
    const { theme } = this.props;
    eCharts.init(directionChart, themeConfig[theme]).dispose();
  }

  drawChart = (directionsData = [], saveBtn) => {
    const { deviceName } = this.props;
    const textColor = '#999999';
    // 坐标
    const coordinatesData = directionsData && directionsData.map(cur => (cur.rangName));
    // 风向value
    const directionArr = directionsData && directionsData.map(cur => (cur.directionPercent));
    // 风能value
    const energyArr = directionsData && directionsData.map(cur => (cur.energyPercent));
    const axisLineColor = {
      axisLabel: {
        formatter: '{value}%',
      },
      axisTick: {
        show: false,
      },
    };
    return {
      animation: false,
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
      tooltip: {
        show: true,
        padding: 0,
        borderWidth: 0,
        axisPointer: { //去掉移动的指示线
          type: 'none',
        },
        formatter: function (params) {
          const { name, data } = params[0];
          return `<div class=${styles.tooltip}>
              <span class=${styles.title}>${name}</span>
              <div class=${styles.info}>
                <span>占比：</span><span>${data}</span><span>%</span>
              </div>
            </div>`;
        },
      },
      angleAxis: [{
        polarIndex: 0,
        type: 'category',
        data: coordinatesData,
        axisLabel: {
          color: textColor,
        },
        boundaryGap: false,
      }, {
        polarIndex: 1,
        type: 'category',
        data: coordinatesData,
        axisLabel: {
          color: textColor,
        },
        boundaryGap: false,
      }],
      radiusAxis: [{
        polarIndex: 0,
        min: 0,
        z: 2,
        ...axisLineColor,
      }, {
        polarIndex: 1,
        min: 0,
        z: 2,
        ...axisLineColor,
      }],
      polar: [{
        center: ['25%', '50%'],
        radius: '50%',
      }, {
        center: ['75%', '50%'],
        radius: '50%',
      }],
      series: [{
        polarIndex: 0,
        type: 'bar',
        color: '#3e97d1',
        barWidth: 20,
        data: directionArr,
        emphasis: {
          itemStyle: {
            color: '#00cdff',
            shadowColor: '#ccc',
            shadowOffsetY: 1,
          },
        },
        coordinateSystem: 'polar',
        name: '风向',
      }, {
        polarIndex: 1,
        type: 'bar',
        color: '#f9b600',
        barWidth: 20,
        data: energyArr,
        emphasis: {
          itemStyle: {
            color: '#ff8f2a',
            shadowColor: '#ccc',
            shadowOffsetY: 1,
          },
        },
        coordinateSystem: 'polar',
        name: '风能',
      }],
    };
  };

  renderChart = (directionsData, saveBtn, isRequest) => {
    const { theme, likeStatusChange, index, saveImgUrl, deviceName, getDirections, deviceList } = this.props;
    const params = {
      ...isRequest,
    };
    const { directionChart } = this;
    const myChart = eCharts.init(directionChart, themeConfig[theme]); //构建下一个实例
    myChart.clear();
    const option = this.drawChart(directionsData, saveBtn );
    myChart.off();
    myChart.on('click', 'title', () => {
      likeStatusChange(index, !saveBtn, directionsData);
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
      continueQuery && getDirections({
        ...params,
        deviceFullCode: deviceList[index + 1].deviceFullCode,
      });
    }, 100);

    myChart.setOption(option, true);
  };

  render(){
    const { index, showImg, directionsData, directionsLoading } = this.props;
    // 风向value
    const directionArr = directionsData && directionsData.map(cur => (cur.directionPercent));
    const directionFlag = directionArr.every((cur) => {return cur === null;});
    // 风能value
    const energyArr = directionsData && directionsData.map(cur => (cur.energyPercent));
    const energyFlag = energyArr.every((cur) => {return cur === null;});
    return(
      <div className={styles.chartWrap}>
        <Icon type="zoom-in" onClick={() => showImg(index)} className={styles.showModalIcon} />
        <span className={styles.windDirection}>风向</span>
        <span className={styles.windPower}>风能</span>
        {(directionsLoading && directionFlag) && <div className={styles.firstInfo}>
          <div>
            暂无数据
          </div>
        </div>}
        {(directionsLoading && energyFlag) && <div className={styles.secondInfo}>
          <div>
            暂无数据
          </div>
        </div>}
        <div ref={ref => { this.directionChart = ref;}} className={styles.windRoseStyle} />
      </div>
    );
  }
}
