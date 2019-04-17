import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import { dataFormats, numWithComma } from '../../../../../utils/utilFunc';
import OwnProgress from '../../../../Common/OwnProgress/index';
import { Popover } from 'antd';
class windStationHeader extends React.Component {
  static propTypes = {
    windMonitorStation: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }

  DeviceValueFormat = (data, placeholder = '--', pointLength, special = false) => {
    let point = pointLength;
    if (special) { // 特殊的设置 只针对风电
      if (data > 100) point = 0;
      if (data > 0.01 && data <= 100) point = 2;
      if (data <= 0.01) point = 4;
    }
    let showData = dataFormats(data, placeholder, point, true)
    if (showData !== '--') {
      const valueArr = showData.split('.');
      const intNum = valueArr[0];
      const pointNum = valueArr[1];
      return (
        <span className={styles.valueFormat}>
          <span className={styles.int} style={{ fontSize: 24 }}>{numWithComma(intNum)}</span>
          {pointNum && <span className={styles.decimal} style={{ fontSize: 18 }}>.{pointNum}</span>}
        </span>
      )
    } else {
      return showData
    }
  }

  unitFormarts = (data, quantity) => {
    if (isNaN(data) || (!data && data !== 0)) {
      return '--';
    }
    return data / quantity
  }

  render() {
    const { windMonitorStation, } = this.props;
    const stationDataSummary = windMonitorStation.stationDataSummary || {};
    const stationPower = stationDataSummary.stationPower;
    const stationCapacity = stationDataSummary.stationCapacity;
    const stationUnitCount = stationDataSummary.stationUnitCount;
    const instantaneous = stationDataSummary.instantaneous;
    const dayPower = this.unitFormarts(stationDataSummary.dayPower, 10000);
    const monthPower = this.unitFormarts(stationDataSummary.monthPower, 10000);
    const monthRate = stationDataSummary.monthRate;
    const yearPower = this.unitFormarts(stationDataSummary.yearPower, 10000);
    const equivalentHours = stationDataSummary.equivalentHours;
    const yearRate = stationDataSummary.yearRate;
    const capabilityRate = stationDataSummary.yearRate;
    const stationPlanPower = stationDataSummary.stationPlanPower;
    const content = (
      <div>
        <div className={styles.poverItem}>
          <i>实时功率</i>
          <p><span>{dataFormats(stationPower, '--', 2, true)}</span><span className={styles.unit}>MW</span> </p>
        </div>
        <div className={styles.poverItem}>
          <i>应发功率</i>
          <p><span>{dataFormats(stationPlanPower, '--', 2, true)}</span> <span className={styles.unit}>MW</span> </p>
        </div>
        <div className={styles.poverItem}>
          <i>出力比</i>
          <p><span>{dataFormats(capabilityRate, '--', 2, true)}</span> <span className={styles.unit}>%</span> </p>
        </div>
      </div>)
    return (
      <div className={styles.headStation}>
        <div className={styles.leftIcon}></div>
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
              <div> <span className={styles.dataValue}>{this.DeviceValueFormat(stationPower, '--', 2)}</span> MW </div>
              <div> <span className={styles.dataValue}>{this.DeviceValueFormat(stationCapacity, '--', 2)}</span>MW</div>
            </div>
            <OwnProgress percent={stationPower / stationCapacity * 100} successPercent={capabilityRate} />
            <div className={styles.stationPower}> <span>实时功率</span> <span>装机容量</span></div>
          </Popover>
        </div>
        <div className={styles.dataColumn}>
          <div> 平均风速  <span className={`${styles.dataValue} ${styles.speed}`}>{this.DeviceValueFormat(instantaneous, '--', 2)}</span> m/s </div>
          <div >  装机台数 <span className={styles.dataValue}>{this.DeviceValueFormat(stationUnitCount, '--', 0)} </span> 台</div>
        </div>
        <div className={styles.dataColumn}>
          <div>日发电量  <span className={styles.dataValue}>{this.DeviceValueFormat(dayPower, '--', 2, true)}</span> 万kWh  </div>
          <div> 月完成率 <span className={styles.dataValue}>{this.DeviceValueFormat(monthRate, '--', 2)} </span> %  </div>
        </div>
        <div className={styles.dataColumn}>
          <div> 月发电量  <span className={styles.dataValue}>{this.DeviceValueFormat(monthPower, '--', 2, true)}</span> 万kWh  </div>
          <div> 年完成率 <span className={styles.dataValue}>{this.DeviceValueFormat(yearRate, '--', 2)} </span> % </div>
        </div>
        <div className={styles.dataColumn}>
          <div>年发电量  <span className={styles.dataValue}>{this.DeviceValueFormat(yearPower, '--', 2, true)}</span> 万kWh </div>
          <div> 年利用小时 <span className={styles.dataValue}>{this.DeviceValueFormat(equivalentHours, '--', 2, true)}</span> h</div>
        </div>
      </div >
    )
  }
}
export default (windStationHeader)