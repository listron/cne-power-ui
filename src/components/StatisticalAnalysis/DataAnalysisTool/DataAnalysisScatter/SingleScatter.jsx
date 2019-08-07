import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import echarts from 'echarts';
import { Icon } from 'antd';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { themeConfig } from '../../../../utils/darkConfig';

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
    const { xPointName, yPointName, id, saveBtn, theme } = nextProps;
    if (xPointName !== this.props.xPointName && yPointName !== this.props.yPointName) {
      this.drawChart(nextProps);
    }
    if (id !== this.props.id || saveBtn !== this.props.saveBtn || theme !== this.props.theme) {
      console.log(111, theme, this.props.theme);
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
    const { title, xPointName, yPointName, chartData = [], saveBtn, index, onChange, theme } = params;
    let scatterChart = echarts.init(this.chartId, themeConfig[theme]);
    if (scatterChart) {
      scatterChart.dispose();
      scatterChart = echarts.init(this.chartId, themeConfig[theme]);
    }
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
          name: this.format(yPointName),
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

