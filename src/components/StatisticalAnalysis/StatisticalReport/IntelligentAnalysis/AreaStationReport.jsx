import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { ScoreStations } from './Areafun';
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

    const highEquUsehourStations = areaStationInfo.highEquUsehourStations || [];
    const lowEquUsehourStations = areaStationInfo.lowEquUsehourStations || [];
    const highComplateRateStations = areaStationInfo.highComplateRateStations || [];
    const lowComplateRateStations = areaStationInfo.lowComplateRateStations || [];
    const totalLossPowerDesc = areaStationInfo.totalLossPowerDesc || [];
    const scoreStations = areaStationInfo.scoreStations || [] ;

    return(
      <div className={styles.analysisReport}>
        {dateType === 1 ? 
          <div className={styles.monthReportContent}>
            <div className={styles.titleText}>
              <h3>{areaName}-区域电站分析报告({month}月)</h3>
            </div>  
            <div className={styles.contentText}>
              <p>
                <span>1、区域内电站平均等效利用小时数为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveEquUsehours,'--',2,true) || '--'}</span>
                <span>h，平均损失电量等效小时数</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveEquLossPowerhours,'--',2,true) || '--'}</span>
                <span>h。</span>
              </p>  

              <p className={styles.paragraph}>
                <span>该区域等效利用小时数最高的三个电站为</span>
                <span className={styles.text}>{highEquUsehourStations.map(e=>e.stationName).join('、')}</span>
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
                <span className={styles.text}>{lowEquUsehourStations.map(e=>e.stationName).join('、')}</span>
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
                <span className={styles.text}>{dataFormats(areaStationInfo.aveComplateRate,'--',2,true) || '--'}</span>
                <span>%。</span>
              </p>  
              
              <p className={styles.paragraph}>
                <span>该区域计划完成率最高的三个电站为</span>
                <span className={styles.text}>{highComplateRateStations.map(e=>e.stationName).join('、')}</span>
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
                <span>该区域计划完成率最低的三个电站为</span>
                <span className={styles.text}>{lowComplateRateStations.map(e=>e.stationName).join('、')}</span>
                <span>。</span>
              </p>  
              
              <p>原因说明：</p> 
              
              {lowComplateRateStations.map((e) => (
                <p className={styles.paragraph}>
                  <span className={styles.text}>{e.stationName || '--'}</span>
                  <span>电站损失电量较高，损失率为</span>
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
                <span className={styles.text}>{dataFormats(areaStationInfo.totalLossPower,'--',4,true) || '--'}</span>
                <span>万kWh。</span>
                <span className={styles.text}>{areaStationInfo.maxFaultName || '--'}</span>
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
                <span className={styles.text}>{dataFormats(totalLossPowerDesc.highExternalFaultLossPower,'--',2,true) || '--'}</span>
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
                <span className={styles.text}>{dataFormats(totalLossPowerDesc.transmissionSystemFaultProportion,'--',2,true) || '--'}</span>
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
                <span className={styles.text}>{dataFormats(areaStationInfo.aveScore,'--',2,true) || '--'}</span>
                <span>分。</span>
              </p>  
              
              <p className={styles.paragraph}>
                <span>该区域内得分最低5个电站为</span>
                <span className={styles.text}>{scoreStations.map(e=>e.stationName).join('、')}</span>
                <span>。</span>
              </p>  
              
              <ScoreStations scoreStations={scoreStations} />
            </div>
          </div>
        : 
          <div className={styles.yearReportContent}>
            <div className={styles.titleText}>
              <h3>{areaName}-区域电站分析报告({year}年)</h3>
            </div>  
            <div className={styles.contentText}>
              <p>
                <span>1、区域内电站平均等效利用小时数为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveEquUsehours,'--',2,true) || '--'}</span>
                <span>h，平均损失电量等效小时数</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveEquLossPowerhours,'--',2,true) || '--'}</span>
                <span>h。</span>
              </p>  

              <p className={styles.paragraph}>
                <span>该区域等效利用小时数最高的三个电站为</span>
                <span className={styles.text}>{highEquUsehourStations.map(e=>e.stationName).join('、')}</span>
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
                <span className={styles.text}>{lowEquUsehourStations.map(e=>e.stationName).join('、')}</span>
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
                <span className={styles.text}>{dataFormats(areaStationInfo.aveComplateRate,'--',2,true) || '--'}</span>
                <span>%。</span>
              </p>  
              
              <p className={styles.paragraph}>
                <span>该区域计划完成率最高的三个电站为</span>
                <span className={styles.text}>{highComplateRateStations.map(e=>e.stationName).join('、')}</span>
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
                <span>该区域计划完成率最低的三个电站为</span>
                <span className={styles.text}>{lowComplateRateStations.map(e=>e.stationName).join('、')}</span>
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
                <span className={styles.text}>{dataFormats(areaStationInfo.totalLossPower,'--',4,true) || '--'}</span>
                <span>万kWh。</span>
                <span className={styles.text}>{areaStationInfo.maxFaultName || '--'}</span>
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
                <span className={styles.text}>{dataFormats(totalLossPowerDesc.transmissionSystemFaultProportion,'--',2,true) || '--'}</span>
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
                <span className={styles.text}>{dataFormats(areaStationInfo.aveScore,'--',2,true) || '--'}</span>
                <span>分。</span>
              </p>  
              
              <p className={styles.paragraph}>
                <span>该区域内得分最低5个电站为</span>
                <span className={styles.text}>{scoreStations.map(e=>e.stationName).join('、')}</span>
                <span>。</span>
              </p>  
              
              <ScoreStations scoreStations={scoreStations} />
            </div>
          </div>
        }
      </div>
    )
  }
}

export default AreaStationReport;