
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
    stationDeviceTypes: PropTypes.array,
    lostGenTypes: PropTypes.array,
    deviceExistInfo: PropTypes.object,
    toChangeDayReportStore: PropTypes.func,
    totalReportInfoChange: PropTypes.func,
    findDeviceExist: PropTypes.func,
    getLostGenType: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
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
    const { totalReportInfoChange } = this.props;
    totalReportInfoChange(uploadParams);
    showModal && this.setState({ // 关闭弹框
      abnormalModalshow: false,
    })
  }

  render(){
    const { reportDay,stationDeviceTypes, getStationDeviceTypes, dayReportConfig, reportStation, findDeviceExist, deviceExistInfo, dayReportTotalInfoArr, lostGenTypes, getLostGenType } = this.props;
    const { abnormalModalshow, abnormalInfo, abnormalList } = this.state;
    const stationType = reportStation[0] && reportStation[0].stationType; 
    return (
      <div className={styles.uploadReportList}>
        <div className={styles.uploadReportTip} >{reportDay} <span>新添加<i>{dayReportTotalInfoArr && dayReportTotalInfoArr.length || '--'}</i>条</span></div>
        <div>
          <StationReportColumn dayReportConfig={dayReportConfig} stationType={stationType} />
          {dayReportTotalInfoArr.map(e=> {// 判定是否有图表提示添加异常损失
            const hasAbnormal = e.dailyDetailList.find(e=>(!e.lostPower && e.lostPower!== 0));
            return (<EachStationReport
              hasAbnormal={hasAbnormal}
              key={e.dailyReport.stationCode}
              dayReportConfig={dayReportConfig}
              stationInfo={e.dailyReport}
              addAbnormalInfo={this.addAbnormalInfo}
              totalInfoChange={this.totalInfoChange}
              dayReportTotalInfoArr={dayReportTotalInfoArr}
            />)
          })}
        </div>
        {abnormalModalshow && <AbnormalReportModal
          stationType={stationType} 
          dayReportConfig={dayReportConfig}
          findDeviceExist={findDeviceExist}
          lostGenTypes={lostGenTypes}
          deviceExistInfo={deviceExistInfo}
          abnormalInfo={abnormalInfo}
          abnormalList={abnormalList}
          abnormalModalshow={abnormalModalshow}
          hideAbnormalModal={this.hideAbnormalModal}
          totalInfoChange={this.totalInfoChange}
          dayReportTotalInfoArr={dayReportTotalInfoArr}
          stationDeviceTypes={stationDeviceTypes}
          getStationDeviceTypes={getStationDeviceTypes}
          getLostGenType={getLostGenType}
        />}
        
      </div>
    )
  }
}

export default UploadReportList;
