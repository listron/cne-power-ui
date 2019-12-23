
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './singleStationCommon.scss';
import echarts from 'echarts';
import { Radio } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
import { dataFormat } from '../../../../../utils/utilFunc'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class PowerDiagramTenMin extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    powerData: PropTypes.array,
    match: PropTypes.object,
    getPowerDataTenMin: PropTypes.func,
    stationCode: PropTypes.string,
    stationType: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      intervalTime: 0, // 默认电站发电量时间段， 0日，1月, 2年
    }
  }


  componentWillReceiveProps(nextProps) {
    const { powerData, chartType, yAxisUnit, yAxisValuePoint } = nextProps;
    const { intervalTime } = this.state;
    const yAxisType = `电量(${yAxisUnit})`
    const powerDiagram = echarts.init(document.getElementById('powerDiagram'));

    const lineColor = '#353535';
    const actualPower = powerData.map(e => (yAxisUnit === '万kWh' ? (+e.actualPower) : (+e.actualPower * 10000)).toFixed(yAxisValuePoint));  // 实际发电量
    const filterActualPower = powerData.filter(e => e.actualPower);
    const theoryPower = powerData.map(e => e.theoryPower); // 计划发电量
    const filterTheoryPower = powerData.filter(e => e.theoryPower);
    const instantaneous = powerData.map(e => e.instantaneous); // 风速／累计曝幅值
    const filterInstantaneous = powerData.filter(e => e.instantaneous);
    const completeRate = powerData.map(e => dataFormat(e.completeRate, '--', 2));  // 完成率
    const filterCompleteRate = powerData.filter(e => e.completeRate);
    const powerGraphic = (
      filterActualPower.length === 0
      && filterTheoryPower.length === 0
      && filterInstantaneous.length === 0
      && filterCompleteRate.length === 0
    ) ? showNoData : hiddenNoData;
    let color = this.getColor(chartType, intervalTime);
    const powerOption = {//实际发电量 计划发电量
      graphic: powerGraphic,
      color: color,
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

        textStyle: {
          color: lineColor,
        },
        // icon: 'circle',
        itemWidth: 10,
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
            return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName} :
            ${this.dealValue(item.seriesName, item.value, this.getDefaultPoint(item.seriesName))}</div>`
          });
          return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:150px;overflow:hidden;"> <span style="float: left">${params[0].name} </span>
            </div>${paramsItem}`
        },

      },
      axisPointer: {
        type: 'line',
        snap: true,
        lineStyle: {
          width: 38,
          color: 'rgba(150,150,150,0.3)'
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
              color: '#d4d4d4',
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
          name: yAxisType,
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
          name: chartType === 'wind' ? '平均风速(m/s)' : `${intervalTime === 0 ? '累计辐射(MJ/m²)' : (intervalTime === 1 ? '累计辐射(MJ/m²)' : '累计辐射(MJ/m²)')}`,
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
              color: '#d4d4d4',
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
          name: '计划发电量',
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
          name: chartType === 'wind' ? '平均风速' : `${intervalTime === 0 ? '累计辐射' : (intervalTime === 1 ? '累计辐射' : '累计辐射')}`,
          type: 'line',
          data: instantaneous,
          // color:'#f9b600',
          yAxisIndex: 1,
          lineStyle: {
            type: 'solid',
          },
        }, {
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
      powerOption.series = powerOption.series.filter(e => e.name !== '计划发电量' && e.name !== '完成率');
      powerOption.series.color = ['#a42b2c', '#f9b600'];
    }
    powerDiagram.setOption(powerOption, 'notMerge');
    powerDiagram.resize();
  }

  onChangeTimePower = (e) => { // 改变 日／月／年
    const { stationCode, stationType } = this.props;
    const intervalTime = e.target.value;
    this.setState({ intervalTime });
    this.props.getPowerDataTenMin({ stationCode, stationType, intervalTime });// 时间格式传出，清空定时器并重新请求数据。
  }



  getColor = (type, intervalTime) => {  // 颜色的设置
    let color = [];
    if (type === 'wind') {
      if (intervalTime === 0) { return color = ['#a42b2c', '#3e97d1']; }
      return color = ['#a42b2c', '#c7ceb2', '#3e97d1', '#199475'];
    } else {
      if (intervalTime === 0) { return color = ['#a42b2c', '#f9b600',]; }
      return color = ['#a42b2c', '#c7ceb2', '#f9b600', '#199475'];
    }
  }

  getDefault = (intervalTime) => {
    let result = [];
    switch (intervalTime) {
      case 0: result = '累计辐射'; break;
      case 1: result = '累计辐射'; break;
    }
    return result;
  }


  getDefaultPoint = (name) => {
    let result = [];
    switch (name) {
      case '累计发电量': result = 4; break;
      case '计划发电量': result = 4; break;
      default: result = 2; break
    }
    return result;
  }

  dealValue = (seriesName, value, point) => { // 完成率的修改
    if (seriesName === '完成率') {
      return ((value || +value === 0) && value) + '%' || '--' + '%'
    } else {
      return (value || +value === 0 && parseFloat(value).toFixed(point)) || '--'
    }
  }


  render() {
    const { stationCode } = this.props;
    const productionAnalysis = `/statistical/stationaccount/production#${stationCode}`;
    return (
      <div className={styles.powerDiagramBox} >
        <div id="powerDiagram" style={{ width: "100%", height: "100%", color: '#353535', paddingTop: "20px" }}></div>
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
