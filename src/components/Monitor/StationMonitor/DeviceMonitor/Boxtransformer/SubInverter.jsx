import React from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './boxtransformer.scss';

const SubInverter = ({ subDeviceList = [], deviceDetail = {}, stationCode, theme = 'light' }) => {
  const baseLinkPath = '/hidden/monitorDevice';

  const inverterStatus = { // 逆变器各种设备状态
    light: {
      '401': { color: '#a42b2c', statusName: '限电', name: 'limit' }, // 限电
      '201': { color: '#199475', statusName: '正常停机', name: 'stop' }, // 正常停机
      '202': { color: '#199475', statusName: '计划停机', name: 'plan' }, // 计划停机
      '203': { color: '#a42b2c', statusName: '故障停机', name: 'fault' }, // 故障停机
      '400': { color: '#199475', statusName: '正常', name: 'normal' }, // 正常
      '500': { color: '#a42b2c', statusName: '无通讯', name: 'break' }, // 无通讯
      '900': { color: '#999', statusName: '未接入', name: 'unconnect' }, // 未接入
    },
    dark: {
      '401': { color: '#fd6e8f', statusName: '限电', name: 'limit' }, // 限电
      '201': { color: '#00baff', statusName: '正常停机', name: 'stop' }, // 正常停机
      '202': { color: '#00baff', statusName: '计划停机', name: 'plan' }, // 计划停机
      '203': { color: '#fd6e8f', statusName: '故障停机', name: 'fault' }, // 故障停机
      '400': { color: '#00baff', statusName: '正常', name: 'normal' }, // 正常
      '500': { color: '#fd6e8f', statusName: '无通讯', name: 'break' }, // 无通讯
      '900': { color: '#bbcef7', statusName: '未接入', name: 'unconnect' }, // 未接入
    },
  };

  const seriesStatus = { // 支路设备状态
    light: {
      '801': '#f9b600', // 偏低
      '802': '#3e97d1', // 偏高
      '803': '#a42b2c', // 异常
      '400': '#ceebe0', // 正常
      '500': '#f1f1f1', // 无通讯
      '900': '#f1f1f1', // 未接入
    },
    dark: {
      '801': '#f8b14e', // 偏低
      '802': '#4d5fe2', // 偏高
      '803': '#fd6e8f', // 异常
      '400': '#00baff', // 正常
      '500': '#405080', // 无通讯
      '900': '#405080', // 未接入
    },
  };

  const confluenceStatus = { // 汇流箱设备状态
    light: {
      '400': '#ceebe0', // 正常
      '500': '#dfdfdf', // 无通讯
      '900': '#f1f1f1', // 未接入
      '801': '#f9b600', // 离散率>=10%数
      '802': '#a42b2c', // 离散率>=20%数
    },
    dark: {
      '400': '#00baff', // 正常
      '500': '#f8b14e', // 无通讯
      '900': '#181a4e', // 未接入
      '801': '#5522e4', // 离散率>=10%数
      '802': '#5f2370', // 离散率>=20%数
    },
  };

  const getStatusBox = (alarmNum, isLowEfficiency) => {
    let backgroundColor = 'transparent', color = '#666';
    alarmNum && isLowEfficiency && (backgroundColor = '#fefad2') && (color = '#e08031');
    alarmNum && !isLowEfficiency && (backgroundColor = '#ff8e9c') && (color = '#a42b2c');
    return { backgroundColor, color };
  };
  return (
    <div className={`${styles.subInverter} ${styles[theme]}`}>
      {/* <h3>下级设备</h3> */}
      {subDeviceList.map((item, i) => {
        const { branchState = [], deviceStatus, deviceCapacity, devicePower, deviceCode = '' } = item;
        const deviceTypeCode = deviceCode.split('M')[1];
        const progressPercent = devicePower / deviceCapacity * 100 || 0;
        const unconnect = `${deviceStatus}` === '900';
        // const statusBoxStyle = getStatusBox(item.alarmNum, item.isLowEfficiency);
        const inverterStatusInfo = inverterStatus[theme][deviceStatus] || {};
        const statusBoxStyle = item.isLowEfficiency > 0 ? 'lowEfficiency' : item.alarmNum > 0 && 'alarm';
        return (
          <div key={i} className={`${styles.singledeviceItem} ${unconnect && styles.unconnect}  ${styles[statusBoxStyle]}`}>
            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${deviceCode}`}>
              <div className={`${styles.statusBox}`} style={{ backgroundColor: statusBoxStyle.backgroundColor }}>
                <div className={styles.deviceItemIcon}>
                  <i className={`iconfont icon-nb ${styles.icon}`} />
                  {item.alarmNum > 0 && <i className="iconfont icon-alarm" />}
                </div>
                <div className={styles.deviceItemR}>
                  <div className={styles.deviceBlockName}>
                    <span style={{ color: statusBoxStyle.color }} className={styles.deviceName}>{item.deviceName}</span>
                    <span>{dataFormats(item.transferRate, '--', 2)}%</span>
                  </div>
                  <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                  <div className={styles.deviceItemPower}>
                    <div className={styles.realDevicePower}>{dataFormats(devicePower, '--', 2)} kW</div>
                    <div>{dataFormats(deviceCapacity, '--', 2)} kW</div>
                  </div>
                </div>
              </div>
              <div className={styles.deviceBlockFooter} >
                <div className={styles.eachInfo}>
                  <div>日发电量</div>
                  <div className={styles.value}>{dataFormats(item.dayPower, '--', 2)} kWh</div>
                </div>
                <div className={styles.eachInfo}>
                  <div>日利用小时</div>
                  <div className={styles.value}>{dataFormats(item.equipmentHours, '--', 2)} h</div>
                </div>
              </div>
              <div className={styles.allStatus}>
                <div className={styles.branchStatus}>{branchState && branchState.map((e, i) => (
                  <span
                    key={i}
                    className={deviceTypeCode === '201' ? styles.rect : styles.round}
                    style={{ backgroundColor: deviceTypeCode === '206' ? seriesStatus[theme][e] : confluenceStatus[theme][e] }}
                  />
                ))}</div>
                <div style={{ color: inverterStatusInfo.color }}>{inverterStatusInfo.statusName}</div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default SubInverter;
