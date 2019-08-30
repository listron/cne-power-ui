import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { dataFormats } from '../../../../utils/utilFunc';

class SingleStationAnalysisReport extends Component {

  static propTypes = {
    stationName: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string,
    dateType: PropTypes.number,
    generatinCapacity: PropTypes.object,
    systematicStatistics: PropTypes.object,
    completionRate: PropTypes.object,
    lossOfElectricity: PropTypes.object,
    selectStationCode: PropTypes.number,
    stations: PropTypes.array,
    singleStationInfo: PropTypes.object,
  };

  render() {
    const { dateType, year, month, singleStationInfo, stationName, theme } = this.props;

    const generatinCapacity = singleStationInfo.generatinCapacity || []; // 累计发电量信息及原因
    const systematicStatistics = singleStationInfo.systematicStatistics || []; // 年系统效率(PR)信息及原因(仅年查询此项)
    const completionRate = singleStationInfo.completionRate || []; // 发电完成率信息及原因
    const lossOfElectricity = singleStationInfo.lossOfElectricity || []; // 损失电量信息及原因

    const { genValid, genValidCompared, resourceValueCompared, lostPowerCompared, limitPowerRate, limitPowerRateCompared } = generatinCapacity;
    const generatinMonth = generatinCapacity.month;

    const { prs, pr, lostPower } = systematicStatistics;
    const bMonth = systematicStatistics.month;

    const { planComplateRate, monthPlanComplateRate, limitPowerCompared } = completionRate;

    const cMonth = completionRate.month;
    const cResourceValueCompared = completionRate.resourceValueCompared;
    const cLostPowerCompared = completionRate.lostPowerCompared;
    const cLimitPowerRate = completionRate.limitPowerRate;

    const dMonth = lossOfElectricity.month;
    const dLostPowerCompared = lossOfElectricity.lostPowerCompared;

    const { lowVoltageDCFaultLostPower, lowVoltageDCFaultProportion, lowVoltageDCFaultCompared, substationSystemFaultLostPower, substationSystemFaultProportion, substationSystemFaultCompared, transmissionSystemFaultLostPower, transmissionSystemFaultProportion, transmissionSystemFaultCompared, secondaryAndHaveNotPowerFaultLostPower, secondaryAndHaveNotPowerFaultProportion, secondaryAndHaveNotPowerFaultCompared, otherFaultLostPower, otherFaultProportion, otherFaultCompared, externalFaultLostPower, externalFaultProportion, externalFaultCompared } = lossOfElectricity;

    return (
      <div className={`${styles.analysisReport}`}>
        {dateType === 1 ?
          <div className={styles.monthReportContent}>
            <div className={styles.titleText}>
              <h3>{stationName}电站分析报告({month}月)</h3>
            </div>
            <div className={styles.contentText}>
              <p>
                <span>1、今年</span>
                <span className={styles.time}>{generatinMonth || '--'}</span>
                <span>月份的发电量为</span>
                <span className={styles.text}>{dataFormats(genValid, '--', 4, true) || '--'}</span>
                <span>万kWh，同比</span>
                {(genValidCompared >= 0) && <span>提高</span>}
                {(genValidCompared < 0) && <span>降低</span>}
                <span className={styles.text}>{dataFormats(Math.abs(genValidCompared), '--', 2, true) || '--'}</span>
                <span>%。</span>
              </p>

              <p className={styles.paragraph}>
                <span>其原因在于：该月辐照度同比</span>
                {(resourceValueCompared >= 0) && <span>提高</span>}
                {(resourceValueCompared < 0) && <span>降低</span>}
                <span className={styles.text}>{dataFormats(Math.abs(resourceValueCompared), '--', 2, true) || '--'}</span>
                <span>%；损失电量同比</span>
                {(lostPowerCompared >= 0) && <span>提高</span>}
                {(lostPowerCompared < 0) && <span>降低</span>}
                <span className={styles.text}>{dataFormats(Math.abs(lostPowerCompared), '--', 2, true) || '--'}</span>
                <span>%。</span>
                {(limitPowerRate || limitPowerRate === 0) &&
                  <span>
                    <span>限电率</span>
                    <span className={styles.text}>{dataFormats(limitPowerRate, '--', 2, true) || '--'}</span>
                    <span>%，同比</span>
                    {(limitPowerRateCompared >= 0) && <span>提高</span>}
                    {(limitPowerRateCompared < 0) && <span>降低</span>}
                    <span className={styles.text}>{dataFormats(Math.abs(limitPowerRateCompared), '--', 2, true) || '--'}</span>
                    <span>%。</span>
                  </span>
                }
              </p>

              <p className={styles.distanceTop}>
                <span>2、今年</span>
                <span className={styles.text}>{cMonth || '--'}</span>
                <span>月份的计划完成率为</span>
                <span className={styles.text}>{dataFormats(planComplateRate, '--', 2, true) || '--'}</span>
                <span>%。</span>
              </p>

              {(!(95 < planComplateRate && 105 > planComplateRate)) &&
                <p className={styles.paragraph}>
                  <span>该电站
                    {(95 > planComplateRate) && <span>未完成计划</span>}
                    {(105 < planComplateRate) && <span>超出计划</span>}
                    的主要原因在于：实际辐照度比历史辐照度</span>
                  {(cResourceValueCompared >= 0) && <span>高</span>}
                  {(cResourceValueCompared < 0) && <span>低</span>}
                  <span className={styles.text}>{dataFormats(Math.abs(cResourceValueCompared), '--', 2, true) || '--'}</span>
                  <span>%，损失电量同比</span>
                  {(cLostPowerCompared >= 0) && <span>提高</span>}
                  {(cLostPowerCompared < 0) && <span>降低</span>}
                  <span className={styles.text}>{dataFormats(Math.abs(cLostPowerCompared), '--', 2, true) || '--'}</span>
                  <span>%；</span>
                  {(limitPowerRate || limitPowerRate === 0) &&
                    <span>
                      <span>限电损失电量同比</span>
                      {(cLimitPowerRate >= 0) && <span>提高</span>}
                      {(cLimitPowerRate < 0) && <span>降低</span>}
                      <span className={styles.text}>{dataFormats(Math.abs(cLimitPowerRate), '--', 2, true) || '--'}</span>
                      <span>%。</span>
                    </span>
                  }
                </p>
              }

              <p className={styles.distanceTop}>
                <span>3、今年</span>
                <span className={styles.text}>{dMonth || '--'}</span>
                <span>月份的故障损失电量同比</span>
                {(dLostPowerCompared >= 0) && <span>提高</span>}
                {(dLostPowerCompared < 0) && <span>降低</span>}
                <span className={styles.text}>{dataFormats(Math.abs(dLostPowerCompared), '--', 2, true) || '--'}</span>
                <span>%。</span>
              </p>

              <p className={styles.paragraph}>详细情况说明：</p>

              <p className={styles.paragraph}>
                <span>1）外部故障损失电量为</span>
                <span className={styles.text}>{dataFormats(externalFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(externalFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(externalFaultCompared >= 0) && <span>提高</span>}
                {(externalFaultCompared < 0) && <span>降低</span>}
                {!externalFaultCompared ? <span className={styles.text}>{dataFormats(externalFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(externalFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>2）低压直流故障损失电量为</span>
                <span className={styles.text}>{dataFormats(lowVoltageDCFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(lowVoltageDCFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(lowVoltageDCFaultCompared >= 0) && <span>提高</span>}
                {(lowVoltageDCFaultCompared < 0) && <span>降低</span>}
                {!lowVoltageDCFaultCompared ? <span className={styles.text}>{dataFormats(lowVoltageDCFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(lowVoltageDCFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>3）变电系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(substationSystemFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(substationSystemFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(substationSystemFaultCompared >= 0) && <span>提高</span>}
                {(substationSystemFaultCompared < 0) && <span>降低</span>}
                {!substationSystemFaultCompared ? <span className={styles.text}>{dataFormats(substationSystemFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(substationSystemFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>4）输电系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(transmissionSystemFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(transmissionSystemFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(transmissionSystemFaultCompared >= 0) && <span>提高</span>}
                {(transmissionSystemFaultCompared < 0) && <span>降低</span>}
                {!transmissionSystemFaultCompared ? <span className={styles.text}>{dataFormats(transmissionSystemFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(transmissionSystemFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>5）二次及有功无功控制系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(secondaryAndHaveNotPowerFaultCompared >= 0) && <span>提高</span>}
                {(secondaryAndHaveNotPowerFaultCompared < 0) && <span>降低</span>}
                {!secondaryAndHaveNotPowerFaultCompared ? <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(secondaryAndHaveNotPowerFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>6）其他故障损失电量为</span>
                <span className={styles.text}>{dataFormats(otherFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(otherFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(otherFaultCompared >= 0) && <span>提高</span>}
                {(otherFaultCompared < 0) && <span>降低</span>}
                {!otherFaultCompared ? <span className={styles.text}>{dataFormats(otherFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(otherFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%。</span>
              </p>
            </div>
          </div>
          :
          <div className={styles.yearReportContent}>
            <div className={styles.titleText}>
              <h3>{stationName}电站分析报告({year}年)</h3>
            </div>
            <div className={styles.contentText}>
              <p>
                <span>1、今年累计发电量为</span>
                <span className={styles.text}>{dataFormats(genValid, '--', 4, true) || '--'}</span>
                <span>万kWh，环比</span>
                {(genValidCompared >= 0) && <span>提高</span>}
                {(genValidCompared < 0) && <span>降低</span>}
                <span className={styles.text}>{dataFormats(Math.abs(genValidCompared), '--', 2, true) || '--'}</span>
                <span>%。</span>
              </p>
              <p className={styles.paragraph}>
                <span>其原因在于：该年辐照度环比</span>
                {(resourceValueCompared >= 0) && <span>提高</span>}
                {(resourceValueCompared < 0) && <span>降低</span>}
                {!resourceValueCompared ? <span className={styles.text}>{dataFormats(resourceValueCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(resourceValueCompared), '--', 2, true) || '--'}</span>}
                <span>%；损失电量环比</span>
                {(lostPowerCompared >= 0) && <span>提高</span>}
                {(lostPowerCompared < 0) && <span>降低</span>}
                {!lostPowerCompared ? <span className={styles.text}>{dataFormats(lostPowerCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(lostPowerCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
                {(limitPowerRateCompared || (limitPowerRateCompared === 0)) &&
                  <span>
                    <span>限电率环比</span>
                    {(limitPowerRateCompared >= 0) && <span>提高</span>}
                    {(limitPowerRateCompared < 0) && <span>降低</span>}
                    {!limitPowerRateCompared ? <span className={styles.text}>{dataFormats(limitPowerRateCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(limitPowerRateCompared), '--', 2, true) || '--'}</span>}
                    <span>%。</span>
                  </span>
                }
              </p>

              <p className={styles.distanceTop}>
                <span>2、年系统效率为</span>
                <span className={styles.text}>{dataFormats(prs, '--', 2, true) || '--'}</span>
                <span> %，其中</span>
                <span className={styles.text}>{bMonth || '--'}</span>
                <span>月份的系统效率最低，为</span>
                <span className={styles.text}>{dataFormats(pr, '--', 2, true) || '--'}</span>
                <span>%。</span>
              </p>
              <p className={styles.paragraph}>
                <span>原因为：该月份故障损失电量和限电损失电量总和最高，为</span>
                <span className={styles.text}>{dataFormats(lostPower, '--', 4, true) || '--'}</span>
                <span>万kWh。</span>
              </p>

              <p className={styles.distanceTop}>
                <span>3、年发电计划完成率为</span>
                <span className={styles.text}>{dataFormats(planComplateRate, '--', 2, true) || '--'}</span>
                <span>%。其中</span>
                <span className={styles.text}>{cMonth || '--'}</span>
                <span>月份的计划完成率最低，为</span>
                <span className={styles.text}>{dataFormats(monthPlanComplateRate, '--', 2, true) || '--'}</span>
                <span>%。</span>
              </p>
              <p className={styles.paragraph}>
                {((cResourceValueCompared > 0) || (cLostPowerCompared > 0) || (limitPowerCompared > 0)) && <span>原因为：</span>}
                {(cResourceValueCompared > 0) &&
                  <span>
                    <span>年实际辐照度比历史辐照度低</span>
                    <span className={styles.text}>{dataFormats(cResourceValueCompared, '--', 2, true) || '--'}</span>
                    <span>%；</span>
                  </span>}
                {(cLostPowerCompared > 0) &&
                  <span>
                    <span>年损失电量环比提高</span>
                    <span className={styles.text}>{dataFormats(cLostPowerCompared, '--', 2, true) || '--'}</span>
                    <span>%；</span>
                  </span>}
                {(limitPowerCompared && (limitPowerCompared > 0)) &&
                  <span>
                    <span>年限电率环比提高</span>
                    <span className={styles.text}>{dataFormats(limitPowerCompared, '--', 2, true) || '--'}</span>
                    <span>%；</span>
                  </span>}
              </p>

              <p className={styles.distanceTop}>
                <span>4、年总损失电量环比</span>
                {(dLostPowerCompared >= 0) && <span>提高</span>}
                {(dLostPowerCompared < 0) && <span>降低</span>}
                <span className={styles.text}>{dataFormats(Math.abs(dLostPowerCompared), '--', 2, true) || '--'}</span>
                <span>%</span>
              </p>

              <p className={styles.paragraph}>详细情况说明：</p>

              <p className={styles.paragraph}>
                <span>1）外部故障损失电量为</span>
                <span className={styles.text}>{dataFormats(externalFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(externalFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(externalFaultCompared >= 0) && <span>提高</span>}
                {(externalFaultCompared < 0) && <span>降低</span>}
                {!externalFaultCompared ? <span className={styles.text}>{dataFormats(externalFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(externalFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>2）低压直流故障损失电量为</span>
                <span className={styles.text}>{dataFormats(lowVoltageDCFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(lowVoltageDCFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(lowVoltageDCFaultCompared >= 0) && <span>提高</span>}
                {(lowVoltageDCFaultCompared < 0) && <span>降低</span>}
                {!lowVoltageDCFaultCompared ? <span className={styles.text}>{dataFormats(lowVoltageDCFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(lowVoltageDCFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>3）变电系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(substationSystemFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(substationSystemFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(substationSystemFaultCompared >= 0) && <span>提高</span>}
                {(substationSystemFaultCompared < 0) && <span>降低</span>}
                {!substationSystemFaultCompared ? <span className={styles.text}>{dataFormats(substationSystemFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(substationSystemFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>4）输电系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(transmissionSystemFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(transmissionSystemFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(transmissionSystemFaultCompared >= 0) && <span>提高</span>}
                {(transmissionSystemFaultCompared < 0) && <span>降低</span>}
                {!transmissionSystemFaultCompared ? <span className={styles.text}>{dataFormats(transmissionSystemFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(transmissionSystemFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>5）二次及有功无功控制系统故障损失电量为</span>
                <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(secondaryAndHaveNotPowerFaultCompared >= 0) && <span>提高</span>}
                {(secondaryAndHaveNotPowerFaultCompared < 0) && <span>降低</span>}
                {!secondaryAndHaveNotPowerFaultCompared ? <span className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(secondaryAndHaveNotPowerFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%；</span>
              </p>

              <p className={styles.paragraph}>
                <span>6）其他故障损失电量为</span>
                <span className={styles.text}>{dataFormats(otherFaultLostPower, '--', 4, true) || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{dataFormats(otherFaultProportion, '--', 2, true) || '--'}</span>
                <span>%，同比</span>
                {(otherFaultCompared >= 0) && <span>提高</span>}
                {(otherFaultCompared < 0) && <span>降低</span>}
                {!otherFaultCompared ? <span className={styles.text}>{dataFormats(otherFaultCompared, '--', 2, true) || '--'}</span> : <span className={styles.text}>{dataFormats(Math.abs(otherFaultCompared), '--', 2, true) || '--'}</span>}
                <span>%。</span>
              </p>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default SingleStationAnalysisReport;
