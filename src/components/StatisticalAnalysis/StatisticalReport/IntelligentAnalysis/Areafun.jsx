import React from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { dataFormats } from '../../../../utils/utilFunc';

export const ScoreStations = ({scoreStations}) => { // 同区域电站分析报告-平均得分
  return(
    <div>
      {scoreStations.length > 0 &&
        <div>
        <div className={styles.coumnTiTle}>
          <div className={styles.stationName + ' ' + styles.stations}>电站名称</div>
          <div className={styles.score + ' ' + styles.scores}>得分</div>
          <div className={styles.cause + ' ' + styles.causes}>原因分析</div>
        </div>
        {scoreStations.map(e=>{
          return (
            <div className={styles.column}>
                <div className={styles.stationName}>{e.stationName || '--'}</div>
                <div className={styles.score}>{dataFormats(e.score, '--', 2)}</div>
                <div className={styles.titlesText}>{
                  <div className={styles.cause}>
                    <div>
                      {(e.lowPlanFinishRate || e.lowPlanFinishRate === 0) &&
                        <span>
                          <span>发电量计划完成率较低，为</span>
                          <span>{dataFormats(e.lowPlanFinishRate, '--', 2, true)}</span>
                          <span>%；</span>
                        </span>}
                      {(e.lowPrFinishRate || e.lowPrFinishRate === 0) &&
                        <span>
                          <span>PR计划完成率较低，为</span>
                          <span>{dataFormats(e.lowPrFinishRate, '--', 2, true)}</span>
                          <span>%；</span>
                        </span>}
                      {(e.highLostPowerEquivalentHours || e.highLostPowerEquivalentHours === 0) &&
                        <span>
                          <span>损失电量等效时较高，为</span>
                          <span>{dataFormats(e.highLostPowerEquivalentHours, '--', 2, true)}</span>
                          <span>h。</span>
                        </span>}
                      {(e.highComPlantPowerRate || e.highComPlantPowerRate === 0) &&
                        <span>
                          <span>用电率较高，为</span>
                          <span>{dataFormats(e.highComPlantPowerRate, '--', 2, true)}</span>
                          <span>%；</span>
                        </span>}
                        {(e.lowDefectFinishRate || e.lowDefectFinishRate === 0) &&
                        <span>
                          <span>消缺率较低，为</span>
                          <span>{dataFormats(e.lowDefectFinishRate, '--', 2, true)}</span>
                          <span>%；</span>
                        </span>}
                      {
                        (e.aLevelDefectFinishRate || e.bLevelDefectFinishRate || e.cLevelDefectFinishRate) && <span>消缺及时性较差，</span>
                      }
                      {(e.aLevelDefectFinishRate || e.aLevelDefectFinishRate === 0) &&
                        <span>
                          <span>一级故障平均处理时长</span>
                          <span>{dataFormats(e.aLevelDefectFinishRate, '--', 2, true)}</span>
                          <span>h，</span>
                        </span>}
                      {(e.bLevelDefectFinishRate || e.bLevelDefectFinishRate === 0) &&
                        <span>
                          <span>二级故障平均处理时长</span>
                          <span>{dataFormats(e.bLevelDefectFinishRate, '--', 2, true)}</span>
                          <span>h，</span>
                        </span>}
                      {(e.cLevelDefectFinishRate || e.cLevelDefectFinishRate) &&
                        <span>
                          <span>三级故障平均处理时长</span>
                          <span>{dataFormats(e.cLevelDefectFinishRate, '--', 2, true)}</span>
                          <span>h。</span>
                        </span>}
                    </div>
                  </div>
                }</div>
              </div>
            );
          })}
      </div>
      }
    </div>
  );
};

ScoreStations.propTypes = {
  scoreStations: PropTypes.array,
};

export const GenRegionDataList = ({genRegionDataList}) => {

  return(
    <div>
      {genRegionDataList.map((e, i) => (
        <p>
          <p className={styles.bigText}>
            <span>（{i + 1}）</span>
            <span className={styles.text}>{e.regionName || '--'}</span>
            <span>区域完成率低的三个电站及原因说明：</span>
          </p>

          <div className={styles.fileBox}>
            <div className={styles.stationName}>
              <p className={styles.titlesText}>电站名称</p>
              {e.faultList.map((e) => (
                <p>{e.stationName || '--'}</p>
              ))}
            </div>

            <div className={styles.lossEquivalentHours}>
              <p className={styles.titlesText}>损失电量（损失率）</p>
              {e.faultList.map((e) => (
                <p>{dataFormats(e.faultLostRate, '--', 2, true) || '--'}</p>
              ))}
            </div>

            <div className={styles.sunnyDays}>
              <p className={styles.titlesText}>晴天天数（天）</p>
              {e.faultList.map((e) => (
                <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
              ))}
            </div>

            <div className={styles.highProportion}>
              <p className={styles.titlesText}>占比（%）</p>
              {e.faultList.map((e) => (
                <p>{dataFormats(e.sunnyDayRate, '--', 2, true) || '--'}</p>
              ))}
            </div>
          </div>
        </p>
      ))}
    </div>
  );
};

GenRegionDataList.propTypes = {
  genRegionDataList: PropTypes.array,
};

export const LostRegionDataList = ({lostRegionDataList}) => {
  return(
    <div>
      {lostRegionDataList.map((e, i) => (
        <p>
          <p className={styles.bigText}>
            <span>（{i + 1}）</span>
            <span className={styles.text}>{e.regionName || '--'}</span>
            <span>区域故障损失分类：</span>
          </p>

          <div className={styles.fileBox}>
            <div className={styles.faults}>
              <p className={styles.titlesText}>故障类型</p>
              <p>外部故障</p>
              <p>低压直流故障</p>
              <p>变电系统故障</p>
              <p>输电系统故障</p>
              <p>二次及有功无功控制系统故障</p>
              <p>其他故障</p>
            </div>

            <div className={styles.electricitys}>
              <p className={styles.titlesText}>损失电量等效小时数</p>
              <p>{dataFormats(e.faultData.courtLostHours, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.lowVoltageLostHours, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.substationLostHours, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.outPutLostHours, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.twiceLostHours, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.otherLostHours, '--', 2, true) || '--'}</p>
            </div>

            <div className={styles.ratios}>
              <p className={styles.titlesText}>占比</p>
              <p>{dataFormats(e.faultData.courtLostHoursRate, '--', 2,true) || '--'}</p>
              <p>{dataFormats(e.faultData.lowVoltageLostHoursRate, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.substationLostHoursRate, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.outPutLostHoursRate, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.twiceLostHoursRate, '--', 2, true) || '--'}</p>
              <p>{dataFormats(e.faultData.otherLostHoursRate, '--', 2, true) || '--'}</p>
            </div>
          </div>
        </p>
      ))}
    </div>
  );
};

LostRegionDataList.propTypes = {
  lostRegionDataList: PropTypes.array,
};
