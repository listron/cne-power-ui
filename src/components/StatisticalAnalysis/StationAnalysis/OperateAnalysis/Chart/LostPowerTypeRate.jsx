import React from 'react';
import echarts from 'echarts';
import styles from './styles.scss';
import { chartsLoading, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
class LostPowerTypeRate extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.drawCharts(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawCharts(nextProps);
  }

  getName = (type) => { // 根据类型，匹配name
    let name = '';
    switch (type) {
      case 'limit': name = '限电'; break;
      case 'eletric': name = '变电故障'; break;
      case 'plane': name = '计划停机'; break;
      case 'system': name = '光伏发电系统故障'; break;
      case 'other': name = '场外因素'; break;
    }
    return name;
  }

  getColor = {
    'light': {
      'limit': '#f9b600',
      'eletric': '#999999',
      'plane': '#199475',
      'system': '#c7ceb2',
      'other': '#a42b2c',
    },
    'dark': {
      'limit': '#f8b14e',
      'eletric': '#f8e71c',
      'plane': '#ff73f4',
      'system': '#ff7878',
      'other': '#00f0ff',
    },
  }

  drawCharts = (params) => {
    const { graphId, data, hasData, theme } = params;
    let targetPieChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetPieChart) {
      targetPieChart.dispose();
      targetPieChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const color = ['#f9b600', '#999999', '#199475', '#c7ceb2', '#a42b2c', '#ceebe0'];
    const seriesData = [];
    for (var type in data) {
      if (type !== 'date') {
        seriesData.push({
          name: this.getName(type),
          value: +data[type] === 0 ? '' : data[type],
          itemStyle: {
            color: type && this.getColor[theme][type] || '#ceebe0',
          },
        });
      }
    }
    const graphic = chartsNodata(hasData, theme);
    const targetPieOption = {
      graphic: graphic,
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return (
            `<div class=${styles[theme]}>
                <div class=${styles.axisValue}>${params.name}</div>
                <div class=${styles.tooltipContainer}>
                  <div> 损失电量: ${params.value}</div>
                  <div> 所占比例: ${params.percent} %</div>
                </div>
            </div>`
          );
        },
      },
      color: color,
      series: [
        {
          name: '发电量',
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          data: seriesData,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    targetPieChart.setOption(targetPieOption);
  }

  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId} style={{ height: 260 }}> </div>
    );
  }
}
export default (LostPowerTypeRate);
