
import React from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './integrate.scss';

const SubBoxtransformer = ({ subDeviceList, deviceDetail, stationCode }) => {
  const baseLinkPath = '/hidden/monitorDevice';
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
                <div>Ia:{dataFormats(item.current, '--', 2)} A</div>
              </div>
            </Link>
          </div>);
      })}
    </div>
  )
}

export default SubBoxtransformer;

