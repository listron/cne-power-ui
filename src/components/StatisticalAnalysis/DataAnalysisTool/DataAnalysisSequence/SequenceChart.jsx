import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import eCharts from 'echarts';
import { Icon } from 'antd';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig } from '../../../../utils/darkConfig';
import { dataFormat } from '../../../../utils/utilFunc';
import moment from 'moment';


class SequenceChart extends React.Component {
  static propTypes = {
    chartLoading: PropTypes.bool,
    saveBtn: PropTypes.bool,
    index: PropTypes.number,
    deviceList: PropTypes.array,
    sequenceData: PropTypes.object,
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
    // const myChart = eCharts.init(this.sequenceChart, themeConfig[nextProps.theme]);
    const { activeCode, chartLoading, saveBtn, sequenceData } = nextProps;

    const prevCode = this.props.activeCode;
    const preData = this.props.sequenceData;
    if (preData.deviceFullCode === this.props.deviceFullCode) {
      const myChart = eCharts.init(this.sequenceChart, themeConfig[nextProps.theme]);
      if (this.props.chartLoading) {
        myChart.hideLoading();
      }
    }
    if ((activeCode && activeCode !== prevCode && activeCode === this.props.deviceFullCode)) {
      const myChart = eCharts.init(this.sequenceChart, themeConfig[nextProps.theme]); //构建下一个实例
      if (this.props.chartLoading) {
        myChart.showLoading();
      }


      this.renderChart(sequenceData, saveBtn, true);//此处的第三个参数是控制定时器是否发送下一个请求
    }
    if (saveBtn !== this.props.saveBtn) {
      this.renderChart(sequenceData, saveBtn, false);
    }


    // const { chartLoading, index, saveBtn, point1Max, point2Max, theme } = this.props;
    // if (nextProps.chartLoading && (index) === this.props.sequenceData.length) { // loading态控制。第一次无数据，请求数据的过程
    //   myChart.showLoading();
    // }
    // if (!nextProps.chartLoading) {
    //   myChart.hideLoading();
    // }
    // if ((nextProps.saveBtn !== saveBtn)) {
    //   // console.log('likestatus发生改变重新渲染');
    //   myChart.clear();
    //   this.renderChart(nextProps);
    // }
    // if ((index + 1 === nextProps.sequenceData.length) && (chartLoading && nextProps.chartLoading !== chartLoading)) {
    //   // console.log('后面的图渲染');
    //   myChart.clear();//清除
    //   myChart.dispose();
    //   this.renderChart(nextProps);
    // }
    // if ((point1Max !== nextProps.point1Max || point2Max !== nextProps.point2Max)) {
    //   // console.log('limitValue');
    //   myChart.clear();//清除
    //   this.renderChart(nextProps);
    // }

  }
  shouldComponentUpdate(nextProps) {
    const { activeCode, deviceFullCode } = nextProps;
    return activeCode === this.props.deviceFullCode || this.props.deviceFullCode !== deviceFullCode;
  }
  componentWillUnmount() {
    console.log('卸载');
    // eCharts.init(this.chartId, themeConfig[this.props.theme]).dispose();

  }
  creatOption = (sequenceData = {}, saveBtn) => {
    const { deviceName, pointCodeNameX, pointCodeNameY, xyValueLimit } = this.props;
    const { xMax, xMin, yMax, yMin } = xyValueLimit;
    const { timeLine = [], point1Data = [], point2Data = [] } = sequenceData;
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
          min: xMin,
          max: xMax,
          // min: point1Min,
          // max: point1Max,
          position: 'left',
          // axisLabel: {
          //   formatter: '{value} kW',
          // },
        }, {
          type: 'value',
          min: yMin,
          max: yMax,
          // min: point2Min,
          // max: point2Max,
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
          progressive: 200,
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
  renderChart = (sequenceData, saveBtn, isRequest) => {
    const { deviceList, getSequenceData, index, pointY1, pointY2, startTime, endTime, likeStatusChange, deviceName, theme } = this.props;
    const parms = {
      pointY1,
      pointY2,
      startTime,
      endTime,
      interval: 60,
    };

    const myChart = eCharts.init(this.sequenceChart, themeConfig[theme]); //构建下一个实例
    myChart.clear();
    const option = this.creatOption(sequenceData, saveBtn);
    myChart.off();
    myChart.on('click', 'title', (payload) => {
      likeStatusChange(index, !saveBtn, sequenceData);
    });


    myChart.on('rendered', () => {
      const imgUrl = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      this.props.saveImgUrl && this.props.saveImgUrl(deviceName, imgUrl);
    });
    // if ((+sequenceData.length === index + 1) && (index + 1 < deviceList.length)) {
    //   myChart.on('finished', () => {
    //     myChart.off();
    //     myChart.on('click', 'title', (payload) => {
    //       likeStatusChange(index, !saveBtn);
    //     });
    //     getSequenceData(
    //       {
    //         ...parms,
    //         deviceFullCode: deviceList[index + 1].deviceFullCode,
    //       });
    //   });
    // }
    isRequest && setTimeout(() => {
      const continueQuery = index < deviceList.length - 1;
      continueQuery && this.props.getSequenceData({
        ...parms,
        deviceFullCode: deviceList[index + 1].deviceFullCode,
      });
    }, 50);
    myChart.setOption(option, true);
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


