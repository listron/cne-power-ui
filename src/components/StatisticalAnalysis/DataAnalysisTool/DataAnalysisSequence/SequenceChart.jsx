import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import eCharts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import moment from 'moment';
class SequenceChart extends React.Component {
  static propTypes = {
    chartLoading: PropTypes.bool,
    index: PropTypes.number,
    chartTime: PropTypes.number,
    sequenceData: PropTypes.array,
    allChartData: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart); //构建下一个实例
    const option = this.creatOption(this.props);
    myChart.setOption(option);
    const defaultStartime = moment().month(moment().month() - 1).startOf('month').format();
    const defaultEndtime = moment().month(moment().month() - 1).endOf('month').format();
    this.props.getSequenceData({
      deviceFullCode: '73M101M34M1',
      startTime: defaultStartime,
      endTime: defaultEndtime,
      pointY1: 'NC001',
      pointY2: 'TR002',
      interval: 10,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { chartTime: currentChartTime, chartLoading, index, allChartData, sequenceData, saveBtn } = this.props;
    console.log('index: ', index);
    console.log('sequenceData: ', sequenceData, 'nextProps.sequenceData', nextProps.sequenceData);
    console.log('chartLoading: ', chartLoading);
    console.log('sequenceData.length: ', sequenceData.length);
    console.log('loading变化', chartLoading && nextProps.chartLoading !== chartLoading);
    const { chartTime } = nextProps;
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart);
    if (chartLoading && (index) === sequenceData.length) { // loading态控制。第一次无数据，请求数据的过程
      myChart.showLoading();
    }
    // if (chartLoading && (index + 1) === sequenceData.length) {
    //   myChart.showLoading();
    // }
    if (!chartLoading) {
      myChart.hideLoading();
    }

    if (nextProps.saveBtn !== saveBtn) {
      console.log('likestatus发生改变重新渲染');
      this.renderChart(nextProps);
    }
    if ((index + 1 === sequenceData.length) && (allChartData && allChartData !== nextProps.allChartData)) {
      console.log('后面的图渲染');
      myChart.clear();//清除
      this.renderChart(nextProps);
    }
    if ((chartLoading && nextProps.chartLoading !== chartLoading)) {
      console.log('loadding渲染');
      // eCharts.init(sequenceChart).clear();//清除
      this.renderChart(nextProps);
    }

  }
  creatOption = (payload) => {
    console.log('payload: ', payload);
    const { allChartData, deviceName, pointCodeNameX, pointCodeNameY, saveBtn } = payload;
    const { timeLine, point1Data, point2Data } = allChartData ? allChartData : { timeLine: [], point1Data: [], point2Data: [] };
    const option = {
      graphic: allChartData ? hiddenNoData : showNoData,
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
                image: saveBtn ? '/img/mark.png' : '/img/unmark.png',
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
        data: timeLine,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: pointCodeNameX,
          type: 'line',
          progressiveThreshold: 1000,
          progressive: 100,
          data: point1Data,
        },
        {
          name: pointCodeNameY,
          type: 'line',
          data: point2Data,
          progressiveThreshold: 1000,
          progressive: 100,

        }],
    };
    return option;
  }
  renderChart = (payload) => {
    const { allChartData, deviceList, getSequenceData, sequenceData, index, pointY1, pointY2, startTime, endTime, likeStatusChange, saveBtn } = payload;
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart); //构建下一个实例
    // if (!allChartData) { // 空数据销毁后，不进行处理
    //   return;
    // }
    const option = this.creatOption(payload);
    myChart.off();
    myChart.on('click', 'title', (payload) => {
      likeStatusChange(index, !saveBtn);
    });
    myChart.setOption(option, 'noMerge');

    console.log('能否发请求', +sequenceData.length === index + 1 && index + 1 < deviceList.length);
    if (+sequenceData.length === index + 1 && index + 1 < deviceList.length) {
      console.log('请求的设备全编码', deviceList[index + 1].deviceFullCode);
      myChart.on('finished', () => {
        console.log('渲染完');
        getSequenceData({
          deviceFullCode: deviceList[index + 1].deviceFullCode,
          pointY1,
          pointY2,
          startTime,
          endTime,
          interval: 10,
        });
      });
    }
  }
  render() {
    return (
      <div ref={(ref) => { this.sequenceChart = ref; }} className={styles.sequenceChart}>
      </div>
    );
  }
}

export default (SequenceChart);


