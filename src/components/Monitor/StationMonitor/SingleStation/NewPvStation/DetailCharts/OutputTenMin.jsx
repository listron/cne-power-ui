

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './detailCharts.scss';
import echarts from 'echarts';
import { DatePicker } from 'antd';
import moment from 'moment';
import { dataFormats, getDefaultData } from '../../../../../../utils/utilFunc';
import { divideFormarts, chartPowerPoint } from '../../../PvCommon/PvDataformat';
import { themeConfig, chartsNodata, chartsLoading } from '../../../../../../utils/darkConfig';
class OutputTenMin extends Component {
  static propTypes = {
    stationCode: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      time: moment(),
    };
  }

  componentDidMount() {
    this.drawChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }

  drawChart = (param) => {
    const { capabilityData = {}, yAxisUnit, capabilityLoading, theme } = param;
    const { chartDatas = [], showTemplate } = capabilityData; // showTemplate  样板逆变器功率 0 不显示 1 显示
    const yAxisType = `功率(${yAxisUnit})`;
    let capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'), themeConfig[theme]);
    if (capabilityDiagram) {
      capabilityDiagram.dispose();
      capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'), themeConfig[theme]);
    }
    chartsLoading(capabilityDiagram, capabilityLoading, theme);
    const capabilityPower = chartDatas.map(e => dataFormats(divideFormarts(e.stationPower, yAxisUnit), '--', 2));
    const capabilityRadiation = chartDatas.map(e => dataFormats(e.instantaneous, '--', 2));
    const templatePower = chartDatas.map(e => dataFormats(divideFormarts(e.templatePower, yAxisUnit), '--', 2)); // 样板逆变器功率 无样板机逆变器时没有
    const theoreticalPower = chartDatas.map(e => dataFormats(divideFormarts(e.theoreticalPower, yAxisUnit), '--', 2)); // 理论功率 无气象站时没有
    const templatePowerSeries = showTemplate && chartDatas.length > 0 && chartDatas[0].templatePower !== undefined && {
      name: '样板机功率',
      type: 'line',
      smooth: true,
      data: templatePower,
      yAxisIndex: 0,
      z: 4,
      axisTick: {
        show: false,
      },
      color: '#3e97d1',
      lineStyle: {
        color: '#3e97d1',
      },
    } || { type: 'line' };
    const theoreticalPowerSeries = chartDatas.length > 0 && chartDatas[0].theoreticalPower !== undefined && {
      name: '理论功率',
      type: 'line',
      smooth: true,
      data: theoreticalPower,
      yAxisIndex: 0,
      z: 5,
      axisTick: {
        show: false,
      },
      color: '#199475',
      lineStyle: {
        color: '#199475',
      },
    } || { type: 'line' };
    const filterCapabilityPower = chartDatas.filter(e => e.stationPower);
    const filterCapabilityRadiation = chartDatas.filter(e => e.instantaneous);
    const filterTemplatePower = chartDatas.filter(e => e.templatePower);
    const filterTheoreticalPower = chartDatas.filter(e => e.hasTheoreticalPower);
    const capabilityGraphic = (filterCapabilityPower.length === 0 && filterCapabilityRadiation.length === 0 && filterTemplatePower.length === 0 && filterTheoreticalPower.length === 0);
    const graphic = chartsNodata(!capabilityGraphic, theme);
    const minPower = Math.min(...capabilityPower);
    const minRadiation = Math.min(...capabilityRadiation);
    const capabilityOption = {//出力图
      graphic: graphic,
      legend: {
        left: 'center',
        top: 42,
        itemWidth: 10,
        itemHeight: 5,
      },
      title: {
        text: '出力图',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
        },
        top: 8,
        left: 10,
      },
      grid: {
        right: '13%',
        top: 100,
        left: '13%',
        bottom: 40,
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let paramsItem = '';
          params.forEach(item => {
            paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${item.color}"> </span> 
                ${item.seriesName} :  ${item.value}${item.seriesName === '完成率' && '%' || ''}</div>`;
          });
          return (
            `<div class=${styles.tooltipBox}>
                    <div class=${styles.axisValue}>${params[0].name}</div>
                    <div class=${styles.tooltipContainer}> ${paramsItem}</div>
                </div>`
          );
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartDatas && chartDatas.map(e => {
          return moment(e.utc).format('MM-DD HH:mm');
        }),
        axisLabel: {
          interval: 23, // 4*6-1
          formatter: (value) => {
            return moment(value).format('HH:mm');
          },
        },
        axisTick: {
          show: false,
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
      },
      yAxis: [
        {
          name: yAxisType,
          type: 'value',
          min: minPower < 0 ? minPower : 0,
          axisLabel: {
            formatter: '{value}',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
          },
        },
        {
          name: '辐射(W/m²)',
          type: 'value',
          min: minRadiation < 0 ? minRadiation : 0,
          axisLabel: {
            formatter: '{value}',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '交流功率',
          type: 'line',
          smooth: true,
          data: capabilityPower,
          yAxisIndex: 0,
          color: '#a42b2c',
          z: 3,
          axisTick: {
            show: false,
          },
          lineStyle: {
            color: '#a42b2c',
          },
        },
        theoreticalPowerSeries,
        templatePowerSeries,
        {
          name: '辐射',
          type: 'line',
          data: capabilityRadiation,
          yAxisIndex: 1,
          color: '#f9b600',
          lineStyle: {
            color: '#f9b600',
            // type: 'dotted',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(249, 182, 0, 0.5)', // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(249, 182, 0, 0.2)', // 100% 处的颜色
              }],
              global: false, // 缺省为 false
            },
          },
          axisTick: {
            show: false,
          },
        },
      ],
    };
    capabilityDiagram.setOption(capabilityOption, 'notMerge');
    capabilityDiagram.resize();
  }

  timeChange = (value) => { // 时间改变
    this.timeChange(value);
  }

  prevDay = () => { //向前一天
    const time = moment(this.state.time).subtract(1, 'day');
    this.timeChange(time);
  }

  nextDay = () => { //向后一天
    const time = moment(this.state.time).add(1, 'day');
    this.timeChange(time);
  }

  timeChange = (value) => {
    this.setState({ time: value });
    const startTime = startTime || moment(value).startOf('day').utc().format();
    const endTime = endTime || moment(value).endOf('day').utc().format();
    const stationType = '1';
    const { stationCode } = this.props;
    this.props.onChange({ stationCode, stationType, startTime, endTime });
  }


  render() {
    const { stationCode } = this.props;
    const { time } = this.state;
    const today = moment().format('YYYY-MM-DD');
    const isChoice = moment(today).isSame(moment(time).format('YYYY-MM-DD'));
    return (
      <div className={styles.powerDiagramBox} >
        <div id="capabilityDiagram" style={{ width: 440, height: 278 }} />
        <span ref={'date'} />
        <div className={styles.dataChange}>
          <i className={`iconfont icon-arrowleft ${styles.arrow}`} onClick={this.prevDay} />
          <DatePicker
            // defaultValue={moment(moment(), 'YYYY/MM/DD')}
            value={moment(time, 'YYYY/MM/DD')}
            format={'YYYY/MM/DD'}
            style={{ width: 128 }}
            onChange={this.timeChange}
            allowClear={false}
            disabledDate={(current) => { return current > moment().endOf('day'); }}
            getCalendarContainer={() => this.refs.date}
          />
          <i className={`iconfont icon-arrowr ${styles.arrow}  ${isChoice && styles.disabled}`} onClick={this.nextDay} />
        </div>
      </div>
    );
  }
}

export default OutputTenMin;
