
import React from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './integrate.scss';

const SubBoxtransformer = ({ subDeviceList, deviceDetail, stationCode }) => {
  const baseLinkPath = '/hidden/monitorDevice';
  subDeviceList = [
    {
      "alarmNum": 2,
      "deviceCapacity": 89.1000,
      "deviceCode": "394M202M6M2",
      "deviceFullcode": "394M202M6M2",
      "deviceId": 987932,
      "deviceModeCode": 6,
      "deviceName": "HL01-02",
      "devicePower": 63.5315,
      "deviceStatus": 100,
      "deviceTypeCode": 202,
      "dispersionRatio": "0.80",
      "electricity": 104.15,
      "isConnected": 1,
      "parentDeviceCode": 987891,
      "parentDeviceName": "NB01-A",
      "stationCode": 394,
      "temp": 56.0,
      "voltage": 610.0
    }, {
      "alarmNum": 2,
      "deviceCapacity": 95.0400,
      "deviceCode": "394M202M6M3",
      "deviceFullcode": "394M202M6M3",
      "deviceId": 987933,
      "deviceModeCode": 6,
      "deviceName": "HL01-03",
      "devicePower": 69.3181,
      "deviceStatus": 200,
      "deviceTypeCode": 202,
      "dispersionRatio": "0.90",
      "electricity": 114.01,
      "isConnected": 1,
      "parentDeviceCode": 987891,
      "parentDeviceName": "NB01-A",
      "stationCode": 394,
      "temp": 55.0,
      "voltage": 608.0
    }
  ];

  // const boxStatus = { // 逆变器各种设备状态
  //   '400': {color: '#199475', statusName: '正常', name: 'normal'}, // 正常
  //   '500': {color: '#a42b2c', statusName: '无通讯', name: 'break'}, // 中断
  //   '900': {color: '#999', statusName: '未接入', name: 'unconnect'}, // 未接入
  // }

  return (
    <div className={styles.subBoxtransformer}>
      {subDeviceList.map((item, i) => {
        const { deviceCode, devicePower, deviceCapacity, alarmNum } = item;
        let progressPercent = devicePower / deviceCapacity * 100 || 0;
        const deviceTypeCode = deviceCode.split('M')[1];
        return (
          <div key={i} className={`${styles.singledeviceItem} `}>
            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${deviceCode}`} >
              <div className={`${styles.statusBox}`} style={{backgroundColor: alarmNum > 0 ? '#ff8e9c' : 'transparent'}}>
                <div className={styles.deviceItemIcon} >
                  <i className={`iconfont icon-xb ${styles.icon}`} />
                  {(alarmNum > 0) && <i className="iconfont icon-alarm" /> }
                </div>
                <div className={styles.deviceItemR} >
                  <div className={styles.deviceBlockName}>
                    <span style={{color: alarmNum > 0 ? '#a42b2c' : '#666'}}>{item.deviceName}</span>
                  </div>
                  <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                  <div className={styles.deviceItemPower}>
                    <div className={styles.realDevicePower}>{dataFormats(item.devicePower, '--', 2)} kW</div>
                    <div>{dataFormats(item.deviceCapacity, '--', 2)} kW</div>
                  </div>
                </div>
              </div>
              <div className={styles.deviceBlockFooter}>
                <div>Q：{dataFormats(item.voltage, '--', 2)} kVar</div>
                <div>F：{dataFormats(item.electricity, '--', 2)} Hz</div>
                <div>Cos：{dataFormats(item.dispersionRatio, '--', 2)} </div>
                <div>Ia:{dataFormats(item.temp, '--', 2)} A</div>
              </div>
            </Link>
          </div>);
      })}
    </div>
  )
}

export default SubBoxtransformer;

