import React from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
class AlarmStatisticGraph extends React.Component {
  static propTypes = {
    graphId: PropTypes.string,
    alarmStatistic: PropTypes.array,
  };

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
      return item.handleAvgTime
    });
    return {
      stationNameData, oneWarningNum, twoWarningNum, threeWarningNum, fourWarningNum, handleAvgTime
    };
  }
  renderChart = (data) => {
    const { stationNameData, oneWarningNum, twoWarningNum, threeWarningNum, fourWarningNum, handleAvgTime } = data;

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (params) => {
           
             return `<div>
             <div> ${params[0].name}</div>             
             <div> ${params[0].marker}${params[0].seriesName}${params[0].value}</div>
             <div> ${params[1].marker}${params[1].seriesName}${params[1].value}</div>             
             <div> ${params[2].marker}${params[2].seriesName}${params[2].value}</div>
             <div> ${params[3].marker}${params[3].seriesName}${params[3].value}</div>
             <div>总计${params[0].value+params[1].value+params[2].value+params[3].value}</div>                
           </div>`
           },
        backgroundColor: '#fff',
        textStyle: {
          color: '#999',
        },
      },
      legend: {
        data: ['一级', '二级', '三级', '四级', '平均处理时间']
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
          name: '天数(天)',
          position: 'right',
          axisLine: {
            lineStyle: {
            }
          },
          axisLabel: {
            formatter: '{value} 天'
          }
        },
        {
          type: 'value',
          name: '告警个数(个)',
          position: 'left',
          axisLine: {
            lineStyle: {

            }
          },
          axisLabel: {
            formatter: '{value} 个'
          }
        }
      ],
      xAxis: {
        type: 'category',
        //data: ['电站1', '电站2', '电站3', '电站4', '电站5', '电站6', '电站7']
        data: stationNameData,
      },
      series: [
        {
          name: '平均处理时间',
          type: 'line',
          // stack: '总量',
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
          data: handleAvgTime
          //这是平均处理时间的数据
          // data: [6, 15, 20, 8, 9, 7, 0,]
        },
        {
          name: '一级',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          yAxisIndex: 1,
          //data: [24, 11, 6, 5, 9, 10, 0]
          data: oneWarningNum,
        },
        {
          name: '二级',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          yAxisIndex: 1,
          data: twoWarningNum
          //data: [6, 10, 24, 11, 5, 9, 0]
        },
        {
          name: '三级',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          yAxisIndex: 1,
          data: threeWarningNum
          //data: [24, 6, 5, 9, 10, 11, 0]
        },
        {
          name: '四级',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          yAxisIndex: 1,
          data: fourWarningNum
          //data: [6, 5, 10, 24, 11, 7, 9]
        },
       

      ]
    };

    this.alarmChart.setOption(option)
    // windAlarmChart.on('click', (params) => {
    //  // console.log(params, '电站的参数');

    // })
  }
  render() {
    const { graphId } = this.props;
    return (
      <div style={{borderTop:"1px dashed #dfdfdf"}}>
        <div id={graphId} style={{ width: '1200px', height: '410px' }}> </div>
      </div>
    )
  }
}
export default (AlarmStatisticGraph)
