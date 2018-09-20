import React from "react";
import PropTypes from "prop-types";
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
      return item.stationName
    }) || 0
    const oneWarningNum = alarmStatistic.map((item, index) => {
      return item.oneWarningNum
    });

    const twoWarningNum = alarmStatistic.map((item, index) => {
      return item.twoWarningNum
    });

    const threeWarningNum = alarmStatistic.map((item, index) => {
      return item.threeWarningNum
    });
    const fourWarningNum = alarmStatistic.map((item, index) => {
      return item.fourWarningNum
    });
    const handleAvgTime = alarmStatistic.map((item, index) => {
      return item.handleAvgTime === null ? null : (item.handleAvgTime/60/60/24).toFixed(2);
    });
    return {
      stationNameData, oneWarningNum, twoWarningNum, threeWarningNum, fourWarningNum, handleAvgTime
    };
  }
  renderChart(data) {
    const { stationNameData, oneWarningNum, twoWarningNum, threeWarningNum, fourWarningNum, handleAvgTime } = data;
    const option = {
      tooltip: {
        trigger: 'axis',
        padding: [4, 0],
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        textStyle: {
          color: '#999',
          fontSize: 12,
        },
        extraCssText:'width:128px;height:165px;',
        formatter: (params) => {
          return `<div>
          <div style="border-bottom: 1px solid #dfdfdf;padding-left:4px;padding-bottom:4px">${params[0].name}</div> 
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">${params[0].marker}${params[0].seriesName}</span><span>${params[0].value}</span></div>
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">${params[1].marker}${params[1].seriesName}</span><span>${params[1].value}</span></div>
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">${params[2].marker}${params[2].seriesName}</span><span>${params[2].value}</span></div> 
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">${params[3].marker}${params[3].seriesName}</span><span>${params[3].value}</span></div>
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">${params[4].marker}${params[4].seriesName}</span><span>${params[4].value}</span></div>
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">总计</span><span>${params[1].value+params[2].value+params[3].value+params[4].value}</span></div> 
          </div>`
          },
        backgroundColor: '#fff',
      },
      legend: {
        data: ['一级', '二级', '三级', '四级', '平均处理时间']
      },
      yAxis: [
        {
          type: 'value',
          name: '告警数(个)',
          splitLine: {
            show: false
          }
        },
        {
          type: 'value',
          name: '天数(天)',
          splitLine: {
            show: false
          }
        },
      ],
      xAxis: {
        type: 'category',
        //data: ['电站1', '电站2', '电站3', '电站4', '电站5', '电站6', '电站7']
        data: stationNameData,
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
            type: 'dashed'
          },
          itemStyle: {
            color: '#199475'
          },
          data: handleAvgTime
        },
        {
          name: '一级',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#a42b2c'
          },
          data: oneWarningNum,
        },
        {
          name: '二级',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#e08031'
          },
          data: twoWarningNum
        },
        {
          name: '三级',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#f9b600'
          },
          data: threeWarningNum
        },
        {
          name: '四级',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#fbe6e3'
          },
          data: fourWarningNum,
          barMaxWidth: '100px',
        }

      ]
    };

    this.alarmChart.setOption(option)
  }

  
  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId} className={styles.statisticGraph} style={{ marginTop:10,display:'flex',flex:1}}> </div>
    );
  }
}
export default AlarmStatisticGraph;
