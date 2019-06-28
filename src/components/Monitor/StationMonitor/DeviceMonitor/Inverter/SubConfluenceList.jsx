import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './inverter.scss';

const SubConfluenceList = ({ subDeviceList = [], stationCode }) => {
  const baseLinkPath = "/hidden/monitorDevice";
  const statusArr = { // 汇流箱状态
    100: { name: 'normal', text: '正常', color: '#199475' },
    200: { name: 'moreThanTen', text: '离散率>10%', color: '#f9b600' },
    300: { name: 'moreThanTwenty', text: '离散率>20%', color: '#e08031' },
    500: { name: 'noContact', text: '无通讯', color: '#666' },
    900: { name: 'noAccess', text: '未接入', color: '#999' },
  }

  const branchStatus = { // 支路电流状态
    '500': { color: 'transparent', backgroundColor: '#f1f1f1'}, // 无通讯
    '900': { color: 'transparent', backgroundColor: '#f1f1f1'}, // 未接入
    '802': { color: '#fff', backgroundColor: '#3e97d1'}, // 偏大 - 蓝
    '400': { color: '#199475', backgroundColor: '#ceebe0'}, // 正常 - 绿
    '801': { color: '#fff', backgroundColor: '#f9b600'}, // 偏小 - 橙
    '803': { color: '#fff', backgroundColor: '#a42b2c'}, // 异常 - 红
  };
  return (
    <div className={styles.subConfluence}>
      {subDeviceList.map((item, i) => {
        const { alarmNum, deviceStatus } = item;
        const subInfo = deviceStatus.subInfo || []; // 每个汇流箱下支路信息。
        const statusInfo = statusArr[deviceStatus] || {};
        const deviceCapacity = dataFormats(item.deviceCapacity, '--', 2);
        const devicePower = dataFormats(item.devicePower, '--', 2);
        let progressPercent = deviceCapacity && devicePower && devicePower / deviceCapacity * 100 || 0;
        return (
          <div key={i} className={`${styles.singledeviceItem} ${styles[statusInfo.name]} ${alarmNum && styles.alarm} `}>
            <Link to={`${baseLinkPath}/${stationCode}/${item.deviceTypeCode}/${item.deviceCode}`}>
              <div className={`${styles.statusBox}`} >
                <div className={styles.deviceItemIcon} >
                  {deviceStatus === 500 && <i className="iconfont icon-outage" ></i> || null}
                  <i className={`iconfont icon-hl ${styles.icon}`} ></i>
                  {(item.alarmNum && item.alarmNum > 0) && <i className="iconfont icon-alarm" ></i> || null}
                </div>
                <div className={styles.deviceItemR} >
                  <div className={styles.deviceBlockName}><span>{item.deviceName}</span></div>
                  <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                  <div className={styles.deviceItemPower}>
                    <div className={styles.realDevicePower}>{devicePower} kW</div>
                    <div>{deviceCapacity} kW</div>
                  </div>
                </div>
              </div>
              <div className={styles.deviceBlockFooter} >
                <div>电压：{dataFormats(item.voltage, '--', 2)} V</div>
                <div>电流：{dataFormats(item.electricity, '--', 2)} A</div>
                <div style={{color: statusInfo.color}}>离散率：{dataFormats(item.dispersionRatio, '--', 2)} %</div>
                <div>温度：{dataFormats(item.temp, '--', 2)} ℃</div>
              </div>
              {subInfo.length > 0 && <div className={styles.subBranch}>
                {subInfo.map((branch, innerIndex) => {
                  const { pointValue, pointStatus } = branch;
                  return (
                    <span
                      key={innerIndex}
                      className={styles.eachBranch}
                      style={branchStatus[pointStatus]}
                    >{dataFormats(pointValue, '--', 2)}</span>
                  )
                })}
              </div>}
            </Link>
          </div>
        );
      })}
    </div>
  )
}

SubConfluenceList.propTypes = {
  subDeviceList: PropTypes.array,
  stationCode: PropTypes.string
}

export default SubConfluenceList;

