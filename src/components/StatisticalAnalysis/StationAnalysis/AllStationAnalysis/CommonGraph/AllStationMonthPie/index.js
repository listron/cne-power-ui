import React from "react";
import echarts from 'echarts';

class AllStationMonthPie extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {

    const { allStationMonthpie } = this.props;
    const targetPieChart = echarts.init(document.getElementById(allStationMonthpie));

    const targetPieOption = {
      title: {
       
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left',
      //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      // },
      series: [
        {
          name: '发电量',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
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
          ],
          label: {
            normal: {
                show: false
            },
            emphasis: {
                show: false
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    targetPieChart.setOption(targetPieOption);

    targetPieChart.resize();
  }
  render() {
    const { allStationMonthpie } = this.props;
    return (
      <div id={ allStationMonthpie } style={{ width: '30%', height: "300px", }}> </div>
    )
  }
}
export default (AllStationMonthPie)