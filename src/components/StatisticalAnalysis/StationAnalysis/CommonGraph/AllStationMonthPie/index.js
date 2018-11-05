import React from "react";
import echarts from 'echarts';
import PropTypes from 'prop-types';

class AllStationMonthPie extends React.Component {
  static propTypes = {
    allStationMonthpie: PropTypes.string,
  };
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.drawChart(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps)
  }

  drawChart=(param)=>{
    const { allStationMonthpie,yAxisName,pieTargetData, } = param;
    const targetPieChart = echarts.init(document.getElementById(allStationMonthpie));
    let reg=/\(([^()]+)\)/g;
    let unit=reg.exec(yAxisName)[1];
    targetPieChart.clear();
    targetPieChart.resize();
    const targetPieOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        formatter: function (params) {
          return '<div style="border-bottom: 1px solid #ccc; font-size: 12px;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;">'+params.name+'</div>'
            + yAxisName.split('(')[0] + '：' + params.value +unit+ '<br>'
            + '同比' + '：' + params.percent + '%<br>';
        },
      },
      series: [
        {
          name: '发电量',
          type: 'pie',
          color:['#a42b2c','#d48265','#91c7af','#749f83','#ca8622','#bda29a','#546570','#6e7074','#9b9b9b','#ceebe0'],
          radius: '55%',
          center: ['50%', '50%'],
          data:pieTargetData,
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
  };

  render() {
    const { allStationMonthpie } = this.props;
    return (
      <div id={ allStationMonthpie}  > </div>
    )
  }
}
export default (AllStationMonthPie)
