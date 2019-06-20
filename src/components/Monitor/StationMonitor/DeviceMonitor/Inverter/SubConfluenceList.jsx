import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './inverter.scss';

const SubConfluenceList = ({ subDeviceList, stationCode }) => {
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

SubConfluenceList.propTypes = {
  subDeviceList: PropTypes.array,
  stationCode: PropTypes.string
}

export default SubConfluenceList;

