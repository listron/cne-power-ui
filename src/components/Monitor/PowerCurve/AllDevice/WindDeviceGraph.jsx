import React, { Component } from "react";
import PropTypes from "prop-types";
import echarts from 'echarts';
import { Switch } from 'antd';
import styles from './allDeviceCurve.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import moment from 'moment';

class WindDeviceGraph extends Component {
  static propTypes = {
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    allDeviceCurveData: PropTypes.array,
    checkedAll: PropTypes.bool,
    stationCode: PropTypes.number,
    changeAllDeviceStore: PropTypes.func,

  }
  constructor(props, context) {
    super(props, context)

  }
  componentDidMount() {
    const { stationCode, startTime, endTime,checkedAll } = this.props;
    const beginTime=moment(startTime).format('YYYY-MM-DD');
    const stopTime=moment(endTime).format('YYYY-MM-DD');

    this.drawChart((this.props.allDeviceCurveData || []), checkedAll, stationCode, beginTime, stopTime)
  }
  componentWillReceiveProps(nextProps) {
    const theoryPowers = nextProps.allDeviceCurveData || [];
    const { stationCode, startTime, endTime,checkedAll } = nextProps;
    const beginTime=moment(startTime).format('YYYY-MM-DD');
    const stopTime=moment(endTime).format('YYYY-MM-DD');
    this.drawChart(theoryPowers, checkedAll, stationCode, beginTime, stopTime)
  }

  onChange = (checked) => {
    const { stationCode, startTime, endTime } = this.props;
    const beginTime=moment(startTime).format('YYYY-MM-DD');
    const stopTime=moment(endTime).format('YYYY-MM-DD');
    this.props.changeAllDeviceStore({
      checkedAll: checked
    })
    this.drawChart((this.props.allDeviceCurveData || []), checked, stationCode,  beginTime, stopTime)
  }
  changeSelect = (checked) => {
    let select = {};
    this.props.allDeviceCurveData.forEach((e,i)=>{
      e.dataList.forEach((item,i)=>{
        select[e.deviceName]=checked;
      })
    })
    return select

  }
  compare = (key) => {
    return (a, b) => {
      let val1 = +a[key];
      let val2 = +b[key];
      if (val1 < val2) { //正序
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  drawChart = (params, checkedAll, stationCode, startTime, endTime) => {
    const powercurveChart = echarts.init(document.getElementById('powerCurveChart'));
    const filterDeviceName = params.map(e => e.deviceName);
    const filterPowerAvg = params.map((e, i) => {
      return e.dataList.map((item, i) => {
        return item.powerAvg
      })
    })
    const hasData = filterPowerAvg.length > 0 ? filterPowerAvg.reduce((pre, next) => {
      return pre.concat(next)
    }) : [];

    const inverterTenMinGraphic = (filterDeviceName.length === 0 && hasData.length === 0) ? showNoData : hiddenNoData;
    const lineColor = '#666';
    let color = ['#a42b2c', '#0e6650', '#de930c', '#004a79', '#6a3302', '#b00016', '#2d5600', '#006a6c'];

    params.forEach((e, i) => {
      e.dataList.sort(this.compare('windSpeedCenter'))

    })
    const option = {
      graphic: inverterTenMinGraphic,
      // color: color,
      legend: {
        show: true,
        left: '10%',
        // right:'30%',
        top: '60%',
        width: '80%',
        // bottom: '80%',
        itemWidth: 14,
        itemHeight: 6,
        x: 'center',
        y: 'bottom',
        padding: [100, 0],
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
        selected: this.changeSelect(checkedAll)
      },
      grid: {
        top: 90,
        right: '10%',
        height: '300px',
      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        show: true,
        formatter: (params) => {
          const info = params.data;
          const windSpeedInterval = info.windSpeedInterval.replace(',', '~')
          return `<div class=${styles.formatStyle}>
            <div class=${styles.topStyle}>
              <div>${params.seriesName}</div>
              <div>风速区间:${windSpeedInterval}</div>
            </div>
            <div  style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
            <div class=${styles.lineStyle}>型号:  ${info.deviceModeName}</div>
            <div class=${styles.lineStyle}>平均风速:  ${dataFormat(info.windSpeedAvg)}</div>
            <div class=${styles.lineStyle}>平均功率: ${dataFormat(info.powerAvg)}</div>
          </div>`
        },
        backgroundColor: '#fff',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: lineColor,
          }
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
      },
      xAxis: {
        type: 'value',
        // data: [5, 10, 15, 20, 25],
        name: '风速(m/s)',
        nameTextStyle: {
          color: lineColor,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#dfdfdf'],
            type: 'dashed',
          }
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: lineColor,
        },
        axisPointer: {
          label: {
            show: false,
          }
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '功率(KW)',
          nameTextStyle: {
            color: lineColor,
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#dfdfdf'],
              type: 'dashed',
            }
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: {
            show: false,
          },
        }
      ],

      series: params.map((e, i) => {
        let lineData = [];
        let sortData = e.dataList.sort(this.compare('windSpeedCenter'));

        sortData.forEach((item, i) => {
          lineData.push({
            value: [item.windSpeedCenter, item.powerAvg],
            ...item,
            ...e,
          })
        })
        return {
          name: `${e.deviceName}`,
          deviceMode: `${e.deviceFullCode}`,
          type: 'line',
          label: {
            normal: {
              show: false
            }
          },
          data: lineData,
        }
      })
    };
    powercurveChart.setOption(option, 'notMerge');
    powercurveChart.resize();
    powercurveChart.on('click', (params) => {
      // 
      // 
      return this.props.history.push(`/monitor/powercurve/${stationCode}/${params.data.deviceFullCode}/${startTime}~${endTime}`)
    })
  }
  render() {
    const {checkedAll}=this.props;
    return (
      <div className={styles.graphStyle}>
        <div id="powerCurveChart" className={styles.powerCurveChart}></div>
        <div className={styles.switchStyle}> <Switch checked={checkedAll} onChange={this.onChange} />全部显示</div>
      </div>
    )
  }
}
export default (WindDeviceGraph)