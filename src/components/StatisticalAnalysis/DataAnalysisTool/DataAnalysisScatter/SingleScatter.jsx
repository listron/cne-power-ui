import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import echarts from 'echarts';
import { Icon } from 'antd';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

class SingleScatter extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    xPointName: PropTypes.string,
    yPointName: PropTypes.string,
    // chartData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      saveBtn: false,
    };
  }
  componentDidMount() {
    this.drawChart(this.props);
    console.log('1');
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.xPointName !== this.props.xPointName && nextProps.yPointName !== this.props.yPointName) {
      this.drawChart(nextProps);
      this.setState({ saveBtn: false });
      console.log('2');
    }
  }

  drawChart = (params) => {
    const { title, xPointName, yPointName, chartData = [] } = params;
    const scatterChart = echarts.init(document.getElementById(title));
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
              height: 40,
              width: 40,
              align: 'center',
              backgroundColor: {
                image: '/img/wind04.png',
                color: 'yellow',
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
          verticalAlign: 'bottom',
          lineHeight: 40,
          padding: [60, 0, 0, 0],
        },
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
          name: yPointName,
          type: 'value',
          nameTextStyle: {
            color: lineColor,
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
      console.log('params: ', params);
      console.log('saveBtn: ', this.state.saveBtn);
      this.setState({ saveBtn: !this.state.saveBtn }, scatterChart.setOption({
        title: {
          // text: title,
          text: [`${title}`, '{b|}'].join(''),
          left: '5%',
          textStyle: {
            fontSize: 14,
            rich: {
              b: {
                height: 40,
                width: 40,
                align: 'center',
                backgroundColor: {
                  image: !this.state.saveBtn ? '/img/wind01.png' : '/img/wind04.png',
                  color: 'yellow',
                },
              },

            },
          },
          triggerEvent: true,
        },
      }));
    });

    scatterChart.setOption(option, 'notMerge');
    scatterChart.resize();
    const img = new Image();
    // const imgUrl = scatterChart.toDataURL('image/jpeg');
    const imgUrl = scatterChart.getDataURL();
    // console.log('imgUrl: ', imgUrl);
    img.src = imgUrl;
    var $a = document.createElement('a');
    $a.setAttribute('href', img);
    $a.setAttribute('download', 'echarts图片下载');

    // $a.click();


  }
  // savaFun = (params) => {
  //   console.log('params: ', params);
  //   const { event: { topTarget: { style: { rich: { b: { textBackgroundColor } } } } } } = params;
  //   console.log('textBackgroundColor: ', textBackgroundColor);
  //   console.log('title');

  // }

  render() {
    const { title } = this.props;
    return (

      <div id={title} className={styles.scatterStyle}>
      </div>
    );
  }
}
export default (SingleScatter)
  ;
