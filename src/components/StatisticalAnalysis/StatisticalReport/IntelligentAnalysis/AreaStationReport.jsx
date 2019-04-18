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
    const { stations, monthTime, regionName, yearTime, dateType, } = this.props;
    const tmpHightStationInfoList = areaPartBBean.hightStationInfoList || []; // 电站损失等效小时最高的三个电站信息

    const tmpLowStationInfoList = areaPartBBean.lowStationInfoList || []; // 电站损失等效小时最低的三个电站信息

    return(
      <div className={styles.areaStationReport}>
      {dateType === 1 ? 
        <div className={styles.monthReportContent}>
          <div className={styles.titleText}>
            <h3>{}区域电站分析报告({monthTime}月)</h3>
          </div>
          <div className={styles.contentText}>

            <p>
              <span>1、区域内电站平均等效利用小时数为</span>
              <span className={styles.text}>{aveEquUsehours || '--'}</span>
              <span>h，平均损失电量等效小时数</span>
              <span className={styles.text}>{avgLostPowerEquiventHours || '--'}</span>
              <span>h。</span>
            </p>

            <p className={styles.paragraph}>
              <span>该区域等效利用小时数最高的三个电站为</span>
              <span className={styles.text}>{hightStationInfoList[0].stationName || '--'}</span>
              <span>、</span>
              <span className={styles.text}>{hightStationInfoList[1].stationName || '--'}</span>
              <span>、</span>
              <span className={styles.text}>{hightStationInfoList[2].stationName || '--'}</span>
              <span>。</span>
            </p>
            <p className={styles.paragraph}>原因说明：</p>
            {hightStationInfoList.map((e,key) => (
              <p className={styles.paragraph} key={key}>
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

            <p className={styles.paragraph}>
              <span>该区域等效利用小时数最低的三个电站为</span>
              <span>{lowStationInfoList[0].stationName || '--'}</span>
              <span>、</span>
              <span>{lowStationInfoList[1].stationName || '--'}</span>
              <span>、</span>
              <span>{lowStationInfoList[2].stationName || '--'}</span>
              <span>。</span>
            </p>
            <p className={styles.paragraph}>原因说明：</p>
            {lowStationInfoList.map((e,key) => (
              <p className={styles.paragraph} key={key}>
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

            <p>
              <span>2、区域内电站平均计划完成率为</span>
              <span className={styles.text}>{avgPlanComplateRate || '--'}</span>
              <span>%。</span>
            </p>
            <p className={styles.paragraph}>
              <span>该区域计划完成率最高的三个电站为</span>
              <span className={styles.text}>{tmpHightStationInfoList[0].stationName}</span>
              <span>、</span>
              <span className={styles.text}>{tmpHightStationInfoList[1].stationName}</span>
              <span>、</span>
              <span className={styles.text}>{tmpHightStationInfoList[2].stationName}</span>
              <span>。</span>
            </p>
            <p>原因说明：</p>
            <p className={styles.paragraph}>
              {tmpHightStationInfoList.map((e,key) => (
                <p className={styles.paragraph} key={key}>
                  <span className={styles.text}>{e.stationName || '--'}</span>
                  <span>电站损失电量较低，损失率为</span>
                  <span className={styles.text}>{e.lostValue || '--'}</span>
                  <span>%;晴天天数</span>
                  <span className={styles.text}>{e.sunnyDays || '--'}</span>
                  <span>天，占比</span>
                  <span className={styles.text}>{e.per || '--'}</span>
                  <span>%；</span>
                </p>
              ))}
            </p>

            <p className={styles.paragraph}>
              <span>该区域计划完成率最高低的三个电站为</span>
              <span className={styles.text}>{tmpLowStationInfoList[0].stationName}</span>
              <span>、</span>
              <span className={styles.text}>{tmpLowStationInfoList[1].stationName}</span>
              <span>、</span>
              <span className={styles.text}>{tmpLowStationInfoList[2].stationName}</span>
              <span>。</span>
            </p>
            <p>原因说明：</p>
            <p className={styles.paragraph}>
              {tmpLowStationInfoList.map((e,key) => (
                <p className={styles.paragraph} key={key}>
                  <span className={styles.text}>{e.stationName || '--'}</span>
                  <span>电站损失电量较低，损失率为</span>
                  <span className={styles.text}>{e.lostValue || '--'}</span>
                  <span>%;晴天天数</span>
                  <span className={styles.text}>{e.sunnyDays || '--'}</span>
                  <span>天，占比</span>
                  <span className={styles.text}>{e.per || '--'}</span>
                  <span>%；</span>
                </p>
              ))}
            </p>

            <p>
              <span>3、区域内电站总损失电量为</span>
              <span className={styles.text}>{lostPowers || '--'}</span>
              <span>万kWh。</span>
              <span className={styles.text}>{faultName || '--'}</span>
              <span>（故障系统）占比最高。</span>
            </p>
            <p>详细情况说明：</p>
            <p className={styles.paragraph}>
              <span>1)外部故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%，其中</span>
              <span className={styles.text}>_____</span>
              <span>(外部因素中的具体分类)占比最高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>2)低压直流故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>3)变电系统故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>4)输电系统故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>5)二次及有功无功控制系统故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>6)其他故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%。</span>
            </p>

            <p>
              <span> 4、区域内电站平均的得分为</span>
              <span className={styles.text}>_____</span>
              <span>分。</span>
            </p>
            <p className={styles.paragraph}>
              <span>该区域内得分最低5个电站为</span>
              <span className={styles.text}>_____</span>
              <span>、</span>
              <span className={styles.text}>_____</span>
              <span>、</span>
              <span className={styles.text}>_____</span>
              <span>、</span>
              <span className={styles.text}>_____</span>
              <span>、</span>
              <span className={styles.text}>_____</span>
              <span>。</span>
            </p>
            <p className={styles.paragraph}>
              <span>1)</span>
              <span>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span>h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
            </p>
            <p className={styles.paragraph}>
              <span>2)</span>
              <span className={styles.text}>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span>h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
            </p>
            <p className={styles.paragraph}>
              <span>3)</span>
            	<span className={styles.text}>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span>h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
              </p>
            <p className={styles.paragraph}>
              <span>4)</span>
            	<span className={styles.text}>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}> ____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span> h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
            </p>
            <p className={styles.paragraph}>
              <span>5)	</span>
              <span className={styles.text}>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span>h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
            </p>
          </div>
        </div>
        : 
        <div className={styles.monthReportContent}>
          <div className={styles.titleText}>
            <h3>{}区域电站分析报告({yearTime}月)</h3>
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
              <span className={styles.text}>{hightStationInfoList[0].stationName || '--'}</span>
              <span>、</span>
              <span className={styles.text}>{hightStationInfoList[1].stationName || '--'}</span>
              <span>、</span>
              <span className={styles.text}>{hightStationInfoList[2].stationName || '--'}</span>
              <span>。</span>
            </p>
            <p className={styles.paragraph}>原因说明：</p>
            {hightStationInfoList.map((e,key) => (
              <p className={styles.paragraph} key={key}>
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

            <p className={styles.paragraph}>
              <span>该区域等效利用小时数最低的三个电站为</span>
              <span>{lowStationInfoList[0].stationName || '--'}</span>
              <span>、</span>
              <span>{lowStationInfoList[1].stationName || '--'}</span>
              <span>、</span>
              <span>{lowStationInfoList[2].stationName || '--'}</span>
              <span>。</span>
            </p>
            <p className={styles.paragraph}>原因说明：</p>
            {lowStationInfoList.map((e,key) => (
              <p className={styles.paragraph} key={key}>
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

            <p>
              <span>2、区域内电站平均计划完成率为</span>
              <span className={styles.text}>{avgPlanComplateRate || '--'}</span>
              <span>%。</span>
            </p>
            <p className={styles.paragraph}>
              <span>该区域计划完成率最高的三个电站为</span>
              <span className={styles.text}>{tmpHightStationInfoList[0].stationName}</span>
              <span>、</span>
              <span className={styles.text}>{tmpHightStationInfoList[1].stationName}</span>
              <span>、</span>
              <span className={styles.text}>{tmpHightStationInfoList[2].stationName}</span>
              <span>。</span>
            </p>
            <p>原因说明：</p>
            <p className={styles.paragraph}>
              {tmpHightStationInfoList.map((e,key) => (
                <p className={styles.paragraph} key={key}>
                  <span className={styles.text}>{e.stationName || '--'}</span>
                  <span>电站损失电量较低，损失率为</span>
                  <span className={styles.text}>{e.lostValue || '--'}</span>
                  <span>%;晴天天数</span>
                  <span className={styles.text}>{e.sunnyDays || '--'}</span>
                  <span>天，占比</span>
                  <span className={styles.text}>{e.per || '--'}</span>
                  <span>%；</span>
                </p>
              ))}
            </p>

            <p className={styles.paragraph}>
              <span>该区域计划完成率最高低的三个电站为</span>
              <span className={styles.text}>{tmpLowStationInfoList[0].stationName}</span>
              <span>、</span>
              <span className={styles.text}>{tmpLowStationInfoList[1].stationName}</span>
              <span>、</span>
              <span className={styles.text}>{tmpLowStationInfoList[2].stationName}</span>
              <span>。</span>
            </p>
            <p>原因说明：</p>
            <p className={styles.paragraph}>
              {tmpLowStationInfoList.map((e,key) => (
                <p className={styles.paragraph} key={key}>
                  <span className={styles.text}>{e.stationName || '--'}</span>
                  <span>电站损失电量较低，损失率为</span>
                  <span className={styles.text}>{e.lostValue || '--'}</span>
                  <span>%;晴天天数</span>
                  <span className={styles.text}>{e.sunnyDays || '--'}</span>
                  <span>天，占比</span>
                  <span className={styles.text}>{e.per || '--'}</span>
                  <span>%；</span>
                </p>
              ))}
            </p>

            <p>
              <span>3、区域内电站总损失电量为</span>
              <span className={styles.text}>{lostPowers || '--'}</span>
              <span>万kWh。</span>
              <span className={styles.text}>{faultName || '--'}</span>
              <span>（故障系统）占比最高。</span>
            </p>
            <p>详细情况说明：</p>
            <p className={styles.paragraph}>
              <span>1)外部故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%，其中</span>
              <span className={styles.text}>_____</span>
              <span>(外部因素中的具体分类)占比最高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>2)低压直流故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>3)变电系统故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>4)输电系统故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>5)二次及有功无功控制系统故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%；</span>
            </p>
            <p className={styles.paragraph}>
              <span>6)其他故障损失电量为</span>
              <span className={styles.text}>_____</span>
              <span>万kWh，占比</span>
              <span className={styles.text}>_____</span>
              <span>%。</span>
            </p>

            <p>
              <span> 4、区域内电站平均的得分为</span>
              <span className={styles.text}>_____</span>
              <span>分。</span>
            </p>
            <p className={styles.paragraph}>
              <span>该区域内得分最低5个电站为</span>
              <span className={styles.text}>_____</span>
              <span>、</span>
              <span className={styles.text}>_____</span>
              <span>、</span>
              <span className={styles.text}>_____</span>
              <span>、</span>
              <span className={styles.text}>_____</span>
              <span>、</span>
              <span className={styles.text}>_____</span>
              <span>。</span>
            </p>
            <p className={styles.paragraph}>
              <span>1)</span>
              <span>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span>h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
            </p>
            <p className={styles.paragraph}>
              <span>2)</span>
              <span className={styles.text}>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span>h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
            </p>
            <p className={styles.paragraph}>
              <span>3)</span>
            	<span className={styles.text}>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span>h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
              </p>
            <p className={styles.paragraph}>
              <span>4)</span>
            	<span className={styles.text}>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}> ____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span> h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
            </p>
            <p className={styles.paragraph}>
              <span>5)	</span>
              <span className={styles.text}>_____</span>
              <span>电站得分</span>
              <span className={styles.text}>_____</span>
              <span>分，原因为：发电量计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；PR计划完成率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；损失电量等效时较高，为</span>
              <span className={styles.text}>_____</span>
              <span>h，用电率较高，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺率较低，为</span>
              <span className={styles.text}>_____</span>
              <span>%；消缺及时性较差，一级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,二级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h,三级故障平均处理时长</span>
              <span className={styles.text}>_____</span>
              <span>h。</span>
            </p>
          </div>
        </div>
      }
      </div>
    )
  }
}

export default AreaStationReport;