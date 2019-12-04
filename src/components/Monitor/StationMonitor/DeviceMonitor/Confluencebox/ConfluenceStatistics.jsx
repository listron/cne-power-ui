import React from 'react';
import PropTypes from 'prop-types';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { monitordataFormat, dataFormat, dataFormats } from '../../../../../utils/utilFunc';
import { Tooltip } from 'antd';
import styles from './confluencebox.scss';

const EachRecord = ({ text, value, unit, show }) => (
  <div className={styles.eachRecord}>
    <span className={styles.text}>{text}</span>
    <DeviceValueFormat value={value} />
    <span className={styles.unit}>{unit}</span>
    {show &&
    <span className={styles.tooltipName}>
      <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={show}> <i className="iconfont icon-help"></i>
      </Tooltip>
    </span>}
  </div>
);

EachRecord.propTypes = {
  text: PropTypes.string,
  value: PropTypes.string,
  unit: PropTypes.string,
  show: PropTypes.bool,
  theme: PropTypes.string,
};

function ConfluenceStatistics({ deviceDetail, subDeviceList = [], theme = 'light' }) {
  const { devicePower, deviceCapacity, voltage, voltageValidation, electricity, electricityValidation, temperature, temperatureValidation, dispersionRatio } = deviceDetail;
  if (!subDeviceList.length && subDeviceList.electricityList) {
    subDeviceList = subDeviceList.electricityList || []; // 取出子集组串接口优化后删。
  }
  const statusColor = {
    light: {
      '500': { color: 'transparent', backgroundColor: '#f1f1f1' }, // 无通讯
      '900': { color: 'transparent', backgroundColor: '#f1f1f1' }, // 未接入
      '802': { color: '#fff', backgroundColor: '#3e97d1' }, // 偏大 - 蓝
      '400': { color: '#199475', backgroundColor: '#ceebe0' }, // 正常 - 绿
      '801': { color: '#fff', backgroundColor: '#f9b600' }, // 偏小 - 橙
      '803': { color: '#fff', backgroundColor: '#a42b2c' }, // 异常 - 红
    },
    dark: {
      '500': { color: 'transparent', backgroundColor: '#405080' }, // 无通讯
      '900': { color: 'transparent', backgroundColor: '#405080' }, // 未接入
      '802': { color: '#fff', backgroundColor: '#4d5fe2' }, // 偏大 - 蓝
      '400': { color: '#fff', backgroundColor: '#00baff' }, // 正常 - 绿
      '801': { color: '#fff', backgroundColor: '#f8b14e' }, // 偏小 - 橙
      '803': { color: '#fff', backgroundColor: '#fd6e8f' }, // 异常 - 红
    },
  };

  return (
    <div className={`${styles.confluenceStatistics} ${styles[theme]}`}>
      <div className={styles.confluenceInfo}>
        <div className={styles.deviceIcon}>
          <span className="iconfont icon-hl" />
        </div>
        <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} theme={theme} />
        <div className={styles.line} />
        <div className={styles.elecInfo}>
          <EachRecord text="电压" value={dataFormats(voltage, '--', 2)} unit="V" show={voltageValidation} />
          <EachRecord text="电流" value={dataFormats(electricity, '--', 2)} unit="A" show={electricityValidation} />
        </div>
        <div className={styles.line} />
        <div className={styles.statisticsInfo}>
          <EachRecord text="温度" value={dataFormats(temperature, '--', 2)} unit="℃" show={temperatureValidation} />
          <EachRecord text="离散率" value={dataFormats(dispersionRatio, '--', 2)} unit="%" />
        </div>
      </div>
      <div className={styles.seriesCurrent}>
        {subDeviceList.map((e, i) => (
          <span
            className={styles.eachCurrent}
            key={i}
            style={{ ...statusColor[theme][e.pointStatus] }}
          >{dataFormat(e.pointValue, '--', 2)}</span>
        ))}
      </div>
    </div>
  );
}


ConfluenceStatistics.propTypes = {
  deviceDetail: PropTypes.object,
  subDeviceList: PropTypes.array,
};

export default ConfluenceStatistics;
