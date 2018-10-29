import React from "react";
import echarts from 'echarts';

class LostPowerTypeRate extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.drawCharts(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawCharts(nextProps)
  }

  getName = (type) => {
    let name = '';
    switch (type) {
      case 'eletric': name = '变电故障'; break;
      case 'limit': name = '限电'; break;
      case 'plane': name = '计划停机'; break;
      case 'system': name = '光伏发电系统故障'; break;
      case 'other': name = '场外因素'; break;
    }
    return name;
  }

  drawCharts = (params) => {
    const { graphId, data, yAxisName } = params;
    const targetPieChart = echarts.init(document.getElementById(graphId));
    let color = ["#f9b600", "#a42b2c", "#fbe6e3", "#199475", "#ceebe0"];
    // let color = ["#a42b2c", "#d48265", "#91c7af", "#749f83", "#ca8622", "#bda29a", "#546570", "#6e7074", "#9b9b9b", "#ceebe0", "#199475", "#f1f1f1"];
    let seriesData = [];
    for (var tests in data) {
      if (tests !== 'date') {
        var json = { name: this.getName(tests), value: data[tests] };
        seriesData.push(json);
      }
    }
    const targetPieOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        formatter: function (params) {
          return '<div style="border-bottom: 1px solid #ccc; font-size: 12px;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;">' + params.name + '</div>'
            + '损失电量' + '：' + params.value +'<br>'
            + '所占比例' + '：' + params.percent + '%<br>';
        },
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
      },
      color: color,
      series: [
        {
          name: '发电量',
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          data: seriesData,
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
    setTimeout(() => { targetPieChart.resize(); }, 1000)
    targetPieChart.setOption(targetPieOption);
  }

  render() {
    const { graphId } = this.props;
    return (
      <div id={graphId} style={{ display: 'flex', flex: 1, height: 250 }}> </div>
    )
  }
}
export default (LostPowerTypeRate)