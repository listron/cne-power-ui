

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import { Radio } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class OutputPowerDiagram extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    powerData: PropTypes.array,
    match: PropTypes.object,
    getMonitorPower: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }


  componentWillReceiveProps(nextProps) {
    const { capabilityData, powerData } = nextProps;
    const lineColor = '#999';
    const stationPowerData = capabilityData && capabilityData.map(e => e.stationPower);
    const instantaneousData = capabilityData && capabilityData.map(e => e.instantaneous);
    // const filterStationPowerData = capabilityData && capabilityData.filter(e => e.stationPower);
    // const filterInstantaneousData = capabilityData && capabilityData.filter(e => e.instantaneous);
    const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    const powerDiagram = echarts.init(document.getElementById('powerDiagram'));

    // const graphicData = ((stationPowerData.length === 0 && filterStationPowerData.length === 0) && (instantaneousData.length === 0 && filterInstantaneousData.length === 0)) ? [
    //   {
    //     type: 'group',
    //     left: 'center',
    //     top: 'center',
    //     children: [
    //       {
    //         type: 'text',
    //         z: 100,
    //         left: 'center',
    //         top: 'middle',
    //         style: {
    //           fill: '#999',
    //           text: [
    //             '暂无数据'
    //           ],
    //           font: '14px Microsoft YaHei',
    //         }
    //       }
    //     ]
    //   }
    // ] : [];

    const tmpOption = {
      title: {
        text: '出力图',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
        data:['功率','斜面辐射'],
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
        itemWidth: 24,
        itemHeight: 6,
      },
      grid: {
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        backgroundColor: '#fff',
        textStyle: {
          color: '#999',
          fontSize: '12px',
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#666',
          }
        },
        formatter: (param) => {
          return `<div style="width: 128px; height: 75px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;" >${param[0].name}</div>
            <div style="padding-left: 5px;" >${param[1].marker}斜面辐射: ${param[1].value}</div>
            <div style="padding-left: 5px;" >${param[0].marker}功率: ${param[0].value}</div>
          </div>`;
        },
        extraCssText:'background: rgba(0,0,0,0);',
      },
      // graphic: graphicData,
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: capabilityData && capabilityData.map(e=>{
            return moment(moment.utc(e.utc).toDate()).format('MM-DD hh:mm');
          }),
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: {
            show: false,
          },
        }
      ],
      yAxis: [
        {
          name: '功率(MW)',
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          splitLine: {
            show: false,
          },
        },
        {
          name: '辐射(W/m²)',
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          splitLine: {
            show: false,
          },
        }
      ],
      series: [
        {
          name: '功率',
          type: 'line',
          smooth: true,
          data: stationPowerData,
          yAxisIndex: 0,
          areaStyle: {
            color: '#fff2f2',
          },
          itemStyle: {
            opacity: 0,
          },
          axisTick: {
            show: false,
          },
          lineStyle: {
            type: 'solid',
            color: '#c57576',
            width: 1,
          },
        },
        {
          name:'斜面辐射',
          type: 'line',
          data: instantaneousData,
          yAxisIndex: 1,
          itemStyle: {
            color: "#199475",
            opacity: 0,
          },
          axisTick: {
            show: false,
          },
          lineStyle: {
            type: 'dotted',
            color: '#199475',
            width: 1,
          },
        }
      ]
    }
   

    capabilityDiagram.setOption(tmpOption);

    // if (nextProps.capabilityData !== this.props.capabilityData && nextProps.capabilityData.length !== 0) {
    //   echarts.dispose(document.getElementById('capabilityDiagram'));
    //   const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    //   capabilityDiagram.setOption(tmpOption);
    // }

    // if((stationPowerData.length===0&&filterStationPowerData.length===0)&&(instantaneousData.length===0&&filterInstantaneousData.length===0)){
    //   capabilityDiagram.setOption(tmpOption);
    // }else{
    //   echarts.dispose(document.getElementById('capabilityDiagram'));
    //   const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    //   capabilityDiagram.setOption(tmpOptionTest);
    // }


    // if(graphicData.length === 0){
    //   echarts.dispose(document.getElementById('capabilityDiagram'));
    //   const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    //   capabilityDiagram.setOption(tmpOption);
    // }else{
    //    capabilityDiagram.setOption(tmpOption);
    // }
    // //console.log(tmpOption.graphic)
    // capabilityDiagram.setOption(tmpOption);

    powerDiagram.setOption({
      color: ['#a42b2c', '#c7ceb2', '#f7c028'],
      title: {
        text: '发电量',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
        data: [{
          name: '实际发电量',
          icon: 'circle',
        },{
          name: '理论发电量',
          icon: 'circle',
        },{
          name: '日曝辐值',
          icon: 'circle',
        }],
        textStyle:{
          color: lineColor,
        },
        itemWidth: 5,
        itemHeight: 5,        
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        backgroundColor: '#fff',
        textStyle: {
          color: '#999',
          fontSize: '12px',
        },
        formatter: (param) => {
          let rate=(param[0].value/param[1].value)<1 ? (param[0].value/param[1].value).toFixed(2)+'%' : '100%';
          return `<div style="width: 128px; height: 115px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div  style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;">${param[0].name}</div>
            <div style="padding-left: 5px;">日曝辐值: ${param[2].value}</div>
            <div style="padding-left: 5px;">实际发电量: ${param[0].value}</div>
            <div style="padding-left: 5px;">理论发电量: ${param[1].value}</div>
            <div style="padding-left: 5px;">完成率: ${rate}</div>
          </div>`;
        },
        extraCssText:'background: rgba(0,0,0,0);',
      },
      calculable: false,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: powerData && powerData.map(e => e.time),
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: { show: false },
          boundaryGap: [true, true],
        }
      ],
      yAxis: [
        {
          name: '电量(万kWh)',
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            show: false,
          },
        },
        {
          name: '日曝辐值(MJ/m²)',
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#f1f1f1',
              type: 'dashed',
            }
          }
        }
      ],
      series: [
        {
          name: '实际发电量',
          type: 'bar',
          data: powerData && powerData.map(e => e.actualPower),
          label: {
            show: false,
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
          name: '理论发电量',
          type: 'bar',
          data: powerData && powerData.map(e => e.theoryPower),
          label: {
            show: false,
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
          name:'日曝辐值',
          type:'line',
          data: powerData && powerData.map(e=>e.instantaneous),
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
    const { stationCode } = this.props.match.params;
    this.props.getMonitorPower({
      stationCode,
      intervalTime: parseInt(e.target.value),
      startTime: moment().set({ 'year': moment().year(), 'month': 0, 'date': 1, }).format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
    });
  }

  render() {
    const resourceAnalysis = "/statistical/stationaccount/resource";
    const productionAnalysis = "/statistical/stationaccount/production";
    return (
      <div className={styles.outputPowerDiagram}>
        <div className={styles.capabilityDiagramBox} >
          <div id="capabilityDiagram" style={{ width: "100%", height: "100%", borderRight: "2px solid #dfdfdf", color: '#999', paddingTop: "20px" }}><i className="iconfont icon-more"></i></div>
          <Link to={resourceAnalysis} target="_blank"  ><i className="iconfont icon-more"></i></Link>
        </div>
        <div className={styles.powerDiagramBox} >
          <div id="powerDiagram" style={{ width: "100%", height: "100%", color: '#999', paddingTop: "20px" }}></div>
          <div className={styles.powerRadio}>
            <RadioGroup defaultValue="0" size="small" onChange={this.onChangeTimePower} >
              <RadioButton value="0">日</RadioButton>
              <RadioButton value="1">月</RadioButton>
              <RadioButton value="2">年</RadioButton>
            </RadioGroup>
          </div>
          <Link to={productionAnalysis} target="_blank"  ><i className="iconfont icon-more"></i></Link>
        </div>

      </div>
    )
  }
}

export default OutputPowerDiagram;
