import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { Progress} from "antd";

class PvStationItem extends React.Component{
  static propTypes = {
    stationDataList:PropTypes.array,
  }
    constructor(props,context){
        super(props,context)
    }
    render(){
      const {stationDataList}=this.props; 
     
        return(
            <div>
              <div className={styles.stationCardContainer}>
              {
                stationDataList.map((item,index)=>{
                  return(
                  <div className={styles.stationCard} key={index}>
                  <div className={styles.stationCardTitle}>{item.stationName}</div>
                  <div className={styles.stationCardProgress}>
                    <Progress percent={item.stationPower / item.stationCapacity * 100} showInfo={false} />
                  </div>
                  <div className={styles.stationCardValue}>
                    <div className={styles.stationMark}>{item.stationPower}MW</div>
                    <div>{item.stationCapacity}MW</div>
                  </div>
                  <div className={styles.stationCardWindSpeed}>{item.instantaneous}w/m²</div>
                  <div className={styles.stationCardEquipmentNum}>
                    <div>{item.stationCapacity}台</div>
                    {item.alarmNum===2?<div className={styles.stationWarning}>⚠{item.alarmNum}</div>:''}
                    {/*  <div className={styles.stationWarning}>⚠{item.alarmNum}</div> */}
                  </div>
                </div>
                )
                  
                })
              }

            </div>

            </div>
        )
    }
}
export default (PvStationItem)
