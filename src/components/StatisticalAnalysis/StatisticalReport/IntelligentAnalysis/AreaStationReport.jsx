import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';

class AreaStationReport extends Component{

  static propTypes = {
    monthTime: PropTypes.string,
    yearTime: PropTypes.string,
    dataType: PropTypes.string,
  };

  constructor(props){
    super(props);
  }

  render(){
    const { monthTime, regionName, yearTime, dataType, areaPartABean, areaPartBBean, areaPartCBean, areaPartDBean,} = this.props;
    const { avgEquiventHours, avgLostPowerEquiventHours, hightStationInfoList = [], lowStationInfoList = [] } = areaPartABean;
    const { avgPlanComplateRate,  } = areaPartBBean;
    const tmpHightStationInfoList = areaPartBBean.hightStationInfoList || [];
    const [first = {}, secend = {}, third = {}] = hightStationInfoList;
    
    const hightAStationName = hightStationInfoList.map( e => { // 区域内电站平均等效利用小时数最高的三个电站
      return e.stationName;
    }) || {}

    const lowAStationName = lowStationInfoList.map( e => { // 区域内电站平均等效利用小时数最低的三个电站
      return e.stationName;
    }) || {}
    const lowAStationlost = lowStationInfoList.map( e => {
      return e.lostValue
    }) || {}
    const lowAStationSunny = lowStationInfoList.map( e => {
      return e.sunnyDays;
    }) || {}
    const lowAStationPer = lowStationInfoList.map( e => {
      return e.per
    }) || {}
  
    return(
      <div className={styles.areaStationReport}>
      
        <div className={styles.monthReportContent}>
          <div className={styles.titleText}>
            <h3>{regionName}区域电站分析报告({monthTime}月)</h3>
          </div>
          <div className={styles.contentText}>

            <p>
              <span>1、区域内电站平均等效利用小时数为</span>
              <span className={styles.text}>{avgEquiventHours || '--'}</span>
              <span>h，平均损失电量等效小时数</span>
              <span className={styles.text}>{avgLostPowerEquiventHours || '--'}</span>
              <span>h。</span>
            </p>

            <p className={styles.paragraph}>
              <span>该区域等效利用小时数最高的三个电站为</span>
              <span className={styles.text}>{hightAStationName[0] || '--'}</span>
              <span>、</span>
              <span className={styles.text}>{hightAStationName[1] || '--'}</span>
              <span>、</span>
              <span className={styles.text}>{hightAStationName[2] || '--'}</span>
              <span>。</span>
            </p>
            <p className={styles.paragraph}>原因说明：</p>
              
            {hightStationInfoList.map(e => (
              <p className={styles.paragraph}>
                <span className={styles.text}>{e.stationName || '--'}</span>
                <span>电站损失等效小时数较低，为</span>
                <span className={styles.text}>{e.lostValue || '--'}</span>
                <span>h;晴天天数</span>
                <span className={styles.text}>{e.sunnyDays || '--'}</span>
                <span>天，占比</span>
                <span className={styles.text}>{e.per || '--'}</span>
                <span>%；</span>
              </p>
            ))}


            <p className={styles.paragraph}>该区域等效利用小时数最低的三个电站为{ lowAStationName[0]}、{ lowAStationName[1] }、{lowAStationName[2] }。原因说明：</p>
            <p className={styles.paragraph}>{ lowAStationName[0] }电站损失等效小时数较高，为{ lowAStationlost[0] }h;晴天天数{ lowAStationSunny[0] }天，占比{ lowAStationPer[0] }%；</p>
            <p className={styles.paragraph}>{ lowAStationName[1] }电站损失等效小时数较高，为{ lowAStationlost[1] }h;晴天天数{ lowAStationSunny[1] }天，占比{ lowAStationPer[1] }%；</p>
            <p className={styles.paragraph}>{ lowAStationName[2] }电站损失等效小时数较高，为{ lowAStationlost[2] }h;晴天天数{ lowAStationSunny[2] }天，占比{ lowAStationPer[2] }%。</p>
            {/* <p>2、区域内电站平均计划完成率为{ avgPlanComplateRate ? <span className={styles.text}>{avgPlanComplateRate}</span> : <span className={styles.text}>--</span> }%。</p> */}
            <p className={styles.paragraph}>该区域计划完成率最高的三个电站为______、_______、_______。原因说明：</p>
            <p className={styles.paragraph}>______电站损失电量较低，损失率为____%;晴天天数___天，占比____%；</p>
            <p className={styles.paragraph}>______电站损失电量较低，损失率为____%;晴天天数___天，占比____%；</p>
            <p className={styles.paragraph}>______电站损失电量较低，损失率为____%;晴天天数___天，占比____%。</p>
            <p className={styles.paragraph}>该区域计划完成率最低的三个电站为______、_______、_______。原因说明：</p>
            <p className={styles.paragraph}>______电站损失电量较高，损失率为____%;晴天天数___天，占比____%；</p>
            <p className={styles.paragraph}>______电站损失电量较高，损失率为____%;晴天天数___天，占比____%；</p>
            <p className={styles.paragraph}>______电站损失电量较高，损失率为____%;晴天天数___天，占比____%。</p>
            <p>3、区域内电站总损失电量为_____万kWh。________（故障系统）占比最高，详细情况说明：</p>
            <p className={styles.paragraph}>1)	外部故障损失电量为_____万kWh，占比_____%，其中_____(外部因素中的具体分类)占比最高，为_____%；</p>
            <p className={styles.paragraph}>2)	低压直流故障损失电量为_____万kWh，占比_____%；</p>
            <p className={styles.paragraph}>3)	变电系统故障损失电量为_____万kWh，占比_____%；</p>
            <p className={styles.paragraph}>4)	输电系统故障损失电量为_____万kWh，占比_____%；</p>
            <p className={styles.paragraph}>5)	二次及有功无功控制系统故障损失电量为_____万kWh，占比_____%；</p>
            <p className={styles.paragraph}>6)	其他故障损失电量为_____万kWh，占比_____%。</p>
            <p>4、区域内电站平均的得分为_____分。</p>
            <p className={styles.paragraph}>该区域内得分最低5个电站为_____、_____、_____、_____、_____。</p>
            <p className={styles.paragraph}>1)	_____电站得分_____分，原因为：发电量计划完成率较低，为_____%；PR计划完成率较低，为_____%；损失电量等效时较高，为_____h，用电率较高，为_____%；消缺率较低，为_____%；消缺及时性较差，一级故障平均处理时长_____h,二级故障平均处理时长_____h,三级故障平均处理时长_____h。</p>
            <p className={styles.paragraph}>2)	_____电站得分_____分，原因为：发电量计划完成率较低，为_____%；PR计划完成率较低，为_____%；损失电量等效时较高，为_____h，用电率较高，为_____%；消缺率较低，为_____%；消缺及时性较差，一级故障平均处理时长_____h,二级故障平均处理时长_____h,三级故障平均处理时长_____h。</p>
            <p className={styles.paragraph}>3)	_____电站得分_____分，原因为：发电量计划完成率较低，为_____%；PR计划完成率较低，为_____%；损失电量等效时较高，为_____h，用电率较高，为_____%；消缺率较低，为_____%；消缺及时性较差，一级故障平均处理时长_____h,二级故障平均处理时长_____h,三级故障平均处理时长_____h。</p>
            <p className={styles.paragraph}>4)	_____电站得分_____分，原因为：发电量计划完成率较低，为_____%；PR计划完成率较低，为_____%；损失电量等效时较高，为_____h，用电率较高，为_____%；消缺率较低，为_____%；消缺及时性较差，一级故障平均处理时长_____h,二级故障平均处理时长_____h,三级故障平均处理时长_____h。</p>
            <p className={styles.paragraph}>5)	_____电站得分_____分，原因为：发电量计划完成率较低，为_____%；PR计划完成率较低，为_____%；损失电量等效时较高，为_____h，用电率较高，为_____%；消缺率较低，为_____%；消缺及时性较差，一级故障平均处理时长_____h,二级故障平均处理时长_____h,三级故障平均处理时长_____h。</p>
          </div>
        </div>
          
      </div>
    )
  }
}

export default AreaStationReport;