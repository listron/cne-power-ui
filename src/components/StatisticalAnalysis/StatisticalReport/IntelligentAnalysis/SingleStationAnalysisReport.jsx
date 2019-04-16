import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { dataFormats } from '../../../../utils/utilFunc';

class SingleStationAnalysisReport extends Component{

  static propTypes = {
    stationName: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string,
    dateType: PropTypes.number,
    generatinCapacity: PropTypes.object,
    systematicStatistics: PropTypes.object,
    completionRate: PropTypes.object,
    lossOfElectricity: PropTypes.object,
  };

  constructor(props){
    super(props);
  }

  render(){
    const { selectStationCode, stations, dateType, yearTime, monthTime, generatinCapacity, systematicStatistics, completionRate, lossOfElectricity } = this.props;
    let checkedStationCode = stations.filter((e,i) => e.stationCode === selectStationCode);
    const checkedStationInfo = checkedStationCode[0]; 
    const checkedStationName = checkedStationInfo && checkedStationInfo.stationName;

    const {  genValid, genValidCompared, resourceValueCompared, lostPowerCompared, limitPowerRate, limitPowerRateCompared } = generatinCapacity; // 累计发电量信息及原因
    const generatinMonth = generatinCapacity.month;

    const { prs, pr, lostPower } = systematicStatistics; // 年系统效率(PR)信息及原因(仅年查询此项)
    const bMonth = systematicStatistics.month;

    const { planComplateRate, monthPlanComplateRate, limitPowerCompared } = completionRate; // 发电完成率信息及原因
    const cMonth = completionRate.month;
    const cResourceValueCompared = completionRate.resourceValueCompared;
    const cLostPowerCompared = completionRate.lostPowerCompared;
    const cLimitPowerRate = completionRate.limitPowerRate;

    const { lowVoltageDCFaultLostPower, lowVoltageDCFaultProportion, lowVoltageDCFaultCompared, substationSystemFaultLostPower, substationSystemFaultProportion, substationSystemFaultCompared, transmissionSystemFaultLostPower, transmissionSystemFaultProportion, transmissionSystemFaultCompared, secondaryAndHaveNotPowerFaultLostPower, secondaryAndHaveNotPowerFaultProportion, secondaryAndHaveNotPowerFaultCompared, otherFaultLostPower, otherFaultProportion, otherFaultCompared, externalFaultLostPower, externalFaultProportion, externalFaultCompared } = lossOfElectricity; // 损失电量信息及原因
    const dMonth = lossOfElectricity.month;
    const dLostPowerCompared = lossOfElectricity.lostPowerCompared;
    return(
      <div className={styles.analysisReport}>
      {dateType === 1 ? 
        <div className={styles.monthReportContent}>
          <div className={styles.titleText}>
            <h3>{ checkedStationName }电站分析报告({ monthTime }月)</h3>
          </div>
          <div className={styles.contentText}>

            <p>
              <span>1、今年</span>
              <span className={styles.time}>{generatinMonth || '--'}</span>
              <span>月份的发电量为</span>
              <span className={styles.text}>{dataFormats(genValid,'--',4,true) || '--'}</span>
              <span>万kWh，同比降低/提高</span>
              <span className={styles.text}>{dataFormats(genValidCompared,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>
 
             <p className={styles.paragraph}>
              <span>其原因在于：该月辐照度同比降低/提高</span>
              <span className={styles.text}>{dataFormats(resourceValueCompared,'--',2,true) || '--'}</span>
              <span>%；损失电量同比提高/降低</span>
              <span className={styles.text}>{dataFormats(lostPowerCompared,'--',2,true) || '--'}</span>
              <span>%。</span>
              {(limitPowerRate === 0 || '') && 
                <span>
                  <span>限电率</span>
                  <span className={styles.text}>{dataFormats(limitPowerRate,'--',2,true) || '--'}</span>
                  <span>同比提高/降低</span>
                  <span className={styles.text}>{dataFormats(limitPowerRateCompared,'--',2,true) || '--'}</span>
                  <span>%。</span> 
                </span>
              }
            </p>

            <p>
              <span>2、今年</span>
              <span className={styles.text}>{cMonth || '--'}</span>
              <span>月份的计划完成率为</span>
              <span className={styles.text}>{dataFormats(planComplateRate,'--',2,true) || '--'}</span>
              <span>%。</span>
            </p>

            {(95 < planComplateRate && 105 > planComplateRate) &&  <p className={styles.paragraph}>
              <span className={styles.dotted}>该电站未完成计划/超出计划的主要原因在于：实际辐照度比历史辐照度低/高</span>
              <span className={styles.text + ' ' + styles.dotted}>{dataFormats(cResourceValueCompared,'--',2,true) || '--'}</span>
              <span className={styles.dotted}>%，损失电量同比提高/降低</span>
              <span className={styles.text + ' ' + styles.dotted}>{dataFormats(cLostPowerCompared,'--',2,true) || '--'}</span>
              <span className={styles.dotted}>%，限电损失电量同比提高/降低</span>
              <span className={styles.text + ' ' + styles.dotted}>{dataFormats(cLimitPowerRate,'--',2,true) || '--'}</span>
              <span className={styles.dotted}>%。</span>
            </p> 
             }

            <p>
              <span>3、今年</span>
              <span className={styles.text}>{dMonth || '--'}</span>
              <span>月份的故障损失电量同比提高/降低</span>
              <span className={styles.text}>{dataFormats(dLostPowerCompared,'--',2,true) || '--'}</span>
              <span>%。</span> 
            </p>

            <p className={styles.paragraph}>详细情况说明：</p>

            <p className={styles.paragraph}>
              <span>1）外部故障损失电量为</span>
              <span className={styles.text}>{dataFormats(externalFaultLostPower,'--',4,true,) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(externalFaultProportion,'--',2,true) || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{dataFormats(externalFaultCompared,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>2,true）低压直流故障损失电量为</span>
              <span className={styles.text}>{dataFormats(lowVoltageDCFaultLostPower,'--',4,true,) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(lowVoltageDCFaultProportion,'--',2,true) || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{dataFormats(lowVoltageDCFaultCompared,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>3）变电系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(substationSystemFaultLostPower,'--',4,true,) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(substationSystemFaultProportion,'--',2,true) || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{dataFormats(substationSystemFaultCompared,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>4,true,）输电系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(transmissionSystemFaultLostPower,'--',4,true,) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(transmissionSystemFaultProportion,'--',2,true) || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{dataFormats(transmissionSystemFaultCompared,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>5）二次及有功无功控制系统故障损失电量为</span>
              <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultLostPower,'--',4,true,) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultProportion,'--',2,true) || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultCompared,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>6）其他故障损失电量为</span>
              <span className={styles.text}>{dataFormats(otherFaultLostPower,'--',4,true,) || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{dataFormats(otherFaultProportion,'--',2,true) || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{dataFormats(otherFaultCompared,'--',2,true) || '--'}</span>
              <span>%；</span>
            </p>
            
          </div>
        </div>
           : 
          <div className={styles.yearReportContent}>
            <div className={styles.titleText}>
            <h3>{ checkedStationName }电站分析报告({ yearTime }年)</h3>
            </div>
            <div className={styles.contentText}>

              <p>
                <span>1、今年累计发电量为</span>
                <span className={styles.text}>{dataFormats(genValid,'--',4,true,) || '--'}</span>
                <span>万kWh，环比降低/提高</span>
                <span className={styles.text}>{dataFormats(genValidCompared,'--',2,true) || '--'}</span>
                <span>%。其原因在于：该年辐照度环比降低/提高</span>
                <span className={styles.text}>{dataFormats(resourceValueCompared,'--',2,true) || '--'}</span>
                <span>%；损失电量环比提高/降低</span>
                <span className={styles.text}>{dataFormats(lostPowerCompared,'--',2,true) || '--'}</span>
                <span>%；限电率环比提高/降低</span>
                <span className={styles.text}>{dataFormats(limitPowerRateCompared,'--',2,true) || '--'}</span>
                <span>%。</span>
              </p>

              <p>
                2,true、年系统效率为
                <span className={styles.text}>{dataFormats(prs,'--',2,true) || '--'}</span>
                <span> %，其中</span>
                <span className={styles.text}>{bMonth || '--' }</span>
                <span>月份的系统效率最低，为</span>
                <span className={styles.text}>{dataFormats(pr,'--',2,true) || '--'}</span>
                <span>%。原因为：该月份损失电量最高，为</span>
                <span className={styles.text}>{dataFormats(lostPower,'--',4,true,) || '--'}</span>
                <span>万kWh；限电率最高。</span>
              </p>

              <p>
                <span>3、年发电计划完成率为</span>
                <span className={styles.text}>{dataFormats(planComplateRate,'--',2,true) || '--'}</span>
                <span>%。其中</span>
                <span className={styles.text}>{dMonth || '--'}</span>
                <span>月份的计划完成率最低，为</span>
                <span className={styles.text}>{dataFormats(monthPlanComplateRate,'--',2,true) || '--'}</span>
                <span>%。原因为：年实际辐照度比历史辐照度低</span>
                <span className={styles.text}>{dataFormats(cResourceValueCompared,'--',2,true) || '--'}</span>
                <span>%；年损失电量环比提高 </span>
                <span className={styles.text}>{dataFormats(cLostPowerCompared,'--',2,true) || ''}</span>
                <span>%；年限电率环比提高</span>
                <span className={styles.text}>{dataFormats(limitPowerCompared,'--',2,true) || ''}</span>
                <span>%。</span>
              </p>

              <p>
                <span>4,true,、年总损失电量环比提高/降低</span>
                <span className={styles.text}>{dataFormats(dLostPowerCompared,'--',2,true) || '--'}</span>
                <span>%。详细情况说明：</span>
              </p>

              <p>
                <span>1)	外部故障损失电量为</span>
                <span className={styles.text}>{dataFormats(externalFaultLostPower,'--',4,true,) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(externalFaultProportion,'--',2,true) || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{dataFormats(externalFaultCompared,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>2,true)	低压直流故障损失电量为</span>
                <span className={styles.text}>{dataFormats(lowVoltageDCFaultLostPower,'--',4,true,) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(lowVoltageDCFaultProportion,'--',2,true) || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{dataFormats(lowVoltageDCFaultCompared,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>3)	变电系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(substationSystemFaultLostPower,'--',4,true,) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(substationSystemFaultProportion,'--',2,true) || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{dataFormats(substationSystemFaultCompared,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>4,true,)	输电系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(transmissionSystemFaultLostPower,'--',4,true,) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(transmissionSystemFaultProportion,'--',2,true) || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{dataFormats(transmissionSystemFaultCompared,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>5)	二次及有功无功控制系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultLostPower,'--',4,true,) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultProportion,'--',2,true) || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultCompared,'--',2,true) || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>6)	其他故障损失电量为</span>
                <span className={styles.text}>{dataFormats(otherFaultLostPower,'--',4,true,) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(otherFaultProportion,'--',2,true) || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{dataFormats(otherFaultCompared,'--',2,true) || '--'}</span>
                <span>%。</span>
              </p>

            </div>
          </div>
          }
      </div>
    )
  }
}

export default SingleStationAnalysisReport;