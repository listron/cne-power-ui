import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { dataFormats } from '../../../../utils/utilFunc';

class AreaStationReport extends Component{

  static propTypes = {
    areaName: PropTypes.string,
    dateType: PropTypes.number,
    month: PropTypes.string,
    year: PropTypes.string,
    areaStationInfo:PropTypes.object
  };

  render(){
    const { areaName, dateType, month, year, areaStationInfo } = this.props;

    const aveEquUsehours = areaStationInfo.aveEquUsehours || '';
    const aveEquLossPowerhours = areaStationInfo.aveEquLossPowerhours || '';
    const highEquUsehourStations = areaStationInfo.highEquUsehourStations || [];
    const lowEquUsehourStations = areaStationInfo.lowEquUsehourStations || [];
    const highComplateRateStations = areaStationInfo.highComplateRateStations || [];
    const aveComplateRate = areaStationInfo.aveComplateRate || '';
    const lowComplateRateStations = areaStationInfo.lowComplateRateStations || [];
    const totalLossPower = areaStationInfo.totalLossPower || '';
    const totalLossPowerDesc = areaStationInfo.totalLossPowerDesc || [];
    
    const maxFaultName = areaStationInfo.maxFaultName || '';
    const aveScore = areaStationInfo.aveScore || '';
    const scoreStations = areaStationInfo.scoreStations || [] ;

    return(
      <div className={styles.analysisReport}>
        {dateType === 1 ? 
          <div className={styles.monthReportContent}>
            <div className={styles.titleText}>
              <h3>{areaName}区域电站分析报告({month}月)</h3>
            </div>  

            <div className={styles.contentText}>
              <p>
                <span>1、区域内电站平均等效利用小时数为</span>
                <span className={styles.text}>{dataFormats(aveEquUsehours,'--',2,true) || '--'}</span>
                <span>h，平均损失电量等效小时数</span>
                <span className={styles.text}>{dataFormats(aveEquLossPowerhours,'--',2,true) || '--'}</span>
                <span>h。</span>
              </p>  

              <p className={styles.paragraph}>
                <span>该区域等效利用小时数最高的三个电站为</span>
                {
                  highEquUsehourStations.map((e,i) => {
                    if(i === 0){
                      return(
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      )
                    }else{
                      return (
                        <span>
                          <span>、</span>
                          <span className={styles.text}>{e.stationName || '--'}</span>
                        </span>
                      )
                    }
                  })
                }
                <span>。</span>   
              </p>  
            
            <p className={styles.paragraph + ' ' + styles.distanceTop}>原因说明：</p> 
            
            {highEquUsehourStations.map((e) => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失等效小时数较低，为</span>
                <span className={styles.text}>{dataFormats(e.hours,'--',2,true) || '--'}</span>
                <span>h;晴天天数</span>
                <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{dataFormats(e.proportion,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>
            ))} 

            <p className={styles.paragraph}>
              <span>该区域等效利用小时数最低的三个电站为</span>
              {
                lowEquUsehourStations.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e.stationName || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>  
            
            <p className={styles.paragraph + ' ' + styles.distanceTop}>原因说明：</p> 
            
            {lowEquUsehourStations.map((e) => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失等效小时数较低，为</span>
                <span className={styles.text}>{dataFormats(e.hours,'--',2,true) || '--'}</span>
                <span>h;晴天天数</span>
                <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{dataFormats(e.proportion,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>
            ))} 

            <p className={styles.distanceTop}>
              <span>2、区域内电站平均计划完成率为</span>
              <span className={styles.text}>{dataFormats(aveComplateRate,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>该区域计划完成率最高的三个电站为</span>
              {
                highComplateRateStations.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e.stationName || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>  
            
            <p>原因说明：</p> 
            
            {highComplateRateStations.map((e) => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失电量较低，损失率为</span>
                <span className={styles.text}>{dataFormats(e.lossRate,'--',2,true) || '--'}</span>
                <span>%;晴天天数</span>
                <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{dataFormats(e.proportion,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>
            ))} 

            <p className={styles.paragraph + ' ' + styles.distanceTop}>
              <span>该区域计划完成率最高低的三个电站为</span>
              {
                lowComplateRateStations.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e.stationName || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>  
            
            <p>原因说明：</p> 
            
            {lowComplateRateStations.map((e) => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失电量较低，损失率为</span>
                <span className={styles.text}>{dataFormats(e.lossRate,'--',2,true) || '--'}</span>
                <span>%;晴天天数</span>
                <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{dataFormats(e.proportion,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>
            ))}   

            <p className={styles.distanceTop}>
              <span>3、区域内电站总损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPower,'--',4,true) || '--'}</span>
              <span>万kWh。</span>
              <span className={styles.text}>{maxFaultName || '--'}</span>
              <span>占比最高。</span>
            </p>  
            
            <p>详细情况说明：</p>
            <p className={styles.paragraph}>
              <span>1）外部故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.externalFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.externalFaultProportion,'--',2,true) || '--'}</span>
              <span>%，其中</span>
              <span className={styles.text}>{totalLossPowerDesc.highExternalFaultName || '--'}</span>
              <span>占比最高，为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.highPxternalFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>2）低压直流故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.lowVoltageDCFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.lowVoltageDCFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>3）变电系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>4）输电系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.transmissionSystemFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>5）二次及有功无功控制系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.secondaryAndHaveNotPowerFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.secondaryAndHaveNotPowerFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>6）其他故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.otherFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.otherFaultProportion,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>  
            
            <p className={styles.distanceTop}>
              <span> 4、区域内电站平均的得分为</span>
              <span className={styles.text}>{dataFormats(aveScore,'--',2,true) || '--'}</span>
              <span>分。</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>该区域内得分最低5个电站为</span>
              {
                scoreStations.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e.stationName || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>  
            
            <p className={styles.paragraph}>
              {scoreStations.map((e,i) => (
                <p className={styles.paragraph}>
                  <span>{i+1}）</span>
                  <span className={styles.text}>{e.stationName || '--'}</span>
                  <span>电站得分</span>
                  <span className={styles.text}>{dataFormats(e.score,'--',2,true) || '--'}</span>
                  <span>分。</span>
                  {e.exceedLimit && 
                    <span>
                      <span>原因为：</span>
                      {(e.lowPlanFinishRate) && 
                        <span>
                          <span>发电量计划完成率较低，为</span>
                          <span className={styles.text}>{dataFormats(e.lowPlanFinishRate,'--',2,true) || '--'}</span>
                          <span>%；</span>
                        </span>}
                      {(e.lowPrFinishRate) && 
                        <span>
                          <span>PR计划完成率较低，为</span>
                          <span className={styles.text}>{dataFormats(e.lowPrFinishRate,'--',2,true) || '--'}</span>
                          <span>%；</span>
                        </span>}
                      {(e.highLostPpwerEquivalentHours || e.highLostPpwerEquivalentHours === 0) && 
                        <span>
                          <span>损失电量等效时较高，为</span>
                          <span className={styles.text}>{dataFormats(e.highLostPpwerEquivalentHours,'--',2,true) || '--'}</span>
                          <span>h。</span>
                        </span>}
                      {(e.highComPlantPowerRate) && 
                        <span>
                          <span>用电率较高，为</span>
                          <span className={styles.text}>{dataFormats(e.highComPlantPowerRate,'--',2,true) || '--'}</span>
                          <span>%；</span>
                        </span>}
                      {(e.lowDefectFinishRate) && 
                        <span>
                          <span>消缺率较低，为</span>
                          <span className={styles.text}>{dataFormats(e.lowDefectFinishRate,'--',2,true) || '--'}</span>
                          <span>%；</span>
                        </span>}
                      {
                        (e.aLevelDefectFinishRate && e.bLevelDefectFinishRate && e.cLevelDefectFinishRate) && <span>消缺及时性较差，</span>
                      }

                      {(e.aLevelDefectFinishRate) && 
                        <span>
                          <span>一级故障平均处理时长</span>
                          <span className={styles.text}>{dataFormats(e.aLevelDefectFinishRate,'--',2,true) || '--'}</span>
                          <span>h，</span>
                        </span>}
                      {(e.bLevelDefectFinishRate) && 
                        <span>
                          <span>二级故障平均处理时长</span>
                          <span className={styles.text}>{dataFormats(e.bLevelDefectFinishRate,'--',2,true) || '--'}</span>
                          <span>h，</span>
                        </span>}
                      {(e.cLevelDefectFinishRate) && 
                        <span>
                          <span>三级故障平均处理时长</span>
                          <span className={styles.text}>{dataFormats(e.cLevelDefectFinishRate,'--',2,true) || '--'}</span>
                          <span>h。</span>
                        </span>}
                    </span>
                  }
                </p>
              ))}
          </p>
      </div>
    </div>
    : 
    <div className={styles.yearReportContent}>
      <div className={styles.titleText}>
        <h3>{areaName}区域电站分析报告({year}年)</h3>
      </div>  

      <div className={styles.contentText}>
              <p>
                <span>1、区域内电站平均等效利用小时数为</span>
                <span className={styles.text}>{dataFormats(aveEquUsehours,'--',2,true) || '--'}</span>
                <span>h，平均损失电量等效小时数</span>
                <span className={styles.text}>{dataFormats(aveEquLossPowerhours,'--',2,true) || '--'}</span>
                <span>h。</span>
              </p>  

              <p className={styles.paragraph}>
                <span>该区域等效利用小时数最高的三个电站为</span>
                {
                  highEquUsehourStations.map((e,i) => {
                    if(i === 0){
                      return(
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      )
                    }else{
                      return (
                        <span>
                          <span>、</span>
                          <span className={styles.text}>{e.stationName || '--'}</span>
                        </span>
                      )
                    }
                  })
                }
                <span>。</span>   
              </p>  
            
            <p className={styles.paragraph + ' ' + styles.distanceTop}>原因说明：</p> 
            
            {highEquUsehourStations.map((e) => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失等效小时数较低，为</span>
                <span className={styles.text}>{dataFormats(e.hours,'--',2,true) || '--'}</span>
                <span>h;晴天天数</span>
                <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{dataFormats(e.proportion,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>
            ))} 

            <p className={styles.paragraph}>
              <span>该区域等效利用小时数最低的三个电站为</span>
              {
                lowEquUsehourStations.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e.stationName || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>  
            
            <p className={styles.paragraph + ' ' + styles.distanceTop}>原因说明：</p> 
            
            {lowEquUsehourStations.map((e) => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失等效小时数较低，为</span>
                <span className={styles.text}>{dataFormats(e.hours,'--',2,true) || '--'}</span>
                <span>h;晴天天数</span>
                <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{dataFormats(e.proportion,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>
            ))} 

            <p className={styles.distanceTop}>
              <span>2、区域内电站平均计划完成率为</span>
              <span className={styles.text}>{dataFormats(aveComplateRate,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>该区域计划完成率最高的三个电站为</span>
              {
                highComplateRateStations.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e.stationName || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>  
            
            <p>原因说明：</p> 
            
            {highComplateRateStations.map((e) => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失电量较低，损失率为</span>
                <span className={styles.text}>{dataFormats(e.lossRate,'--',2,true) || '--'}</span>
                <span>%;晴天天数</span>
                <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{dataFormats(e.proportion,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>
            ))} 

            <p className={styles.paragraph + ' ' + styles.distanceTop}>
              <span>该区域计划完成率最高低的三个电站为</span>
              {
                lowComplateRateStations.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e.stationName || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>  
            
            <p>原因说明：</p> 
            
            {lowComplateRateStations.map((e) => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失电量较低，损失率为</span>
                <span className={styles.text}>{dataFormats(e.lossRate,'--',2,true) || '--'}</span>
                <span>%;晴天天数</span>
                <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{dataFormats(e.proportion,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>
            ))}   

            <p className={styles.distanceTop}>
              <span>3、区域内电站总损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPower,'--',4,true) || '--'}</span>
              <span>万kWh。</span>
              <span className={styles.text}>{maxFaultName || '--'}</span>
              <span>占比最高。</span>
            </p>  
            
            <p>详细情况说明：</p>
            <p className={styles.paragraph}>
              <span>1）外部故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.externalFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.externalFaultProportion,'--',2,true) || '--'}</span>
              <span>%，其中</span>
              <span className={styles.text}>{totalLossPowerDesc.highExternalFaultName || '--'}</span>
              <span>占比最高，为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.highPxternalFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>2）低压直流故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.lowVoltageDCFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.lowVoltageDCFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>3）变电系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>4）输电系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.transmissionSystemFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>5）二次及有功无功控制系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.secondaryAndHaveNotPowerFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.secondaryAndHaveNotPowerFaultProportion,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>6）其他故障损失电量为</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.otherFaultLostPower,'--',4,true) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(totalLossPowerDesc.otherFaultProportion,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>  
            
            <p className={styles.distanceTop}>
              <span> 4、区域内电站平均的得分为</span>
              <span className={styles.text}>{dataFormats(aveScore,'--',2,true) || '--'}</span>
              <span>分。</span>
            </p>  
            
            <p className={styles.paragraph}>
              <span>该区域内得分最低5个电站为</span>
              {
                scoreStations.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e.stationName || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e.stationName || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>  
            
            <p className={styles.paragraph}>
              {scoreStations.map((e,i) => (
                <p className={styles.paragraph}>
                  <span>{i+1}）</span>
                  <span className={styles.text}>{e.stationName || '--'}</span>
                  <span>电站得分</span>
                  <span className={styles.text}>{dataFormats(e.score,'--',2,true) || '--'}</span>
                  <span>分。</span>
                  {e.exceedLimit && 
                    <span>
                      <span>原因为：</span>
                      {(e.lowPlanFinishRate) && 
                        <span>
                          <span>发电量计划完成率较低，为</span>
                          <span className={styles.text}>{dataFormats(e.lowPlanFinishRate,'--',2,true) || '--'}</span>
                          <span>%；</span>
                        </span>}
                      {(e.lowPrFinishRate) && 
                        <span>
                          <span>PR计划完成率较低，为</span>
                          <span className={styles.text}>{dataFormats(e.lowPrFinishRate,'--',2,true) || '--'}</span>
                          <span>%；</span>
                        </span>}
                      {(e.highLostPpwerEquivalentHours || e.highLostPpwerEquivalentHours === 0) && 
                        <span>
                          <span>损失电量等效时较高，为</span>
                          <span className={styles.text}>{dataFormats(e.highLostPpwerEquivalentHours,'--',2,true) || '--'}</span>
                          <span>h。</span>
                        </span>}
                      {(e.highComPlantPowerRate) && 
                        <span>
                          <span>用电率较高，为</span>
                          <span className={styles.text}>{dataFormats(e.highComPlantPowerRate,'--',2,true) || '--'}</span>
                          <span>%；</span>
                        </span>}
                      {(e.lowDefectFinishRate) && 
                        <span>
                          <span>消缺率较低，为</span>
                          <span className={styles.text}>{dataFormats(e.lowDefectFinishRate,'--',2,true) || '--'}</span>
                          <span>%；</span>
                        </span>}
                      {
                        (e.aLevelDefectFinishRate && e.bLevelDefectFinishRate && e.cLevelDefectFinishRate) && <span>消缺及时性较差，</span>
                      }

                      {(e.aLevelDefectFinishRate) && 
                        <span>
                          <span>一级故障平均处理时长</span>
                          <span className={styles.text}>{dataFormats(e.aLevelDefectFinishRate,'--',2,true) || '--'}</span>
                          <span>h，</span>
                        </span>}
                      {(e.bLevelDefectFinishRate) && 
                        <span>
                          <span>二级故障平均处理时长</span>
                          <span className={styles.text}>{dataFormats(e.bLevelDefectFinishRate,'--',2,true) || '--'}</span>
                          <span>h，</span>
                        </span>}
                      {(e.cLevelDefectFinishRate) && 
                        <span>
                          <span>三级故障平均处理时长</span>
                          <span className={styles.text}>{dataFormats(e.cLevelDefectFinishRate,'--',2,true) || '--'}</span>
                          <span>h。</span>
                        </span>}
                    </span>
                  }
                </p>
              ))}
          </p>
      </div>
    </div>
  }
      </div>
    )
  }
}

export default AreaStationReport;