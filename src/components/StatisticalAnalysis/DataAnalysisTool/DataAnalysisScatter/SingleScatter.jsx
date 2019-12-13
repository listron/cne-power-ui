import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import echarts from 'echarts';
import { Icon } from 'antd';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig } from '../../../../utils/darkConfig';
import { dataFormat } from '../../../../utils/utilFunc';
import moment from 'moment';

class SingleScatter extends React.PureComponent {
  static propTypes = {
    pointCodeNameX: PropTypes.string,
    pointCodeNameY: PropTypes.string,
    saveImgUrl: PropTypes.func,
    showImg: PropTypes.func,
    saveBtn: PropTypes.bool,
    theme: PropTypes.string,
    activeCode: PropTypes.string,
    scatterData: PropTypes.object,
    chartLoading: PropTypes.bool,
    deviceList: PropTypes.array,
    deviceFullCode: PropTypes.string,
    xyValueLimit: PropTypes.object,
    title: PropTypes.string,
    stationCode: PropTypes.number,
    xPointCode: PropTypes.string,
    yPointCode: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    getScatterData: PropTypes.func,
    index: PropTypes.number,
    onChange: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { chartId } = this;
    const { theme, xyValueLimit, scatterData, saveBtn } = this.props;
    const myChart = echarts.init(chartId, themeConfig[theme]); //构建下一个实例
    const option = this.creatOption(scatterData, saveBtn, xyValueLimit);
    myChart.setOption(option);
  }
  componentWillReceiveProps(nextProps) {
    const { activeCode, scatterData, chartLoading, theme, saveBtn, deviceList, xyValueLimit } = nextProps;
    const prevCode = this.props.activeCode;
    if (activeCode !== prevCode) {
      const scatterChart = echarts.init(this.chartId, themeConfig[theme]);
      if (!chartLoading) {
        scatterChart.hideLoading();
      }

    }
    if ((activeCode !== prevCode && activeCode === this.props.deviceFullCode)) {
      const scatterChart = echarts.init(this.chartId, themeConfig[theme]);
      this.drawChart(scatterData, saveBtn, true, xyValueLimit);//此处的第三个参数是控制定时器是否发送下一个请求
      if (this.props.deviceFullCode !== deviceList[deviceList.length - 1].deviceFullCode && !chartLoading) {
        const lightColor = {
          maskColor: 'rgba(255, 255, 255, 0.8)',
          color: '#199475',
        };
        scatterChart.showLoading('default', lightColor);
      }
      if (this.props.deviceFullCode === deviceList[deviceList.length - 1].deviceFullCode) {
        scatterChart.hideLoading();
      }
    }
    if (saveBtn !== this.props.saveBtn) {
      this.drawChart(scatterData, saveBtn, false, xyValueLimit);
    }

  }

  shouldComponentUpdate(nextProps) {
    const { activeCode, deviceFullCode } = nextProps;
    return activeCode === this.props.deviceFullCode || this.props.deviceFullCode !== deviceFullCode;
  }
  componentWillUnmount() {
    echarts.init(this.chartId, themeConfig[this.props.theme]).dispose();
  }
  creatOption = (scatterData = {}, saveBtn, xyValueLimit) => {
    const { title, pointCodeNameX, pointCodeNameY } = this.props;
    const { xMax, xMin, yMax, yMin } = xyValueLimit;
    const { chartData = [], xUnit, yUnit } = scatterData;
    const filterYaxisData = chartData.map(e => e.y);
    const filterXaxisData = chartData.map(e => e.x);
    const inverterTenMinGraphic = (filterYaxisData.length === 0 || filterXaxisData.length === 0) ? showNoData : hiddenNoData;
    const color = '#199475';
    const option = {
      graphic: inverterTenMinGraphic,
      color: color,
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
            <div  style='background:#d4d4d4;height:1px;
            width:100%;' ></div>
            <div class=${styles.lineStyle}>时间: ${info[2] ? moment(info[2]).format('YYYY-MM-DD HH:mm:ss') : '--'}</div>
            <div class=${styles.lineStyle}>${pointCodeNameX}: ${dataFormat(info[0], '--', 2)}</div>
            <div class=${styles.lineStyle}>${pointCodeNameY}: ${dataFormat(info[1], '--', 2)}</div>
          
          </div>`;
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
      },
      xAxis: [{
        type: 'value',
        axisLabel: {
          formatter: '{value}',
        },
        nameGap: -40,
        min: xMin,
        max: xMax,
        name: pointCodeNameX,
        nameTextStyle: {
          fontSize: 14,
          verticalAlign: 'bottom',
          lineHeight: 30,
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
      }, {
        name: xUnit,
      }],
      yAxis: [
        {
          name: this.format(pointCodeNameY),
          nameRotate: 360,
          nameGap: 20,
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
          min: yMin,
          max: yMax,
          nameLocation: 'center',
          nameTextStyle: {
            fontSize: 14,
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
        }, {
          name: yUnit,
          nameTextStyle: {
            verticalAlign: 'bottom',
            lineHeight: 5,

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
        data: chartData.map(e => [e.x, e.y, e.time]),
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
  drawChart = (scatterData, saveBtn, isRequest, xyValueLimit) => {
    const { title, index, onChange, theme, deviceList, stationCode, xPointCode, yPointCode, startTime, endTime, saveImgUrl } = this.props;
    const parms = { stationCode, xPointCode, yPointCode, startTime, endTime };
    const scatterChart = echarts.init(this.chartId, themeConfig[theme]);
    scatterChart.clear();
    const option = this.creatOption(scatterData, saveBtn, xyValueLimit);
    scatterChart.off();
    scatterChart.on('click', 'title', (params) => {
      onChange(index, !saveBtn, scatterData);//保留当前数据值scatterData，避免重新渲染时数据源发生改变。
    });

    scatterChart.on('rendered', () => {
      const imgUrl = scatterChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      saveImgUrl && saveImgUrl(title, imgUrl);
    });
    isRequest && setTimeout(() => {
      const continueQuery = index < deviceList.length - 1;
      continueQuery && this.props.getScatterData({
        ...parms,
        deviceFullCode: deviceList[index + 1].deviceFullCode,
      });
    }, 0);

    scatterChart.setOption(option, true);

  }

  render() {
    const { index, showImg, scatterData } = this.props;
    return (
      <div className={styles.chartWrap}>
        {showImg && <Icon type="zoom-in" onClick={() => showImg(index, scatterData)} className={styles.showModalInco} />}
        <div ref={(ref) => { this.chartId = ref; }} className={styles.scatterStyle}></div>
      </div>
    );
  }
}
export default (SingleScatter);

