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
    
    message.config({
      top: 300,
      duration: 2,
      maxCount: 3,
    });
    message.warning('电站未接入,无法查看详情',2);
    

  }
 
  render() {
    const { stationDataList } = this.props;
   
    return (
      <div className={styles.stationCardContainer}>
       
        {
          stationDataList.map((item, index) => {
            const stationStatus = item.stationStatus || {};
            const stationName = item.stationName || '--';
            const stationPower = item.stationPower || '--';
            const stationCapacity = item.stationCapacity || '--';
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
                    <div className={styles.stationMark}>{stationPower}MW</div>
                    <div>{stationCapacity}MW</div>
                  </div>
                  <div className={styles.stationCardWindSpeed}>{instantaneous}W/m²</div>
                </Link>
                <div className={styles.stationCardEquipmentNum}>
                  <Link to={`/monitor/singleStation/${item.stationCode}`} key={new Date()}>
                    <div>{stationUnitCount}台</div>
                  </Link>
                  {item.alarmNum > 0 ? <Link to={`/monitor/alarm/realtime`} key={item.stationCode}><div className={styles.stationWarning}>
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
