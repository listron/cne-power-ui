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
    saveImgUrl: PropTypes.func,
    showImg: PropTypes.func,
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

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.xPointName !== this.props.xPointName && nextProps.yPointName !== this.props.yPointName) {
      this.drawChart(nextProps);
      this.setState({ saveBtn: false });

    }
  }
  base64Img2Blob = (code) => {
    if (code) {
      var parts = code.split(';base64,');
      var contentType = parts[0].split(':')[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;
      var uInt8Array = new Uint8Array(rawLength);
      for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    }
    return;
  }
  downloadFile = (fileName, content) => {
    var blob = this.base64Img2Blob(content); //new Blob([content]);
    var aLink = document.createElement('a');
    // var evt = document.createEvent('HTMLEvents');
    // evt.initEvent('click', false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    // aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    aLink.click();

  }
  format = (val) => {
    if (val) {
      return val.split('').join('\n');
    }
    return val;
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
    scatterChart.on('rendered', () => {
      const imgUrl = scatterChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      this.props.saveImgUrl && this.props.saveImgUrl(title, imgUrl);
    });
  }
  render() {
    const { title, index, showImg } = this.props;

    return (
      <React.Fragment>
        <Icon type="left" onClick={() => showImg(index)} className={styles.showModalInco} />
        <div id={title} className={styles.scatterStyle}></div>
      </React.Fragment>
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
