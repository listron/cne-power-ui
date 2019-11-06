
import React, { Component } from 'react';
import axios from 'axios';
import { message } from 'antd';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { divideFormarts, multiplyFormarts, powerPoint, provinceList, provinceListArray } from '../../PvCommon/PvDataformat';
import { dataFormats } from '../../../../../utils/utilFunc';


class PvMapChart extends Component {
  static propTypes = {
    stations: PropTypes.array,
    monitorPvUnit: PropTypes.object,
    stations: PropTypes.array,
  }

  constructor(props) {
    super();
    this.state = {
      mapType: 'China',
      mapTypeName: '',
    };
  }

  componentDidMount() {
    const { stations } = this.props;
    const provinceType = [...new Set(stations.map(e => e.provinceName))];
    if (provinceType.length === 1) {
      const province = provinceListArray.filter(e => provinceType[0].includes(e.name));
      this.setState({
        mapType: province.length > 0 && province[0].id || 'China',
      }, () => {
        this.drawCharts(this.props);
      });
    } else {
      this.drawCharts(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.drawCharts(nextProps);
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
          const currentStatus = `${item.stationStatus}`;
          if (currentStatus === '900') {
            return null;
          }
          const needData = [
            { name: '实时功率', value: 'stationPower', point: 2, unit: realTimePowerUnit, unitChange: true },
            { name: '瞬时辐射', value: 'instantaneous', point: 2, unit: 'W/m²' },
            { name: '负荷率', value: 'loadRate', point: 2, unit: '%' },
            { name: '日等效时', value: 'equivalentHours', point: 2, unit: 'h' },
            { name: '日发电量', value: 'dayPower', point: 2, unit: powerUnit, unitChange: true },
            { name: '异常支路数', value: 'anomalousBranchNum', point: 0, unit: '个' },
            { name: '低效逆变器', value: 'lowEfficiencyInverterNum', point: 0, unit: '台' },
            { name: '告警数量', value: 'alarmNum', point: 0, unit: '个' },
          ];
          let paramsItem = '';
          needData.forEach((e, index) => {
            let value = dataFormats(item[e['value']], '--', e.point, true);
            if (e.value === 'stationPower') {
              const stationPowerNum = divideFormarts(item.stationPower, realTimePowerUnit);
              value = dataFormats(stationPowerNum, '--', e.point, true);
            }
            if (e.value === 'dayPower') {
              value = powerPoint(divideFormarts(item.dayPower, powerUnit));
            }
            paramsItem += (
              `<div class=${styles.popColumn} key=${index}>
                <div>${e.name}</div>
                <div>
                  <span class=${styles.value}>${value}</span>
                  <span class=${styles.unit}>${e.unit}</span>
                </div>
              </div>`
            );
          });
          return `<div class=${styles.popover}>
            <div class=${styles.name}>${item.stationName} </div>
            <div class=${`${currentStatus}` === '400' && styles.poNomal || styles.poInterrupt}>
              ${`${currentStatus}` === '400' ? '通讯正常' : '通讯中断'}
            </div>
            <div class=${styles.popContainer}>
                ${paramsItem}
            </div>
         </div>`;
        },
      },
    };
    return option;
  }


  changOption = (stationDataList) => { // 改变的数据
    const normalData = stationDataList.filter(e => `${e.stationStatus}` === '400');
    const interrupt = stationDataList.filter(e => `${e.stationStatus}` === '500');
    const notConnected = stationDataList.filter(e => `${e.stationStatus}` === '900');
    const { mapType } = this.state;
    const mapNameType = mapType === 'China' && 'china' || mapType;
    const option = {
      geo: {
        map: mapNameType,
        layoutCenter: ['50%', '50%'],
        layoutSize: mapType === 'China' ? '100%' : '70%',
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          normal: {
            areaColor: '#d8eef6',
            borderColor: '#fff',
          },
          emphasis: {
            areaColor: '#b2e8fa',
          },
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
            symbol: dataItem.alarmNum > 0 ? 'image:///img/pv02.png' : 'image:///img/pv01.png',
          };
        }),
        symbol: 'image:///img/pv01.png',
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
            symbol: dataItem.alarmNum > 0 ? 'image:///img/wrong2.png' : 'image:///img/pvcutdown.png',
          };
        }),
        symbol: 'image:///img/pvcutdown.png',
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
            value: [dataItem.longitude, dataItem.latitude, 10],
          };
        }),
        symbol: 'image:///img/wrong.png',
        symbolSize: [24, 17],
      }],
    };
    return option;
  }


  drawCharts = (params) => {
    const { stationDataList = [], history = {} } = params;
    const { mapType, mapTypeName } = this.state;
    const initOption = this.initOption();
    const wrapStationDataList = stationDataList.filter(e => e.provinceName.includes(mapTypeName));
    const changOption = this.changOption(wrapStationDataList);
    const countryBox = document.getElementById('pvStationMap');
    if (mapType) {
      axios.get(`/mapJson/${mapType}.json`).then(response => {
        const mapNameType = mapType === 'China' && 'china' || mapType;
        echarts.registerMap(mapNameType, response.data);
        const option = {
          ...initOption,
          ...changOption,
        };
        const countryChart = echarts.init(countryBox);
        countryChart.clear();
        countryChart.setOption(option, 'notMerge');
        countryChart.on('click', (params) => {
          if (!params.seriesType) {
            setTimeout(this.setState({
              mapType: provinceList[params.name],
              mapTypeName: params.name,
            }), 0);
            this.drawCharts(this.props);
          } else {
            if (`${params.data.stationStatus}` !== '900') {
              return history.push(`/monitor/singleStation/${params.data.stationCode}`);
            }
            this.showTip();

          }
        });
      });
    }

  }

  showBack = () => {
    this.setState({ mapType: 'China', mapTypeName: '' }, () => {
      this.drawCharts(this.props);
    });
  }

  render() {
    const { mapType } = this.state;
    return (
      <div className={styles.pvStationMap}>
        {mapType !== 'China' && <div onClick={this.showBack} className={styles.backChina}> 返回</div>}
        <div id={'pvStationMap'} className={styles.mapChart} > </div>
      </div>
    );
  }
}


export default PvMapChart;
