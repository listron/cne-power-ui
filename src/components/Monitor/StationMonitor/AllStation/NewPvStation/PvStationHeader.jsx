import React from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import { Tooltip } from 'antd';
import OwnProgress from '../../../../Common/OwnProgress/index';
import { deviceValueFormat, divideFormarts, multiplyFormarts, transferCapacityUnit } from '../../PvCommon/PvDataformat';

class pvStationHeader extends React.Component {
  static propTypes = {
    pvMonitorStation: PropTypes.object,
    monitorPvUnit: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
  }



  render() {
    // 默认传过来的数据是 发电量是kW 装机容量 MW 实时功率 kW 小数根据数据计算
    const { pvMonitorStation, monitorPvUnit, theme } = this.props;
    const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
    const { stationDataSummary = {} } = pvMonitorStation;
    //此处的逻辑：主要依据装机容量的单位，比如说装机容量是MW那么实时功率就是MW，
    //并且当装机容量的值小于1的时候，单位变为kW，实时功率要跟着变
    //后台的接口返回的实时功率数据是kW的值，返回的装机容量是MW的值，所以需要换算
    const showCapacityUnit = transferCapacityUnit(stationDataSummary.stationCapacity, realCapacityUnit);//计算装机容量的单位
    const stationPower = divideFormarts(stationDataSummary.stationPower, showCapacityUnit);//转换实时功率的值
    const stationCapacity = showCapacityUnit === 'MW' ? stationDataSummary.stationCapacity : multiplyFormarts(stationDataSummary.stationCapacity, 1000);//转换装机容量的值

    const stationUnitCount = stationDataSummary.stationUnitCount;
    const stationSize = stationDataSummary.stationSize;
    // const instantaneous = stationDataSummary.instantaneous;
    const dayPower = divideFormarts(stationDataSummary.dayPower, powerUnit);
    const monthPower = divideFormarts(stationDataSummary.monthPower, powerUnit);
    const yearPower = divideFormarts(stationDataSummary.yearPower, powerUnit);
    const monthRate = stationDataSummary.monthRate;
    const equivalentHours = stationDataSummary.equivalentHours;
    const equivalentHoursValidation = stationDataSummary.equivalentHoursValidation;
    const yearRate = stationDataSummary.yearRate;
    const percent = (stationDataSummary.stationPower && stationCapacity) ? (stationPower / stationCapacity) * 100 : 0;
    // const percent = (stationDataSummary.stationPower && stationCapacity) ? (stationDataSummary.stationPower / multiplyFormarts(stationDataSummary.stationCapacity, 1000)) * 100 : 0;
    return (
      <div className={`${styles.headStation}`} >
        <div className={`${styles.leftIcon}`}> <span className={'iconfont icon-pvlogo'}></span> </div>
        <div className={styles.dataColumn}>
          <div className={styles.stationPower}>
            <div> <span className={styles.dataValue}>{deviceValueFormat(stationPower, '--', 2)}</span>{showCapacityUnit}</div>
            <div> <span className={styles.dataValue}>{deviceValueFormat(stationCapacity, '--', 2)}</span>{showCapacityUnit}</div>
          </div>
          <OwnProgress percent={percent} active={true} theme={theme} />
          <div className={styles.stationPower}> <span>实时功率</span> <span>装机容量</span></div>
        </div>
        <div className={styles.dataColumn}>
          <div> 电站数量  <span className={`${styles.dataValue}`}>{stationSize}</span> 个 </div>
          <div >  装机台数 <span className={styles.dataValue}>{deviceValueFormat(stationUnitCount, '--', 0)} </span> 台</div>
        </div>
        <div className={styles.dataColumn}>
          <div>日发电量  <span className={styles.dataValue}>{deviceValueFormat(dayPower, '--', 2, true)}</span> {powerUnit}  </div>
          <div className={styles.equivalentTime}>
            <span>日等效时<span className={`${styles.dataValue} ${equivalentHoursValidation && styles.specialColor}`}>{deviceValueFormat(equivalentHours, '--', 2)}</span>h</span>
            {equivalentHoursValidation &&
              <div className={styles.tooltipName}>
                <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={equivalentHoursValidation}> <i className="iconfont icon-help"></i>
                </Tooltip>
              </div>}
          </div>
        </div>
        <div className={styles.dataColumn}>
          <div> 月发电量  <span className={styles.dataValue}>{deviceValueFormat(monthPower, '--', 2, true)}</span> {powerUnit}  </div>
          <div> 月完成率 <span className={styles.dataValue}>{deviceValueFormat(monthRate, '--', 2)} </span> %  </div>
        </div>
        <div className={styles.dataColumn}>
          <div>年发电量  <span className={styles.dataValue}>{deviceValueFormat(yearPower, '--', 2, true)}</span> {powerUnit} </div>
          <div> 年完成率 <span className={styles.dataValue}>{deviceValueFormat(yearRate, '--', 2)} </span> % </div>
        </div>
      </div>
    );
  }
}
export default (pvStationHeader);
