import React from 'react';
import echarts from 'echarts';
import { dataFormats } from '../../../../../utils/utilFunc';
import { chartsLoading, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
import styles from './styles.scss';

class LostPowerType extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }
  getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
    const length = data.length;
    const replaceData = [];
    for (let i = 0; i < length; i++) { replaceData.push('--'); }
    const realData = data.some(e => e || e === 0) ? data : replaceData;
    return realData;
  }

  addXaixsName = {
    'month': '月',
    'year': '',
    'day': '日',
  }

  drawChart = param => {
    const { yAxisName, title, data = [], hasData, theme = 'light', dateType } = param;
    if (data.length > 0) {
      const categoryName = data[0].items.map(e => {
        return e.faultName;
      });
      const valueData = data.map(e => {
        const arr = [e.date + this.addXaixsName[dateType]];
        e.items.map(e => {
          arr.push(dataFormats(e.lostGen, '--', 2));
        });
        return arr;
      });
      const dataset = [['date', ...categoryName], ...valueData];
      const seriesData = categoryName.map(e => {
        return { type: 'bar', stack: '总量', barWidth: 13 };
      });
      let targetChart = echarts.init(this.chart, themeConfig[theme]);
      if (targetChart) {
        targetChart.dispose();
        targetChart = echarts.init(this.chart, themeConfig[theme]);
      }
      const color = ['#f9b600', '#999999', '#199475', '#c7ceb2', '#a42b2c', '#ceebe0'];
      const darkColor = ['#f8b14e', '#f8e71c', '#ff73f4', '#ff7878', '#00f0ff', '#7ed321'];

      // const graphic = chartsNodata(hasData, theme);
      const targetMonthOption = {
        // graphic: graphic,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params, b, c) => {
            let paramsItem = '';
            params.forEach(item => {
              const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
              paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${dataFormats(item.value[item.encode.y], '--', 2)}</div>`;
            });
            return (
              `<div class=${styles[theme]}>
                <div class=${styles.axisValue}>${params[0].name}</div>
                <div class=${styles.tooltipContainer}> ${paramsItem}</div>
            </div>`
            );
          },

        },
        dataset: {
          source: dataset,
        },
        title: {
          text: title,
          show: title ? 'show' : false,
          left: '23',
          top: 'top',
        },
        color: theme === 'dark' ? darkColor : color,
        legend: {
          itemWidth: 8,
          itemHeight: 5,
          left: 'center',
          width: 430,
        },
        yAxis: {
          type: 'value',
          name: yAxisName,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        xAxis: {
          type: 'category',
        },
        series: seriesData,
      };
      targetChart.setOption(targetMonthOption);
    }

  };
  render() {
    return <div ref={ref => { this.chart = ref; }} />;
  }
}
export default LostPowerType;
