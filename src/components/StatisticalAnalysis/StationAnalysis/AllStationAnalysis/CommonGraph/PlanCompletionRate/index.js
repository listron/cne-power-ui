import React from "react";
import styles from './styles.scss';
import WaterWave from './WaterWave';
import {  Table,  Radio } from "antd";

class PlancompletionRate extends React.Component{
    constructor(props,context){
        super(props,context)
    }
    selectYear() {
        return (
          <Radio.Group defaultValue="2019"  buttonStyle="solid">
           {['2014','2015','2016','2017','2018','2019'].map((e,index)=>{
             if(true){
              return   <Radio.Button value={e} key={index}  style={{margin:'0 5px'}}>{e}年</Radio.Button>
             }else{
              return   <Radio.Button value={e} key={index} disabled style={{margin:'0 5px'}}>{e}月</Radio.Button>
             }      
           }       
           )}        
          </Radio.Group>
        )
      }
    render(){
        const{timeSelect}=this.props;
        return(
            <div className={styles.allStationData}>
               <div className={styles.textStyle}>计划完成情况{timeSelect==='year'?this.selectYear():''}</div>
               <div className={styles.allStationDataContainer}>
               <div className={styles.leftPic}>
               <WaterWave percent={30} height={100} title="" />
               </div>
               <div className={styles.powerGeneration}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>1333.30</div>
               <div className={styles.stationTargetName}>实际发电量 万kWh</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>2500.00</div>
               <div className={styles.stationTargetName}>计划发电量 万kWh</div>
               </div>
               </div>
               <div className={styles.dataSummary}>
               <div className={styles.rightDataSummary}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>1333.30</div>
               <div className={styles.stationTargetName}>累计光辐射总量 MJ/㎡</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>99.99%</div>
               <div className={styles.stationTargetName}>电站可利用率</div>
               </div>
               </div>
               <div className={styles.rightDataSummary}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>821.33</div>
               <div className={styles.stationTargetName}>等效利用小时数  h</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>81.00</div>
               <div className={styles.stationTargetName}>损失电量  万kWh</div>
               </div>
               </div>
               <div className={styles.rightDataSummary}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>320.00</div>
               <div className={styles.stationTargetName}>装机容量 MW</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>12</div>
               <div className={styles.stationTargetName}>故障台次数</div>
               </div>
               </div>
               <div className={styles.rightDataSummary}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>86.00%</div>
               <div className={styles.stationTargetName}>PR</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>0.40%</div>
               <div className={styles.stationTargetName}>限电率</div>
               </div>
               </div>    
               </div>
             </div>

            </div>
        )
    }
}
export default (PlancompletionRate)