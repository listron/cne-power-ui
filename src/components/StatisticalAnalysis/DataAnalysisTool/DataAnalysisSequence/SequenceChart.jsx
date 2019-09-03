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
    deviceName: PropTypes.string,
    pointCodeNameX: PropTypes.string,
    pointCodeNameY: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    xyValueLimit: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { sequenceData, saveBtn, xyValueLimit } = this.props;
    const myChart = eCharts.init(this.sequenceChart, themeConfig[this.props.theme]); //构建下一个实例
    const option = this.creatOption(sequenceData, saveBtn, xyValueLimit);
    myChart.setOption(option, true);
  }
  componentWillReceiveProps(nextProps) {
    const { activeCode, saveBtn, sequenceData, deviceList, startTime, endTime, pointY1, pointY2, xyValueLimit } = nextProps;
    const requestParams = { startTime, endTime, pointY1, pointY2 };
    const prevCode = this.props.activeCode;
    if (prevCode === this.props.deviceFullCode) {
      const myChart = eCharts.init(this.sequenceChart, themeConfig[nextProps.theme]);
      if (this.props.chartLoading) {
        myChart.hideLoading();
      }
    }
    if ((activeCode !== prevCode && activeCode === this.props.deviceFullCode)) {
      this.renderChart(sequenceData, saveBtn, requestParams, xyValueLimit);//此处的第三个参数是控制定时器是否发送下一个请求
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
      this.renderChart(sequenceData, saveBtn, false, xyValueLimit);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { activeCode, deviceFullCode } = nextProps;
    return activeCode === this.props.deviceFullCode || this.props.deviceFullCode !== deviceFullCode;
  }
  componentWillUnmount() {
    eCharts.init(this.sequenceChart, themeConfig[this.props.theme]).dispose();
  }
  creatOption = (sequenceData = {}, saveBtn, xyValueLimit) => {
    const { deviceName, pointCodeNameX, pointCodeNameY } = this.props;
    const { xMax, xMin, yMax, yMin } = xyValueLimit;
    const { timeLine = [], point1Data = [], point2Data = [], point1Unit = '', point2Unit = '' } = sequenceData;
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
        top: 50,
        left: '10%',
      },
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'cross',
        // },
        enterable: true,
        show: true,
        formatter: (payload) => {
          const y1 = payload[0];
          var data = '';
          payload.forEach(e => {
            data += `<div class=${styles.lineStyle}>${e.seriesName}:${dataFormat(e.value, '--', 2)} </div>`;
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
          name: point1Unit,
          min: xMin,
          max: xMax,
          position: 'left',
          // axisLabel: {
          //   formatter: '{value} kW',
          // },
        }, {
          type: 'value',
          name: point2Unit,
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
          progressiveThreshold: 3000,
          progressive: 500,
          data: point1Data,

        },
        {
          name: pointCodeNameY,
          type: 'line',
          yAxisIndex: 1,
          data: point2Data,
          progressiveThreshold: 3000,
          progressive: 500,


        }],
    };
    return option;
  }
  renderChart = (sequenceData, saveBtn, isRequest, xyValueLimit) => {
    const { deviceList, getSequenceData, index, likeStatusChange, deviceName, theme, saveImgUrl } = this.props;
    const parms = {
      ...isRequest,
      interval: 60,
    };

    const myChart = eCharts.init(this.sequenceChart, themeConfig[theme]); //构建下一个实例
    myChart.clear();
    const option = this.creatOption(sequenceData, saveBtn, xyValueLimit);
    myChart.off();
    myChart.on('click', 'title', (payload) => {
      likeStatusChange(index, !saveBtn, sequenceData);
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
      continueQuery && getSequenceData({
        ...parms,
        deviceFullCode: deviceList[index + 1].deviceFullCode,
      });
    }, 50);
    myChart.setOption(option, true);
  }
  render() {
    const { index, showImg, sequenceData } = this.props;
    return (
      //showImg不应该传第二个参数，会污染数据源
      <div className={styles.chartWrap}>
        {showImg && <Icon type="zoom-in" onClick={() => showImg(index)} className={styles.showModalInco} />}
        <div ref={(ref) => { this.sequenceChart = ref; }} className={styles.sequenceChart}>
        </div>
      </div>
    );
  }
}

export default (SequenceChart);


