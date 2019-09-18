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
      angleAxis: [{
        polarIndex: 0,
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        z: 10,
      }, {
        polarIndex: 1,
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        z: 10,
      }],
      radiusAxis: [{
        polarIndex: 0,
        min: 0,
      }, {
        polarIndex: 1,
        min: 0,
      }],
      polar: [{
        center: ['25%', '60%'],
        radius: '50%',
      }, {
        center: ['75%', '60%'],
        radius: '50%',
      }],
      series: [{
        polarIndex: 0,
        type: 'bar',
        data: [1, 2, 3, 4, 3, 5, 1],
        coordinateSystem: 'polar',
        name: '风向',
      }, {
        polarIndex: 1,
        type: 'bar',
        data: [2, 4, 6, 1, 3, 2, 1],
        coordinateSystem: 'polar',
        name: '风能',
      }],
    };
  };

  render(){
    return(
      <div className={styles.chartWrap}>
        <Icon type="zoom-in" className={styles.showModalIcon} />
        <div ref={ref => { this.chartId = ref;}} className={styles.windRoseStyle} />
      </div>
    );
  }
}
