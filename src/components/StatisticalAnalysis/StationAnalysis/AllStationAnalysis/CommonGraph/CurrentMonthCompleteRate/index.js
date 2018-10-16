import React from "react";

import echarts from 'echarts';


class barGraph extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { graphId, yAxisName,xAxisName, dateType } = this.props;
  
      const targetChart = echarts.init(document.getElementById(graphId));
    
      const targetMonthOption = {
        title: {
            text: '堆叠区域图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['2017','2018','同比']
        },
        
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            }
        ],
        yAxis : [
            {
              type : 'value',    name: '当月累计完成率',
            },{
              type : 'value',    name: '同比',
            }
        ],
        series : [
            {
                name:'2017',
                type:'line',
                lineStyle: {
                  normal: {
                      color: 'red',
                      width: 2,
                      type: 'dashed'
                  }
              },
                // stack: '总量',
              
                data:[320, 332, 301, 334, 390, 330, 320]
              
            },
           
            {
                name:'2018',
                type:'line',
                // stack: '总量',
                areaStyle: {normal: {}},
                data:[820, 932, 901, 934, 1290, 1330, 1320]
              
            },
            {
                name:'同比',
                type:'line',
                // stack: '总量',
                // label: {
                //     normal: {
                //         show: true,
                //         position: 'top'
                //     }
                // },
                // areaStyle: {normal: {}},
                data:[120, 132, 101, 134, 90, 230, 210]
            }
        ]
    };
    
      targetChart.setOption(targetMonthOption)
      targetChart.resize();
    
  
  }
  componentWillReceiveProps(nextProps) {
    const { graphId, yAxisName,xAxisName, dateType }  = nextProps;
    if (dateType === 'day') {
      const targetChart = echarts.init(document.getElementById(graphId));
      const targetDayOption = {
        title: {
            text: '堆叠区域图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['2017','2018','同比']
        },
        
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            }
        ],
        yAxis : [
            {
              type : 'value',    name: '当月累计完成率',
            },{
              type : 'value',    name: '同比',
            }
        ],
        series : [
            {
                name:'2017',
                type:'line',
                lineStyle: {
                  normal: {
                      color: 'red',
                      width: 2,
                      type: 'dashed'
                  }
              },
                // stack: '总量',
              
                data:[320, 332, 301, 334, 390, 330, 320]
              
            },
           
            {
                name:'2018',
                type:'line',
                // stack: '总量',
                areaStyle: {normal: {}},
                data:[820, 932, 901, 934, 1290, 1330, 1320]
              
            },
            {
                name:'同比',
                type:'line',
                // stack: '总量',
                // label: {
                //     normal: {
                //         show: true,
                //         position: 'top'
                //     }
                // },
                // areaStyle: {normal: {}},
                data:[120, 132, 101, 134, 90, 230, 210]
            }
        ]
    };
      targetChart.setOption(targetDayOption)
      targetChart.resize();
    } 
   

  }
  render() {
    const { graphId,dateType } = this.props;
    return (

      <div id={graphId} style={{ width: '100%', height: "300px", }}> </div>

    )
  }
}
export default (barGraph)