

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import { Radio } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class OutputPowerDiagram extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    powerData: PropTypes.array,
    match: PropTypes.object,
    getMonitorPower: PropTypes.func,
  }

  constructor(props){
    super(props);

  }
  componentDidMount(){
    
  }

  componentWillReceiveProps(nextProps){
    const { capabilityData, powerData } = nextProps;
    const lineColor = '#999';
    const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    const powerDiagram = echarts.init(document.getElementById('powerDiagram'));
    capabilityDiagram.setOption({
      title: {
        text: '出力图',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
        data:['功率','瞬时辐照'],
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
      },
      grid: {
        show: true,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        backgroundColor: '#fff',
        textStyle: {
          color: lineColor,
          fontSize: '12px',
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: capabilityData.map(e=>e.localTime),
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
        }
      ],
      yAxis: [
        {
          name: '功率(MW)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
        },
        {
          name: '瞬时辐照(W/m²)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
        }
      ],
      series: [
        {
          name:'功率',
          type:'line',
          smooth:true,
          data: capabilityData.map(e=>e.stationPower),
          yAxisIndex: 0,
          areaStyle: {
            color: '#fff2f2',
          }
        },
        {
          name:'瞬时辐照',
          type:'line',
          smooth:true,
          data: capabilityData.map(e=>e.instantaneous),
          yAxisIndex: 1,
          itemStyle: {
            color: "#199475",
          },
          lineStyle: {
            type: 'dashed',
          }
        }
      ]              
    });
    
    powerDiagram.setOption({
      color: ['#a42b2c','#c7ceb2','#f7c028'],
      title: {
        text: '发电量',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
        data:[{
          name: '实际发电量',
          icon: 'circle',
        },{
          name: '理论发电量',
          icon: 'circle',
        },{
          name: '日曝辐值',
          icon: 'circle',
        }],
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
      },
      grid: {
        show: true,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        backgroundColor: '#fff',
        textStyle: {
          color: lineColor,
          fontSize: '12px',
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: powerData.map(e=>e.time),
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisPointer: {
            type: 'shadow'
          },
          axisTick: {show: false},
          boundaryGap: [true, true],
        }
      ],
      yAxis: [
        {
          name: '电量(万kWh)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
        },
        {
          name: '日曝辐值(w/m²)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
        }
      ],
      series: [
        {
          name:'实际发电量',
          type:'bar',
          data: powerData.map(e=>e.actualPower),
          label: {
            show: true,
            rotate: 90,
            distance: 10,
            color: '#fff',
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
          },
          barGap: '0',
          barWidth: 14,
        },
        {
          name:'理论发电量',
          type:'bar',
          data: powerData.map(e=>e.theoryPower),
          label: {
            show: true,
            rotate: 90,
            distance: 10,
            color: '#fff',
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
          },
          barWidth: 14,
        },
        {
          name:'瞬时辐照',
          type:'line',
          data: powerData.map(e=>e.instantaneous),
          yAxisIndex: 1,
          lineStyle: {
            type: 'solid',
            color: "#f7c028",
          }
        }
      ]              
    })
  }

  onChangeTimePower = (e) => {
    console.log(e);
    const { stationCode, intervalTime } = this.props.match.params;
    this.props.getMonitorPower({stationCode,intervalTime: parseInt(e.target.value)});
  }

  render(){
    
    return (
      <div className={styles.outputPowerDiagram}>
        <div id="capabilityDiagram" style={{ width: "50%", height: "100%",borderRight:"2px solid #dfdfdf",color: '#999', paddingTop: "20px" }}></div>
        <div className={styles.powerDiagramBox} >
          <div id="powerDiagram" style={{ width: "100%", height: "100%",color: '#999', paddingTop: "20px" }}></div>
          <div className={styles.powerRadio}>
            <RadioGroup defaultValue="0" size="small" onChange={this.onChangeTimePower} >
              <RadioButton value="0">日</RadioButton>
              <RadioButton value="1">月</RadioButton>
              <RadioButton value="2">年</RadioButton>
            </RadioGroup>
          </div>
        </div>
        
      </div>
    )
  }
}

export default OutputPowerDiagram;
