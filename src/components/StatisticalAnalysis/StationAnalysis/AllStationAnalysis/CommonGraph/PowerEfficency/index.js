import React from "react";

import echarts from 'echarts';


class PowerEfficency extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { graphId,  } = this.props;
    
      const targetChart = echarts.init(document.getElementById(graphId));
      const targetMonthOption = {        
        
          
          tooltip: {
              trigger: 'axis',
              axisPointer: {type: 'cross'}
          },
          legend: {
              data:['等效利用小时数','辐射总量','PR'],
             
             
          },
          xAxis: [
              {
                  type: 'category',
                  
                  axisTick: {
                      alignWithLabel: true
                  },
                  data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '等效利用小时数 (h)',
                 
                  position: 'left',
                  axisLine: {
                    show: false,
                  },
                  axisLabel: {
                      formatter: '{value} '
                  }
              },
              {
                  type: 'value',
                  name: '辐射总量(MJ/㎡)',
                  
                  position: 'right',
                  axisLine: {
                      show:false
                  },
                  axisLabel: {
                      formatter: '{value}'
                  }
              }, {
                type: 'value',
                name: 'PR',
                
                position: 'right',
                offset:40,
                axisLine: {
                    lineStyle: {
                        color: '#666',
                    }
                },
                axisLabel: {
                    formatter: '{value}%'
                }
            }
          ],
          series: [
              {
                  name:'等效利用小时数',
                  stack: '总量',
                
                  color: '#666',
                  type:'bar',
                  data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
              },
              {
                  name:'辐射总量',
                  type:'line',
                  color: '#e15f49',
                  yAxisIndex: 1,
                  data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
              },
              
              {
                  name:'PR',
                  type:'line',
                  color: '#e6e303',
                  yAxisIndex: 1,
                  data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
              }
          ]
      
    
      };
      targetChart.setOption(targetMonthOption)
      targetChart.resize();
    
    
  }
 
  render() {
    const { graphId, } = this.props;
    return (

      <div id={graphId}  style={{ width: '55%', height: "300px", }}> </div>

    )
  }
}
export default (PowerEfficency)