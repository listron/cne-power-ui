import React from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import moment from 'moment';
class AlarmSingleStationGraph extends React.Component {
  static propTypes = {
    singleAlarmStatistic: PropTypes.array,
    singleChartLoading: PropTypes.bool,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { singleAlarmStatistic, singleChartLoading } = this.props;
    const data = this.transferData(singleAlarmStatistic);
    this.alarmChart = echarts.init(document.getElementById('singleStationAlarmChart'));
    this.renderChart(data, singleChartLoading);
  }

  componentWillReceiveProps(nextProps) {
    const { singleAlarmStatistic, singleChartLoading } = nextProps;
    const data = this.transferData(singleAlarmStatistic);
    this.renderChart(data, singleChartLoading);
  }
  transferData(singleAlarmStatistic) {
    const timeData = singleAlarmStatistic && singleAlarmStatistic.map((item, index) => {
      return moment(item.time).format('YYYY-MM-DD');
    });

    const alarmNum = singleAlarmStatistic && singleAlarmStatistic.map((item, index) => {
      return item.alarmNum;
    });

    const transferWorkAlarmNum = singleAlarmStatistic && singleAlarmStatistic.map((item, index) => {
      return item.transferWorkAlarmNum;
    });

    const noTransferWorkAlarmNum = singleAlarmStatistic && singleAlarmStatistic.map((item, index) => {
      return item.noTransferWorkAlarmNum;
    });

    const transferWorkRate = singleAlarmStatistic && singleAlarmStatistic.map((item, index) => {
      return item.transferWorkRate;
    });

    return {
      timeData, alarmNum, transferWorkAlarmNum, noTransferWorkAlarmNum, transferWorkRate
    };
  }
  renderChart(data, singleChartLoading) {
    const { timeData, transferWorkAlarmNum, noTransferWorkAlarmNum, transferWorkRate } = data;
    const alarmChart = echarts.init(document.getElementById('singleStationAlarmChart'));
    singleChartLoading ? alarmChart.showLoading('default', { color: '#199475' }) : alarmChart.hideLoading();
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'line',
          lineStyle: {
            width: 30,
            color: 'rgb(0, 0, 0,0.2)'
          },
        },
        textStyle: {
          color: '#353535',
          fontSize: 12,
        },
        extraCssText: 'width:128px;height:116px;',
        formatter: (params) => {
          return `<div>
          <div style="border-bottom: 1px solid #d4d4d4;padding-left:4px;padding-bottom:4px">${params[0].name}</div> 
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">告警数</span><span>${params[1].value + params[2].value}</span></div>
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">${params[1].marker}${params[1].seriesName}</span><span>${params[1].value}</span></div> 
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">${params[2].marker}${params[2].seriesName}</span><span>${params[2].value}</span></div>
          <div style="padding-left:4px;height:22px;line-height:22px"><span style="display:inline-block;padding-right:6px">${params[0].marker}${params[0].seriesName}</span><span>${params[0].value}%</span></div>       
          </div>`
        },
        backgroundColor: '#fff',
      },
      legend: {
        data: ['转化率', '转工单数', '未转工单数']
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
          name: '转化率(%)',
          splitLine: {
            show: false
          }
        }
      ],
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: -30
        },
        data: timeData,
        // data:['2018-08-01','2018-08-02','2018-08-03','2018-08-04','2018-08-05','2018-08-06','2018-08-07']
      },
      series: [
        {
          name: '转化率',
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
          data: transferWorkRate
          //这是平均处理时间的数据
          // data: [60, 80, 70, 50, 90, 100, 70]
        },
        {
          name: '转工单数',
          type: 'bar',
          //单个柱最大宽度
          barMaxWidth: '200px',
          stack: '总量',
          itemStyle: {
            color: '#c7ceb2'
          },
          // data: [15, 10, 5, 5, 10, 10, 5]
          data: transferWorkAlarmNum,
        },
        {
          name: '未转工单数',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            color: '#f9b600'
          },
          data: noTransferWorkAlarmNum,
          barMaxWidth: 6,
          // data: [5, 15, 15, 10, 5, 15, 15]
        }
      ]
    };

    alarmChart.setOption(option)
  }


  render() {
    return (
      <div id="singleStationAlarmChart" style={{ marginTop: 10, display: 'flex', flex: 1 }}> </div>
    );
  }
}
export default AlarmSingleStationGraph;
