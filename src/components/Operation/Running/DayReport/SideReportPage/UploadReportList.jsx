
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import StationReportColumn from './StationReportColumn';
import EachStationReport from './EachStationReport';
import AbnormalReportModal from './AbnormalReportModal';

class UploadReportList extends Component {
  static propTypes = {
    reportDay: PropTypes.string,
    dayReportConfig: PropTypes.array,
    reportStation: PropTypes.array,
    dayReportTotalInfoArr: PropTypes.array,
    lostGenTypes: PropTypes.array,
    deviceExistInfo: PropTypes.object,
    toChangeDayReportStore: PropTypes.func,
    totalReportInfoChange: PropTypes.func,
    findDeviceExist: PropTypes.func,
    getLostGenType: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      abnormalInfo : {},
      abnormalList: [],
      abnormalModalshow: false,
    }
  }

  componentDidMount(){
    const { reportStation, getLostGenType } = this.props;
    const stationType = reportStation[0] && reportStation[0].stationType || 1; 
    getLostGenType({ // 选中电站的所有故障类型
      stationType, 
      defectType: -1, 
      type: 0,
    })
  }

  addAbnormalInfo = (abnormalInfo, abnormalList) => {
    this.setState({
      abnormalModalshow: true,
      abnormalInfo,
      abnormalList,
    })
  }

  hideAbnormalModal = () => {
    this.setState({
      abnormalModalshow: false,
      abnormalInfo: {},
      abnormalList: [],
    })
  }

  totalInfoChange = (uploadParams, showModal=false) => {
    const { totalReportInfoChange, dayReportConfig } = this.props;
    // const requireTarget = dayReportConfig[1] || {};
    // const unitConfig = dayReportConfig[0] || {};
    // const genUnit = unitConfig.power || 'kWh'; // kWh两位小数，万kWh四位小数。
    // const allTargetName = [
    //   'resourceValue', 
    //   'yearGenIntegrated', 
    //   'yearGenInternet', 
    //   'yearGenInverter', 
    //   'buyPower', 
    //   'modelInverterCapacity', 
    //   'modelInverterPowerGen'
    // ];
    // // 判断必填项未填：
    // uploadParams.find(eachStation=>{
    //   const stationCheckError = allTargetName.find(e=>{  //查找不合规范数据。
    //     const checkedValue = eachStation.dailyReport[e];
    //     if(requireTarget[e]){ 
    //       // 必填项未填
    //       (!checkedValue && checkedValue !== 0) && this.setState({
    //         dataErrorText: '', // 日报数据错误提示文字
    //         showDataError: true, // 日报数据错误弹框展示。
    //       })
    //       return true;
    //       // 填入数据不符合格式// 必填项
    //     }
    //   })
    //   return stationCheckError;
    // })
    // 需于此处检查各电站基础报表数据项的必填+是否数字+小数。
    totalReportInfoChange(uploadParams);
    showModal && this.setState({ // 关闭弹框
      abnormalModalshow: false,
    })
  }

  // reportInforErrorShow = (dataErrorText) => { // 错误信息展示2s
  //   this.setState({
  //     showDataError: true,
  //     dataErrorText
  //   });
  //   setTimeout(()=>{this.setState({
  //     showDataError: false,
  //   })},2000)
  // }

  render(){
    const { reportDay, dayReportConfig, reportStation, findDeviceExist, deviceExistInfo, dayReportTotalInfoArr, lostGenTypes } = this.props;
    const { abnormalModalshow, abnormalInfo, abnormalList } = this.state;
    const stationType = reportStation[0] && reportStation[0].stationType || 1; 
    return (
      <div className={styles.uploadReportList}>
        <div className={styles.uploadReportTip} >{reportDay} <span>新添加<i>{dayReportTotalInfoArr && dayReportTotalInfoArr.length || '--'}</i>条</span></div>
        <div>
          <StationReportColumn dayReportConfig={dayReportConfig} stationType={stationType} />
          {dayReportTotalInfoArr.map(e=>(<EachStationReport
            key={e.dailyReport.stationCode}
            dayReportConfig={dayReportConfig}
            stationInfo={e.dailyReport}
            addAbnormalInfo={this.addAbnormalInfo}
            totalInfoChange={this.totalInfoChange}
            dayReportTotalInfoArr={dayReportTotalInfoArr}
          />))}
        </div>
        {abnormalModalshow && <AbnormalReportModal 
          findDeviceExist={findDeviceExist}
          lostGenTypes={lostGenTypes}
          deviceExistInfo={deviceExistInfo}
          abnormalInfo={abnormalInfo}
          abnormalList={abnormalList}
          abnormalModalshow={abnormalModalshow}
          hideAbnormalModal={this.hideAbnormalModal}
          totalInfoChange={this.totalInfoChange}
          dayReportTotalInfoArr={dayReportTotalInfoArr}
        />}
        
      </div>
    )
  }
}

export default UploadReportList;
