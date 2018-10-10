
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { DatePicker, Button } from 'antd';
import StationSelect from '../../../../Common/StationSelect';
import UploadReportList from './UploadReportList';
import moment from 'moment';

class SideReportPage extends Component {
  static propTypes = {
    reportDay: PropTypes.string,
    sidePage: PropTypes.string,
    stations: PropTypes.array,
    reportStation: PropTypes.array,
    toChangeDayReportStore: PropTypes.func,
    getStationBaseReport: PropTypes.func,
    showReportInputList: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state = {
      reportDay: '',
      reportStation: [],
    }
  }

  toReportList = () => { // 回日报列表页
    this.props.toChangeDayReportStore({
      showPage: 'list',
    })
  }

  selectReportTime = (reportMoment,reportDay) => { // 存储选中日报时间
    this.props.toChangeDayReportStore({
      reportDay,
    })
  }

  toSelectCondition = () => { // 返回选择时间/电站
    this.props.toChangeDayReportStore({
      showReportInputList: false,
    })
  }

  stationSelected = (reportStation) => { // 存储选中的电站
    this.props.toChangeDayReportStore({
      reportStation
    })
  }

  toReportStations = () => { // 去填写各电站报表信息
    const { reportDay, reportStation } = this.props;
    this.props.getStationBaseReport({
      reportDay,
      reportStation: reportStation.map(e=>`${e.stationCode}`)
    })
  }

  saveDayReport = () => {
    console.log('save report info')
  }

  render(){
    const { reportDay, stations, reportStation, showReportInputList } = this.props;
    const canReport = reportDay && reportStation && reportStation.length > 0;
    return (
      <div className={styles.sideReportPage}>
        <div>
          <span>上报日报</span>
          <div>
            {showReportInputList && <Button onClick={this.toSelectCondition}>上一步</Button>}
            {showReportInputList && <Button onClick={this.saveDayReport} >保存</Button>}
            <span onClick={this.toReportList}>返回列表</span>
          </div>
        </div>
        {!showReportInputList && <div>
          <div>
            <span>日报时间</span>
            <DatePicker onChange={this.selectReportTime} value={reportDay?moment(reportDay):null} />
          </div>
          <div>
            <span>电站选择</span>
            <StationSelect 
              value={reportStation}
              data={stations}
              multiple={true}
              onChange={this.stationSelected}
            />
            <Button onClick={this.toReportStations} disabled={!canReport} >下一步</Button>
          </div>
        </div>}
        {showReportInputList && <UploadReportList {...this.props} />}
      </div>
    )
  }
}

export default SideReportPage;
