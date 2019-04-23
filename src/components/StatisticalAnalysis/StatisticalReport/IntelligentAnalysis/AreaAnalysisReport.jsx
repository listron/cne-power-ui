import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { dataFormats } from '../../../../utils/utilFunc';

class AreaAnalysisReport extends Component{

  static propTypes = {
    dateType: PropTypes.number,
    monthTime: PropTypes.string,
    yearTime: PropTypes.string,
    dataType: PropTypes.string,
    areaInfo:PropTypes.object
  };

  render(){
    const { dateType, areaInfo, month, year,} = this.props;

    const enterpriseGenData = areaInfo.enterpriseGenData || {}; // 集团计划完成率
    const rate = enterpriseGenData.rate || ''; // 集团计划完成率
    const genRegionNameList = enterpriseGenData.regionNameList || []; // 计划完成率低的三个区域名称
    const genRegionDataList = enterpriseGenData.regionDataList || []; // 计划完成率低的区域详情

    const enterpriseHoursData = areaInfo.enterpriseHoursData || {}; // 集团损失电量等效时数据
    const lostValue = enterpriseHoursData.value || '';
    const lostRegionNameList = enterpriseHoursData.regionNameList || [];
    const lostRegionDataList = enterpriseHoursData.regionDataList || [];

    return(
      <div className={styles.analysisReport}>
      {dateType === 1 ? 
        <div className={styles.monthReportContent}>
          <div className={styles.titleText}>
            <h3>区域对比分析({month}月)</h3>
          </div>

          <div className={styles.contentText}>
            <p>
              <span>1、集团电站平均计划完成率为</span>
              <span className={styles.text}>{dataFormats(rate,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>

            <p className={styles.paragraph}>
              <span>计划完成率最低的三个区域为</span>
              {
                genRegionNameList.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>
            {
              genRegionDataList.map(e => (
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
              ))
            }

          <p>
            <span>2、集团电站总损失电量等效时为</span>
            <span className={styles.text}>{dataFormats(lostValue,'--',2,true) || '--'}</span>
            <span>h。</span>
          </p>
            <p className={styles.paragraph}>
              <span>损失电量等效时最高的三个区域为</span>
              {
                lostRegionNameList.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>
              <p className={styles.paragraph}>
                {lostRegionDataList.map(e => (
                  <p>
                    <p>
                      <span className={styles.text}>{e.regionName || '--'}</span>
                      <span>区域故障损失分类：</span>
                    </p>
                
                    <p className={styles.distanceBottom}>
                      <p>
                            <span>1)	外部故障损失电量等效时为</span>
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
                            <span>2)	低压直流故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.lowVoltageLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.lowVoltageLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                      <p>
                            <span>3)	变电系统故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.substationLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.substationLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                      <p>
                            <span>4)	输电系统故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.outPutLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.outPutLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                      <p>
                            <span>5)	二次及有功无功控制系统故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.twiceLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.twiceLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                      <p>
                            <span>6)	其他故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.otherLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.otherLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                    </p>
                  </p>
                ))}
              </p>
          </div>
        </div>
        : 
        <div className={styles.yearReportContent}>
        <div className={styles.titleText}>
          <h3>区域对比分析({year}年)</h3>
        </div>

        <div className={styles.contentText}>
            <p>
              <span>1、集团电站平均计划完成率为</span>
              <span className={styles.text}>{dataFormats(rate,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>

            <p className={styles.paragraph}>
              <span>计划完成率最低的三个区域为</span>
              {
                genRegionNameList.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>
            {
              genRegionDataList.map(e => (
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
              ))
            }

          <p>
            <span>2、集团电站总损失电量等效时为</span>
            <span className={styles.text}>{dataFormats(lostValue,'--',2,true) || '--'}</span>
            <span>h。</span>
          </p>
            <p className={styles.paragraph}>
              <span>损失电量等效时最高的三个区域为</span>
              {
                lostRegionNameList.map((e,i) => {
                  if(i === 0){
                    return(
                      <span className={styles.text}>{e || '--'}</span>
                    )
                  }else{
                    return (
                      <span>
                        <span>、</span>
                        <span className={styles.text}>{e || '--'}</span>
                      </span>
                    )
                  }
                })
              }
              <span>。</span>
            </p>
              <p className={styles.paragraph}>
                {lostRegionDataList.map(e => (
                  <p>
                    <p>
                      <span className={styles.text}>{e.regionName || '--'}</span>
                      <span>区域故障损失分类：</span>
                    </p>
                
                    <p className={styles.distanceBottom}>
                      <p>
                            <span>1)	外部故障损失电量等效时为</span>
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
                            <span>2)	低压直流故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.lowVoltageLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.lowVoltageLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                      <p>
                            <span>3)	变电系统故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.substationLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.substationLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                      <p>
                            <span>4)	输电系统故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.outPutLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.outPutLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                      <p>
                            <span>5)	二次及有功无功控制系统故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.twiceLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.twiceLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                      <p>
                            <span>6)	其他故障损失电量等效时为</span>
                            <span className={styles.text}>{dataFormats(e.faultData.otherLostHours,'--',2,true) || '--'}</span>
                            <span>h，占比</span>
                            <span className={styles.text}>{dataFormats(e.faultData.otherLostHoursRate,'--',2,true) || '--'}；</span>
                          </p>
                    </p>
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

export default AreaAnalysisReport;