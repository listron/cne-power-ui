import React from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import moment from 'moment';
class AlarmSingleStationGraph extends React.Component {
  static propTypes = {
    singleAlarmStatistic: PropTypes.array,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { singleAlarmStatistic } = this.props;
    const data = this.transferData(singleAlarmStatistic);
    this.alarmChart = echarts.init(document.getElementById('singleStationAlarmChart'));
    this.renderChart(data);
  }
  
  componentWillReceiveProps(nextProps) {
    const { singleAlarmStatistic } = nextProps;
    const data = this.transferData(singleAlarmStatistic);
    this.renderChart(data);
  }
  transferData(singleAlarmStatistic) {
    const timeData = singleAlarmStatistic.map((item, index) => {
      return moment(item.time).format('YYYY-MM-DD');
    }) || 0
    const alarmNum = singleAlarmStatistic.map((item, index) => {
      return item.alarmNum
    });

    const transferWorkAlarmNum = singleAlarmStatistic.map((item, index) => {
      return item.transferWorkAlarmNum
    });

    const noTransferWorkAlarmNum = singleAlarmStatistic.map((item, index) => {
      return item.noTransferWorkAlarmNum
    });
    const transferWorkRate = singleAlarmStatistic.map((item, index) => {
      return item.transferWorkRate
    });
    return {
      timeData, alarmNum, transferWorkAlarmNum, noTransferWorkAlarmNum, transferWorkRate
    };
  }
  renderChart(data) {
    const { timeData, alarmNum, transferWorkAlarmNum, noTransferWorkAlarmNum, transferWorkRate } = data;
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (params) => {
          console.log(params);
          return `<div>
          <div> ${params[0].name}</div> 
          <div style='background:#dfdfdf;height:1px;width:100%;' ></div>
          <div>告警数：${params[1].value+params[2].value}</div> 
          <div> ${params[0].marker}${params[0].seriesName}${params[0].value}</div>
          <div> ${params[1].marker}${params[1].seriesName}${params[1].value}</div> 
          <div> ${params[2].marker}${params[2].seriesName}${params[2].value}</div>         
          </div>`
          },
        backgroundColor: '#fff',
        textStyle: {
          color: '#999',
        },
      },
      legend: {
        data: ['转化率', '转工单数', '未转工单数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: [
        {
          type: 'value',
          name: '转化率(%)',
          position: 'right',
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: {
            }
          },
          axisLabel: {
          }
        },
        {
          type: 'value',
          name: '告警数(个)',
          position: 'left',
          axisLine: {
            lineStyle: {

            }
          },
          axisLabel: {
          }
        }
      ],
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: -30
      },
        //data: timeData,
        data:['2018-08-01','2018-08-02','2018-08-03','2018-08-04','2018-08-05','2018-08-06','2018-08-07']
      },
      series: [
        {
          name: '转化率',
          type: 'line',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          lineStyle: {
            normal: {
              color: 'green',
              width: 2,
              type: 'dashed'
            }
          },
           //data: transferWorkRate
          //这是平均处理时间的数据
          data: [60, 80, 70, 50, 90, 100, 70]
        },
        {
          name: '转工单数',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          yAxisIndex: 1,
          data: [15, 10, 5, 5, 10, 10, 5]
          //data: transferWorkAlarmNum,
        },
        {
          name: '未转工单数',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          yAxisIndex: 1,
          //data: noTransferWorkAlarmNum
          data: [5, 15, 15, 10, 5, 15, 15]
        }
      ]
    };

    this.alarmChart.setOption(option)
  }

  
  render() {
    return (
      <div>
        <div id="singleStationAlarmChart" style={{ width: '85%', height: '500px' }}> </div>
      </div>
    );
  }
}
export default AlarmSingleStationGraph;
