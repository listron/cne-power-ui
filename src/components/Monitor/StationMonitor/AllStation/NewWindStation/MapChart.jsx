
import React from 'react';
import axios from 'axios';
import { message } from 'antd';
import echarts from 'echarts';
import styles from './windStation.scss';
import { dataFormats, numWithComma } from '../../../../../utils/utilFunc';


const MapChart = ({ ...data }) => {
  const { stationDataList = [], history = {} } = data;
  const normalData = stationDataList.filter(e => e.stationStatus.stationStatus === '400');
  const interrupt = stationDataList.filter(e => e.stationStatus.stationStatus === '500');
  const notConnected = stationDataList.filter(e => e.stationStatus.stationStatus === '900');
  const showTip = (e) => {
    message.destroy();
    message.config({ top: 225, maxCount: 1 });
    message.warning('电站未接入,无法查看详情', 2);
  };

  axios.get('/mapJson/China.json').then(response => {
    const countryBox = document.getElementById('allStationMap');
    if (countryBox) {
      const countryChart = echarts.init(countryBox);
      echarts.registerMap('china', response.data);
      const option = {
        legend: {
          show: true,
          left: 'left',
          top: 20,
          itemWidth: 21,
          itemHeight: 28,
          selectedMode: false,
        },
        geo: {
          map: 'china',
          layoutCenter: ['50%', '50%'],
          layoutSize: '100%',
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
              return null;
            }
            const needData = [
              { name: '实时功率', value: 'stationPower', point: 2, unit: 'MW', quantity: 1000 },
              { name: '平均风速', value: 'instantaneous', point: 2, unit: 'm/s' },
              { name: '出力比', value: 'capabilityRate', point: 2, unit: '%' },
              { name: '装机容量', value: 'stationCapacity', point: 2, unit: 'MW' },
              { name: '应发功率', value: 'stationPlanPower', point: 2, unit: 'MW', quantity: 1000 },
              { name: '装机台数', value: 'stationUnitCount', point: 0, unit: '台' },
              { name: '正常运行台数', value: 'normalNum', point: 0, unit: '台' },
              { name: '待机台数', value: 'standbyNum', point: 0, unit: '台' },
              { name: '停机台数', value: 'shutdownNum', point: 0, unit: '台' },
              { name: '维护台数', value: 'maintainNum', point: 0, unit: '台' },
              { name: '故障台数', value: 'errorNum', point: 0, unit: '台' },
              { name: '通讯中断台数', value: 'interruptNum', point: 0, unit: '台' },
              { name: '未接入台数', value: 'noAccessNum', point: 0, unit: '台' },
              { name: '告警数量', value: 'alarmNum', point: 0, unit: '个' },
            ];
            let paramsItem = '';
            needData.forEach((e, index) => {
              const value = e.quantity ? dataFormats(item[e.value], '--') / e.quantity : item[e.value];
              paramsItem += (
                `<div class=${styles.popColumn} key=${index}>
                  <div>${e.name}</div>
                  <div>
                    <span class=${styles.value}>${dataFormats(value, '--', e.point, true)}</span>
                    <span class=${styles.unit}>${e.unit}</span>
                  </div>
                </div>`
              );
            });
            return `<div class=${styles.popover}>
              <div class=${styles.name}>${item.stationName} </div>
              <div class=${currentStatus === '400' && styles.poNomal || styles.poInterrupt}>
                ${currentStatus === '400' ? '通讯正常' : '通讯中断'}
              </div>
              <div class=${styles.popContainer}>
                  ${paramsItem}
              </div>
           </div>`;
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
              symbol: dataItem.alarmNum > 0 ? 'image:///img/wind02.png' : 'image:///img/wind01.png',
            };
          }),
          symbol: 'image:///img/wind01.png',
          symbolSize: [21, 28],
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
              symbol: dataItem.alarmNum > 0 ? 'image:///img/windcutdown2.png' : 'image:///img/cutdown.png',
            };
          }),
          symbol: 'image:///img/cutdown.png',
          rotation: () => { let rotation = 0; (rotation += Math.PI / 360) % (Math.PI * 2); },
          symbolSize: [21, 28],
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
          symbol: 'image:///img/wind04.png',
          symbolSize: [21, 28],
        }],

      };
      countryChart.resize();
      countryChart.setOption(option, 'notMerge');
      countryChart.on('click', (params) => {
        if (!params.seriesType) { return false; }
        if (params.data.stationStatus.stationStatus !== '900') {
          return history.push(`/monitor/singleStation/${params.data.stationCode}`);
        }
        showTip();

      });
    }
  });




  return (<div id={'allStationMap'} className={styles.mapChart} > </div>);
};

export { MapChart };
