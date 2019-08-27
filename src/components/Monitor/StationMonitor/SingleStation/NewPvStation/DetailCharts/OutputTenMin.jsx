

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './detailCharts.scss';
import echarts from 'echarts';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { dataFormats, getDefaultData } from '../../../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData.js';
import { divideFormarts, chartPowerPoint } from '../../../PvCommon/PvDataformat';
import { Gradient1, Gradient2, chartsLoading, themeConfig, chartsNodata } from '../../../../../../utils/darkConfig';
class OutputTenMin extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    yXaisName: PropTypes.string,
    // stationCode: PropTypes.number,
    yAxisUnit: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.drawChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps);
  }


  drawChart = (param) => {
    const { capabilityData, yAxisUnit, stationCode, theme } = param;
    const yAxisType = `功率(${yAxisUnit})`;
    let capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'), themeConfig[theme]);
    if (capabilityDiagram) {
      capabilityDiagram.dispose();
      capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'), themeConfig[theme]);
    }
    const capabilityPower = capabilityData.map(e => dataFormats(divideFormarts(e.stationPower, yAxisUnit), '--', 2, true));
    const capabilityRadiation = capabilityData.map(e => dataFormats(e.instantaneous, '--', 2, true));
    const filterCapabilityPower = capabilityData.filter(e => e.stationPower);
    const filterCapabilityRadiation = capabilityData.filter(e => e.instantaneous);
    const capabilityGraphic = (filterCapabilityPower.length === 0 && filterCapabilityRadiation.length === 0);
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
            return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${item.color}"> </span> 
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
      color: ['#a42b2c', '#f9b600'],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: capabilityData && capabilityData.map(e => {
          return moment(moment.utc(e.utc).toDate()).format('MM-DD HH:mm');
        }),
        axisLabel: {
          formatter: (value) => {
            return moment(value).format('HH:MM');
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
          splitLine: {
            show: false,
          },
        },
        {
          name: '辐射(W/m²)',
          type: 'value',
          min: minRadiation < 0 ? minRadiation : 0,
          axisLabel: {
            formatter: '{value}',
          },
          splitLine: {
            show: false,
          },
        },
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
          axisTick: {
            show: false,
          },
        },
        {
          name: '辐射',
          type: 'line',
          data: capabilityRadiation,
          yAxisIndex: 1,
          axisTick: {
            show: false,
          },
          lineStyle: {
            type: 'dotted',
          },
        },
      ],
    };
    capabilityDiagram.setOption(capabilityOption, 'notMerge');
    capabilityDiagram.resize();
  }

  timeChange = (value) => { // 时间改变
    const startTime = startTime || moment(value).startOf('day').utc().format();
    const endTime = endTime || moment(value).endOf('day').utc().format();
    const stationType = '1';
    const { stationCode } = this.props;
    this.props.onChange({ stationCode, stationType, startTime, endTime });
  }


  render() {
    const { stationCode } = this.props;
    return (
      <div className={styles.powerDiagramBox} >
        <div id="capabilityDiagram" style={{ width: 440, height: 278 }} />
        <div className={styles.dataChange}>
          <span ref={'date'} />
          <DatePicker
            defaultValue={moment(moment(), 'YYYY/MM/DD')}
            format={'YYYY/MM/DD'}
            style={{ width: 128 }}
            onChange={this.timeChange}
            allowClear={false}
            disabledDate={(current) => { return current > moment().endOf('day'); }}
            getCalendarContainer={() => this.refs.date}
          />
        </div>
        {/* <a href={'javascript:void(0)'} className={styles.link}><i className="iconfont icon-more"></i></a> */}
      </div>
    );
  }
}

export default OutputTenMin;
