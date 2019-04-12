import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { dataFormat } from '../../../../utils/utilFunc';

class SingleStationAnalysisReport extends Component{

  static propTypes = {
    stationName: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string,
    dateType: PropTypes.num,
    generatinCapacity: PropTypes.object,
    systematicStatistics: PropTypes.object,
    completionRate: PropTypes.object,
    lossOfElectricity: PropTypes.object,
  };

  constructor(props){
    super(props);
    this.state = {
      isShow: false 
    }
  }

  judge = () => { // 判断是否显示限电损失电量内容
    const { completionRate } = this.props;
    const { planComplateRate } = completionRate
    if( 95 < planComplateRate || 105 > planComplateRate){
      this.setState({
        isShow: true
      })
    }
  }

  

  render(){
    // test1=1;
    // let aaaa=stations.filter((e,i)=>e.stationCode===test1);
    // // {stationCode:...,st}
    // aaa.stattionName


    


    const { isShow } = this.state;
    const { stationName, stations, month, year, dateType, yearTime, monthTime, generatinCapacity, systematicStatistics, completionRate, lossOfElectricity } = this.props;
    console.log(stations)
    let stationaaa = stations.filter((e,i) => e.)

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
            <h3>{ stationName }电站分析报告({ monthTime }月)</h3>
          </div>
          <div className={styles.contentText}>

            <p>
              <span>1、今年</span>
              <span className={styles.time}>{generatinMonth || '--'}</span>
              <span>月份的发电量为</span>
              <span className={styles.text}>{dataFormat(genValid,'--',4) || '--'}</span>
              <span>万kWh，同比降低/提高</span>
              <span className={styles.text}>{dataFormat(genValidCompared,'--',2) || '--'}</span>
              <span>%。</span>
            </p>

            <p className={styles.paragraph}>
              <span>其原因在于：该月辐照度同比降低/提高</span>
              <span className={styles.text}>{dataFormat(resourceValueCompared,'--',2) || '--'}</span>
              <span>%；损失电量同比提高/降低</span>
              <span className={styles.text}>{dataFormat(lostPowerCompared,'--',2) || '--'}</span>
              <span>%；限电率</span>
              <span className={styles.text}>{dataFormat(limitPowerRate,'--',2) || '--'}</span>
              <span>同比提高/降低</span>
              <span className={styles.text}>{dataFormat(limitPowerRateCompared,'--',2) || '--'}</span>
              <span>%。</span>
            </p>

            <p>
              <span>2、今年</span>
              <span className={styles.text}>{cMonth || '--'}</span>
              <span>月份的计划完成率为</span>
              <span className={styles.text}>{dataFormat(planComplateRate,'--',2) || '--'}</span>
              <span>%。</span>
            </p>

            {isShow ? 
            <p className={styles.paragraph}>
              <span className={styles.dotted}>该电站未完成计划/超出计划的主要原因在于：实际辐照度比历史辐照度低/高</span>
              <span className={styles.text + ' ' + styles.dotted}>{cResourceValueCompared || '--'}</span>
              <span className={styles.dotted}>%，损失电量同比提高/降低</span>
              <span className={styles.text + ' ' + styles.dotted}>{cLostPowerCompared || '--'}</span>
              <span className={styles.dotted}>%，限电损失电量同比提高/降低</span>
              <span className={styles.text + ' ' + styles.dotted}>{cLimitPowerRate || '--'}</span>
              <span className={styles.dotted}>%。</span>
            </p> 
            : ''}

            <p>
              <span>3、今年</span>
              <span className={styles.text}>{dMonth || '--'}</span>
              <span>月份的故障损失电量同比提高/降低</span>
              <span className={styles.text}>{dLostPowerCompared || '--'}</span>
              <span>%。</span> 
            </p>

            <p className={styles.paragraph}>详细情况说明：</p>

            <p className={styles.paragraph}>
              <span>1）外部故障损失电量为</span>
              <span className={styles.text}>{externalFaultLostPower || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{externalFaultProportion || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{externalFaultCompared || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>2）低压直流故障损失电量为</span>
              <span className={styles.text}>{lowVoltageDCFaultLostPower || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{lowVoltageDCFaultProportion || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{lowVoltageDCFaultCompared || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>3）变电系统故障损失电量为</span>
              <span className={styles.text}>{substationSystemFaultLostPower || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{substationSystemFaultProportion || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{substationSystemFaultCompared || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>4）输电系统故障损失电量为</span>
              <span className={styles.text}>{transmissionSystemFaultLostPower || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{transmissionSystemFaultProportion || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{transmissionSystemFaultCompared || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>5）二次及有功无功控制系统故障损失电量为</span>
              <span className={styles.text}>{secondaryAndHaveNotPowerFaultLostPower || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{secondaryAndHaveNotPowerFaultProportion || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{secondaryAndHaveNotPowerFaultCompared || '--'}</span>
              <span>%；</span>
            </p>

            <p className={styles.paragraph}>
              <span>6）其他故障损失电量为</span>
              <span className={styles.text}>{otherFaultLostPower || '--'}</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>{otherFaultProportion || '--'}</span>
              <span>%，同比提高/降低</span>
              <span className={styles.text}>{otherFaultCompared || '--'}</span>
              <span>%；</span>
            </p>
            
          </div>
        </div>
           : 
          <div className={styles.yearReportContent}>
            <div className={styles.titleText}>
            <h3>{ stationName }电站分析报告({ yearTime }年)</h3>
            </div>
            <div className={styles.contentText}>

              <p>
                <span>1、今年累计发电量为</span>
                <span className={styles.text}>{genValid || '--'}</span>
                <span>万kWh，环比降低/提高</span>
                <span className={styles.text}>{genValidCompared || '--'}</span>
                <span>%。其原因在于：该年辐照度环比降低/提高</span>
                <span className={styles.text}>{resourceValueCompared || '--'}</span>
                <span>%；损失电量环比提高/降低</span>
                <span className={styles.text}>{lostPowerCompared || '--'}</span>
                <span>%；限电率环比提高/降低</span>
                <span className={styles.text}>{limitPowerRateCompared || '--'}</span>
                <span>%。</span>
              </p>

              <p>
                2、年系统效率为
                <span className={styles.text}>{prs || '--'}</span>
                <span> %，其中</span>
                <span className={styles.text}>{bMonth || '--' }</span>
                <span>月份的系统效率最低，为</span>
                <span className={styles.text}>{pr || '--'}</span>
                <span>%。原因为：该月份损失电量最高，为</span>
                <span className={styles.text}>{lostPower || '--'}</span>
                <span>万kWh；限电率最高。</span>
              </p>

              <p>
                <span>3、年发电计划完成率为</span>
                <span className={styles.text}>{planComplateRate || '--'}</span>
                <span>%。其中</span>
                <span className={styles.text}>{dMonth || '--'}</span>
                <span>月份的计划完成率最低，为</span>
                <span className={styles.text}>{monthPlanComplateRate || '--'}</span>
                <span>%。原因为：年实际辐照度比历史辐照度低</span>
                <span className={styles.text}>{cResourceValueCompared || '--'}</span>
                <span>%；年损失电量环比提高 </span>
                <span className={styles.text}>{cLostPowerCompared || ''}</span>
                <span>%；年限电率环比提高</span>
                <span className={styles.text}>{limitPowerCompared || ''}</span>
                <span>%。</span>
              </p>

              <p>
                <span>4、年总损失电量环比提高/降低</span>
                <span className={styles.text}>{dLostPowerCompared || '--'}</span>
                <span>%。详细情况说明：</span>
              </p>

              <p>
                <span>1)	外部故障损失电量为</span>
                <span className={styles.text}>{externalFaultLostPower || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{externalFaultProportion || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{externalFaultCompared || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>2)	低压直流故障损失电量为</span>
                <span className={styles.text}>{lowVoltageDCFaultLostPower || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{lowVoltageDCFaultProportion || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{lowVoltageDCFaultCompared || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>3)	变电系统故障损失电量为</span>
                <span className={styles.text}>{substationSystemFaultLostPower || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{substationSystemFaultProportion || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{substationSystemFaultCompared || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>4)	输电系统故障损失电量为</span>
                <span className={styles.text}>{transmissionSystemFaultLostPower || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{transmissionSystemFaultProportion || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{transmissionSystemFaultCompared || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>5)	二次及有功无功控制系统故障损失电量为</span>
                <span className={styles.text}>{secondaryAndHaveNotPowerFaultLostPower || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{secondaryAndHaveNotPowerFaultProportion || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{secondaryAndHaveNotPowerFaultCompared || '--'}</span>
                <span>%；</span>
              </p>

              <p>
                <span>6)	其他故障损失电量为</span>
                <span className={styles.text}>{otherFaultLostPower || '--'}</span>
                <span>万kWh，占比</span>
                <span className={styles.text}>{otherFaultProportion || '--'}</span>
                <span>%，环比提高/降低</span>
                <span className={styles.text}>{otherFaultCompared || '--'}</span>
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