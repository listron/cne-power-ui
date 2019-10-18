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

    const { genValid, genValidCompared, resourceValueCompared, lostPowerCompared, lowMonth, limitPowerRate, limitPowerRateCompared } = generatinCapacity;
    const generatinMonth = generatinCapacity.month;

    const { prs, pr, lostPower, prsCompared } = systematicStatistics;
    const bMonth = systematicStatistics.month;

    const { planComplateRate, monthPlanComplateRate, limitPowerCompared, planComplateRateCompared } = completionRate;
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
              <p className={styles.bigText}>
                <span>1、今年</span>
                <span className={styles.time + ' ' + styles.text}>{generatinMonth || '--'}</span>
                <span>月份的发电量为</span>
                <span className={styles.text}>{dataFormats(genValid, '--', 4, true) || '--'}</span>
                <span>万kWh，今年</span>
                <span className={styles.time + ' ' + styles.text}>{generatinMonth || '--'}</span>
                <span>月份的计划完成率为</span>
                <span className={styles.text}>{dataFormats(planComplateRate, '--', 2, true) || '--'}</span>
                <span>%。详细情况说明：</span>
              </p>

              <div className={styles.fileBox}>
                <div className={styles.quota}>
                  <p className={styles.titlesText}>指标</p>
                  <p className={styles.texts}>发电量</p>
                  <p className={styles.texts}>计划完成率</p>
                </div>

                <div className={styles.data}>
                  <p className={styles.titlesText}>数据</p>
                  <p className={styles.texts}>{dataFormats(genValid, '--', 4, true) || '--'}</p>
                  <p className={styles.texts}>{dataFormats(planComplateRate, '--', 2, true) || '--'}</p>
                </div>

                <div className={styles.compares}>
                  <p className={styles.titlesText + ' ' + styles.compare}>同比降低/提高（%）</p>
                  <p className={styles.texts}>{dataFormats(Math.abs(genValidCompared), '--', 2, true) || '--'}</p>
                  <p className={styles.texts}>{dataFormats(Math.abs(planComplateRateCompared), '--', 2, true) || '--'}</p>
                </div>

                <div className={styles.reasons}>
                  <p className={styles.titlesText}>原因分析</p>
                  {(resourceValueCompared || lostPowerCompared || limitPowerRate) ?
                  <p className={styles.texts}>
                    {(resourceValueCompared || resourceValueCompared === 0) &&
                    <span>
                      <span>该月辐照度同比</span>
                      {(resourceValueCompared >= 0) && <span>提高</span>}
                      {(resourceValueCompared < 0) && <span>降低</span>}
                      <span className={styles.text}>{dataFormats(Math.abs(resourceValueCompared), '--', 2, true)}</span>
                      <span>%；</span>
                    </span>}

                    {(lostPowerCompared || lostPowerCompared === 0) &&
                    <span>
                      <span>损失电量同比</span>
                      {(lostPowerCompared >= 0) && <span>提高</span>}
                      {(lostPowerCompared < 0) && <span>降低</span>}
                      <span className={styles.text}>{dataFormats(Math.abs(lostPowerCompared), '--', 2, true)}</span>
                      <span>%；</span>
                    </span>}

                    {(limitPowerRate || (limitPowerRate === 0)) &&
                      <span>
                        <span>限电率</span>
                        <span className={styles.text}>{dataFormats(limitPowerRate, '--', 2, true)}</span>
                        <span>%，同比</span>
                        {(limitPowerRateCompared >= 0) && <span>提高</span>}
                        {(limitPowerRateCompared < 0) && <span>降低</span>}
                        <span className={styles.text}>{dataFormats(Math.abs(limitPowerRateCompared), '--', 2, true) || '--'}</span>
                        <span>%。</span>
                      </span>}

                  </p> : <p className={styles.texts}></p>}

                  {((95 < planComplateRate) && (planComplateRate < 105)) ?
                    <p className={styles.texts}>--</p> :
                    <p className={styles.texts}>
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
                    </p>}
                </div>
              </div>

              <p className={styles.distanceTop + ' ' + styles.bigText}>
                <span>2、今年</span>
                <span className={styles.text}>{dMonth || '--'}</span>
                <span>月份的故障损失电量同比</span>
                {(dLostPowerCompared >= 0) && <span>提高</span>}
                {(dLostPowerCompared < 0) && <span>降低</span>}
                <span className={styles.text}>{dataFormats(Math.abs(dLostPowerCompared), '--', 2, true) || '--'}</span>
                <span>%。详细情况说明：</span>
              </p>


              <div className={styles.fileBox}>
                <div className={styles.faultType}>
                  <p className={styles.titlesText}>故障类型</p>
                  <p>外部故障</p>
                  <p>低压直流故障</p>
                  <p>变电系统故障</p>
                  <p>输电系统故障</p>
                  <p>二次及有功无功控制系统故障</p>
                  <p>其他故障</p>
                </div>

                <div className={styles.LossElectricity}>
                  <p className={styles.titlesText}>损失电量</p>
                  <p className={styles.text}>{dataFormats(externalFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(lowVoltageDCFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(substationSystemFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(transmissionSystemFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(otherFaultLostPower, '--', 4, true) || '--'}</p>
                </div>

                <div className={styles.proportion}>
                  <p className={styles.titlesText}>占比（%）</p>
                  <p className={styles.text}>{dataFormats(externalFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(lowVoltageDCFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(substationSystemFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(transmissionSystemFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(otherFaultProportion, '--', 2, true) || '--'}</p>
                </div>

                <div className={styles.Comparisons}>
                  <p className={styles.titlesText}>同比提高/降低（%）</p>
                  {!externalFaultCompared && <p className={styles.text}>{dataFormats(externalFaultCompared, '--', 2, true) || '--'}</p>}
                  {!lowVoltageDCFaultCompared && <p className={styles.text}>{dataFormats(lowVoltageDCFaultCompared, '--', 2, true) || '--'}</p>}
                  {!substationSystemFaultCompared && <p className={styles.text}>{dataFormats(substationSystemFaultCompared, '--', 2, true) || '--'}</p>}
                  {!transmissionSystemFaultCompared && <p className={styles.text}>{dataFormats(transmissionSystemFaultCompared, '--', 2, true) || '--'}</p>}
                  {!secondaryAndHaveNotPowerFaultCompared && <p className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultCompared, '--', 2, true) || '--'}</p>}
                  {!otherFaultCompared && <p className={styles.text}>{dataFormats(otherFaultCompared, '--', 2, true) || '--'}</p>}
                </div>
              </div>
            </div>
          </div>
          :
          <div className={styles.yearReportContent}>
            <div className={styles.titleText}>
              <h3>{stationName}电站分析报告({year}年)</h3>
            </div>
            <div className={styles.contentText}>
              <p className={styles.bigText}>
                <span>1、今年累计发电量为</span>
                <span className={styles.text}>{dataFormats(genValid, '--', 4, true) || '--'}</span>
                <span>万kWh，年系统效率为</span>
                <span className={styles.text}>{dataFormats(prs, '--', 2, true) || '--'}</span>
                <span>%，年发电计划完成率为</span>
                <span className={styles.text}>{dataFormats(planComplateRate, '--', 2, true) || '--'}</span>
                <span>%。详细情况说明：</span>
              </p>

              <div className={styles.fileBox}>

                <div className={styles.firstColumn}>
                  <p className={styles.titlesText}>指标</p>
                  <p className={styles.secondLine}>年累计发电量</p>
                  <p className={styles.thirdLine}>年系统效率</p>
                  <p className={styles.fourthLine}>年发电计划完成率</p>
                </div>

                <div className={styles.secondColumn}>
                  <p className={styles.titlesText}>数据</p>
                  <p className={styles.secondLine}>{dataFormats(genValid, '--', 4, true) || '--'}</p>
                  <p className={styles.thirdLine}>{dataFormats(prs, '--', 2, true) || '--'}</p>
                  <p className={styles.fourthLine}>{dataFormats(planComplateRate, '--', 2, true) || '--'}</p>
                </div>

                <div className={styles.thirdColumn}>
                  <p className={styles.titlesText}>环比降低/提高（%）</p>
                  <p className={styles.secondLine}>{dataFormats(genValidCompared, '--', 2, true) || '--'}</p>
                  <p className={styles.thirdLine}>{dataFormats(prsCompared, '--', 2, true) || '--'}</p>
                  <p className={styles.texts + ' ' + styles.fourthLine}>{dataFormats(planComplateRateCompared, '--', 2, true) || '--'}</p>
                </div>

                <div className={styles.fourthColumn}>
                  <p className={styles.titlesText}>最低月份</p>
                  <p className={styles.secondLine}>{lowMonth || '--'}</p>
                  <p className={styles.thirdLine}>{bMonth || '--'}</p>
                  <p className={styles.fourthLine}>{cMonth || '--'}</p>
                </div>

                <div className={styles.fifthColumn}>
                  <p className={styles.titlesText}>原因分析</p>
                  {(resourceValueCompared || lostPowerCompared || limitPowerRateCompared) ?
                  <p className={styles.secondLine}>
                    {(resourceValueCompared || lostPowerCompared === 0) &&
                    <span>
                      <span>该年辐照度环比</span>
                      {(resourceValueCompared >= 0) && <span>提高</span>}
                      {(resourceValueCompared < 0) && <span>降低</span>}
                      <span className={styles.text}>{dataFormats(Math.abs(resourceValueCompared), '--', 2, true)}</span>
                      <span>%；</span>
                    </span>}

                    {(lostPowerCompared || lostPowerCompared === 0) &&
                      <span>
                        <span>损失电量环比</span>
                        {(lostPowerCompared >= 0) && <span>提高</span>}
                        {(lostPowerCompared < 0) && <span>降低</span>}
                        <span className={styles.text}>{dataFormats(Math.abs(lostPowerCompared), '--', 2, true)}</span>
                        <span>%；</span>
                      </span>}


                    {(limitPowerRateCompared || limitPowerRateCompared === 0) &&
                      <span>
                        <span>限电率环比</span>
                        {(limitPowerRateCompared >= 0) && <span>提高</span>}
                        {(limitPowerRateCompared < 0) && <span>降低</span>}
                        <span className={styles.text}>{dataFormats(Math.abs(limitPowerRateCompared), '--', 2, true)}</span>
                        <span>。%</span>
                      </span>}
                    </p> : <p className={styles.secondLine}>--</p>}

                  <p className={styles.thirdLine}>
                    <span>该月份损失电量最高，为</span>
                    <span className={styles.text}>{dataFormats(lostPower, '--', 4, true)}</span>
                    <span>万kWh。限电率最高。</span>
                  </p>

                  <p className={styles.fourthLine}>
                  {(cResourceValueCompared || cLostPowerCompared || limitPowerCompared) ?
                    <div>
                      {(cResourceValueCompared || cResourceValueCompared === 0) &&
                        <span>
                          <span>年实际辐照度比历史辐照度低</span>
                          <span className={styles.text}>{dataFormats(cResourceValueCompared, '--', 2, true)}</span>
                          <span>%；</span>
                        </span>}
                      {(cLostPowerCompared || cLostPowerCompared === 0) &&
                        <span>
                          <span>年损失电量环比提高</span>
                          <span className={styles.text}>{dataFormats(cLostPowerCompared, '--', 2, true)}</span>
                          <span>%；</span>
                        </span>}
                      {(limitPowerCompared || limitPowerCompared === 0) &&
                        <span>
                          <span>年限电率环比提高</span>
                          <span className={styles.text}>{dataFormats(limitPowerCompared, '--', 2, true)}</span>
                          <span>%。</span>
                        </span>}
                    </div> : '--'}
                  </p>
                </div>
              </div>

              <p className={styles.distanceTop + ' ' + styles.bigText}>
                <span>2、年总损失电量环比</span>
                {(dLostPowerCompared >= 0) && <span>提高</span>}
                {(dLostPowerCompared < 0) && <span>降低</span>}
                <span className={styles.text}>{dataFormats(Math.abs(dLostPowerCompared), '--', 2, true) || '--'}</span>
                <span>%。详细情况说明：</span>
              </p>

              <div className={styles.fileBox}>
                <div className={styles.fault}>
                  <p className={styles.titlesText}>故障类型</p>
                  <p className={styles.text}>外部故障</p>
                  <p className={styles.text}>低压直流故障</p>
                  <p className={styles.text}>变电系统故障</p>
                  <p className={styles.text}>输电系统故障</p>
                  <p className={styles.text}>二次及有功无功控制系统故障损失电量为</p>
                  <p className={styles.text}>其他故障损失电量为</p>
                </div>

                <div className={styles.electricity}>
                  <p className={styles.titlesText}>损失电量</p>
                  <p className={styles.text}>{dataFormats(externalFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(lowVoltageDCFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(substationSystemFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(transmissionSystemFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultLostPower, '--', 4, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(otherFaultLostPower, '--', 4, true) || '--'}</p>
                </div>

                <div className={styles.ratio}>
                  <p className={styles.titlesText}>占比（%）</p>
                  <p className={styles.text}>{dataFormats(externalFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(lowVoltageDCFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(substationSystemFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(transmissionSystemFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultProportion, '--', 2, true) || '--'}</p>
                  <p className={styles.text}>{dataFormats(otherFaultProportion, '--', 2, true) || '--'}</p>
                </div>

                <div className={styles.rateCompared}>
                  <p className={styles.titlesText}>环比提高/降低（%）</p>
                  {!externalFaultCompared && <p className={styles.text}>{dataFormats(externalFaultCompared, '--', 2, true) || '--'}</p>}
                  {!lowVoltageDCFaultCompared && <p className={styles.text}>{dataFormats(lowVoltageDCFaultCompared, '--', 2, true) || '--'}</p>}
                  {!substationSystemFaultCompared && <p className={styles.text}>{dataFormats(substationSystemFaultCompared, '--', 2, true) || '--'}</p>}
                  {!transmissionSystemFaultCompared && <p className={styles.text}>{dataFormats(transmissionSystemFaultCompared, '--', 2, true) || '--'}</p>}
                  {!secondaryAndHaveNotPowerFaultCompared && <p className={styles.text}>{dataFormats(secondaryAndHaveNotPowerFaultCompared, '--', 2, true) || '--'}</p>}
                  {!otherFaultCompared && <p className={styles.text}>{dataFormats(otherFaultCompared, '--', 2, true) || '--'}</p>}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default SingleStationAnalysisReport;
