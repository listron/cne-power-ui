import React from "react";
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

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
    const {pieGraphId,pieData ,pieComplete,hasData} = param;
    const targetPieChart = echarts.init(document.getElementById(pieGraphId));
    targetPieChart.resize();
    targetPieChart.clear();
    const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
    const targetPieOption = {
      graphic: confluenceTenMinGraphic,
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        formatter: function (params) {
            return '<div style="border-bottom: 1px solid #ccc; font-size: 12px;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;">'+params.name+'</div>'
              + '月发电量' + '：' + params.value + '万kWh<br>'
              + '年计划完成率' + '：' + params.percent + '%<br>'         
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
          color:['#a42b2c','#d48265','#91c7af','#749f83','#ca8622','#efc17e','#d8907a','#bda29a','#546570','#6e7074','#9b9b9b','#ceebe0'],
          center: ['50%', '50%'],
          radius: ['0%', '55%'],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
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
