import React, { Component } from 'react';
import {Icon} from 'antd';
import eCharts from 'echarts';
import styles from './windRose.scss';

export default class SingleWindRose extends Component{

  componentDidMount() {
    const { chartId } = this;
    const myChart = eCharts.init(chartId);
    myChart.setOption(this.drawChart());
  }

  drawChart = () => {
    const saveBtn = true;
    const textColor = '#999999';
    const directionData = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const axisLineColor = {
      axisLabel: {
        formatter: '{value}%',
      },
      axisTick: {
        show: false,
      },
    };
    return {
      title: {
        text: [1, '{b|}'].join(''),
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
          formatter: function (params) {
          return `<div class=${styles.tooltip}>
              <span class=${styles.title}>${params.name}</span>
              <div class=${styles.info}>
                <span>占比：</span><span>${params.data}</span><span>%</span>
              </div>
            </div>`;
        },
      },
      angleAxis: [{
        polarIndex: 0,
        type: 'category',
        data: directionData,
        axisLabel: {
          color: textColor,
        },
        boundaryGap: false,
      }, {
        polarIndex: 1,
        type: 'category',
        data: directionData,
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
        data: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        coordinateSystem: 'polar',
        name: '风向',
      }, {
        polarIndex: 1,
        type: 'bar',
        color: '#f9b600',
        barWidth: 20,
        data: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        coordinateSystem: 'polar',
        name: '风能',
      }],
    };
  };

  render(){
    return(
      <div className={styles.chartWrap}>
        <Icon type="zoom-in" className={styles.showModalIcon} />
        <span className={styles.windDirection}>风向</span>
        <span className={styles.windPower}>风能</span>
        <div ref={ref => { this.chartId = ref;}} className={styles.windRoseStyle} />
      </div>
    );
  }
}
