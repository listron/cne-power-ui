

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import { Radio } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {showNoData, hiddenNoData} from '../../../../../constants/echartsNoData';

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
    //console.log(capabilityData);
    const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    const powerDiagram = echarts.init(document.getElementById('powerDiagram'));

    const lineColor = '#999';
    const capabilityPower = capabilityData && capabilityData.map(e => e.stationPower);
    const capabilityRadiation = capabilityData && capabilityData.map(e => e.instantaneous);
    const filterCapabilityPower = capabilityData && capabilityData.filter(e => e.stationPower);
    const filterCapabilityRadiation = capabilityData && capabilityData.filter(e => e.instantaneous);

    const actualPower = powerData && powerData.map(e=>e.actualPower);
    const filterActualPower = powerData && powerData.filter(e=>e.actualPower);
    const theoryPower = powerData && powerData.map(e=>e.theoryPower);
    const filterTheoryPower = powerData && powerData.filter(e=>e.theoryPower);
    const instantaneous = powerData && powerData.map(e=>e.instantaneous);
    const filterInstantaneous = powerData && powerData.filter(e=>e.instantaneous);

    const capabilityGraphic = (capabilityData && capabilityData.length === 0 && 
      filterCapabilityPower.length === 0 && filterCapabilityRadiation.length === 0) ? showNoData : hiddenNoData;
    const powerGraphic = (powerData && powerData.length === 0 && 
      filterActualPower.length===0 && filterTheoryPower.length===0 && filterInstantaneous.length===0
    ) ? showNoData : hiddenNoData;

    const capabilityOption = {//出力图
      graphic: capabilityGraphic,
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
            <div style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;" >${param[0] && param[0].name || '--'}</div>
            <div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #199475; width:6px; height:6px; border-radius:100%;"></span> 斜面辐射: ${param[1] && param[1].value || '--'}</div>
            <div style="padding-left: 5px;" ><span style="display: inline-block; background:#ffffff; border:1px solid #a42b2c; width:6px; height:6px; border-radius:100%;"></span> 功率: ${param[0] && param[0].value || '--'}</div>
          </div>`;
        },
        extraCssText:'background: rgba(0,0,0,0);',
      },
      calculable: true,
      xAxis: {
          type: 'category',
          splitNumber: 4,
          boundaryGap: false,
          data: capabilityData && capabilityData.map(e=>{
            return moment(moment.utc(e.utc).toDate()).format('MM-DD HH:mm');
          }),
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
            interval:20,
            
          },
          axisTick: {
            show: false,
            interval: 4,
          },
         
          axisPointer:{
            label: {
              show: false,
            }
          },
        },
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
          data: capabilityPower,
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
          data: capabilityRadiation,
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
    capabilityDiagram.setOption(capabilityOption);
    capabilityDiagram.resize();

    const powerOption = {//实际发电量 理论发电量
      graphic: powerGraphic,
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
          return `<div style="width: 150px; height: 120px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div  style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;">${param[0].name}</div>
            <div style="padding-left: 5px;"><span style="display: inline-block; background:#f9b600; width:5px; height:5px; border-radius:100%;"></span> 辐射: ${parseFloat(param[2].value).toFixed(2) || 0}</div>
            <div style="padding-left: 5px;"><span style="display: inline-block; background:#a42b2c;  width:5px; height:5px; border-radius:100%;"></span> 实际发电量: ${parseFloat(param[0].value).toFixed(4) || 0}</div>
            <div style="padding-left: 5px;"><span style="display: inline-block; background:#c7ceb2;  width:5px; height:5px; border-radius:100%;"></span> 理论发电量: ${parseFloat(param[1].value).toFixed(4) || 0}</div>
            <div style="padding-left: 15px;">完成率: ${rate}</div>
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
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#f1f1f1',
              type: 'dotted',
            }
          }
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
              type: 'dotted',
            }
          }
        }
      ],
      series: [
        {
          name: '实际发电量',
          type: 'bar',
          data: actualPower,
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
          data: theoryPower,
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
          data: instantaneous,
          yAxisIndex: 1,
          lineStyle: {
            type: 'solid',
            color: "#f7c028",
          }
        }
      ]
    }
    powerDiagram.setOption(powerOption);
    powerDiagram.resize();
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
          <Link to={resourceAnalysis}  target="_blank" ><i className="iconfont icon-more"></i></Link>
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
