import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';

class SingleStationAnalysisReport extends Component{

  static propTypes = {
    stationName: PropTypes.string,
    monthTime: PropTypes.string,
    dataType: PropTypes.string,
  };

  constructor(props){
    super(props);
  }

  render(){
    const { stationName, monthTime, dataType } = this.props;
    console.log(dataType);
    
    return(
      <div className={styles.analysisReport}>
        <div className={styles.MonthReportContent}>
          <div className={styles.titleText}>
            <h3>{ stationName }电站分析报告({ monthTime }月)</h3>
          </div>
          <div className={styles.contentText}>
            <p>1、今年————月份的发电量为_____万kWh，同比降低/提高_____%。</p>
              <p>其原因在于：该月辐照度同比降低/提高_____%；损失电量同比提高/降低_____%；限电率（该电站没有限电则不显示）同比提高/降低______%。</p>
            <p>2、今年_____月份的计划完成率为______%。</p>
            <p>（未完成的原因显示/不显示）</p>
            <p>3、今年_____月份的故障损失电量同比提高/降低_____%。</p>
            <p>详细情况说明：</p>
            <p>1）外部故障损失电量为_____万kWh，占比_____%，同比提高/降低_____%；</p>
            <p>2）低压直流故障损失电量为_____万kWh，占比_____%，同比提高/降低_____%；</p>
            <p>3）变电系统故障损失电量为_____万kWh，占比_____%，同比提高/降低_____%；</p>
            <p>4）输电系统故障损失电量为_____万kWh，占比_____%，同比提高/降低_____%；</p>
            <p>5）二次及有功无功控制系统故障损失电量为_____万kWh，占比_____%，同比提高/降低_____%；</p>
            <p>6）其他故障损失电量为_____万kWh，占比_____%，同比提高/降低_____%。</p>
          </div>
        </div>
      </div>
    )
  }
}

export default SingleStationAnalysisReport;