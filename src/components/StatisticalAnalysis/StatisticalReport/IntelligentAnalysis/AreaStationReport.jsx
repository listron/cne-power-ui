import React, { Component } from 'react';
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
    areaStationInfo: PropTypes.object,
  };

  render(){
    const { areaName, dateType, month, year, areaStationInfo } = this.props;

    const highEquUsehourStations = areaStationInfo.highEquUsehourStations || [];
    const lowEquUsehourStations = areaStationInfo.lowEquUsehourStations || [];
    const highComplateRateStations = areaStationInfo.highComplateRateStations || [];
    const lowComplateRateStations = areaStationInfo.lowComplateRateStations || [];
    const totalLossPowerDesc = areaStationInfo.totalLossPowerDesc || [];
    const scoreStations = areaStationInfo.scoreStations || [];

    return(
      <div className={styles.analysisReport}>
        {dateType === 1 ?
          <div className={styles.monthReportContent}>
            <div className={styles.titleText}>
              <h3>{areaName}-区域电站分析报告({month}月)</h3>
            </div>
            <div className={styles.contentText}>
              <p className={styles.bigText}>
                <span>1、区域内电站平均等效利用小时数为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveEquUsehours, '--', 2, true) || '--'}</span>
                <span>h，平均损失电量等效小时数</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveEquLossPowerhours, '--', 2, true) || '--'}</span>
                <span>h。</span>
              </p>

              <p className={styles.bigText}>
                <span>（1）该区域等效利用小时数最高的三个电站为</span>
                <span className={styles.text}>{highEquUsehourStations.map(e=>e.stationName).join('、')}</span>
                <span>。</span>
              </p>

              <div className={styles.fileBox}>
                <div className={styles.stationName}>
                  <p className={styles.titlesText}>电站名称</p>
                  {highEquUsehourStations.map((e) => (
                    <p>{e.stationName || '--'}</p>
                  ))}
                </div>

                <div className={styles.lossEquivalentHours}>
                  <p className={styles.titlesText}>损失等效小时数</p>
                  {highEquUsehourStations.map((e) => (
                    <p>{dataFormats(e.hours, '--', 2, true) || '--'}</p>
                  ))}
                </div>

                <div className={styles.sunnyDays}>
                  <p className={styles.titlesText}>晴天天数（天）</p>
                  {highEquUsehourStations.map((e) => (
                    <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
                  ))}
                </div>

                <div className={styles.highProportion}>
                  <p className={styles.titlesText}>占比（%）</p>
                  {highEquUsehourStations.map((e) => (
                    <p>{dataFormats(e.proportion, '--', 2, true) || '--'}</p>
                  ))}
                </div>
              </div>

              <div>
                <p className={styles.distanceTop + ' ' + styles.bigText}>
                  <span>（2）该区域等效利用小时数最低的三个电站为</span>
                  <span className={styles.text}>{lowEquUsehourStations.map(e=>e.stationName).join('、')}</span>
                  <span>。原因说明：</span>
                </p>

                <div className={styles.fileBox}>
                  <div className={styles.stationName}>
                    <p className={styles.titlesText}>电站名称</p>
                    {lowEquUsehourStations.map((e) => (
                      <p>{e.stationName || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.lossEquivalentHours}>
                    <p className={styles.titlesText}>损失等效小时数</p>
                    {lowEquUsehourStations.map((e) => (
                      <p>{dataFormats(e.hours, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.sunnyDays}>
                    <p className={styles.titlesText}>晴天天数（天）</p>
                    {lowEquUsehourStations.map((e) => (
                      <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.highProportion}>
                    <p className={styles.titlesText}>占比（%）</p>
                    {lowEquUsehourStations.map((e) => (
                      <p>{dataFormats(e.proportion, '--', 2, true) || '--'}</p>
                    ))}
                  </div>
                </div>

              </div>

              <p className={styles.distanceTop + ' ' + styles.bigText}>
                <span>2、区域内电站平均计划完成率为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveComplateRate, '--', 2, true) || '--'}</span>
                <span>%。</span>
              </p>

              <p className={styles.bigText}>
                <span>（1）该区域计划完成率最高的三个电站为</span>
                <span className={styles.text}>{highComplateRateStations.map(e=>e.stationName).join('、')}</span>
                <span>。原因说明：</span>
              </p>


                <div className={styles.fileBox}>
                  <div className={styles.stationName}>
                    <p className={styles.titlesText}>电站名称</p>
                    {highComplateRateStations.map((e) => (
                      <p>{e.stationName || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.lossEquivalentHours}>
                    <p className={styles.titlesText}>损失电量（损失率）</p>
                    {highComplateRateStations.map((e) => (
                      <p>{dataFormats(e.lossRate, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.sunnyDays}>
                    <p className={styles.titlesText}>晴天天数（天）</p>
                    {highComplateRateStations.map((e) => (
                      <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.highProportion}>
                    <p className={styles.titlesText}>占比（%）</p>
                    {highComplateRateStations.map((e) => (
                      <p>{dataFormats(e.proportion, '--', 2, true) || '--'}</p>
                    ))}
                  </div>
                </div>

              <p className={styles.bigText + ' ' + styles.distanceTop}>
                <span>（2）该区域计划完成率最低的三个电站为</span>
                <span className={styles.text}>{lowComplateRateStations.map(e=>e.stationName).join('、')}</span>
                <span>。原因说明：</span>
              </p>

                <div className={styles.fileBox}>
                  <div className={styles.stationName}>
                    <p className={styles.titlesText}>电站名称</p>
                    {lowComplateRateStations.map((e) => (
                      <p>{e.stationName || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.lossEquivalentHours}>
                    <p className={styles.titlesText}>损失电量（损失率）</p>
                    {lowComplateRateStations.map((e) => (
                      <p>{dataFormats(e.lossRate, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.sunnyDays}>
                    <p className={styles.titlesText}>晴天天数（天）</p>
                    {lowComplateRateStations.map((e) => (
                      <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.highProportion}>
                    <p className={styles.titlesText}>占比（%）</p>
                    {lowComplateRateStations.map((e) => (
                      <p>{dataFormats(e.proportion, '--', 2, true) || '--'}</p>
                    ))}
                  </div>
                </div>

              <p className={styles.distanceTop + ' ' + styles.bigText}>
                <span>3、区域内电站总损失电量为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.totalLossPower,'--',4,true) || '--'}</span>
                <span>万kWh。</span>
                <span className={styles.text}>{areaStationInfo.maxFaultName || '--'}</span>
                <span>（故障系统）占比最高，详细情况说明：</span>
              </p>
              
              <div className={styles.fileBox}>
                <div className={styles.faults}>
                  <p className={styles.titlesText}>故障类型</p>
                  <p>外部故障损失</p>
                  <p>低压直流故障损失</p>
                  <p>变电系统故障损失</p>
                  <p>输电系统故障损失</p>
                  <p>二次及有功无功控制系统故障损失</p>
                  <p>其他故障损失</p>
                </div>

                <div className={styles.electricitys}>
                  <p className={styles.titlesText}>损失电量</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.externalFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.lowVoltageDCFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.transmissionSystemFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.secondaryAndHaveNotPowerFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.otherFaultLostPower, '--', 4, true) || '--'}</p>
                </div>

                <div className={styles.ratios}>
                  <p className={styles.titlesText}>占比（%）</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.externalFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.lowVoltageDCFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.transmissionSystemFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.secondaryAndHaveNotPowerFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.otherFaultProportion, '--', 2, true) || '--'}</p>
                </div>
              </div>

              <p className={styles.distanceTop + ' ' + styles.bigText}>
                <span> 4、区域内电站平均的得分为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveScore, '--', 2, true) || '--'}</span>
                <span>分。</span>
              </p>

              <p className={styles.paragraph + ' ' + styles.bigText}>
                <span>该区域内得分最低5个电站为</span>
                {scoreStations.length > 0 ? <span className={styles.text}>{scoreStations.map(e=>e.stationName).join('、')}</span> : '--'}
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
              <p className={styles.bigText}>
                <span>1、区域内电站平均等效利用小时数为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveEquUsehours, '--', 2, true) || '--'}</span>
                <span>h，平均损失电量等效小时数</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveEquLossPowerhours, '--', 2, true) || '--'}</span>
                <span>h。</span>
              </p>

              <p className={styles.bigText}>
                <span>（1）该区域等效利用小时数最高的三个电站为</span>
                <span className={styles.text}>{highEquUsehourStations.map(e=>e.stationName).join('、')}</span>
                <span>。原因说明：</span>
              </p>

              <div className={styles.fileBox}>
                <div className={styles.stationName}>
                  <p className={styles.titlesText}>电站名称</p>
                  {highEquUsehourStations.map((e) => (
                    <p>{e.stationName || '--'}</p>
                  ))}
                </div>

                <div className={styles.lossEquivalentHours}>
                  <p className={styles.titlesText}>损失等效小时数</p>
                  {highEquUsehourStations.map((e) => (
                    <p>{dataFormats(e.hours, '--', 2, true) || '--'}</p>
                  ))}
                </div>

                <div className={styles.sunnyDays}>
                  <p className={styles.titlesText}>晴天天数（天）</p>
                  {highEquUsehourStations.map((e) => (
                    <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
                  ))}
                </div>

                <div className={styles.highProportion}>
                  <p className={styles.titlesText}>占比（%）</p>
                  {highEquUsehourStations.map((e) => (
                    <p>{dataFormats(e.proportion, '--', 2, true) || '--'}</p>
                  ))}
                </div>
              </div>

              <p className={styles.distanceTop}>
                <span>（2）该区域等效利用小时数最低的三个电站为</span>
                <span className={styles.text}>{lowEquUsehourStations.map(e=>e.stationName).join('、')}</span>
                <span>。原因说明：</span>
              </p>

                <div className={styles.fileBox}>
                  <div className={styles.stationName}>
                    <p className={styles.titlesText}>电站名称</p>
                    {lowEquUsehourStations.map((e) => (
                      <p>{e.stationName || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.lossEquivalentHours}>
                    <p className={styles.titlesText}>损失等效小时数</p>
                    {lowEquUsehourStations.map((e) => (
                      <p>{dataFormats(e.hours, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.sunnyDays}>
                    <p className={styles.titlesText}>晴天天数（天）</p>
                    {lowEquUsehourStations.map((e) => (
                      <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.highProportion}>
                    <p className={styles.titlesText}>占比（%）</p>
                    {lowEquUsehourStations.map((e) => (
                      <p>{dataFormats(e.proportion, '--', 2, true) || '--'}</p>
                    ))}
                  </div>
                </div>

              <p className={styles.distanceTop + ' ' + styles.bigText}>
                <span>2、区域内电站平均计划完成率为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveComplateRate,'--',2,true) || '--'}</span>
                <span>%。</span>
              </p>

              <p className={styles.bigText}>
                <span>（1）该区域计划完成率最高的三个电站为</span>
                <span className={styles.text}>{highComplateRateStations.map(e=>e.stationName).join('、')}</span>
                <span>。原因说明：</span>
              </p>

                <div className={styles.fileBox}>
                  <div className={styles.stationName}>
                    <p className={styles.titlesText}>电站名称</p>
                    {highComplateRateStations.map((e) => (
                      <p>{e.stationName || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.lossEquivalentHours}>
                    <p className={styles.titlesText}>损失电量（损失率）</p>
                    {highComplateRateStations.map((e) => (
                      <p>{dataFormats(e.lossRate, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.sunnyDays}>
                    <p className={styles.titlesText}>晴天天数（天）</p>
                    {highComplateRateStations.map((e) => (
                      <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.highProportion}>
                    <p className={styles.titlesText}>占比（%）</p>
                    {highComplateRateStations.map((e) => (
                      <p>{dataFormats(e.proportion, '--', 2, true) || '--'}</p>
                    ))}
                  </div>
                </div>

              <p className={styles.distanceTop}>
                <span>（2）该区域计划完成率最低的三个电站为</span>
                <span className={styles.text}>{lowComplateRateStations.map(e=>e.stationName).join('、')}</span>
                <span>。原因说明：</span>
              </p>

                <div className={styles.fileBox}>
                  <div className={styles.stationName}>
                    <p className={styles.titlesText}>电站名称</p>
                    {lowComplateRateStations.map((e) => (
                      <p>{e.stationName || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.lossEquivalentHours}>
                    <p className={styles.titlesText}>损失电量（损失率）</p>
                    {lowComplateRateStations.map((e) => (
                      <p>{dataFormats(e.lossRate, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.sunnyDays}>
                    <p className={styles.titlesText}>晴天天数（天）</p>
                    {lowComplateRateStations.map((e) => (
                      <p>{dataFormats(e.sunnyDays, '--', 2, true) || '--'}</p>
                    ))}
                  </div>

                  <div className={styles.highProportion}>
                    <p className={styles.titlesText}>占比（%）</p>
                    {lowComplateRateStations.map((e) => (
                      <p>{dataFormats(e.proportion, '--', 2, true) || '--'}</p>
                    ))}
                  </div>
                </div>

              <p className={styles.distanceTop + ' ' + styles.bigText}>
                <span>3、区域内电站总损失电量为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.totalLossPower,'--',4,true) || '--'}</span>
                <span>万kWh。</span>
                <span className={styles.text}>{areaStationInfo.maxFaultName || '--'}</span>
                <span>（故障系统）占比最高。详细情况说明：</span>
              </p>

              <div className={styles.fileBox}>
                <div className={styles.faults}>
                  <p className={styles.titlesText}>故障类型</p>
                  <p>外部故障损失</p>
                  <p>低压直流故障损失</p>
                  <p>变电系统故障损失</p>
                  <p>输电系统故障损失</p>
                  <p>二次及有功无功控制系统故障损失</p>
                  <p>其他故障损失</p>
                </div>

                <div className={styles.electricitys}>
                  <p className={styles.titlesText}>损失电量</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.externalFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.lowVoltageDCFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.transmissionSystemFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.secondaryAndHaveNotPowerFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.otherFaultLostPower, '--', 4, true) || '--'}</p>
                </div>

                <div className={styles.ratios}>
                  <p className={styles.titlesText}>占比（%）</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.externalFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.lowVoltageDCFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.substationSystemFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.transmissionSystemFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.secondaryAndHaveNotPowerFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(totalLossPowerDesc.otherFaultProportion, '--', 2, true) || '--'}</p>
                </div>
              </div>

              <p className={styles.distanceTop + ' ' + styles.bigText}>
                <span> 4、区域内电站平均的得分为</span>
                <span className={styles.text}>{dataFormats(areaStationInfo.aveScore,'--',2,true) || '--'}</span>
                <span>分。</span>
              </p>

              <p className={styles.paragraph + ' ' + styles.bigText}>
                <span>该区域内得分最低5个电站为</span>
                {!scoreStations ? <span className={styles.text}>{scoreStations.map(e=>e.stationName).join('、')}</span> : '--'}
                <span>。</span>
              </p>

              <ScoreStations scoreStations={scoreStations} />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default AreaStationReport;