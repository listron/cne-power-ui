import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { GenRegionDataList, LostRegionDataList } from './Areafun';
import { dataFormats } from '../../../../utils/utilFunc';


class AreaAnalysisReport extends Component{

  static propTypes = {
    dateType: PropTypes.number,
    month: PropTypes.string,
    year: PropTypes.string,
    areaInfo: PropTypes.object,
  };

  render(){
    const { dateType, month, year, areaInfo} = this.props;

    const enterpriseGenData = areaInfo.enterpriseGenData || {}; // 集团计划完成率
    const genRegionNameList = enterpriseGenData.regionNameList || []; // 计划完成率低的三个区域名称
    const genRegionDataList = enterpriseGenData.regionDataList || []; // 计划完成率低的区域详情
    const enterpriseHoursData = areaInfo.enterpriseHoursData || {}; // 集团损失电量等效时数据
    const lostRegionNameList = enterpriseHoursData.regionNameList || [];
    const lostRegionDataList = enterpriseHoursData.regionDataList || [];

    return(
      <div className={styles.analysisReport}>
        {dateType === 1 ?
          <div className={styles.monthReportContent}>
            <div className={styles.titleText}>
              <h3>集团区域对比分析({month}月)</h3>
            </div>
            <div className={styles.contentText}>
              <p className={styles.bigText}>
                <span>1、集团电站平均计划完成率为</span>
                <span className={styles.text}>{dataFormats(enterpriseGenData.rate,'--',2,true) || '--'}</span>
                <span>%。</span>
              </p>

              <p className={styles.bigText}>
                <span>计划完成率最低的三个区域为</span>
                <span className={styles.text}>{genRegionNameList.map(e => e).join('、')}</span>
                <span>。</span>
              </p>

              <GenRegionDataList genRegionDataList={genRegionDataList} />

              <p className={styles.bigText}>
                <span>2、集团电站总损失电量等效时为</span>
                <span className={styles.text}>{dataFormats(enterpriseHoursData.value,'--',2,true) || '--'}</span>
                <span>h。</span>
              </p>

              <p className={styles.paragraph + ' ' + styles.bigText}>
                <span>损失电量等效时最高的三个区域为</span>
                <span className={styles.text}>{lostRegionNameList.map(e => e).join('、')}</span>
                <span>。</span>
              </p>

              <LostRegionDataList lostRegionDataList={lostRegionDataList} />
            </div>
          </div>
          :
          <div className={styles.yearReportContent}>
            <div className={styles.titleText}>
              <h3>集团区域对比分析({year}年)</h3>
            </div>
            <div className={styles.contentText}>
              <p>
                <span>1、集团电站平均计划完成率为</span>
                <span className={styles.text}>{dataFormats(enterpriseGenData.rate,'--',2,true) || '--'}</span>
                <span>%。</span>
              </p>

              <p className={styles.paragraph}>
                <span>计划完成率最低的三个区域为</span>
                <span className={styles.text}>{genRegionNameList.map(e => e).join('、')}</span>
                <span>。</span>
              </p>

              <GenRegionDataList genRegionDataList={genRegionDataList} />

              <p>
                <span>2、集团电站总损失电量等效时为</span>
                <span className={styles.text}>{dataFormats(enterpriseHoursData.value,'--',2,true) || '--'}</span>
                <span>h。</span>
              </p>

              <p className={styles.paragraph}>
                <span>损失电量等效时最高的三个区域为</span>
                <span className={styles.text}>{lostRegionNameList.map(e => e).join('、')}</span>
                <span>。</span>
              </p>

              <LostRegionDataList lostRegionDataList={lostRegionDataList} />
            </div>
          </div>
        }
      </div>
    )
  }
}

export default AreaAnalysisReport;