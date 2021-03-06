
import React from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './integrate.scss';

const SubBoxtransformer = ({ subDeviceList = [], deviceDetail, stationCode, theme = 'light' }) => {
  const baseLinkPath = '/hidden/monitorDevice';
  const getStatusName = { // 逆变器各种设备状态
    '400': { name: 'normal', text: '正常' },
    '500': { name: 'noContact', text: '中断' },
    '900': { name: 'noAccess', text: '未接入' },
  };
  return (
    <div className={`${styles.subBoxtransformer} ${styles[theme]}`}>
      {subDeviceList.map((item, i) => {
        const { deviceCode, devicePower, deviceCapacity, alarmNum } = item;
        const progressPercent = devicePower / deviceCapacity * 100 || 0;
        const deviceTypeCode = deviceCode && deviceCode.split('M')[1] || '';
        const statusName = item.deviceStatus && getStatusName[`${item.deviceStatus}`].name || 'noAccess';
        const alarm = item.alarmNum && item.alarmNum > 0;
        return (
          <div key={i} className={`${styles.singledeviceItem} ${styles[statusName]} ${alarm && styles.alarm}`}>
            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${deviceCode}`}>
              <div className={`${styles.statusBox}`} >
                <div className={styles.deviceItemIcon} >
                  <i className={`iconfont icon-xb ${styles.icon}`} />
                  {(alarmNum > 0) && <i className="iconfont icon-alarm" />}
                </div>
                <div className={styles.deviceItemR} >
                  <div className={styles.deviceBlockName}>
                    <span>{item.deviceName || '--'}</span>
                  </div>
                  <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                  <div className={styles.deviceItemPower}>
                    <div className={styles.realDevicePower}>{dataFormats(item.devicePower, '--', 2)} kW</div>
                    <div>{dataFormats(item.deviceCapacity, '--', 2)} kW</div>
                  </div>
                </div>
              </div>
              <div className={styles.deviceBlockFooter}>
                <div>Q：{dataFormats(item.reactivePower, '--', 2)} kVar</div>
                <div>F：{dataFormats(item.powerFrequency, '--', 2)} Hz</div>
                <div>Cos：{dataFormats(item.powerFactor, '--', 2)} </div>
                <div>Ia:{dataFormats(item.current, '--', 2)} A</div>
              </div>
            </Link>
          </div>);
      })}
    </div>
  );
};

export default SubBoxtransformer;

