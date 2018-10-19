import React from "react";
import styles from './styles.scss';
import PropTypes from "prop-types";
import WaterWave from './WaterWave';
import {    Radio } from "antd";
import moment from 'moment';

class PlancompletionRate extends React.Component{
    static propTypes = {
        AllStationAvalibaData: PropTypes.array,
        dateType: PropTypes.string,
      }
    constructor(props,context){
        super(props,context)
    }
    selectYear() {
        const {AllStationAvalibaData}=this.props;
        const currentYear=moment().format('YYYY');
        return (
          <Radio.Group defaultValue={currentYear}  buttonStyle="solid">
           {AllStationAvalibaData.map((e,index)=>{        
             if(e.isTrue==='1'){
              return   <Radio.Button value={e.year} key={index}  style={{margin:'0 5px'}}>{e.year}年</Radio.Button>
             }else{
              return   <Radio.Button value={e.year} key={index} disabled style={{margin:'0 5px'}}>{e.year}年</Radio.Button>
             }      
           }      
           )}        
          </Radio.Group>
        )
      
      }
    render(){
        const {dateType}=this.props;
       
        return(
            <div className={styles.allStationData}>
               <div className={styles.textStyle}>计划完成情况{dateType==='year'?this.selectYear():''}</div>
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