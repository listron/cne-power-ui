import React from "react";
import echarts from 'echarts';
import PropTypes from 'prop-types';

class TargetStatisticPieGraph extends React.Component {
  static propTypes = {
    pieGraphId: PropTypes.string,
  };
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.drawChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  componentWillReceiveProps(){
    this.drawChart(this.props);
  }

  drawChart = (param) => {
    const {pieGraphId,pieData ,pieComplete} = param;
    //console.log(pieData,pieComplete);
    const targetPieChart = echarts.init(document.getElementById(pieGraphId));
    targetPieChart.resize();
    targetPieChart.clear();
    const targetPieOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        formatter: function (params) {
          if(params.seriesIndex===1){
            return '<div style="border-bottom: 1px solid #ccc; font-size: 12px;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;">'+params.name+'</div>'
              + '月发电量' + '：' + params.value + '万kwh<br>'
              + '年计划完成率' + '：' + params.percent + '%<br>'
          }
        },
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name: '发电量',
          type: 'pie',
          color:['#199475','#f1f1f1'],
          center: ['50%', '50%'],
          radius: [0, '30%'],
          label: {
            show:false,
            position: 'inner',
            //formatter: '{b}: {d}',
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          // data: [
          //   {value: 679, name: '已完成'},
          //   {value: 335, name: '未完成',},

          // ]
          data:pieComplete
        },
        {
          name: '发电量',
          type: 'pie',
          color:['#a42b2c','#d48265','#91c7af','#749f83','#ca8622','#bda29a','#546570','#6e7074','#9b9b9b','#ceebe0'],
          center: ['50%', '50%'],
          radius: ['40%', '55%'],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          // data: [
          //   {value: 335, name: '1月'},
          //   {value: 310, name: '2月'},
          //   {value: 234, name: '3月'},
          //   {value: 135, name: '4月'},
          //   {value: 1048, name: '5月'},
          //   {value: 251, name: '6月'},
          //   {value: 147, name: '7月'},
          //   {value: 102, name: '8月'},
          //   {value: 135, name: '9月'},
          //   {value: 1048, name: '10月'},
          //   {value: 251, name: '11月'},
          //   {value: 234, name: '12月'},
          // ]
          data:pieData
        }
      ]
    };
    targetPieChart.setOption(targetPieOption);
  };

  render() {
    const {pieGraphId} = this.props;
    return (
      <div id={pieGraphId}> </div>
    )
  }
}

export default (TargetStatisticPieGraph)
