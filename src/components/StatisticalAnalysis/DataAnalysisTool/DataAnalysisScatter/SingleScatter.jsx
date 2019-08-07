import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import echarts from 'echarts';
import { Icon } from 'antd';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class SingleScatter extends React.Component {
  static propTypes = {
    // title: PropTypes.string,
    xPointName: PropTypes.string,
    yPointName: PropTypes.string,
    id: PropTypes.string,
    saveImgUrl: PropTypes.func,
    showImg: PropTypes.func,
    saveBtn: PropTypes.boolean,
    // chartData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.xPointName !== this.props.xPointName && nextProps.yPointName !== this.props.yPointName) {
      this.drawChart(nextProps);
    }
    if (nextProps.id !== this.props.id || nextProps.saveBtn !== this.props.saveBtn) {
      this.drawChart(nextProps, true);
    }
  }
  format = (val) => {
    if (val) {
      return val.split('').join('\n');
    }
    return val;
  }
  drawChart = (params, change) => {
    const { title, xPointName, yPointName, chartData = [], saveBtn, index, onChange } = params;
    const scatterChart = echarts.init(this.chartId);
    const filterYaxisData = chartData.map(e => e.y);
    const filterXaxisData = chartData.map(e => e.x);
    const inverterTenMinGraphic = (filterYaxisData.length === 0 || filterXaxisData.length === 0) ? showNoData : hiddenNoData;
    const lineColor = '#666';
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
        top: '70px',
        left: '20%',

      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (params) => {
          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
          
            </div>
            <div  style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
          </div>`;
        },
        backgroundColor: '#fff',
        axisPointer: {
          // type: 'cross',
          label: {
            backgroundColor: lineColor,
          },
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
        name: xPointName,
        nameTextStyle: {
          color: lineColor,
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
        axisLabel: {
          color: lineColor,
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
          name: this.format(yPointName),
          nameRotate: 360,
          nameGap: 20,
          type: 'value',
          nameLocation: 'center',
          nameTextStyle: {
            color: lineColor,
            fontSize: 18,
            padding: [0, 20, 60, 20],


          },

          splitLine: {
            show: true,
            lineStyle: {
              color: ['#dfdfdf'],
              type: 'dashed',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
        },
      ],
      series: chartData.map((e, i) => {
        return {
          name: `${e.deviceName}`,
          type: 'scatter',
          symbolSize: 5,
          emphasis: {
            symbolSize: 8,
          },
          data: [e.x, e.y],
        };
      }),
    };
    scatterChart.off();
    scatterChart.on('click', 'title', (params) => {
      onChange(index, !saveBtn);
    });
    scatterChart.setOption(option, 'notMerge');
    scatterChart.resize();
    scatterChart.on('rendered', () => {
      const imgUrl = scatterChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      this.props.saveImgUrl && this.props.saveImgUrl(title, imgUrl);
    });
  }
  render() {
    const { id, index, showImg } = this.props;
    return (
      <div className={styles.chartWrap}>
        <Icon type="zoom-in" onClick={() => showImg(index)} className={styles.showModalInco} />
        <div ref={(ref) => { this.chartId = ref; }} className={styles.scatterStyle}></div>
      </div>
    );
  }
}
export default (SingleScatter);

      // this.downloadFile(title, imgUrl);
      // const img = new Image();
      // img.src = scatterChart.getDataURL({
      // pixelRatio: 2,
      // backgroundColor: '#fff',
      // });
      // var $a = document.createElement('a');
      // $a.setAttribute('href', img.src);
      // $a.setAttribute('download', title);
      // $a.click();
