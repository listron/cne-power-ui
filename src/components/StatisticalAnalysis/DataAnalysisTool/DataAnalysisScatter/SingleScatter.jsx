import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import echarts from 'echarts';
import { Icon } from 'antd';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig, chartsLoading } from '../../../../utils/darkConfig';
import { dataFormat } from '../../../../utils/utilFunc';

import moment from 'moment';

class SingleScatter extends React.PureComponent {
  static propTypes = {
    // title: PropTypes.string,
    pointCodeNameX: PropTypes.string,
    pointCodeNameY: PropTypes.string,
    saveImgUrl: PropTypes.func,
    showImg: PropTypes.func,
    saveBtn: PropTypes.bool,
    // chartData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { chartId } = this;
    const { theme } = this.props;
    const myChart = echarts.init(chartId, themeConfig[theme]); //构建下一个实例
    const option = this.creatOption(this.props);
    myChart.setOption(option);
  }
  componentWillReceiveProps(nextProps) {
    const { activeCode, scatterData, chartLoading, theme, saveBtn, deviceList, xyValueLimit } = nextProps;
    // console.log('xyValueLimit22222: ', xyValueLimit);
    const prevCode = this.props.activeCode;
    if (activeCode !== prevCode) {
      const scatterChart = echarts.init(this.chartId, themeConfig[theme]);
      if (!chartLoading) {
        scatterChart.hideLoading();
      }

    }
    if ((activeCode !== prevCode && activeCode === this.props.deviceFullCode)) {
      const scatterChart = echarts.init(this.chartId, themeConfig[theme]);
      this.drawChart(scatterData, saveBtn, true);//此处的第三个参数是控制定时器是否发送下一个请求
      if (this.props.deviceFullCode !== deviceList[deviceList.length - 1].deviceFullCode && !chartLoading) {
        scatterChart.showLoading();
      }
      if (this.props.deviceFullCode === deviceList[deviceList.length - 1].deviceFullCode) {
        scatterChart.hideLoading();
      }
    }
    if (saveBtn !== this.props.saveBtn) {
      this.drawChart(scatterData, saveBtn, false);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { activeCode, deviceFullCode } = nextProps;
    return activeCode === this.props.deviceFullCode || this.props.deviceFullCode !== deviceFullCode;
  }
  componentWillUnmount() {
    echarts.init(this.chartId, themeConfig[this.props.theme]).dispose();

  }
  creatOption = (scatterData = {}, saveBtn) => {
    const { title, pointCodeNameX, pointCodeNameY, startTime, endTime, xyValueLimit } = this.props;
    // console.log('xyValueLimit11111: ', xyValueLimit);
    const { xMax, xMin, yMax, yMin } = xyValueLimit;
    const { chartData = [] } = scatterData;
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
      xAxis: {
        type: 'value',
        nameGap: -40,
        min: xMin,
        max: xMax,
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
          min: yMin,
          max: yMax,
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
<<<<<<< HEAD
  drawChart = (scatterData, saveBtn, isRequest) => {
=======
  drawChart = (scatterData, saveBtn, isRequest, ) => {
>>>>>>> c203902e47d214df64a3b95930883f87b7694fac
    const { title, index, onChange, theme, deviceList, stationCode, xPointCode, yPointCode, startTime, endTime } = this.props;
    const parms = { stationCode, xPointCode, yPointCode, startTime, endTime };
    const scatterChart = echarts.init(this.chartId, themeConfig[theme]);
    scatterChart.clear();
    const option = this.creatOption(scatterData, saveBtn);
    scatterChart.off();
    scatterChart.on('click', 'title', (params) => {
      onChange(index, !saveBtn, scatterData);//保留当前数据值scatterData，避免重新渲染时数据源发生改变。
    });
<<<<<<< HEAD

    scatterChart.on('rendered', () => {
      const imgUrl = scatterChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      this.props.saveImgUrl && this.props.saveImgUrl(title, imgUrl);
    });
    isRequest && setTimeout(() => {
      const continueQuery = index < deviceList.length;
      continueQuery && this.props.getScatterData({
        ...parms,
        deviceFullCode: deviceList[index + 1].deviceFullCode,
      });
    }, 50);

=======

    scatterChart.on('rendered', () => {
      const imgUrl = scatterChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      this.props.saveImgUrl && this.props.saveImgUrl(title, imgUrl);
    });
    isRequest && setTimeout(() => {
      const continueQuery = index < deviceList.length - 1;
      continueQuery && this.props.getScatterData({
        ...parms,
        deviceFullCode: deviceList[index + 1].deviceFullCode,
      });
    }, 50);

>>>>>>> c203902e47d214df64a3b95930883f87b7694fac
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

