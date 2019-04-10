
import React from 'react';
import axios from 'axios';
import { message } from 'antd';
import echarts from 'echarts';
import styles from './windStation.scss';
import { dataFormats, numWithComma } from '../../../../../utils/utilFunc';


const MapChart = ({ ...data }) => {
  const { stationDataList = [] } = data;
  const normalData = stationDataList.filter(e => e.stationStatus.stationStatus === '400');
  const interrupt = stationDataList.filter(e => e.stationStatus.stationStatus === '500');
  const notConnected = stationDataList.filter(e => e.stationStatus.stationStatus === '900');
  const showTip = (e) => {
    message.destroy();
    message.config({ top: 225, maxCount: 1 });
    message.warning('电站未接入,无法查看详情', 2);
  }

  axios.get(`/mapJson/China.json`).then(response => {
    const countryBox = document.getElementById('allStationMap');
    if (countryBox) {
      const countryChart = echarts.init(countryBox);
      echarts.registerMap('china', response.data);
      const option = {
        tooltip: {
          trigger: 'item',
          enterable: true,
        },
        legend: {
          show: true,
          left: 'left',
          top: 20,
          itemWidth: 21,
          itemHeight: 28,
        },
        geo: {
          map: 'china',
          layoutCenter: ['50%', '47%'],
          layoutSize: '120%',
          itemStyle: {
            normal: {
              areaColor: '#d8eef6',
              borderColor: '#fff',
              // opacity: 0.5
            },
            emphasis: {
              areaColor: '#b2e8fa',
              label: { show: false }
            }
          },
        },
        tooltip: {
          enterable: true,
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
          confine:true,
          formatter: (params, ticket, callback) => {
            const item = params.data;
            const stationStatus = item.stationStatus || {};
            const currentStatus = stationStatus.stationStatus;
            let needData = [
              { name: '实时功率', value: 'stationPower', point: 2, unit: 'MW' },
              { name: '平均风速', value: 'instantaneous', point: 1, unit: 'm/s' },
              { name: '出力比', value: 'capabilityRate', point: 2, unit: '%' },
              { name: '装机容量', value: 'stationCapacity', point: 2, unit: 'MW' },
              { name: '应发功率', value: 'useCapacity', point: 2, unit: '%' },
              { name: '装机台数', value: 'stationUnitCount', point: 0, unit: '台' },
              { name: '正常运行台数', value: 'normalNum', point: 0, unit: '台' },
              { name: '待机台数', value: 'standbyNum', point: 0, unit: '台' },
              { name: '停机台数', value: 'stationPower', point: 0, unit: '台' },
              { name: '维护台数', value: 'maintainNum', point: 0, unit: '台' },
              { name: '故障台数', value: 'errorNum', point: 0, unit: '台' },
              { name: '通讯中断台数', value: 'interruptNum', point: 0, unit: '台' },
              { name: '未接入台数', value: 'noAccessNum', point: 0, unit: '台' },
              { name: '告警数量', value: 'alarmNum', point: 0, unit: '个' },
            ]
            let paramsItem = '';
            needData.forEach((e, index) => {
              return paramsItem += (
                `<div class=${styles.popColumn} key=${index}>
                  <div>${e.name}</div>
                  <div>
                    <span class=${styles.value}>${dataFormats(item[e.stationPower], '--', e.point, true)}</span>
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
        series: [{
          name: '通讯正常',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: normalData.map((dataItem, index) => {
            return {
              ...dataItem,
              key: index,
              name: dataItem.stationName,
              value: [dataItem.longitude, dataItem.latitude, 10]
            }
          }),
          symbol: `image:///img/wind01.png`,
          symbolSize: [21, 28],
        },
        {
          name: '通讯中断',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: interrupt.map((dataItem, index) => {
            return {
              ...dataItem,
              key: index,
              name: dataItem.stationName,
              value: [dataItem.longitude, dataItem.latitude, 10]
            }
          }),
          symbol: `image:///img/cutdown.png`,
          rotation: () => { let rotation = 0; (rotation += Math.PI / 360) % (Math.PI * 2) },
          symbolSize: [21, 28],
        },
        {
          name: '未接入',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: notConnected.map((dataItem, index) => {
            return {
              ...dataItem,
              key: index,
              name: dataItem.stationName,
              value: [dataItem.longitude, dataItem.latitude, 10]
            }
          }),
          symbol: `image:///img/wind04.png`,
          symbolSize: [21, 28],
        }],

      }
      countryChart.setOption(option);
      // countryBox.on('click', (params) => {
      //   if (params.data.stationStatus !== '900') {
      //     return this.props.history.push(`/monitor/singleStation/${params.data.stationCode}`)
      //   } else {
      //     showTip();
      //   }
      // })
    }
  })




  return (<div id={'allStationMap'} className={styles.mapChart} > </div>);
}

export { MapChart }