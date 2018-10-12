import React from "react";
import echarts from 'echarts';

class TargetStatisticPieGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {

    const { pieGraphId } = this.props;
    const targetPieChart = echarts.init(document.getElementById(pieGraphId));
    const targetPieOption = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      // legend: {
      //     orient: 'vertical',
      //     x: 'left',
      //     data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
      // },
      series: [
        {
          name: '发电量',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],

          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: 335, name: '未完成', },
            { value: 679, name: '已完成' },

          ]
        },
        {
          name: '发电量',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          data: [
            { value: 335, name: '1月' },
            { value: 310, name: '2月' },
            { value: 234, name: '3月' },
            { value: 135, name: '4月' },
            { value: 1048, name: '5月' },
            { value: 251, name: '6月' },
            { value: 147, name: '7月' },
            { value: 102, name: '8月' },
            { value: 135, name: '9月' },
            { value: 1048, name: '10月' },
            { value: 251, name: '11月' },
            { value: 234, name: '12月' },
          ]
        }
      ]
    };

    targetPieChart.setOption(targetPieOption);

    targetPieChart.resize();
  }
  render() {
    const { pieGraphId } = this.props;
    return (
      <div id={pieGraphId} style={{ width: '30%', height: "300px", }}> </div>
    )
  }
}
export default (TargetStatisticPieGraph)