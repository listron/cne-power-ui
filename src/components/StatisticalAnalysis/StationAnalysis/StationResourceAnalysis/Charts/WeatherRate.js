import React from 'react';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
import { themeConfig, chartsNodata } from '../../../../../utils/darkConfig';
import styles from './styles.scss';

class WeatherRate extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.drawCharts(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawCharts(nextProps);
  }

  getName = (type) => {
    let name = '';
    switch (type) {
      // "雪1", "雨2", "霾3", "阴4", "晴5","其他0"  根据后台数据库设定的
      case '5': name = '晴'; break;
      case '4': name = '阴'; break;
      case '2': name = '雨'; break;
      case '1': name = '雪'; break;
      case '3': name = '霾'; break;
      case '0': name = '其他'; break;
    }
    return name;
  }

  getColor = {
    light: ['#ceebe0', '#c7ceb2', '#199475', '#a42b2c', '#999999', '#f9b600'],
    dark: ['#7ed321', '#ff7878', '#ff73f4', '#00f0ff', '#f8e71c', '#f8b14e'],
  }


  drawCharts = (params) => {
    const { graphId, data, yAxisName, hasData, theme } = params;
    let targetPieChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    if (targetPieChart) {
      targetPieChart.dispose();
      targetPieChart = echarts.init(document.getElementById(graphId), themeConfig[theme]);
    }
    const seriesData = data.map((item) => {
      return {
        name: this.getName(item.weather),
        value: item.days === 0 ? '' : item.days,
        itemStyle: {
          color: this.getColor[theme][item.weather],
        },
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
                  <div> 天数: ${params.value}</div>
                  <div> 所占比例: ${params.percent} %</div>
                </div>
            </div>`
          );
        },
      },
      legend: {
        left: 'center',
        // icon: 'circle',
        itemWidth: 8,
        itemHeight: 5,
        data: ['晴', '阴', '雨', '雪', '霾', '其他'],
      },
      series: [
        {
          name: '发电量',
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          stillShowZeroSum: true,
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
export default (WeatherRate);
