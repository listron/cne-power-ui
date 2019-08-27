import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig, chartsLoading } from '../../../../utils/darkConfig';
import { dataFormat } from '../../../../utils/utilFunc';
import moment from 'moment';


class BigScattrChart extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { bigScatterData, deviceList, index } = this.props;
    const curChart = deviceList[index];
    const saveBtn = curChart ? curChart.likeStatus : false;
    const title = curChart ? curChart.deviceName : '';
    this.drawChat(bigScatterData, saveBtn, title);
  }
  componentWillReceiveProps(nextProps) {
    const { bigScatterData, bigchartLoading, theme, index, deviceList } = nextProps;
    const curChart = deviceList[index];
    const saveBtn = curChart ? curChart.likeStatus : false;
    const title = curChart ? curChart.deviceName : '';
    const bigscatterChart = echarts.init(this.bigScattrchart, themeConfig[theme]);
    if (bigchartLoading) {
      bigscatterChart.showLoading();
    }
    if (!bigchartLoading) {
      bigscatterChart.hideLoading();
    }
    this.drawChat(bigScatterData, saveBtn, title);
  }
  creatOption = (bigScatterData = {}, saveBtn, title) => {
    const { pointCodeNameX, pointCodeNameY, startTime, endTime } = this.props;
    const { chartData = [] } = bigScatterData;
    const filterYaxisData = chartData.map(e => e.y);
    const filterXaxisData = chartData.map(e => e.x);
    const inverterTenMinGraphic = (filterYaxisData.length === 0 || filterXaxisData.length === 0) ? showNoData : hiddenNoData;
    const option = {
      graphic: inverterTenMinGraphic,
      title: {
        text: [`${title}`, '{b|}'].join(''),
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
      grid: {
        right: '10%',
        top: '50px',
        left: '20%',

      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (payload) => {
          const info = payload.data;
          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
            <div>${payload.seriesName}</div>
            </div>
            <div  style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
            <div>${moment(startTime).format('YYYY-MM-DD HH:mm:ss')}-${
            moment(endTime).format('YYYY-MM-DD HH:mm:ss')
            }</div>
            <div class=${styles.lineStyle}>${pointCodeNameX}: ${dataFormat(info[0], '--', 2)}</div>
            <div class=${styles.lineStyle}>${pointCodeNameY}: ${dataFormat(info[1], '--', 2)}</div>
          </div>`;
        },
        backgroundColor: '#fff',
        axisPointer: {
          // type: 'cross',

        },

        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
      },
      xAxis: {
        type: 'value',
        nameGap: -40,
        name: pointCodeNameX,
        nameTextStyle: {
          fontSize: 18,
          verticalAlign: 'bottom',
          lineHeight: 40,
          padding: [60, 0, 0, 0],
        },
        nameLocation: 'center',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          onZero: false,
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
          name: this.format(pointCodeNameY),
          nameRotate: 360,
          nameGap: 20,
          type: 'value',
          nameLocation: 'center',
          nameTextStyle: {
            fontSize: 18,
            padding: [0, 20, 60, 20],
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisTick: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
      ],
      series: [{
        name: title,
        type: 'scatter',
        symbolSize: 5,
        emphasis: {
          symbolSize: 8,
        },
        data: chartData.map(e => [e.x, e.y]),
      }],
    };
    return option;
  }
  format = (val) => {
    if (val) {
      return val.split('').join('\n');
    }
    return val;
  }
  drawChat = (bigScatterData, saveBtn, title) => {
    const { index, likeChange, theme, deviceList, stationCode, xPointCode, yPointCode, startTime, endTime } = this.props;

    const bigscatterChart = echarts.init(this.bigScattrchart, themeConfig[theme]);
    const option = this.creatOption(bigScatterData, saveBtn, title);
    bigscatterChart.off();
    bigscatterChart.on('click', 'title', (params) => {
      likeChange(index, !saveBtn);
    });
    bigscatterChart.setOption(option);
  }
  render() {
    return (
      <div className={styles.chartWrap}>
        <div ref={(ref) => { this.bigScattrchart = ref; }} className={styles.scatterStyle}></div>
      </div>
    );
  }
}
export default (BigScattrChart);