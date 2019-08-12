import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import eCharts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class SequenceChart extends React.Component {
  static propTypes = {

  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart); //构建下一个实例
    // const option = { series: [] };
    // myChart.setOption(option);
    this.renderChart(this.props);
    console.log('11111');
  }

  componentDidUpdate(prevProps) {
    console.log('2222');
    const { chartTime: currentChartTime, chartLoading, index } = this.props;
    console.log('index: ', index, prevProps.index);

    console.log('currentChartTime: ', currentChartTime);
    const { chartTime } = prevProps;
    console.log('chartTime: ', chartTime);
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart);
    if (chartLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!chartLoading) {
      myChart.hideLoading();
    }

    if (chartLoading && prevProps.chartLoading !== chartLoading) {
      eCharts.init(sequenceChart).clear();//清除
      this.renderChart(prevProps);

    }
  }
  renderChart = (payload) => {
    // if (Object.keys(data).length === 0) { // 空数据销毁后，不进行处理
    //   return;
    // }
    const { allChartData, deviceList, point1Name, point2Name, chartLoading, getSequenceData, sequenceData, index } = payload;
    console.log('sequenceData: ', sequenceData);
    console.log('index: ', index);
    console.log('chartLoading: ', chartLoading);
    const deviceNameObj = deviceList.filter((e, i) => (e.deviceFullCode === allChartData.deviceFullCode))[0];
    const deviceName = deviceNameObj.deviceName;
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart); //构建下一个实例

    const option = {
      graphic: Object.keys(allChartData.timeLine).length ? hiddenNoData : showNoData,
      title: {
        text: [`${deviceName}`, '{b|}'].join(''),
        left: '5%',
        textStyle: {
          fontSize: 14,
          rich: {
            b: {
              height: 20,
              width: 20,
              align: 'center',
              backgroundColor: {
                image: 0 ? '/img/mark.png' : '/img/unmark.png',
              },
            },
          },
        },
        triggerEvent: true,
      },
      legend: {
        show: true,
      },
      grid: {
        right: '10%',
        top: '50px',
        left: '20%',
      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: allChartData.timeLine,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: point1Name,
          type: 'line',
          progressiveThreshold: 2000,
          progressive: 300,
          data: allChartData.point1Data,

        },
        {
          name: point2Name,
          type: 'line',
          data: allChartData.point2Data,
          progressiveThreshold: 2000,
          progressive: 300,

        }],

    };
    myChart.setOption(option, 'noMerge');
    myChart.on('finished', () => {
      console.log('渲染完');
      //死循环了
      // if (sequenceData.length === index + 1 && index + 1 < deviceList.length) {
      //   console.log('渲染完发请求');
      //   console.log(deviceList[index + 1].deviceFullCode);
      //   getSequenceData({
      //     deviceFullCode: deviceList[index + 1].deviceFullCode,
      //     pointY1: this.props.pointY1,
      //     pointY2: this.props.pointY2,
      //     startTime: this.props.startTime,
      //     endTime: this.props.endTime,
      //     interval: 10,
      //   });
      // }

    });
  }

  render() {
    return (
      <div ref={(ref) => { this.sequenceChart = ref; }} className={styles.sequenceChart}>
      </div>
    );
  }
}

export default (SequenceChart);

