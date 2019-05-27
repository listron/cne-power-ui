import React from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './inverter.scss';

const SubConfluenceList = ({ subDeviceList, deviceDetail, stationCode }) => {
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
    }, {
      "alarmNum": 2,
      "deviceCapacity": 95.0400,
      "deviceCode": "394M202M6M4",
      "deviceFullcode": "394M202M6M4",
      "deviceId": 987934,
      "deviceModeCode": 6,
      "deviceName": "HL01-04",
      "devicePower": 69.7405,
      "deviceStatus": 300,
      "deviceTypeCode": 202,
      "dispersionRatio": "1.19",
      "electricity": 116.06,
      "isConnected": 1,
      "parentDeviceCode": 987891,
      "parentDeviceName": "NB01-A",
      "stationCode": 394,
      "temp": 49.0,
      "voltage": 600.9
    }, {
      "alarmNum": 2,
      "deviceCapacity": 95.0400,
      "deviceCode": "394M202M6M5",
      "deviceFullcode": "394M202M6M5",
      "deviceId": 987935,
      "deviceModeCode": 6,
      "deviceName": "HL01-05",
      "devicePower": 68.9370,
      "deviceStatus": 500,
      "deviceTypeCode": 202,
      "dispersionRatio": "0.98",
      "electricity": 115.26,
      "isConnected": 1,
      "parentDeviceCode": 987891,
      "parentDeviceName": "NB01-A",
      "stationCode": 394,
      "temp": 54.0,
      "voltage": 598.1
    }, {
      "alarmNum": 2,
      "deviceCapacity": 95.0400,
      "deviceCode": "394M202M6M6",
      "deviceFullcode": "394M202M6M6",
      "deviceId": 987936,
      "deviceModeCode": 6,
      "deviceName": "HL01-06",
      "devicePower": 69.0274,
      "deviceStatus": 900,
      "deviceTypeCode": 202,
      "dispersionRatio": "0.69",
      "electricity": 115.18,
      "isConnected": 1,
      "parentDeviceCode": 987891,
      "parentDeviceName": "NB01-A",
      "stationCode": 394,
      "temp": 56.0,
      "voltage": 599.3
    }, {
      "alarmNum": 0,
      "deviceCapacity": 83.1600,
      "deviceCode": "394M202M6M7",
      "deviceFullcode": "394M202M6M7",
      "deviceId": 987937,
      "deviceModeCode": 6,
      "deviceName": "HL01-07",
      "devicePower": 61.6498,
      "deviceStatus": 100,
      "deviceTypeCode": 202,
      "dispersionRatio": "1.45",
      "electricity": 101.85,
      "isConnected": 1,
      "parentDeviceCode": 987892,
      "parentDeviceName": "NB01-B",
      "stationCode": 394,
      "temp": 48.0,
      "voltage": 605.3
    }, {
      "alarmNum": 0,
      "deviceCapacity": 95.0400,
      "deviceCode": "394M202M6M8",
      "deviceFullcode": "394M202M6M8",
      "deviceId": 987938,
      "deviceModeCode": 6,
      "deviceName": "HL01-08",
      "devicePower": 69.2075,
      "deviceStatus": 200,
      "deviceTypeCode": 202,
      "dispersionRatio": "1.26",
      "electricity": 115.02,
      "isConnected": 1,
      "parentDeviceCode": 987892,
      "parentDeviceName": "NB01-B",
      "stationCode": 394,
      "temp": 54.0,
      "voltage": 601.7
    }, {
      "alarmNum": 0,
      "deviceCapacity": 95.0400,
      "deviceCode": "394M202M6M9",
      "deviceFullcode": "394M202M6M9",
      "deviceId": 987939,
      "deviceModeCode": 6,
      "deviceName": "HL01-09",
      "devicePower": 69.3494,
      "deviceStatus": 300,
      "deviceTypeCode": 202,
      "dispersionRatio": "0.63",
      "electricity": 115.16,
      "isConnected": 1,
      "parentDeviceCode": 987892,
      "parentDeviceName": "NB01-B",
      "stationCode": 394,
      "temp": 55.0,
      "voltage": 602.2
    }, {
      "alarmNum": 0,
      "deviceCapacity": 89.1000,
      "deviceCode": "394M202M6M10",
      "deviceFullcode": "394M202M6M10",
      "deviceId": 987940,
      "deviceModeCode": 6,
      "deviceName": "HL01-10",
      "devicePower": 64.4069,
      "deviceStatus": 500,
      "deviceTypeCode": 202,
      "dispersionRatio": "1.03",
      "electricity": 106.74,
      "isConnected": 1,
      "parentDeviceCode": 987892,
      "parentDeviceName": "NB01-B",
      "stationCode": 394,
      "temp": 54.0,
      "voltage": 603.4
    }, {
      "alarmNum": 0,
      "deviceCapacity": 95.0400,
      "deviceCode": "394M202M6M11",
      "deviceFullcode": "394M202M6M11",
      "deviceId": 987941,
      "deviceModeCode": 6,
      "deviceName": "HL01-11",
      "devicePower": 70.0097,
      "deviceStatus": 900,
      "deviceTypeCode": 202,
      "dispersionRatio": "0.95",
      "electricity": 114.77,
      "isConnected": 1,
      "parentDeviceCode": 987892,
      "parentDeviceName": "NB01-B",
      "stationCode": 394,
      "temp": 56.0,
      "voltage": 610.0
    },
  ];
  const baseLinkPath = "/hidden/monitorDevice";
  const getStatusName = (value) => {
    let result = [];
    switch (value) {
      case '100': result = [{ name: 'normal', text: '正常' }]; break;
      case '200': result = [{ name: 'moreThanTen', text: '离散率>10%' }]; break;
      case '300': result = [{ name: 'moreThanTwenty', text: '离散率>20%' }]; break;
      case '500': result = [{ name: 'noContact', text: '无通讯' }]; break;
      case '900': result = [{ name: 'noAccess', text: '未接入' }]; break;
      default: result = [{ name: 'normal', text: '' }]; break;
    }
    return result;
  }

  return (
    <div className={styles.subConfluence}>
      {subDeviceList.map((item, i) => {
        const statusName = getStatusName(`${item.deviceStatus}`)[0].name;
        const deviceStatus = item.deviceStatus;
        const alarm = item.alarmNum && item.alarmNum > 0;
        const deviceCapacity = dataFormats(item.deviceCapacity, '--', 2);
        const devicePower = dataFormats(item.devicePower, '--', 2);
        let progressPercent = deviceCapacity && devicePower && devicePower / deviceCapacity * 100 || 0;
        return (
          <div key={i} className={`${styles.singledeviceItem} ${styles[statusName]} ${alarm && styles.alarm} `}>
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
                <div className={styles.dispersionRatio}>离散率：{dataFormats(item.dispersionRatio, '--', 2)} %</div>
                <div>温度：{dataFormats(item.temp, '--', 2)} ℃</div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  )
}

export default SubConfluenceList;

