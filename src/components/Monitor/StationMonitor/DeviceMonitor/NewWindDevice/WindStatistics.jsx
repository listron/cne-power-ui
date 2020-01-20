import React from 'react';
import PropTypes from 'prop-types';
import styles from './windDevice.scss';
import { dataFormats } from '../../../../../utils/utilFunc';
import { Popover } from 'antd';
import OwnProgress from '../../../../Common/OwnProgress/index';
import { DeviceValueFormat } from '../../WindCommon/WindDataformat';


class InverterStatistics extends React.Component {
  static propTypes = {
    deviceDetail: PropTypes.object,
  }

  render() {
    const { deviceDetail } = this.props;
    const { devicePower, deviceCapacity, devicePlanPower, capabilityRate, windSpeed, windAngle, powerDay, powerYear, powerMonth, equipmentHours, deviceModeName }
      = deviceDetail;
    const successPercent = (devicePlanPower && deviceCapacity) ? devicePlanPower / deviceCapacity * 100 : 0;
    const percent = (devicePower && deviceCapacity) ? devicePower / deviceCapacity * 100 : 0;
    const content = (
      <div>
        <div className={styles.poverItem}>
          <i>实时功率</i>
          <p><span>{dataFormats(devicePower, '--', 2, true)}</span><span className={styles.unit}>kW</span> </p>
        </div>
        <div className={styles.poverItem}>
          <i>应发功率</i>
          <p><span>{dataFormats(devicePlanPower, '--', 2, true)}</span> <span className={styles.unit}>kW</span> </p>
        </div>
        <div className={styles.poverItem}>
          <i>出力比</i>
          <p><span>{dataFormats(capabilityRate, '--', 2, true)}</span> <span className={styles.unit}>%</span> </p>
        </div>
      </div>);
    return (
      <div className={styles.headStation} >
        <div className={styles.deviceName}>
          <div className={styles.leftIcon}></div>
          <div className={styles.deviceModeName} title={deviceModeName}>{deviceModeName}</div>
        </div>

        <div ref={'allStaionStatic'} className={styles.allStaionStatic}></div>
        <div className={styles.dataColumn}>
          <Popover
            content={content}
            placement="bottom"
            overlayClassName={styles.stationCard}
            trigger="hover"
            getPopupContainer={() => this.refs.allStaionStatic}
          >
            <div className={styles.stationPower}>
              <div> <span className={styles.dataValue}>{DeviceValueFormat(devicePower, '--', 2)}</span> kW </div>
              <div> <span className={styles.dataValue}>{DeviceValueFormat(deviceCapacity, '--', 2)}</span>kW</div>
            </div>
            <OwnProgress percent={percent} successPercent={successPercent} />
            <div className={styles.stationPower}> <span>实时功率</span> <span>装机容量</span></div>
          </Popover>
        </div>
        <div className={styles.dataColumn}>
          <div> 风速 <span className={`${styles.dataValue} ${styles.speed}`}>{DeviceValueFormat(windSpeed, '--', 2)}</span> m/s </div>
          <div> 风向 <span className={styles.dataValue}>{DeviceValueFormat(windAngle, '--', 0)} </span> °</div>
        </div>
        <div className={styles.dataColumn}>
          <div> 日发电量  <span className={styles.dataValue}>{DeviceValueFormat(powerDay / 10000, '--', 2, true)}</span> 万kWh</div>
          <div> 年发电量 <span className={styles.dataValue}>{DeviceValueFormat(powerYear / 10000, '--', 2, true)} </span> 万kWh</div>
        </div>
        <div className={styles.dataColumn}>
          <div> 月发电量  <span className={styles.dataValue}>{DeviceValueFormat(powerMonth / 10000, '--', 2, true)}</span> 万kWh</div>
          <div> 日利用小时 <span className={styles.dataValue}>{DeviceValueFormat(equipmentHours, '--', 2, true)}</span> h</div>
        </div>
      </div>
    );
  }
}

export default InverterStatistics
  ;
