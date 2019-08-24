import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import echarts from 'echarts';
import { Icon } from 'antd';
// import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig } from '../../../../utils/darkConfig';
import { dataFormat } from '../../../../utils/utilFunc';

import moment from 'moment';

class SingleScatter extends React.Component {
  static propTypes = {
    // title: PropTypes.string,
    pointCodeNameX: PropTypes.string,
    pointCodeNameY: PropTypes.string,
    // id: PropTypes.string,
    saveImgUrl: PropTypes.func,
    showImg: PropTypes.func,
    saveBtn: PropTypes.bool,
    // chartData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  // componentDidMount() {
  //   const { chartId } = this;
  //   const { theme } = this.props;
  //   const myChart = echarts.init(chartId, themeConfig[theme]); //构建下一个实例
  //   const option = this.creatOption(this.props);
  //   myChart.setOption(option);
  // }

  componentWillReceiveProps(nextProps) {
    // const { saveBtn, theme, scatterDataTime, chartLoading, scatterData } = nextProps;
    // const scatterChart = echarts.init(this.chartId);
    // if (chartLoading && (this.props.index) === this.props.scatterData.length) { // loading态控制。第一次无数据，请求数据的过程
    //   scatterChart.showLoading();
    // }
    // if (!chartLoading) {
    //   scatterChart.hideLoading();
    // }
    const { activeCode, scatterData } = nextProps;
    const prevCode = this.props.activeCode;
    if ((activeCode && activeCode !== prevCode && activeCode === this.props.deviceFullCode )) {
      // scatterChart.clear();//清除
      this.drawChart(scatterData);
    }
    // if (saveBtn !== this.props.saveBtn || id !== this.props.id) {
    //   scatterChart.clear();
    //   this.drawChart(nextProps);
    // }
    // if ((this.props.index + 1 === scatterData.length)) {
    //   
    //   scatterChart.clear();//清除
    //   this.drawChart(nextProps);
    // }
    // if (scatterDataTime !== this.props.scatterDataTime || theme !== this.props.theme) {
    //   this.drawChart(nextProps);
    // }
  }

  shouldComponentUpdate(nextProps){
    const { activeCode, deviceFullCode } = nextProps;
    return activeCode === this.props.deviceFullCode || this.props.deviceFullCode !== deviceFullCode;
  }

  creatOption = (scatterData = {}) => {
    const { title, pointCodeNameX, pointCodeNameY, saveBtn, startTime, endTime } = this.props;
    const { chartData = [] } = scatterData;
    // const filterYaxisData = scatterData.chartData.map(e => e.y) : [];
    // const filterXaxisData = scatterData.chartData.map(e => e.x) : [];
    // const inverterTenMinGraphic = (filterYaxisData.length === 0 || filterXaxisData.length === 0) ? showNoData : hiddenNoData;

    const option = {
      // graphic: inverterTenMinGraphic,
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
  drawChart = (scatterData) => {
    const { title, saveBtn, index, onChange, theme, deviceList, stationCode, xPointCode, yPointCode, startTime, endTime } = this.props;
    const parms = { stationCode, xPointCode, yPointCode, startTime, endTime };
    const scatterChart = echarts.init(this.chartId, themeConfig[theme]);
    const option = this.creatOption(scatterData);
    scatterChart.off();
    scatterChart.on('click', 'title', (params) => {
      onChange(index, !saveBtn);
    });
    // if (scatterData.length === index + 1 && index + 1 < deviceList.length && scatterData.length < deviceList.length) {
    //   scatterChart.on('rendered', () => {
    //     const imgUrl = scatterChart.getDataURL({
    //       pixelRatio: 2,
    //       backgroundColor: '#fff',
    //     });
    //     this.props.saveImgUrl && this.props.saveImgUrl(title, imgUrl);
    //   });
    setTimeout(() => {
      const continueQuery = index < deviceList.length;
        continueQuery && this.props.getScatterData({
          ...parms,
          deviceFullCode: deviceList[index + 1].deviceFullCode,
        });
    }, 3000);
      // scatterChart.on('finished', () => {
        
      // });
    // }
    // scatterChart.setOption(option, 'notMerge');
    scatterChart.setOption(option);
    // scatterChart.resize();

  }
  render() {
    const { index, showImg } = this.props;
    return (
      <div className={styles.chartWrap}>
        {showImg && <Icon type="zoom-in" onClick={() => showImg(index)} className={styles.showModalInco} />}
        <div ref={(ref) => { this.chartId = ref; }} className={styles.scatterStyle}></div>
      </div>
    );
  }
}
export default (SingleScatter);

