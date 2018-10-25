import React from "react";
import styles from './styles.scss';
import PropTypes from "prop-types";
import WaterWave from './WaterWave';
import {    Radio } from "antd";
import moment from 'moment';
import { getCookie } from '../../../../../../utils/index.js';

class PlancompletionRate extends React.Component{
    static propTypes = {
        AllStationAvalibaData: PropTypes.array,
        AllStationStatisticData: PropTypes.object,
        getAllStationStatisticData: PropTypes.func,
        dateType: PropTypes.string,
        showPage: PropTypes.string,
      }
    constructor(props,context){
        super(props,context)
    }
    handleTime = (e) => {
        const changeYear = Number(e.target.value);
        console.log(changeYear);   
        const { getAllStationStatisticData, dateType } = this.props;
        const userId = getCookie('userId');
        getAllStationStatisticData(
          {
            userId: userId,
            year: changeYear,
            dateType,
          }
        )
    
      }
    selectYear() {
        const {AllStationAvalibaData}=this.props;
        let yearArray=AllStationAvalibaData.map((e,i)=>(Number(e.year))) ;
        let currentYear=Math.max(...yearArray).toString()
     
        return (
          <Radio.Group defaultValue={currentYear}  buttonStyle="solid" onChange={this.handleTime}>
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
        const {dateType,AllStationStatisticData,showPage,year}=this.props;
       
        let planSummary = showPage==='single'?AllStationStatisticData:(AllStationStatisticData&&AllStationStatisticData.planSummary&&AllStationStatisticData.planSummary[0])
        const actualPower=planSummary&&planSummary.actualPower?planSummary.actualPower:'--';
        const planPower=planSummary&&planSummary.planPower?planSummary.planPower:'--';
        const rayRadiation=planSummary&&planSummary.rayRadiation?planSummary.rayRadiation:'--';
        const stationAvailability=planSummary&&planSummary.stationAvailability?planSummary.stationAvailability:'--';
        const equivalentHours=planSummary&&planSummary.equivalentHours?planSummary.equivalentHours:'--';
        const lostPower=planSummary&&planSummary.lostPower?planSummary.lostPower:'--';
        const realCapacity=planSummary&&planSummary.realCapacity?planSummary.realCapacity:'--';
        const faultDeviceNum=planSummary&&planSummary.faultDeviceNum?planSummary.faultDeviceNum:'--';
        const pr=planSummary&&planSummary.pr?planSummary.pr:'--';
        const lostPowerRate=planSummary&&planSummary.lostPowerRate?planSummary.lostPowerRate:'--';
        const completeRate=planSummary&&planSummary.completeRate?planSummary.completeRate:'--';
      
        return(
            <div className={styles.allStationData}>
               <div className={styles.textStyle}>计划完成情况{dateType==='year'?this.selectYear():`(  ${Number(year)}年  ) `}</div>
               <div className={styles.allStationDataContainer}>
               <div className={styles.leftPic}>
               <WaterWave percent={completeRate} height={100} title="" />
               </div>
               <div className={styles.powerGeneration}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{actualPower}</div>
               <div className={styles.stationTargetName}>实际发电量 万kWh</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{planPower}</div>
               <div className={styles.stationTargetName}>计划发电量 万kWh</div>
               </div>
               </div>
               <div className={styles.dataSummary}>
               <div className={styles.rightDataSummary}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{rayRadiation}</div>
               <div className={styles.stationTargetName}>累计光辐射总量 MJ/㎡</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{stationAvailability}</div>
               <div className={styles.stationTargetName}>电站可利用率</div>
               </div>
               </div>
               <div className={styles.rightDataSummary}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{equivalentHours}</div>
               <div className={styles.stationTargetName}>等效利用小时数  h</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{lostPower}</div>
               <div className={styles.stationTargetName}>损失电量  万kWh</div>
               </div>
               </div>
               <div className={styles.rightDataSummary}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{realCapacity}</div>
               <div className={styles.stationTargetName}>装机容量 MW</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{faultDeviceNum}</div>
               <div className={styles.stationTargetName}>故障台次数</div>
               </div>
               </div>
               <div className={styles.rightDataSummary}>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{pr}</div>
               <div className={styles.stationTargetName}>PR</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>{lostPowerRate}</div>
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
