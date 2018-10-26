import React from "react";
import echarts from 'echarts';

class LostPowerTypeRate extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {

    const { graphId } = this.props;
    const targetPieChart = echarts.init(document.getElementById(graphId));
    let color = ["#a42b2c", "#f9b600", "#f9b600", "#199475", "#ceebe0"];
    const targetPieOption = {
      title: {
       
      },
      tooltip: {
        trigger: 'item',
        formatter: " <br/>{b} : {c} ({d}%)"
      },
      color:color,
      series: [
        {
          name: '发电量',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: '限电' },
            { value: 310, name: '变电故障' },
            { value: 234, name: '计划停机' },
            { value: 135, name: '光伏发电系统故障' },
            { value: 1048, name: '技改大修' },
            { value: 251, name: '场外因素' },          
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
    setTimeout(()=>{targetPieChart.resize();},1000) 
    targetPieChart.setOption(targetPieOption);
  }
  render() {
    const { graphId } = this.props;
    return (
      <div id={ graphId } style={{ display:'flex',flex:1 }}> </div>
    )
  }
}
export default (LostPowerTypeRate)