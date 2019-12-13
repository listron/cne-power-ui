import React from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import styles from './alarmStatistic.scss';
class AlarmStatisticGraph extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    alarmStatistic: PropTypes.array,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { graphId, alarmStatistic } = this.props;
    const data = this.transferData(alarmStatistic);
    this.alarmChart = echarts.init(document.getElementById(graphId));
    this.renderChart(data);
  }

  componentWillReceiveProps(nextProps) {
    const { alarmStatistic } = nextProps;
    const data = this.transferData(alarmStatistic);
    this.renderChart(data);
  }
  transferData(alarmStatistic) {
    const stationNameData = alarmStatistic.map((item, index) => {
      return item.stationName;
    }) || 0;
    const oneWarningNum = alarmStatistic.map((item, index) => {
      return item.oneWarningNum;
    });

    const twoWarningNum = alarmStatistic.map((item, index) => {
      return item.twoWarningNum;
    });

    const threeWarningNum = alarmStatistic.map((item, index) => {
      return item.threeWarningNum;
    });
    const fourWarningNum = alarmStatistic.map((item, index) => {
      return item.fourWarningNum;
    });
    const handleAvgTime = alarmStatistic.map((item, index) => {
      return item.handleAvgTime === null ? null : (item.handleAvgTime / 60 / 60).toFixed(2);
    });
    return {
      stationNameData, oneWarningNum, twoWarningNum, threeWarningNum, fourWarningNum, handleAvgTime,
    };
  }
  renderChart(data) {
    const { stationNameData, oneWarningNum, twoWarningNum, threeWarningNum, fourWarningNum, handleAvgTime } = data;
    const option = {
      tooltip: {
        trigger: 'axis',
        padding: [4, 20],
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line',
          lineStyle: {
            width: 30,
            color: 'rgb(0, 0, 0,0.2)',
          },
        },
        textStyle: {
          color: '#666',
          fontSize: 12,
        },
        // extraCssText:'width:128px;height:165px;background: rgba(0,0,0,0);',
        formatter: (params) => {
          if (!params && params.length === 0) {
            return '<div></div>';
          }
          let averageTime = '', oneWarning = '', twoWarning = '', threeWarning = '', fourWarning = '', total = '';
          const averageObj = params.find(e => e.seriesName === '平均处理时间');
          const oneObj = params.find(e => e.seriesName === '一级');
          const twoObj = params.find(e => e.seriesName === '二级');
          const threeObj = params.find(e => e.seriesName === '三级');
          const fourObj = params.find(e => e.seriesName === '四级');

          const tmpAverageTime = averageObj && !isNaN(parseFloat(averageObj.value));
          const tmpOneWarning = oneObj && !isNaN(parseInt(oneObj.value));
          const tmpTwoWarning = twoObj && !isNaN(parseInt(twoObj.value));
          const tmpThreeWarning = threeObj && !isNaN(parseInt(threeObj.value));
          const tmpFourWarning = fourObj && !isNaN(parseInt(fourObj.value));

          if (tmpAverageTime) {
            averageTime = `<div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px"><span style="margin: 0 4px;display: inline-block; background:#fff; border: 1px solid #199475; width:4px; height:4px; border-radius: 100%;"></span>平均处理时间</span></span><span>${parseFloat(averageObj.value).toFixed(2)}</span></div>`;
          }
          if (tmpOneWarning) {
            oneWarning = `<div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px"><span style="margin: 0 4px;display: inline-block; background:#a42b2c; width:6px; height:8px;"></span>一级</span></span><span>${oneObj.value}</span></div>`;
          }
          if (tmpTwoWarning) {
            twoWarning = `<div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px"><span style="margin: 0 4px;display: inline-block; background:#e08031; width:6px; height:8px;"></span>二级</span></span><span>${twoObj.value}</span></div>`;
          }
          if (tmpThreeWarning) {
            threeWarning = `<div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px"><span style="margin: 0 4px;display: inline-block; background:#f9b600; width:6px; height:8px;"></span>三级</span></span><span>${threeObj.value}</span></div>`;
          }
          if (tmpFourWarning) {
            fourWarning = `<div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px"><span style="margin: 0 4px;display: inline-block; background:#fbe6e3; width:6px; height:8px;"></span>四级</span></span><span>${fourObj.value}</span></div>`;
          }
          if (tmpOneWarning && tmpTwoWarning && tmpThreeWarning && tmpFourWarning) {
            total = `<div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">总计</span><span>${oneObj.value + twoObj.value + threeObj.value + fourObj.value}</span></div>`;
          }
          return `<div style="width: 150px; height: 170px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div style="border-bottom: 1px solid #d4d4d4;padding-left:4px;padding-bottom:4px">${params[0].name}</div> 
            ${averageTime}${oneWarning}${twoWarning}${threeWarning}${fourWarning}${total}
            </div>`;


        },
        backgroundColor: '#fff',
      },
      legend: {
        data: ['一级', '二级', '三级', '四级', '平均处理时间'],
      },
      yAxis: [
        {
          type: 'value',
          name: '告警数(个)',
          nameTextStyle: {
            color: '#666',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#666',
          },
        },
        {
          type: 'value',
          name: '小时(h)',
          nameTextStyle: {
            color: '#666',
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: '#666',
          },
        },
      ],
      xAxis: {
        type: 'category',
        //data: ['电站1', '电站2', '电站3', '电站4', '电站5', '电站6', '电站7']
        data: stationNameData,
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      // dataZoom: {
      //   type: 'slide',
      //   show: stationNameData && stationNameData.length > 30,        
      // },
      series: [
        {
          name: '平均处理时间',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            color: '#199475',
            width: 2,
            type: 'dashed',
          },
          itemStyle: {
            color: '#199475',
          },
          data: handleAvgTime,
        },
        {
          name: '一级',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#a42b2c',
          },
          data: oneWarningNum,
        },
        {
          name: '二级',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#e08031',
          },
          data: twoWarningNum,
        },
        {
          name: '三级',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#f9b600',
          },
          data: threeWarningNum,
        },
        {
          name: '四级',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#fbe6e3',
          },
          data: fourWarningNum,
          barMaxWidth: '6px',
        },

      ],
    };

    this.alarmChart.setOption(option);
  }


  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId} className={styles.statisticGraph} style={{ marginTop: 10, display: 'flex', flex: 1 }}> </div>
    );
  }
}
export default AlarmStatisticGraph;
