
import React from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import { message, Select } from 'antd';
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../../utils/utilFunc';
import { divideFormarts, multiplyFormarts, powerPoint } from '../../PvCommon/PvDataformat';
import OutputTenMin from './OutputTenMin';
const Option = Select.Option;

class SingleStaionList extends React.Component {
  static propTypes = {
    singleStation: PropTypes.object,
    monitorPvUnit: PropTypes.object,
    filterChartData: PropTypes.array,
  }

  constructor(props, context) {
    super(props, context);
  }

  componentWillUnmount() {
    // console.log('wo 卸载了一次')
  }

  showTip = (currentStatus) => {
    message.destroy();
    if (currentStatus === '900') {
      message.config({ top: 225, maxCount: 1 });
      message.warning('电站未接入,无法查看详情', 2);
    }
  }

  render() {
    const { singleStation, filterChartData, monitorPvUnit } = this.props;
    const getStatusName = {
      '400': 'normal',
      '500': 'interrupt',
      '900': 'notConnected',
    };
    const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
    const currentStatus = singleStation.stationStatus;
    const stationPower = divideFormarts(singleStation.stationPower, realTimePowerUnit);
    const stationCapacity = realCapacityUnit === 'MW' ? singleStation.stationCapacity : multiplyFormarts(singleStation.stationCapacity, 1000);
    const instantaneous = singleStation.instantaneous;
    const dayPower = divideFormarts(singleStation.dayPower, powerUnit);
    const equivalentHours = singleStation.equivalentHours;
    const alarm = singleStation.alarmNum > 0;
    const invertType = singleStation.lowEffType === 1 ? '201' : '206';
    const arr = ['fadeIn', 'rotateIn', 'zoomIn'];
    const animate = parseInt(Math.random() * 3);
    return (
      <div className={`${styles[getStatusName[`${currentStatus}`]]} ${styles.staionCard}  ${alarm && styles.alarm}`} onClick={() => { this.showTip(currentStatus); }} key={singleStation.stationCode} style={{ WebkitAnimation: `${arr[animate]} 0.8s ease-in-out 1 0s alternate forwards` }} >
        <Link to={`/monitor/singleStation/${singleStation.stationCode}`} className={styles.linkBox}>
          <div className={styles.stationTop}>
            <div className={styles.stationName} title={singleStation.stationName}> {singleStation.stationName}</div>
            <div className={styles.staionCapacity}>
              <div>
                <span className={styles.changeNum}>
                  <i className={'iconfont icon-da'}></i> {stationCapacity}</span> {realCapacityUnit}
              </div>
              <div className={styles.stationUnitCount}>
                <span className={styles.changeNum}>{singleStation.stationUnitCount}</span> 台
                            </div>
              {`${currentStatus}` === '500' && <i className="iconfont icon-outage" />}
              {singleStation.alarmNum > 0 && <i className="iconfont icon-alarm" />}
            </div>
          </div>
          <div className={styles.staionCenter}>
            <div className={styles.staionCenterLeft}>
              <div className={styles.column}>
                <span className={styles.dataName}> 实时功率</span>
                <div> <span className={styles.changeNum}> {dataFormats(stationPower, '--', 2, true)}</span> {realTimePowerUnit} </div>
              </div>
              <div className={styles.column}>
                <span className={styles.dataName}> 瞬时辐射</span>
                <div> <span className={styles.changeNum}> {dataFormats(instantaneous, '--', 2, true)}</span> W/m² </div>
              </div>
            </div>
            <div className={styles.staionCenterRight}>
              <div className={styles.column}>
                <span className={styles.dataName}> 日发电量</span>
                <div> <span className={styles.changeNum}> {powerPoint(dayPower)}</span> {powerUnit} </div>
              </div>
              <div className={styles.column}>
                <span className={styles.dataName}> 日利用小时</span>
                <div> <span className={styles.changeNum}> {dataFormats(equivalentHours, '--', 2, true)}</span> h </div>
              </div>
            </div>
          </div>
        </Link>
        <div className={styles.chart}>
          <OutputTenMin {...this.props}
            yXaisName={'辐射(W/m²)'}
            stationCode={singleStation.stationCode}
            yAxisUnit={realTimePowerUnit}
            capabilityData={filterChartData.length > 0 && filterChartData[0].chartData || []} />
        </div>
        <div className={styles.bottom}>
          <Link to={`/monitor/singleStation/${singleStation.stationCode}?showPart=${'509'}`} className={styles.dataColumn}>
            异常支路数  <span className={styles[`${singleStation.anomalousBranchNum > 0 ? 'red' : 'grey'}`]}> {dataFormats(singleStation.anomalousBranchNum, '--', 0)}</span>
          </Link>
          <Link to={`/monitor/singleStation/${singleStation.stationCode}?showPart=${invertType}`} className={styles.dataColumn}>
            低效逆变器  <span className={styles[`${singleStation.lowEfficiencyInverterNum > 0 ? 'red' : 'grey'}`]}> {dataFormats(singleStation.lowEfficiencyInverterNum, '--', 0)}</span>
          </Link>
          <Link to={`/monitor/alarm/realtime?stationCode=${singleStation.stationCode}`} className={styles.dataColumn}>
            <div>
              告警  <span className={styles[`${singleStation.alarmNum > 0 ? 'red' : 'grey'}`]}> {dataFormats(singleStation.alarmNum, '--', 0)}</span>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
export default SingleStaionList;

