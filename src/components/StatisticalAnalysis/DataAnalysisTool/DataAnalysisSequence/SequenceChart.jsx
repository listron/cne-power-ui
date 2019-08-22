import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import eCharts from 'echarts';
import { Icon } from 'antd';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig } from '../../../../utils/darkConfig';
import { dataFormat } from '../../../../utils/utilFunc';

// import { downloadFile } from '../../../../utils/utilFunc';
import moment from 'moment';
class SequenceChart extends React.Component {
  static propTypes = {
    chartLoading: PropTypes.bool,
    saveBtn: PropTypes.bool,
    index: PropTypes.number,
    sequenceData: PropTypes.array,
    deviceList: PropTypes.array,
    allChartData: PropTypes.object,
    getSequenceData: PropTypes.func,
    pointY1: PropTypes.string,
    pointY2: PropTypes.string,
    showImg: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart, themeConfig[this.props.theme]); //构建下一个实例
    const option = this.creatOption(this.props);
    myChart.setOption(option);

  }
  componentWillReceiveProps(nextProps) {
    const { chartLoading, index, saveBtn, point1Max, point2Max, theme } = this.props;
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart, themeConfig[theme]);
    if (nextProps.chartLoading && (index + 1) === nextProps.sequenceData.length) { // loading态控制。第一次无数据，请求数据的过程
      myChart.showLoading();
    }
    if (!nextProps.chartLoading) {
      myChart.hideLoading();
    }
    if ((nextProps.saveBtn !== saveBtn)) {
      // console.log('likestatus发生改变重新渲染');
      this.renderChart(nextProps);
    }

    // if ((index + 1 === nextProps.sequenceData.length)) {
    //   // console.log('后面的图渲染');
    //   myChart.clear();//清除
    //   this.renderChart(nextProps);
    // }
    if ((chartLoading && nextProps.chartLoading !== chartLoading)) {
      // console.log('loadding渲染');
      myChart.clear();//清除
      this.renderChart(nextProps);
    }
    if (point1Max !== nextProps.point1Max || point2Max !== nextProps.point2Max) {
      myChart.clear();//清除
      this.renderChart(nextProps);
    }

  }
  creatOption = (payload) => {
    const { allChartData, deviceName, pointCodeNameX, pointCodeNameY, saveBtn, point1Max, point1Min, point2Max, point2Min } = payload;
    const { timeLine, point1Data, point2Data } = allChartData ? allChartData : { timeLine: [], point1Data: [], point2Data: [] };
    // const xAxisTime = timeLine.map((e, i) => (moment(e).format('YYYY-MM-DD HH:mm:ss')));
    const option = {
      graphic: timeLine.length ? hiddenNoData : showNoData,
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
        // trigger: 'item',
        trigger: 'axis',
        enterable: true,
        show: true,
        axisPointer: {
          type: 'cross',
        },
        formatter: (payload) => {
          const y1 = payload[0];
          const y2 = payload[1];
          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
            <div>${deviceName}</div>
            </div>
            <div  style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
            <div>${moment(y1.axisValue).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div class=${styles.lineStyle}>${pointCodeNameX}:${dataFormat(y1.value, '--', 2)} </div>
            <div class=${styles.lineStyle}>${pointCodeNameY}:${dataFormat(y2.value, '--', 2)} </div>
          </div>`;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLine,
        axisLabel: {
          formatter: (value) => {
            return moment(value).format('YYYY-MM-DD') + '\n' + moment(value).format('HH:mm:ss');

          },
        },
      },
      yAxis: [
        {
          type: 'value',
          min: point1Min,
          max: point1Max,
          position: 'left',
          // axisLabel: {
          //   formatter: '{value} kW',
          // },
        }, {
          type: 'value',
          min: point2Min,
          max: point2Max,
          position: 'right',
          splitLine: false,
          // axisLabel: {
          //   formatter: '{value} °C',
          // },
        },
      ],
      series: [
        {
          name: pointCodeNameX,
          type: 'line',
          yAxisIndex: 0,
          progressiveThreshold: 1000,
          progressive: 100,
          data: point1Data,

        },
        {
          name: pointCodeNameY,
          type: 'line',
          yAxisIndex: 1,
          data: point2Data,
          progressiveThreshold: 1000,
          progressive: 100,


        }],
    };
    return option;
  }
  renderChart = (payload) => {
    const { deviceList, getSequenceData, sequenceData, index, pointY1, pointY2, startTime, endTime, likeStatusChange, saveBtn, deviceName, theme } = payload;
    const parms = {
      pointY1,
      pointY2,
      startTime,
      endTime,
      interval: 60,
    };
    const { sequenceChart } = this;
    const myChart = eCharts.init(sequenceChart, themeConfig[theme]); //构建下一个实例

    const option = this.creatOption(payload);
    myChart.off();
    myChart.on('click', 'title', (payload) => {
      likeStatusChange(index, !saveBtn);
    });

    let imgUrl = myChart.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff',
    });
    myChart.on('rendered', () => {
      imgUrl = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      this.props.saveImgUrl && this.props.saveImgUrl(deviceName, imgUrl);

    });
    if (+sequenceData.length === index + 1 && index + 1 < deviceList.length) {
      myChart.on('finished', () => {
        getSequenceData(
          {
            ...parms,
            deviceFullCode: deviceList[index + 1].deviceFullCode,
          });
      });
    }
    myChart.setOption(option, 'noMerge');
  }
  render() {
    const { index, showImg } = this.props;
    return (
      <div className={styles.chartWrap}>
        {showImg && <Icon type="zoom-in" onClick={() => showImg(index)} className={styles.showModalInco} />}
        <div ref={(ref) => { this.sequenceChart = ref; }} className={styles.sequenceChart}>
        </div>
      </div>
    );
  }
}

export default (SequenceChart);


