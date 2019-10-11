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

  // getName = (type) => { // 根据类型，匹配name
  //   let name = '';
  //   switch (type) {
  //     case 'limit': name = '限电'; break;
  //     case 'eletric': name = '变电故障'; break;
  //     case 'plane': name = '计划停机'; break;
  //     case 'system': name = '光伏发电系统故障'; break;
  //     case 'other': name = '场外因素'; break;
  //   }
  //   return name;
  // }


  drawCharts = (params) => {
    const { data = [], hasData, theme } = params;
    let targetPieChart = echarts.init(this.chart, themeConfig[theme]);
    if (targetPieChart) {
      targetPieChart.dispose();
      targetPieChart = echarts.init(this.chart, themeConfig[theme]);
    }
    const color = ['#f9b600', '#999999', '#199475', '#c7ceb2', '#a42b2c', '#ceebe0'];
    const darkColor = ['#f8b14e', '#f8e71c', '#ff73f4', '#ff7878', '#00f0ff'];
    const seriesData = data.map(e => {
      return {
        name: e.faultName,
        value: +e.lostGen === 0 ? '' : e.lostGen,
      };
    });
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
      color: theme === 'dark' ? darkColor : color,
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
    return (
      <div style={{ height: 260 }} ref={ref => { this.chart = ref; }} />
    );
  }
}
export default (LostPowerTypeRate);
