import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import { dataFormats, numWithComma } from '../../../../../utils/utilFunc';
import OwnProgress from '../../../../Common/OwnProgress/index';
import {DeviceValueFormat} from '../../WindCommon/WindDataformat';
import { Popover } from 'antd';

class windStationHeader extends React.Component {
  static propTypes = {
    singleStationData: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { singleStationData, } = this.props;
    const stationDataSummary = singleStationData || {};
    const stationPower = stationDataSummary.stationPower;
    const stationCapacity = stationDataSummary.stationCapacity;
    const stationUnitCount = stationDataSummary.stationUnitCount;
    const instantaneous = stationDataSummary.instantaneous;
    const dayPower = stationDataSummary.dayPower;
    const monthPower = stationDataSummary.monthPower;
    const monthRate = stationDataSummary.monthRate;
    const yearPower = stationDataSummary.yearPower;
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
              <div> <span className={styles.dataValue}>{DeviceValueFormat(stationPower, '--', 2)}</span> MW </div>
              <div> <span className={styles.dataValue}>{DeviceValueFormat(stationCapacity, '--', 2)}</span>MW</div>
            </div>
            <OwnProgress percent={stationPower / stationCapacity * 100} successPercent={capabilityRate} />
            <div className={styles.stationPower}> <span>实时功率</span> <span>装机容量</span></div>
          </Popover>
        </div>
        <div className={styles.dataColumn}>
          <div> 平均风速  <span className={`${styles.dataValue} ${styles.speed}`}>{DeviceValueFormat(instantaneous, '--', 2)}</span> m/s </div>
          <div >  装机台数 <span className={styles.dataValue}>{DeviceValueFormat(stationUnitCount, '--', 0)} </span> 台</div>
        </div>
        <div className={styles.dataColumn}>
          <div>日发电量  <span className={styles.dataValue}>{DeviceValueFormat(dayPower, '--', 2, true)}</span> 万kWh  </div>
          <div> 月完成率 <span className={styles.dataValue}>{DeviceValueFormat(monthRate, '--', 2)} </span> %  </div>
        </div>
        <div className={styles.dataColumn}>
          <div> 月发电量  <span className={styles.dataValue}>{DeviceValueFormat(monthPower, '--', 2, true)}</span> 万kWh  </div>
          <div> 年完成率 <span className={styles.dataValue}>{DeviceValueFormat(yearRate, '--', 2)} </span> % </div>
        </div>
        <div className={styles.dataColumn}>
          <div>年发电量  <span className={styles.dataValue}>{DeviceValueFormat(yearPower, '--', 2, true)}</span> 万kWh </div>
          <div> 年利用小时 <span className={styles.dataValue}>{DeviceValueFormat(equivalentHours, '--', 2, true)}</span> h</div>
        </div>
      </div >
    )
  }
}
export default (windStationHeader)