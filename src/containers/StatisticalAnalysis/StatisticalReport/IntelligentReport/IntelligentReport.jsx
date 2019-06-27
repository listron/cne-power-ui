import React, { Component } from "react";
import { Radio } from 'antd';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import styles from './intelligentReport.scss';
import Footer from '../../../../components/Common/Footer/index';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { apiUrlReal } from '../../../../config/apiConfig';

class IntelligentReport extends Component {

  static propTypes = {
    location: PropTypes.object,
  }

  constructor(props){
    super(props);
    const { search } = props.location;
    const searchData = search.replace('?', '').split('&').filter(e => e.includes('iframe'));
    const iframeType = searchData.length > 0;
    this.state = {
      timeValue: '',
      typeValue: '',
      iframeType // 特殊指定路径时，使用特殊路径展示。= > 说白了就是给知道路径的人测试的····
    }
  }

  componentDidUpdate(){ // iframe cookie写入
    const reportFrame = window.frames['reportFrame'];
    if (reportFrame) {
      let frameDoc = reportFrame.document;
      frameDoc.cookie = `username=${Cookie.get('username')}`;
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
    const { timeValue, typeValue, iframeType } = this.state;
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
            <iframe id="reportFrame" name="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              'http://www.baidu.com'}></iframe> }
            {monthStation && 
            <iframe id="reportFrame" name="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              iframeType ? `${apiUrlReal}/decision/view/report?viewlet=report_month_station.cpt&__bypagesize__=false` :
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/reportMonthStation.cpt&__bypagesize__=false`
            }></iframe>}
            
            {yearStation && 
            <iframe id="reportFrame" name="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              iframeType ? `${apiUrlReal}/decision/view/report?viewlet=report_year_station.cpt&__bypagesize__=false` :
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/reportYearStation.cpt&__bypagesize__=false`
            }></iframe>}
            
            {dayRegion &&
            <iframe id="reportFrame" name="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              iframeType ? `${apiUrlReal}/decision/view/report?viewlet=report_day_region.cpt&__bypagesize__=false` :
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/reportDayRegion.cpt&__bypagesize__=false`}></iframe> }
  
            {monthRegion && 
            <iframe id="reportFrame" name="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              iframeType ? `${apiUrlReal}/decision/view/report?viewlet=report_month_region.cpt&__bypagesize__=false` :
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/reportMonthRegion.cpt&__bypagesize__=false`}></iframe>}

            {yearRegion && 
            <iframe id="reportFrame" name="reportFrame" className={styles.iframeBody} frameBorder="0" src={
              iframeType ? `${apiUrlReal}/decision/view/report?viewlet=report_year_region.cpt&__bypagesize__=false` :
              `${apiUrlReal}/webroot/auth.html?url=${apiUrlReal}/webroot/decision/view/report?viewlet=HZ_EPower_Report/reportYearRegion.cpt&__bypagesize__=false`}></iframe>}
          </div>
          <Footer />
          </div>
        </div>
      </div>
    )
  }
}

export default IntelligentReport;

