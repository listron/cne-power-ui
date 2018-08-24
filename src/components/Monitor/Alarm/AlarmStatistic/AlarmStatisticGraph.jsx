import React from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
class AlarmStatisticByType extends React.Component{
    static propTypes = {
       
        graphId: PropTypes.string,
       
      }
    constructor(props,context){
        super(props,context)
    }
    componentDidMount() {
        const { graphId } = this.props
        const windAlarmChart = echarts.init(document.getElementById(graphId));
        this.setMapChart(windAlarmChart);
      }
      setMapChart = (windAlarmChart) => {
    
       //let colors = ['#5793f3', '#d14a61', '#675bba'];
        //const { stationDataList } = this.props;
        const option = {
            //color: colors,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                // formatter: (params) => {
                //     // console.log(params.data);
                //      return `<div class='stationCard' style='height:70px;overflow:hidden'>
                //      <div class='stationCardTitle' style='display:flex;flex-direction: row;justify-content: space-between;'>
                //      <span>${1}</span>
                    
                //      <span style='color:red' onClick={console.log(${1},'报警数')}>${2}</span>              
                //      </div>           
                //      <div class='stationCardProgress' style='background:#dfdfdf;height:1px;
                //      width:100%;' ></div>
                //      <div class='stationCardValue'}>
                //        <span class='stationMark'>${3}MW</span>
                //        &nbsp;&nbsp;
                //        <span>${4}MW</span>
                //      </div>
                //      <div class='stationCardWindSpeed'>${5}m/s</div>             
                //    </div>`
                //    },
                   backgroundColor: '#fff',
                   textStyle: {
                    color: '#999',
                  },
            },
            legend: {
                data: ['一级', '二级','三级','四级','平均处理时间']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis:  [
                {
                    type: 'value',
                    name: '天数(天)',
                    min: 0,
                    max: 100,
                    position: 'right',
                   
                    axisLine: {
                        lineStyle: {
                            
                        }
                    },
                    axisLabel: {
                        formatter: '{value} 天'
                    }
                },
                {
                    type: 'value',
                    name: '告警个数(个)',
                    min: 0,
                    max: 200,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                           
                        }
                    },
                    axisLabel: {
                        formatter: '{value} 个'
                    }
                }
            ],
            xAxis: {
                type: 'category',
                data: ['电站1','电站2','电站3','电站4','电站5','电站6','电站7']
            },
            series: [
                {
                    name: '平均处理时间',
                    type: 'line',
                    // stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            //position: 'insideRight'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'green',
                            width: 2,
                            type: 'dashed'
                        }
                    },
                    //这是平均处理时间的数据
                    data: [6,15,20,8,9,7,9,]
                },
                {
                    name: '一级',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [24,11,6,5,9,10,7]
                },
                {
                    name: '二级',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [6,10,24,11,5,9,7]
                },
                {
                    name: '三级',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [24,6,5,9,10,11,7]
                },
                {
                    name: '四级',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [6,5,10,24,11,7,9]
                },
                
            ]
        };
       
        windAlarmChart.setOption(option)
        windAlarmChart.on('click', (params) => {
          // alert('我要跳转')
          console.log(params, '电站的参数');
    
        })
      }
    render(){
        const {graphId}=this.props;
        return(
            <div>
               <div id={graphId} style={{width: '1200px',height:'410px'}}> </div>
            </div>
        )
    }
}
export default (AlarmStatisticByType)
 