import React from "react";
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

class WeatherRate extends React.Component {
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
      // "雪1", "雨2", "霾3", "阴4", "晴5","其他0"
      case '5': name = '晴'; break;
      case '4': name = '阴'; break;
      case '2': name = '雨'; break;
      case '1': name = '雪'; break;
      case '3': name = '霾'; break;
      case '0': name = '其他'; break;
    }
    return name;
  }

  drawCharts = (params) => {
    const { graphId, data, yAxisName ,hasData} = params;
    const targetPieChart = echarts.init(document.getElementById(graphId));
    let color=["#f9b600",'#999999','#199475','#c7ceb2','#a42b2c','#ceebe0']
    let seriesData= data.map((item)=>{
       return {
         name:this.getName(item.weather),
         value:item.days
       }
    })

    const confluenceTenMinGraphic = hasData? hiddenNoData :showNoData;
    const targetPieOption = {
      graphic: confluenceTenMinGraphic,
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        formatter: function (params) {
          return '<div style="border-bottom: 1px solid #ccc; font-size: 12px;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;">' + params.name + '</div>'
            + '天数' + '：' + params.value +'<br>'
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
      <div id={graphId} style={{height:260}}> </div>
    )
  }
}
export default (WeatherRate)