
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
    stationReportBaseData: PropTypes.array,
    toChangeDayReportStore: PropTypes.func,
    getStationBaseReport: PropTypes.func,
    showReportInputList: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state = {
      reportDay: '',
      reportStation: [],
      dayReportTotalInfoArr: [], //用于上传日报的所有信息
    }
  }

  componentWillReceiveProps(nextProps){
    const { stationReportBaseData } = this.props;
    const nextReportBaseData = nextProps.stationReportBaseData;
    if( nextReportBaseData.length > 0 && stationReportBaseData.length === 0){ // 得到初始化列表数据
      const dayReportTotalInfoArr = nextReportBaseData.map(e=>({
        dailyReport: { ...e },
        dailyDetailList: e.defectId && e.defectId.split(',').filter(e=>!!e).map(m=>({
          defectId: m
        })) || [],
      }))
      console.log(dayReportTotalInfoArr)
      this.setState({ dayReportTotalInfoArr })
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

  totalReportInfoChange = (dayReportTotalInfoArr) => { // 用于上报的所有电站日报数据。
    this.setState({ dayReportTotalInfoArr }); //-- todo 改变的infoAr需要根据规则，对onchange的数据进行校验，根据校验结果给出提示。
    console.log(dayReportTotalInfoArr)
  }

  render(){
    const { reportDay, stations, reportStation, showReportInputList } = this.props;
    const canReport = reportDay && reportStation && reportStation.length > 0;
    const { dayReportTotalInfoArr } = this.state;
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
        {showReportInputList && <dailyReport
          {...this.props} 
          totalReportInfoChange={this.totalReportInfoChange}
          dayReportTotalInfoArr={dayReportTotalInfoArr} 
        />}
        <span>请填写数字，最多填写小数点后两位 -- todo</span>
        <span>请填写数字，最多填写小数点后四位 -- todo</span>
      </div>
    )
  }
}

export default SideReportPage;
