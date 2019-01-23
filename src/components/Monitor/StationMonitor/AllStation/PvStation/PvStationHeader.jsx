import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { Tooltip } from 'antd';
import CommonProgress from '../../../../Common/CommonProgress'
import { ValueFormat, DeviceValueFormat } from '../../../../Common/UtilComponent'
import { monitordataFormat } from '../../../../../utils/utilFunc';

class pvStationHeader extends React.Component {
  static propTypes = {
    pvMonitorStation: PropTypes.object,
    realTimePowerUnit: PropTypes.string,
    realCapacityUnit: PropTypes.string,
    powerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.number,
    realCapacityPoint: PropTypes.number,
    powerPoint: PropTypes.number,
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { pvMonitorStation, realTimePowerUnit, realCapacityUnit, powerUnit, realTimePowerPoint, realCapacityPoint, powerPoint, } = this.props;
    const stationDataSummary = pvMonitorStation.stationDataSummary || {};
    const stationPower = stationDataSummary.stationPower || ' -- ';
    const stationCapacity = stationDataSummary.stationCapacity || ' -- ';
    const stationUnitCount = stationDataSummary.stationUnitCount || ' -- ';
    const instantaneous = stationDataSummary.instantaneous || ' -- ';
    const dayPower = stationDataSummary.dayPower || ' -- ';
    const monthPower = stationDataSummary.monthPower || ' -- ';
    const yearPower = stationDataSummary.yearPower || ' -- ';
    const yearPlanPower = stationDataSummary.yearPlanPower || ' -- ';
    const yearPlanRate = stationDataSummary.yearPlanRate || ' -- ';
    const planStatus = stationDataSummary.planStatus || 0;
    return (
      <div className={styles.headStation}>
        <div className={styles.typeIcon}>
          <div className={styles.leftIcon}>
          </div>
        </div>
        <CommonProgress value={stationPower} total={stationCapacity} realTimePoint={realTimePowerPoint} realTimeUnit={realTimePowerUnit} points={realCapacityPoint} valueunit={realCapacityUnit} valueText={`实时功率 (${realTimePowerUnit})`} totalText={`装机容量 (${realCapacityUnit})`} />
        <div className={styles.stationCollect}>
          <div className={styles.equipmentNum}>
            <div className={styles.dataValue}>{stationUnitCount}</div>
            <div className={styles.dataName}>装机台数 (台)</div>
          </div>
          <div className={styles.pvInstantaneous}>
            <div className={styles.dataPvValue}>
              <DeviceValueFormat value={monitordataFormat(instantaneous, '--')} />
            </div>

            <div className={styles.dataName}>平均辐射 (W/m²)</div>
          </div>
          <div className={styles.dayStation}>
            <div className={styles.dataValue}>
              <ValueFormat value={(dayPower, '--', powerPoint)} points={powerPoint} valueunit={powerUnit} />
            </div>
            <div className={styles.dataName}>日发电量 ({powerUnit})</div>
          </div>
          <div className={styles.monthStation}>
            <div className={styles.dataValue}>
              <ValueFormat value={monitordataFormat(monthPower, '--', powerPoint)} points={powerPoint} valueunit={powerUnit} />
            </div>
            <div className={styles.dataName}>月累计发电量 ({powerUnit})</div>
          </div>
          {
            planStatus === 2 && <CommonProgress value={yearPower} total={yearPlanPower} points={powerPoint} realTimePoint={powerPoint} realTimeUnit={powerUnit} valueunit={powerUnit} valueText={`年累计发电量 (${powerUnit})`} totalText={`计划( ${powerUnit})`} percent={yearPlanRate ? yearPlanRate : ''} />
          }
          {
            planStatus === 1 &&
            <React.Fragment>
              <div className={styles.yearStation}>
                <div className={styles.dataValue}>
                  <ValueFormat value={monitordataFormat(yearPower, '--', powerPoint)} points={powerPoint} valueunit={powerUnit} />
                </div>
                <div className={styles.dataName}>年累计发电量 ({powerUnit})</div>
              </div>
              <div className={styles.yearStationRate}>
                <div className={styles.dataValue}>
                  <DeviceValueFormat value={monitordataFormat(yearPlanRate.split('%')[0], '--')} />{'%'}
                </div>
                <div className={styles.dataName}>计划完成率</div>
                <Tooltip placement="bottom" className={styles.tooltipName} overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={'不含未填写计划发电量的电站'}> <i className="iconfont icon-help"></i>
                </Tooltip>
              </div>
            </React.Fragment>
          }
          {
            planStatus === 0 &&
            <div className={styles.yearStation}>
              <div className={styles.dataValue}>
                <ValueFormat value={monitordataFormat(yearPower, '--', powerPoint)} points={powerPoint} valueunit={powerUnit} />
              </div>
              <div className={styles.dataName}>年累计发电量 ({powerUnit})</div>
            </div>
          }

        </div>
      </div>
    )
  }
}
export default (pvStationHeader)