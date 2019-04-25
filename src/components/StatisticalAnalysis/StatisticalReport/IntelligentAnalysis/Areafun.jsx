import React from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { dataFormats } from '../../../../utils/utilFunc';

export const ScoreStations = ({scoreStations}) => { // 同区域电站分析报告-平均得分
  return(
    <div>
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
                  {(e.highLostPowerEquivalentHours || e.highLostPowerEquivalentHours === 0) && 
                    <span>
                      <span>损失电量等效时较高，为</span>
                      <span className={styles.text}>{dataFormats(e.highLostPowerEquivalentHours,'--',2,true) || '--'}</span>
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
                    (e.aLevelDefectFinishRate || e.bLevelDefectFinishRate || e.cLevelDefectFinishRate) && <span>消缺及时性较差，</span>
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
  )
}

ScoreStations.propTypes = {
  scoreStations:PropTypes.array
}

export const GenRegionDataList = ({genRegionDataList}) => {
  
  return(
    <div>
      {genRegionDataList.map(e => (
        <p className={styles.paragraph}>
          <p>
            <span className={styles.text}>{e.regionName || '--'}</span>
            <span>区域完成率低的三个电站及原因说明：</span>
          </p>
          <p className={styles.distanceBottom}>
            {e.faultList.map(e => (
              <p>
                  <span className={styles.text}>{e.stationName || '--'}</span>
                  <span>电站损失电量较高，损失率为</span>
                  <span className={styles.text}>{dataFormats(e.faultLostRate,'--',2,true) || '--'}</span>
                  <span>%;晴天天数</span>
                  <span className={styles.text}>{dataFormats(e.sunnyDays,'--',2,true) || '--'}</span>
                  <span>天，占比</span>
                  <span className={styles.text}>{dataFormats(e.sunnyDayRate,'--',2,true) || '--'}</span>
                  <span>%;</span>
              </p>
            ))}
          </p>
        </p>
      ))}
    </div>
  )
}

GenRegionDataList.propTypes = {
  genRegionDataList:PropTypes.array
}

export const LostRegionDataList = ({lostRegionDataList}) => {
  return(
    <div>
      {lostRegionDataList.map(e => (
        <p className={styles.paragraph}>
          <p>
            <span className={styles.text}>{e.regionName || '--'}</span>
            <span>区域故障损失分类：</span>
          </p>
      
          <p className={styles.distanceBottom}>
            <p>
              <span>1）外部故障损失电量等效时为</span>
              <span className={styles.text}>{dataFormats(e.faultData.courtLostHours,'--',2,true) || '--'}</span>
              <span>h，占比</span>
              <span className={styles.text}>{dataFormats(e.faultData.courtLostHoursRate,'--',2,true) || '--'}</span>
              <span>%，其中</span>
              <span className={styles.text}>{e.faultData.maxFaultName || '--'}</span>
              <span>占比最高，为</span>
              <span className={styles.text}>{dataFormats(e.faultData.maxLostHoursRate,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>
            <p>
              <span>2）低压直流故障损失电量等效时为</span>
              <span className={styles.text}>{dataFormats(e.faultData.lowVoltageLostHours,'--',2,true) || '--'}</span>
              <span>h，占比</span>
              <span className={styles.text}>{dataFormats(e.faultData.lowVoltageLostHoursRate,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>
            <p>
              <span>3）变电系统故障损失电量等效时为</span>
              <span className={styles.text}>{dataFormats(e.faultData.substationLostHours,'--',2,true) || '--'}</span>
              <span>h，占比</span>
              <span className={styles.text}>{dataFormats(e.faultData.substationLostHoursRate,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>
            <p>
              <span>4）输电系统故障损失电量等效时为</span>
              <span className={styles.text}>{dataFormats(e.faultData.outPutLostHours,'--',2,true) || '--'}</span>
              <span>h，占比</span>
              <span className={styles.text}>{dataFormats(e.faultData.outPutLostHoursRate,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>
            <p>
              <span>5）二次及有功无功控制系统故障损失电量等效时为</span>
              <span className={styles.text}>{dataFormats(e.faultData.twiceLostHours,'--',2,true) || '--'}</span>
              <span>h，占比</span>
              <span className={styles.text}>{dataFormats(e.faultData.twiceLostHoursRate,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>
            <p>
              <span>6）其他故障损失电量等效时为</span>
              <span className={styles.text}>{dataFormats(e.faultData.otherLostHours,'--',2,true) || '--'}</span>
              <span>h，占比</span>
              <span className={styles.text}>{dataFormats(e.faultData.otherLostHoursRate,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>
          </p>
        </p>
      ))}
    </div>
  )
}

LostRegionDataList.propTypes = {
  lostRegionDataList:PropTypes.array
}