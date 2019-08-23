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
    allChartData: PropTypes.object,
    saveBtn: PropTypes.bool,
    bigchartLoading: PropTypes.bool,

  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.renderChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { allChartData, saveBtn } = this.props;
    const { bigChart } = this;
    const myChart = eCharts.init(bigChart, themeConfig[this.props.theme]); //构建下一个实例
    if (JSON.stringify(allChartData) !== JSON.stringify(nextProps.allChartData)) {
      this.renderChart(nextProps);
    }
    if (nextProps.bigchartLoading) {
      myChart.showLoading();
    }
    if (!nextProps.bigchartLoading) {
      myChart.hideLoading();
    }
    if ((nextProps.saveBtn !== saveBtn) || (nextProps.id !== this.props.id)) {
      // console.log('likestatus发生改变重新渲染');
      this.renderChart(nextProps);
    }
  }
  creatOption = (payload) => {
    const { allChartData, deviceName, pointCodeNameX, pointCodeNameY, saveBtn, point1Max, point1Min, point2Max, point2Min } = payload;
    const { timeLine, point1Data, point2Data } = Object.keys(allChartData).length ? allChartData : { timeLine: [], point1Data: [], point2Data: [] };
    const option = {
      graphic: Object.keys(allChartData).length ? hiddenNoData : showNoData,
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
        bottom: 40,
      },

      grid: {
        right: '10%',
        top: '50px',
        left: '20%',
      },
      tooltip: {
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
          min: point1Min,
          max: point1Max,

        }, {
          type: 'value',
          min: point2Min,
          max: point2Max,
          splitLine: false,
        },
      ],
      series: [
        {
          name: pointCodeNameX,
          type: 'line',
          yAxisIndex: 0,
          data: point1Data,
          progressiveThreshold: 1000,
          progressive: 100,
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
  renderChart(payload) {
    const { likeStatusChange, index, saveBtn } = payload;
    const { bigChart } = this;
    const myChart = eCharts.init(bigChart, themeConfig[this.props.theme]); //构建下一个实例
    const option = this.creatOption(payload);
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

