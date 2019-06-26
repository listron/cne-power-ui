import React, { Component } from "react";
import { Radio } from 'antd';
import styles from './intelligentReport.scss';
import Footer from '../../../../components/Common/Footer/index';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { apiUrlReal } from '../../../../config/apiConfig';

class IntelligentReport extends Component {
  constructor(props){
    super(props);
    this.state = {
      timeValue: '',
      typeValue: '',
    }
  }
  onTimeChange = (e) => { // 时间维度选择
    this.setState({
      timeValue: e.target.value
    })
  }
  onTypeChange = (e) => { // 报表类型选择
    this.setState({
      typeValue: e.target.value
    })
  }

  render() {
    const { timeValue, typeValue } = this.state;
    const dayStation = timeValue === 'day' && typeValue === 'station';
    const monthStation = timeValue === 'month' && typeValue === 'station';
    const yearStation = timeValue === 'year' && typeValue === 'station';
    const dayRegion = timeValue === 'day' && typeValue === 'region';
    const yearRegion = timeValue === 'month' && typeValue === 'region';
    const monthRegion = timeValue === 'year' && typeValue === 'region';

    return (
      <div className={styles.intelligentReport}>
        <CommonBreadcrumb breadData={[{ name: '智能报表' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
        <div className={styles.reportContent}>
          <div className={styles.intelligentSearch}>
            <div className={styles.timeSearch}>
              <span className={styles.text}>选择时间维度：</span>
              <Radio.Group onChange={this.onTimeChange} value={this.state.timeValue} defaultValue="day" buttonStyle="solid">
                <Radio.Button value="day">按日</Radio.Button>
                <Radio.Button value="month">按月</Radio.Button>
                <Radio.Button value="year">按年</Radio.Button>
              </Radio.Group>
            </div>
            <div className={styles.typeSearch}>
                <span className={styles.text}>报表类型：</span>
                <Radio.Group onChange={this.onTypeChange} value={this.state.typeValue} defaultValue="station" buttonStyle="solid">
                  <Radio.Button value={'station'}>电站报表</Radio.Button>
                  <Radio.Button value={'region'}>区域报表</Radio.Button>
                </Radio.Group>
            </div>
          </div>
          <div className={styles.iframeContent}>
            {dayStation &&
            <iframe id="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/report_day_station.cpt&__bypagesize__=false`}></iframe> }
            {monthStation && 
            <iframe id="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/report_month_station.cpt&__bypagesize__=false`
            }></iframe>}
            
            {yearStation && 
            <iframe id="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/report_year_station.cpt&__bypagesize__=false`
            }></iframe>}
            
            {dayRegion &&
            <iframe id="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/report_day_region.cpt&__bypagesize__=false`}></iframe> }
  
            {monthRegion && 
            <iframe id="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/report_month_region.cpt&__bypagesize__=false`}></iframe>}

            {yearRegion && 
            <iframe id="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/report_year_region.cpt&__bypagesize__=false`}></iframe>}
          </div>
          <Footer />
          </div>
        </div>
      </div>
    )
  }
}

export default IntelligentReport;

// dayStation && `${apiUrlReal}/decision/view/report?viewlet=report_day_station.cpt&__bypagesize__=false`

// monthStation && `${apiUrlReal}/decision/view/report?viewlet=report_month_station.cpt&__bypagesize__=false`

// yearStation && `${apiUrlReal}/decision/view/report?viewlet=report_year_station.cpt&__bypagesize__=false`

// dayRegion && `${apiUrlReal}/decision/view/report?viewlet=report_day_region.cpt&__bypagesize__=false`

// monthRegion && `${apiUrlReal}/decision/view/report?viewlet=report_month_region.cpt&__bypagesize__=false`

// yearRegion && `${apiUrlReal}/decision/view/report?viewlet=report_year_region.cpt&__bypagesize__=false`


