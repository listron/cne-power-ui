import React, {Component} from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { themeConfig } from '@utils/darkConfig';
import {dataFormats} from '@utils/utilFunc';
import styles from './windRose.scss';

export default class BigWindRose extends Component{
  static propTypes = {
    index: PropTypes.number,
    theme: PropTypes.string,
    likeStatusChange: PropTypes.func,
    deviceList: PropTypes.array,
    bigWindRoseData: PropTypes.array,
    bigWindRoseLoading: PropTypes.bool,
    saveBtn: PropTypes.bool,
    id: PropTypes.string,
  };

  componentDidMount(){
    const { bigWindRoseData, deviceList, index, theme, bigWindRoseLoading } = this.props;
    const curChart = deviceList[index];
    const saveBtn = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';
    const myChart = eCharts.init(this.bigChart, themeConfig[theme]);
    const lightColor = {
      maskColor: 'rgba(255, 255, 255, 0.8)',
      color: '#199475',
    };
    if (bigWindRoseLoading) {
      myChart.showLoading('default', lightColor);
    }
    if (!bigWindRoseLoading) {
      myChart.hideLoading();
    }
    this.renderChart(bigWindRoseData, saveBtn, deviceName);
  }

  componentWillReceiveProps(nextProps){
    const { bigWindRoseData, theme, index, deviceList } = nextProps;
    const { bigChart } = this;
    const curChart = deviceList[index];
    const saveBtn = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';
    const myChart = eCharts.init(bigChart, themeConfig[theme]);
    const lightColor = {
      maskColor: 'rgba(255, 255, 255, 0.8)',
      color: '#199475',
    };
    if(this.props.bigWindRoseData.length !== bigWindRoseData.length){
      myChart.showLoading('default', lightColor);
      this.renderChart(bigWindRoseData, saveBtn, deviceName);
    }
    if (nextProps.bigWindRoseLoading) {
      myChart.showLoading('default', lightColor);
    }
    if (!nextProps.bigWindRoseLoading) {
      myChart.hideLoading();
    }
    if ((this.props.saveBtn !== saveBtn) || (nextProps.id !== this.props.id)) {
      this.renderChart(bigWindRoseData, saveBtn, deviceName);
    }
  }

  drawChart = (bigWindRoseData = [], saveBtn, deviceName) => {
    const textColor = '#999999';
    // 坐标
    const coordinatesData = bigWindRoseData && bigWindRoseData.map(cur => (cur.rangName));
    // 风向value
    const directionArr = bigWindRoseData && bigWindRoseData.map(cur => (cur.directionPercent));
    // 风能value
    const energyArr = bigWindRoseData && bigWindRoseData.map(cur => (cur.energyPercent));
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
                <span>占比：</span><span>${dataFormats(data, '--', 2)}</span><span>%</span>
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
        emphasis: {
          itemStyle: {
            color: '#00cdff',
            shadowColor: '#ccc',
            shadowOffsetY: 1,
          },
        },
        data: directionArr,
        coordinateSystem: 'polar',
        name: '风向',
      }, {
        polarIndex: 1,
        type: 'bar',
        color: '#f9b600',
        barWidth: 20,
        emphasis: {
          itemStyle: {
            color: '#ff8f2a',
            shadowColor: '#ccc',
            shadowOffsetY: 1,
          },
        },
        data: energyArr,
        coordinateSystem: 'polar',
        name: '风能',
      }],
    };
  };

  renderChart(bigWindRoseData, saveBtn, deviceName) {
    const { likeStatusChange, index } = this.props;
    const { bigChart } = this;
    const myChart = eCharts.init(bigChart, themeConfig[this.props.theme]);
    const option = this.drawChart(bigWindRoseData, saveBtn, deviceName);
    myChart.off();
    myChart.on('click', 'title', () => {
      likeStatusChange(index, !saveBtn, bigWindRoseData);
    });
    myChart.setOption(option);
  }
  render(){
    const { bigWindRoseData, bigWindRoseLoading } = this.props;
    // 风向value
    const directionArr = bigWindRoseData && bigWindRoseData.map(cur => (cur.directionPercent));
    const directionFlag = directionArr.every((cur) => {return cur === null;});
    // 风能value
    const energyArr = bigWindRoseData && bigWindRoseData.map(cur => (cur.energyPercent));
    const energyFlag = energyArr.every((cur) => {return cur === null;});
    return (
      <div className={styles.bigWindRoseBox}>
        <span className={styles.windDirectionTitle}>风向</span>
        <span className={styles.windPowerTitle}>风能</span>
        {(!bigWindRoseLoading && directionFlag) && <div className={styles.firstBigInfo}>暂无数据</div>}
        {(!bigWindRoseLoading && energyFlag) && <div className={styles.secondBigInfo}>暂无数据</div>}
        <div ref={(ref) => { this.bigChart = ref; }} className={styles.bigWindRose} />
      </div>
    );
  }
}
