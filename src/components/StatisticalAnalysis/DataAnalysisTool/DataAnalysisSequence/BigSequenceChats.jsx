import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import eCharts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { dataFormat } from '../../../../utils/utilFunc';
import { themeConfig } from '../../../../utils/darkConfig';
import moment from 'moment';

class BigSequenceCharts extends React.Component {
  static propTypes = {
    curBigChartData: PropTypes.object,
    xyValueLimit: PropTypes.object,
    saveBtn: PropTypes.bool,
    bigchartLoading: PropTypes.bool,
    deviceList: PropTypes.array,
    index: PropTypes.number,
    theme: PropTypes.string,
    pointCodeNameX: PropTypes.string,
    pointCodeNameY: PropTypes.string,
    likeStatusChange: PropTypes.func,
    id: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { curBigChartData, deviceList, index, theme } = this.props;
    const curChart = deviceList[index];
    const saveBtn = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';
    const myChart = eCharts.init(this.bigChart, themeConfig[theme]); //构建下一个实例
    const lightColor = {
      maskColor: 'rgba(255, 255, 255, 0.8)',
      color: '#199475',
    };
    if (this.props.bigchartLoading) {

      myChart.showLoading('default', lightColor);
    }
    if (!this.props.bigchartLoading) {
      myChart.hideLoading();
    }
    this.renderChart(curBigChartData, saveBtn, deviceName);
  }
  componentWillReceiveProps(nextProps) {
    const { curBigChartData, theme, index, deviceList } = nextProps;
    const { bigChart } = this;
    const curChart = deviceList[index];
    const saveBtn = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';
    const myChart = eCharts.init(bigChart, themeConfig[theme]); //构建下一个实例
    const lightColor = {
      maskColor: 'rgba(255, 255, 255, 0.8)',
      color: '#199475',
    };
    if (JSON.stringify(this.props.curBigChartData) !== JSON.stringify(curBigChartData)) {
      myChart.showLoading('default', lightColor);
      this.renderChart(curBigChartData, saveBtn, deviceName);
    }
    if (nextProps.bigchartLoading) {
      myChart.showLoading('default', lightColor);
    }
    if (!nextProps.bigchartLoading) {
      myChart.hideLoading();
    }
    if ((this.props.saveBtn !== saveBtn) || (nextProps.id !== this.props.id)) {
      this.renderChart(curBigChartData, saveBtn, deviceName);
    }
  }
  creatOption = (curBigChartData = {}, saveBtn, deviceName) => {
    const { pointCodeNameX, pointCodeNameY, xyValueLimit } = this.props;
    const { xMax, xMin, yMax, yMin } = xyValueLimit;
    const { timeLine = [], point1Data = [], point2Data = [], point1Unit = '', point2Unit = '' } = curBigChartData;
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
      dataZoom: {
        show: true,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        bottom: 10,
      },
      grid: {
        right: '10%',
        top: 60,
        bottom: '15%',
        left: '10%',
      },
      tooltip: {
        trigger: 'axis',
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
        data: timeLine.map((e, i) => (moment(e).format('YYYY-MM-DD HH:mm:ss'))),
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
          nameGap: 10,
          nameTextStyle: {
            fontSize: 14,

          },
          min: xMin,
          max: xMax,

        }, {
          type: 'value',
          name: point2Unit,
          nameGap: 10,
          nameTextStyle: {
            fontSize: 14,

          },
          min: yMin,
          max: yMax,
          splitLine: false,
        },
      ],
      series: [
        {
          name: pointCodeNameX,
          type: 'line',
          yAxisIndex: 0,
          data: point1Data,
          progressiveThreshold: 10000,
          progressive: 500,
        },
        {
          name: pointCodeNameY,
          type: 'line',
          yAxisIndex: 1,
          data: point2Data,
          progressiveThreshold: 10000,
          progressive: 500,
        }],
    };
    return option;
  }
  renderChart(curBigChartData, saveBtn, deviceName) {
    const { likeStatusChange, index } = this.props;
    const { bigChart } = this;
    const myChart = eCharts.init(bigChart, themeConfig[this.props.theme]); //构建下一个实例
    const option = this.creatOption(curBigChartData, saveBtn, deviceName);
    myChart.off();
    myChart.on('click', 'title', (payload) => {
      likeStatusChange(index, !saveBtn);
    });
    myChart.setOption(option);
  }
  render() {
    return (
      <div ref={(ref) => { this.bigChart = ref; }} className={styles.sequenceChart}>
      </div>
    );
  }
}
export default (BigSequenceCharts);

