

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
  }

  constructor(props) {
    super(props);
    this.state = {
      intervalTime: 0, // 默认电站发电量时间段， 0日，1月, 2年
    }
  }

  componentWillReceiveProps(nextProps) {
    const { powerData,chartType } = nextProps;
    const { intervalTime } = this.state;
    const powerDiagram = echarts.init(document.getElementById('powerDiagram'));

    const lineColor = '#666';
    const actualPower = powerData.map(e => e.actualPower);
    const filterActualPower = powerData.filter(e => e.actualPower);
    const theoryPower = powerData.map(e => e.theoryPower);
    const filterTheoryPower = powerData.filter(e => e.theoryPower);
    const instantaneous = powerData.map(e => e.instantaneous);
    const filterInstantaneous = powerData.filter(e => e.instantaneous);
    const completeRate = powerData.filter(e => e.completeRate);

    const powerGraphic = (
      filterActualPower.length === 0 && filterTheoryPower.length === 0 && filterInstantaneous.length === 0
    ) ? showNoData : hiddenNoData;

    const powerOption = {//实际发电量 理论发电量
      graphic: powerGraphic,
      color: ['#a42b2c', '#c7ceb2', '#f7c028'],
      title: {
        text: '发电量',
        textStyle: {
          color: lineColor,
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
        data: [{
          name: '实际发电量',
          icon: 'circle',
        }, {
          name: '理论发电量',
          icon: 'circle',
        }, {
          name: chartType==='wind'?'平均风速':`${intervalTime === 0 ? '累计曝幅值' : (intervalTime === 1 ? '月辐射总量' : '年辐射总量')}`,
          icon: 'circle',
        }],
        textStyle: {
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
          color: lineColor,
          fontSize: '12px',
        },
        formatter: (param) => {
          if (!param || param.length === 0) {
            return <div></div>
          }
          let radi = '', thoryPower = '', actualPower = '', rate = '';
          const radiObj = param.find(e => chartType==='wind'?e.seriesName ==='平均风速':
            e.seriesName === (intervalTime === 0 ? '累计曝幅值' : (intervalTime === 1 ? '月辐射总量' : '年辐射总量')));
          const thoryPowerObj = param.find(e => e.seriesName === '理论发电量');
          const actualPowerObj = param.find(e => e.seriesName === '实际发电量');
          const tmpRadi = radiObj && radiObj.value && !isNaN(parseFloat(radiObj.value));
          const tmpThoryPower = thoryPowerObj && thoryPowerObj.value && !isNaN(parseFloat(thoryPowerObj.value));
          const tmpActualPower = actualPowerObj && actualPowerObj.value && !isNaN(parseFloat(actualPowerObj.value));


          if (tmpRadi) {
            radi = `<div style="padding-left: 5px;"><span style="display: inline-block; background:#f9b600; width:5px; height:5px; border-radius:100%;"></span> ${chartType==='wind'?'平均风速':intervalTime === 0 ? '累计曝幅值' : (intervalTime === 1 ? '月辐射总量' : '年辐射总量')} : ${parseFloat(radiObj.value).toFixed(2) || 0}</div>`
          }
          if (tmpActualPower) {
            actualPower = `<div style="padding-left: 5px;"><span style="display: inline-block; background:#a42b2c;  width:5px; height:5px; border-radius:100%;"></span> 实际发电量: ${parseFloat(actualPowerObj.value).toFixed(4) || 0}</div>`
          }
          if (tmpThoryPower) {
            thoryPower = `<div style="padding-left: 5px;"><span style="display: inline-block; background:#c7ceb2;  width:5px; height:5px; border-radius:100%;"></span> 理论发电量: ${parseFloat(thoryPowerObj.value).toFixed(4) || 0}</div>`
          }
          if (completeRate && intervalTime !== 0) {// 没有完成率的情况
            const hasRate = completeRate && completeRate.map(e=>e.completeRate)

            // const tmpRate = parseFloat(thoryPowerObj.value) === 0 ? '--' : (parseFloat(actualPowerObj.value) / parseFloat(thoryPowerObj.value) * 100).toFixed(2);
            let tmpRate = " "
            hasRate ? tmpRate = parseFloat((completeRate[param[2].dataIndex].completeRate) * 100).toFixed(2) : tmpRate = "--";
            rate = `<div style="padding-left: 15px;">完成率: ${tmpRate}%</div>`
          }
          if(chartType==='wind'){
            return `<div style="width: 150px; height: 100px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
            <div  style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;">${param[0] && param[0].name}</div>
            ${actualPower}${thoryPower}${radi}
          </div>`;
          }
          if (intervalTime !== 0) { //  年／月的情况
            return `<div style="width: 150px; height: 120px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
              <div  style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;">${param[0] && param[0].name}</div>
              ${radi}${actualPower}${thoryPower}${rate}
            </div>`;
          } else {  // 日的情况
            return `<div style="width: 150px; height: 100px;font-size:12px;line-height: 24px;background: #fff;box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:2px;">
              <div  style="border-bottom: 1px solid #dfdfdf;padding-left: 5px;">${param[0] && param[0].name}</div>
              ${radi}${actualPower}${thoryPower}${rate}
            </div>`;
          }
          

        },
        extraCssText: 'background: rgba(0,0,0,0);',
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
        },
        {
          name: chartType==='wind'?'平均风速(m/s)':`${intervalTime === 0 ? '累计曝幅值' : (intervalTime === 1 ? '月辐射总量' : '年辐射总量')}`,
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
          name: chartType==='wind'?'平均风速':`${intervalTime === 0 ? '累计曝幅值' : (intervalTime === 1 ? '月辐射总量' : '年辐射总量')}`,
          type: 'line',
          data: instantaneous,
          yAxisIndex: 1,
          lineStyle: {
            type: 'solid',
            color: "#f7c028",
          },
        }
      ]
    }
    powerDiagram.setOption(powerOption);
    powerDiagram.resize();
  }

  onChangeTimePower = (e) => {
    const { stationCode } = this.props.match.params;
    const intervalTime = e.target.value;
    this.setState({ intervalTime });
    this.props.getPowerDataTenMin(stationCode, intervalTime);// 时间格式传出，清空定时器并重新请求数据。
  }

  render() {
    const productionAnalysis = "/statistical/stationaccount/production";
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
