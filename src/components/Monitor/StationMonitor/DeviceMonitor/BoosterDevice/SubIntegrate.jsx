


import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './booster.scss';

const SubIntegrate = ({ subDeviceList, deviceDetail, stationCode, theme }) => {
  const baseLinkPath = '/hidden/monitorDevice';
  return (
    <div className={`${styles.subIntergrate} ${styles[theme]}`}>
      {subDeviceList.map((item, i) => {
        const { deviceCode, alarmNum } = item;
        const deviceTypeCode = deviceCode.split('M')[1];
        return (
          <div key={i} className={`${styles.singledeviceItem} `}>
            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${deviceCode}`} >
              <div className={`${styles.statusBox}`} style={{ backgroundColor: alarmNum > 0 ? '#ff8e9c' : 'transparent' }}>
                <div className={styles.deviceItemIcon} >
                  <i className={`iconfont icon-jidian ${styles.icon}`} />
                  {(alarmNum > 0) && <i className="iconfont icon-alarm" />}
                </div>
                <div className={styles.deviceItemR} >
                  <span style={{ color: alarmNum > 0 ? '#a42b2c' : '#353535' }}>{item.deviceName}</span>
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
  );
};

SubIntegrate.propTypes = {
  subDeviceList: PropTypes.array,
  deviceDetail: PropTypes.object,
  stationCode: PropTypes.string,
  theme: PropTypes.string,
};

export default SubIntegrate;
