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
    likeStatusChange: PropTypes.func,
    pointY1: PropTypes.string,
    pointY2: PropTypes.string,
    activeCode: PropTypes.string,
    theme: PropTypes.string,
    showImg: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { sequenceData, saveBtn } = this.props;
    const myChart = eCharts.init(this.sequenceChart, themeConfig[this.props.theme]); //构建下一个实例
    const option = this.creatOption(sequenceData, saveBtn);
    myChart.setOption(option, true);
  }
  componentWillReceiveProps(nextProps) {
    const { activeCode, saveBtn, sequenceData, deviceList, startTime, endTime, pointY1, pointY2 } = nextProps;

    const requestParams = { startTime, endTime, pointY1, pointY2 };
    const prevCode = this.props.activeCode;
    // const preData = this.props.sequenceData;
    // if (preData.deviceFullCode === this.props.deviceFullCode) {
    if (prevCode === this.props.deviceFullCode) {
      const myChart = eCharts.init(this.sequenceChart, themeConfig[nextProps.theme]);
      if (this.props.chartLoading) {
        myChart.hideLoading();
      }
    }
    if ((activeCode !== prevCode && activeCode === this.props.deviceFullCode)) {
      this.renderChart(sequenceData, saveBtn, requestParams);//此处的第三个参数是控制定时器是否发送下一个请求
      const myChart = eCharts.init(this.sequenceChart, themeConfig[nextProps.theme]); //构建下一个实例
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
      this.renderChart(sequenceData, saveBtn, false);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { activeCode, deviceFullCode } = nextProps;
    return activeCode === this.props.deviceFullCode || this.props.deviceFullCode !== deviceFullCode;
  }
  componentWillUnmount() {
    const myChart = eCharts.init(this.sequenceChart, themeConfig[this.props.theme]);
    myChart.dispose();
  }
  creatOption = (sequenceData = {}, saveBtn) => {
    const { deviceName, pointCodeNameX, pointCodeNameY, xyValueLimit } = this.props;
    const { xMax, xMin, yMax, yMin } = xyValueLimit;
    const { timeLine = [], point1Data = [], point2Data = [] } = sequenceData;
    // const xAxisTime = timeLine.map((e, i) => (moment(e).format('YYYY-MM-DD HH:mm:ss')));
    const color = ['#ff7878', '#00cdff'];
    const option = {
      graphic: timeLine.length ? hiddenNoData : showNoData,
      color: color,
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
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        enterable: true,
        show: true,
        formatter: (payload) => {
          const y1 = payload[0];
          var data = '';
          payload.forEach(e => {
            return data += `<div class=${styles.lineStyle}>${e.seriesName}:${dataFormat(e.value, '--', 2)} </div>`;
          });
          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
            <div>${deviceName}</div>
            </div>
            <div  style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
            <div>${moment(y1.axisValue).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            ${data}
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
          position: 'left',
          // axisLabel: {
          //   formatter: '{value} kW',
          // },
        }, {
          type: 'value',
          min: yMin,
          max: yMax,

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
    const { deviceList, getSequenceData, index, pointY1, pointY2, likeStatusChange, deviceName, theme } = this.props;
    const parms = {
      ...isRequest,
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

    isRequest && setTimeout(() => {
      const continueQuery = index < deviceList.length - 1;
      continueQuery && getSequenceData({
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


