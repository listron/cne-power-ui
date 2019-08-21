import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import eCharts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';


class BigSequenceCharts extends React.Component {
  static propTypes = {
    allChartData: PropTypes.object,
    saveBtn: PropTypes.bool,
    bigchartLoading: PropTypes.bool,

  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.renderChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { allChartData, saveBtn } = this.props;
    const { bigChart } = this;
    const myChart = eCharts.init(bigChart); //构建下一个实例
    if (JSON.stringify(allChartData) !== JSON.stringify(nextProps.allChartData)) {
      this.renderChart(nextProps);
    }
    if (nextProps.bigchartLoading) {
      myChart.showLoading();
    }
    if (!nextProps.bigchartLoading) {
      myChart.hideLoading();
    }
    if ((nextProps.saveBtn !== saveBtn) || (nextProps.id !== this.props.id)) {
      // console.log('likestatus发生改变重新渲染');
      this.renderChart(nextProps);
    }
  }
  creatOption = (payload) => {
    const { allChartData, deviceName, pointCodeNameX, pointCodeNameY, saveBtn, point1Max, point1Min, point2Max, point2Min } = payload;
    const { timeLine, point1Data, point2Data } = Object.keys(allChartData).length ? allChartData : { timeLine: [], point1Data: [], point2Data: [] };
    const option = {
      graphic: Object.keys(allChartData).length ? hiddenNoData : showNoData,
      title: {
        text: [`${deviceName}`, '{b|}'].join(''),
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
      legend: {
        show: true,
      },
      grid: {
        right: '10%',
        top: '50px',
        left: '20%',
      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLine,
      },
      yAxis: [
        {
          type: 'value',
          // name: '功率',
          min: point1Min,
          max: point1Max,
          // axisLabel: {
          //   formatter: '{value} kW',
          // },
        }, {
          type: 'value',
          // name: '温度',
          min: point2Min,
          max: point2Max,
          splitLine: false,
          // axisLabel: {
          //   formatter: '{value} °C',
          // },
        },
      ],
      series: [
        {
          name: pointCodeNameX,
          type: 'line',
          progressiveThreshold: 1000,
          progressive: 100,
          data: point1Data,
        },
        {
          name: pointCodeNameY,
          type: 'line',
          data: point2Data,
          progressiveThreshold: 1000,
          progressive: 100,

        }],
    };
    return option;
  }
  renderChart(payload) {
    const { likeStatusChange, index, saveBtn } = payload;
    const { bigChart } = this;
    const myChart = eCharts.init(bigChart); //构建下一个实例
    const option = this.creatOption(payload);
    myChart.off();
    myChart.on('click', 'title', (payload) => {
      likeStatusChange(index, !saveBtn);
    });
    myChart.setOption(option);
  }
  render() {
    return (
      <div ref={(ref) => { this.bigChart = ref; }} className={styles.sequenceChart}>
      </div>
    );
  }
}
export default (BigSequenceCharts);

