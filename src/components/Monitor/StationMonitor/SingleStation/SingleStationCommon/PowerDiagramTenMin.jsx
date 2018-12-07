

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './singleStationCommon.scss';
import echarts from 'echarts';
import { Radio } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class PowerDiagramTenMin extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    powerData: PropTypes.array,
    match: PropTypes.object,
    getPowerDataTenMin: PropTypes.func,
    stationCode: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      intervalTime: 0, // 默认电站发电量时间段， 0日，1月, 2年
    }
  }

  componentWillReceiveProps(nextProps) {
    const { powerData, chartType } = nextProps;
    const { intervalTime } = this.state;
    const powerDiagram = echarts.init(document.getElementById('powerDiagram'));

    const lineColor = '#666';
    const actualPower = powerData.map(e => e.actualPower);  // 实际发电量
    const filterActualPower = powerData.filter(e => e.actualPower);
    const theoryPower = powerData.map(e => e.theoryPower); // 理论发电量
    const filterTheoryPower = powerData.filter(e => e.theoryPower);
    const instantaneous = powerData.map(e => e.instantaneous); // 风速／累计曝幅值
    const filterInstantaneous = powerData.filter(e => e.instantaneous);
    const completeRate = powerData.map(e => e.completeRate);  // 完成率
    const filterCompleteRate = powerData.filter(e => e.completeRate);
    const powerGraphic = (
      filterActualPower.length === 0 
      && filterTheoryPower.length === 0 
      && filterInstantaneous.length === 0 
      && filterCompleteRate.length ===0
    ) ? showNoData : hiddenNoData;
    let color=this.getColor(chartType);
    const powerOption = {//实际发电量 理论发电量
      graphic: powerGraphic,
      color:color,
      title: {
        text: '发电量',
        textStyle: {
          color: lineColor,
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      grid: {
        right: 85,
      },
      legend: {
        icon: 'circle',
        textStyle: {
          color: lineColor,
        },
        itemWidth: 5,
        itemHeight: 5,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: (params) => {
          let paramsItem = '';
          params.forEach((item, index) => {
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${ (params[index].value ||  params[index].value === '0'  &&  parseFloat(params[index].value).toFixed(this.getDefaultPoint(params[index].seriesName))) || '--'}</div>`
          });
          let complate=intervalTime!==0?`<div style="margin-left:11px;">${'完成率'}:${(completeRate.length>0 && (completeRate[params[0].dataIndex].completeRate)*1000/10) || '--'}%</div>`:''
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:150px;overflow:hidden;"> <span style="float: left">${params[0].name} </span>
            </div>${paramsItem}${complate}`
        },

      },
      axisPointer:{
        type:'line',
        snap:true,
        lineStyle:{
          width:38,
          color:'rgba(150,150,150,0.3)'
        }
      },
      calculable: false,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: powerData && powerData.map(e => intervalTime === 0 ? moment(e.time).format('MM-DD') : e.time),
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
        }, {
          name: chartType === 'wind' ? '平均风速(m/s)' : `${intervalTime === 0 ? '累计曝幅值(MJ/m²)' : (intervalTime === 1 ? '月辐射总量(MJ/m)' : '年辐射总量(MJ/m)')}`,
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
            padding: [0, 30, 0, 0],
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
        }, {
          name: '完成率',
          type: 'value',
          offset: 40,
          axisLabel: {
            formatter: '{value}%',
            color: lineColor,
          },
          nameTextStyle: {
            color: lineColor,
            padding: [0, 0, 0, 30],
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
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
          name: chartType === 'wind' ? '平均风速' : `${intervalTime === 0 ? '累计曝幅值' : (intervalTime === 1 ? '月辐射总量' : '年辐射总量')}`,
          type: 'line',
          data: instantaneous,
          yAxisIndex: 1,
          lineStyle: {
            type: 'solid',
          },
        },{
          name: '完成率',
          type: 'line',
          data: completeRate,
          yAxisIndex: 2,
          lineStyle: {
            type: 'solid',
          },
        }
      ]
    }
    if (intervalTime === 0) { // 日 不显示部分坐标轴与数据。
      powerOption.grid.right = '10%';
      powerOption.yAxis[1].nameTextStyle.padding = 0;
      powerOption.yAxis = powerOption.yAxis.filter(e => e.name !== '完成率');
      powerOption.series = powerOption.series.filter(e => e.name !== '理论发电量' && e.name !== '完成率');
    }
    console.log(powerOption)
    powerDiagram.setOption(powerOption);
    powerDiagram.resize();
  }

  onChangeTimePower = (e) => {
    const { stationCode } = this.props;
    const intervalTime = e.target.value;
    this.setState({ intervalTime });
    this.props.getPowerDataTenMin(stationCode, intervalTime);// 时间格式传出，清空定时器并重新请求数据。
  }

  getColor = (type) => {
    let result = [];
    switch (type) {
      case 'wind':
        result = ['#a42b2c', '#c7ceb2', '#3e97d1'];
        break;
      default:
        result = ['#a42b2c', '#c7ceb2', '#f7c028'];
        break;
    }
    return result;
  }

   getDefault=(intervalTime)=>{
     let result=[];
     switch(intervalTime){
       case 0: result='累计曝幅值';break;
       case 1: result='累计曝幅值';break;
     }
     return result;
   }


   getDefaultPoint=(name)=>{
    let result=[];
    switch(name){
      case '累计发电量': result=4;break;
      case '理论发电量': result=4;break;
      default:result=2;break
    }
    return result;
   }

  render() {
    const { stationCode } = this.props;
    const productionAnalysis = `/statistical/stationaccount/production#${stationCode}`;
    return (
      <div className={styles.powerDiagramBox} >
        <div id="powerDiagram" style={{ width: "100%", height: "100%", color: '#666', paddingTop: "20px" }}></div>
        <div className={styles.powerRadio}>
          <RadioGroup defaultValue={0} size="small" onChange={this.onChangeTimePower} >
            <RadioButton value={0}>日</RadioButton>
            <RadioButton value={1}>月</RadioButton>
            <RadioButton value={2}>年</RadioButton>
          </RadioGroup>
        </div>
        <Link to={productionAnalysis} ><i className="iconfont icon-more"></i></Link>
      </div>
    )
  }
}

export default PowerDiagramTenMin;
