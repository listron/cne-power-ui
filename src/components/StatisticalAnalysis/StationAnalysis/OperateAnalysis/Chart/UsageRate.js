import React from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './styles.scss';

/* 
     1 必填 graphId, 根据ID确定图表
     2 选填 yAxisName, y轴的name
     3 选填 type, 确定为什么类型的图表
     4 选填 title,图表的title
     5 必填 data, 数据 data=[[],[]] 其中为line的数据数组
     6 选填 hasData 是否有数据 如果有数据为true，否则为false
*/
class UsageRate extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }


  getColor = {
    'light': {
      'useRate': ['#e08031', '#3e97d1'],
      'electricity': ['#e08031', '#199475'],
      'loss': ['#e08031', '#3e97d1'],
    },
    dark: {
      'useRate': ['#f8b14e', '#00f8ff'],
      'electricity': ['#fd6e8f', '#00f8ff'],
      'loss': ['#f8b14e', '#00f8ff'],
    },
  }


  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    const replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--'); }
    const realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData;
  }

  drawChart = param => {
    const { graphId, yAxisName, type, title, data, hasData, theme } = param;
    let targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetChart) {
      targetChart.dispose();
      targetChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const color = this.getColor[theme][type];
    const yData = (data && data.yData) || [];
    const series = yData.map((item, index) => {
      return {
        name: yAxisName[index],
        type: 'line',
        yAxisIndex: index,
        data: this.getDefaultData(item),
      };
    });

    const graphic = chartsNodata(hasData, theme);
    const targetMonthOption = {
      graphic: graphic,
      title: {
        text: title,
        show: title ? 'show' : false,
        left: '23',
        top: 'top',
      },
      color: color,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${dataFormats(item.value, '--', 2)}${'%'}</div>`;
          });
          return (
            `<div class=${styles[theme]}>
                <div class=${styles.axisValue}>${params[0].name}</div>
                <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
          );
        },
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        right: '15%',
      },
      legend: {
        top: title ? 0 : 20,
        left: 'center',
        itemWidth: 8,
        itemHeight: 5,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data && data.xData,
        axisPointer: {
          type: 'shadow',
        },
        axisLine: {
          show: true,
          onZero: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: yAxisName[0],
          axisLabel: {
            formatter: '{value} %',
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        {
          type: 'value',
          name: yAxisName[1],
          axisLabel: { formatter: '{value} %' },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      series: series,
    };
    targetChart.setOption(targetMonthOption, 'notMerge');
  };


  render() {
    const { graphId } = this.props;
    return <div id={graphId} />;
  }
}
export default UsageRate;
