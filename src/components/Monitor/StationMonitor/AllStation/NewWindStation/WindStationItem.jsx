import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import { Progress, message } from "antd";
import { Link } from 'react-router-dom';

class WindStationItem extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    realTimePowerUnit: PropTypes.string,
    realCapacityUnit: PropTypes.string,
    powerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.any,
    realCapacityPoint: PropTypes.any,
    powerPoint: PropTypes.any,
  }
  constructor(props, context) {
    super(props, context)
  }

  showTip = () => {
    message.destroy();
    message.config({
      top: 225,
      duration: 2,
      maxCount: 1,
    });
    message.warning('电站未接入,无法查看详情', 2);

  }

  render() {
    const { stationDataList, realTimePowerUnit, realTimePowerPoint, realCapacityUnit, realCapacityPoint } = this.props;
    return (
      <div className={styles.stationCardContainer}>
        {stationDataList.length=0 && <div><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div>}
        {stationDataList.length && stationDataList.map((item, index) => {
          const stationStatus = item.stationStatus || {};
          const stationName = item.stationName || '--';
          const progressStationPower = item.stationPower || '--';
          const progressStationCapacity = item.stationCapacity || '--';
          const stationPower = (realTimePowerUnit === 'MW' ? (+item.stationPower) : (+item.stationPower * 1000)).toFixed(realTimePowerPoint) || '--';
          const stationCapacity = (realCapacityUnit === 'MW' ? (+item.stationCapacity) : (+item.stationCapacity * 1000)).toFixed(realCapacityPoint) || '--';
          const instantaneous = item.instantaneous || '--';
          const stationUnitCount = item.stationUnitCount || '--';
          const currentStatus=stationStatus.stationStatus;
          return (
            <div className={currentStatus === '900' ? styles.stationTest : styles.stationCard} key={index} onClick={this.showTip}>
              <Link to={`/monitor/singleStation/${item.stationCode}`} key={item.stationCode}>
                <div className={styles.stationCardTitle}>
                  <div className={styles.stationName}>{stationName}</div>
                  {currentStatus === '500' ? <i className="iconfont icon-outage"></i> : ''}
                </div>
                <div className={styles.stationCardProgress}>
                  <Progress strokeWidth={3} percent={progressStationPower / progressStationCapacity * 100} showInfo={false} />
                </div>
                <div className={styles.stationCardValue}>
                  <div className={styles.stationMark}>{stationPower}{realTimePowerUnit}</div>
                  <div>{stationCapacity}{realCapacityUnit}</div>
                </div>
                <div className={styles.stationCardWindSpeed}>{instantaneous}m/s</div>
              </Link>
              <div className={styles.stationCardEquipmentNum}>
                <Link to={`/monitor/singleStation/${item.stationCode}`} key={new Date()}>
                  <div>{stationUnitCount}台</div>
                </Link>
                {item.alarmNum > 0 ? <Link to={`/monitor/alarm/realtime?stationCode=${item.stationCode}`} key={item.stationCode}><div className={styles.stationWarning}>
                  <i className="iconfont icon-alarm1"></i>{item.alarmNum}</div></Link> : ''}
              </div>
            </div>
          )
        })
        }
      </div>
    )
  }
}
export default WindStationItem;
