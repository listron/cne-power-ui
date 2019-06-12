import React, { Component } from "react";
import { Radio } from 'antd';
import styles from './intelligentReport.scss';
import Footer from '../../../../components/Common/Footer/index';
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
        <div className={styles.intelligentSearch}>
          <span className={styles.text}>选择时间维度：</span>
          <Radio.Group onChange={this.onTimeChange} value={this.state.timeValue} defaultValue="day" buttonStyle="solid">
            <Radio.Button value="day">按日</Radio.Button>
            <Radio.Button value="month">按月</Radio.Button>
            <Radio.Button value="year">按年</Radio.Button>
          </Radio.Group>

          <span className={styles.text}>报表类型：</span>
          <Radio.Group onChange={this.onTypeChange} value={this.state.typeValue} defaultValue="station" buttonStyle="solid">
            <Radio.Button value={'station'}>电站报表</Radio.Button>
            <Radio.Button value={'region'}>区域报表</Radio.Button>
          </Radio.Group>
        </div>

        {dayStation &&
        <iframe id="reportFrame" width="1440" height="818" frameBorder="0"  src={`${apiUrlReal}/decision/view/report?viewlet=report_day_station.cpt&__bypagesize__=false`}></iframe> }

        {monthStation && <iframe id="reportFrame" width="1440" height="818" frameBorder="0"  src={`${apiUrlReal}/decision/view/report? viewlet=report_month_station.cpt&__bypagesize__=false`}></iframe>}

        {yearStation && <iframe id="reportFrame" width="1440" height="818" frameBorder="0"  src={`${apiUrlReal}/decision/view/report?viewlet=report_year_station.cpt&__bypagesize__=false`}></iframe>}

        {dayRegion &&
        <iframe id="reportFrame" width="1440" height="818" frameBorder="0"  src={`${apiUrlReal}/decision/view/report?viewlet=report_day_region.cpt&__bypagesize__=false`}></iframe> }

        {yearRegion && <iframe id="reportFrame" width="1440" height="818" frameBorder="0"  src={`${apiUrlReal}/decision/view/report? viewlet=report_month_region.cpt&__bypagesize__=false`}></iframe>}

        {monthRegion && <iframe id="reportFrame" width="1440" height="818" frameBorder="0"  src={`${apiUrlReal}/decision/view/report?viewlet=report_year_region.cpt&__bypagesize__=false`}></iframe>}

        <Footer />
      </div>
    )
  }
}

export default IntelligentReport;