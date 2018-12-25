import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { Progress,message } from "antd";
import { Link } from 'react-router-dom';

class PvStationItem extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
    
  }
  
  showTip = (e) => {
    message.destroy();
    message.config({
      top: 225,
      duration: 2,
      maxCount: 1,
    });
    message.warning('电站未接入,无法查看详情',2);
    

  }
 
  render() {
    const { stationDataList,realTimePowerUnit,realCapacityUnit } = this.props;
   
    return (
      <div className={styles.stationCardContainer}>
       
        {
          stationDataList.map((item, index) => {
            const stationStatus = item.stationStatus || {};
            const stationName = item.stationName || '--';
            const stationPower = (realTimePowerUnit==='MW'?item.stationPower:item.stationPower*1000 )|| '--';
            const stationCapacity = (realCapacityUnit==='MW'?item.stationCapacity:item.stationCapacity*1000 )|| '--';
            const instantaneous = item.instantaneous || '--';
            const stationUnitCount = item.stationUnitCount || '--';
            return (
              
              <div className={stationStatus.stationStatus === '900' ? styles.stationTest : styles.stationCard} key={index} onClick={stationStatus.stationStatus === '900' ?this.showTip:null}>
                <Link to={`/monitor/singleStation/${item.stationCode}`} key={item.stationCode}>
                  <div className={styles.stationCardTitle}>
                    <div className={styles.stationName}>{stationName}</div>
                    {stationStatus.stationStatus === '500' ? <i className="iconfont icon-outage"></i> : ''}
                  </div>
                  <div className={styles.stationCardProgress}>
                    <Progress strokeWidth={3} percent={stationPower / stationCapacity * 100} showInfo={false} />
                  </div>
                  <div className={styles.stationCardValue}>
                    <div className={styles.stationMark}>{stationPower}{realTimePowerUnit}</div>
                    <div>{stationCapacity}{realCapacityUnit}</div>
                  </div>
                  <div className={styles.stationCardWindSpeed}>{instantaneous}W/m²</div>
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
export default (PvStationItem)
