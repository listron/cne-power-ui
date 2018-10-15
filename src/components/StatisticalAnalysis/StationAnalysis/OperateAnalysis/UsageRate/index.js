import React from "react";

import echarts from 'echarts';


class barGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { graphId, yAxisName,xAxisName, dateType } = this.props;
  
      const targetChart = echarts.init(document.getElementById(graphId));
    
      
      const targetMonthOption  = {
        title: {
            text: '可利用率',
          
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['电站可利用率','发电系统可利用率']
        },
       
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        series: [
            {
                name:'电站可利用率',
                type:'line',
                data:[11, 11, 15, 13, 12, 13, 10,1, 2, 2, 5, 3, 2, 0],
              
               
            },
            {
                name:'发电系统可利用率',
                type:'line',
                data:[1, 2, 2, 5, 3, 2, 0,11, 15, 13, 12, 13, 10,1,],
            
                
            }
        ]
    };

    
      targetChart.setOption(targetMonthOption)
      targetChart.resize();
    
  
  }
  componentWillReceiveProps(nextProps) {
    const { graphId, yAxisName,xAxisName, dateType }  = nextProps;
  
      const targetChart = echarts.init(document.getElementById(graphId));
      const targetMonthOption  = {
        title: {
            text: '可利用率',
            subtext: '纯属虚构'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['电站可利用率','发电系统可利用率']
        },
       
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        series: [
            {
                name:'电站可利用率',
                type:'line',
                data:[11, 11, 15, 13, 12, 13, 10,1, 2, 2, 5, 3, 2, 0],
              
               
            },
            {
                name:'发电系统可利用率',
                type:'line',
                data:[1, 2, 2, 5, 3, 2, 0,11, 15, 13, 12, 13, 10,1,],
            
                
            }
        ]
    };
      targetChart.setOption(targetMonthOption)
      targetChart.resize();
    
   

  }
  render() {
    const { graphId,dateType } = this.props;
    return (

      <div id={graphId} style={{ width: '55%', height: "300px", }}> </div>

    )
  }
}
export default (barGraph)