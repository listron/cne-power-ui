
import React, { Component } from 'react';
import axios from 'axios';
import { message } from 'antd';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { divideFormarts, multiplyFormarts, powerPoint, provinceList } from '../../PvCommon/PvDataformat';
import { dataFormats, numWithComma } from '../../../../../utils/utilFunc';


class PvMapChart extends Component {

  constructor(props) {
    super();
    this.state = {
      mapType: 'china',
      mapTypeName: "",
    }
  }

  componentDidMount() {
    this.drawCharts(this.props)
  }

  componentDidUpdate(nextProps) {
    this.drawCharts(nextProps)
  }

  showTip = (e) => {
    message.destroy();
    message.config({ top: 225, maxCount: 1 });
    message.warning('电站未接入,无法查看详情', 2);
  }

  initOption = () => { // 默认的数据
    const { monitorPvUnit } = this.props;
    const { powerUnit, realTimePowerUnit } = monitorPvUnit;
    const option = {
      legend: {
        show: true,
        left: 'left',
        top: 20,
        itemWidth: 24,
        itemHeight: 17,
        selectedMode: false,
      },
      tooltip: {
        trigger: 'item',
        enterable: true,
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        confine: true,
        formatter: (params) => {
          const item = params.data;
          const stationStatus = item.stationStatus || {};
          const currentStatus = stationStatus.stationStatus;
          if (currentStatus === '900') {
            return null
          }
          let needData = [
            { name: '实时功率', value: 'stationPower', point: 2, unit: realTimePowerUnit, unitChange: true },
            { name: '瞬时辐射', value: 'instantaneous', point: 2, unit: 'W/m²' },
            { name: '负荷率', value: 'loadRate', point: 2, unit: '%' },
            { name: '日等效时', value: 'equivalentHours', point: 2, unit: 'h' },
            { name: '日发电量', value: 'stationPlanPower', point: 2, unit: powerUnit, unitChange: true },
            { name: '异常支路数', value: 'dayPower', point: 0, unit: '个' },
            { name: '低效逆变器', value: 'lowEfficiencyInverterNum', point: 0, unit: '台' },
            { name: '告警数量', value: 'alarmNum', point: 0, unit: '个' },
          ]
          let paramsItem = '';
          needData.forEach((e, index) => {
            let value = dataFormats(item[e['value']], '--', e.point, true)
            if (e.value === 'stationPower') {
              const stationPowerNum = realTimePowerUnit === 'kW' ? item.stationPower : multiplyFormarts(item.stationPower, 1000);
              value = dataFormats(stationPowerNum, '--', e.point, true)
            }
            if (e.value === 'stationPlanPower') {
              value = powerPoint(divideFormarts(item.dayPower, powerUnit))
            }
            return paramsItem += (
              `<div class=${styles.popColumn} key=${index}>
                <div>${e.name}</div>
                <div>
                  <span class=${styles.value}>${value}</span>
                  <span class=${styles.unit}>${e.unit}</span>
                </div>
              </div>`
            )
          })
          return `<div class=${styles.popover}>
            <div class=${styles.name}>${item.stationName} </div>
            <div class=${currentStatus === '400' && styles.poNomal || styles.poInterrupt}>
              ${currentStatus === '400' ? '通讯正常' : '通讯中断'}
            </div>
            <div class=${styles.popContainer}>
                ${paramsItem}
            </div>
         </div>`
        }
      },
    }
    return option
  }


  changOption = (stationDataList) => { // 改变的数据
    const normalData = stationDataList.filter(e => e.stationStatus.stationStatus === '400');
    const interrupt = stationDataList.filter(e => e.stationStatus.stationStatus === '500');
    const notConnected = stationDataList.filter(e => e.stationStatus.stationStatus === '900');
    const { mapType } = this.state;
    const option = {
      geo: {
        map: mapType,
        layoutCenter: ['50%', '50%'],
        layoutSize: mapType==='china'?'100%':'50%',
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#d8eef6',
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            areaColor: '#b2e8fa',
          }
        },
      },
      series: [{
        name: '通讯正常',
        type: 'scatter',
        coordinateSystem: 'geo',
        z: 2,
        data: normalData.map((dataItem, index) => {
          return {
            ...dataItem,
            key: index,
            name: dataItem.stationName,
            value: [dataItem.longitude, dataItem.latitude, 10],
            symbol: dataItem.alarmNum > 0 ? `image:///img/pv02.png` : `image:///img/pv01.png`
          }
        }),
        symbol: `image:///img/pv01.png`,
        symbolSize: [24, 17],
      },
      {
        name: '通讯中断',
        type: 'scatter',
        coordinateSystem: 'geo',
        z: 3,
        data: interrupt.map((dataItem, index) => {
          return {
            ...dataItem,
            key: index,
            name: dataItem.stationName,
            value: [dataItem.longitude, dataItem.latitude, 10],
            symbol: dataItem.alarmNum > 0 ? `image:///img/wrong2.png` : `image:///img/pv03.png`,
          }
        }),
        symbol: `image:///img/pv03.png`,
        rotation: () => { let rotation = 0; (rotation += Math.PI / 360) % (Math.PI * 2) },
        symbolSize: [24, 17],
      },
      {
        name: '未接入',
        type: 'scatter',
        coordinateSystem: 'geo',
        z: 1,
        data: notConnected.map((dataItem, index) => {
          return {
            ...dataItem,
            key: index,
            name: dataItem.stationName,
            value: [dataItem.longitude, dataItem.latitude, 10]
          }
        }),
        symbol: `image:///img/wrong.png`,
        symbolSize: [24, 17],
      }],
    }
    return option
  }


  drawCharts = (params) => {
    const { stationDataList = [], history = {}, monitorPvUnit } = params;
    const { mapType, mapTypeName } = this.state;
    console.log('mapType', mapType, mapTypeName)
    const initOption = this.initOption();
    console.log('stationDataList', stationDataList)
    const wrapStationDataList = stationDataList.filter(e => e.provinceName.includes(mapTypeName))
    console.log('wrapStationDataList', wrapStationDataList)
    const changOption = this.changOption(wrapStationDataList);
    const countryBox = document.getElementById('pvStationMap');
    axios.get(`/mapJson/${mapType}.json`).then(response => {
      echarts.registerMap(mapType, response.data);
      const option = {
        ...initOption,
        ...changOption,
      };
      const countryChart = echarts.init(countryBox);
      countryChart.resize();
      countryChart.setOption(option, 'notMerge');
      countryChart.on('click', (params) => {
        if (!params.seriesType) {
          if (mapType === 'china') {
            this.setState({ mapType: provinceList[params.name], mapTypeName: params.name })
            this.drawCharts(params)
          } else {
            return false
          }
        } else {
          if (params.data.stationStatus.stationStatus !== '900') {
            return history.push(`/monitor/singleStation/${params.data.stationCode}`)
          } else {
            this.showTip();
          }
        }
      })
    })
  }

  showBack=()=>{
    this.setState({mapType:'china',mapTypeName:''})
    this.drawCharts(this.props)
  }

  render() {
    const {mapType}=this.state;
    return (
      <div className={styles.pvStationMap}>
        {mapType !=='china' && <div onClick={this.showBack}> 返回</div>}
        <div id={'pvStationMap'} className={styles.mapChart} > </div>
      </div>
    );
  }
}


export default PvMapChart