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

  drawChart=(param)=>{
    const { allStationMonthpie,yAxisName } = param;
    const targetPieChart = echarts.init(document.getElementById(allStationMonthpie));
    let reg=/\(([^()]+)\)/g;
    let unit=reg.exec(yAxisName)[1];
    const targetPieOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        formatter: function (params) {
          return '<div style="border-bottom: 1px solid #ccc; font-size: 12px;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;">'+params.name+'</div>'
            + yAxisName.split('(')[0] + '：' + params.value +unit+ '<br>'
            + '同比' + '：' + params.percent + '%<br>';
        },
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '发电量',
          type: 'pie',
          color:['#a42b2c','#fbe6e3','#199475','#c7ceb2','#ceebe0','#f9b600'],
          radius: '55%',
          center: ['50%', '50%'],
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
  };

  render() {
    const { allStationMonthpie } = this.props;
    return (
      <div id={ allStationMonthpie } style={{ width: '30%', height: "300px", }}> </div>
    )
  }
}
export default (AllStationMonthPie)
