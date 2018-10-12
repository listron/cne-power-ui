
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
    deviceExistInfo: PropTypes.object,
    toChangeDayReportStore: PropTypes.func,
    totalReportInfoChange: PropTypes.func,
    findDeviceExist: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      abnormalInfo : {},
      abnormalList: [],
      abnormalModalshow: false,
    }
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
    totalReportInfoChange(uploadParams)
    showModal && this.setState({ // 关闭弹框
      abnormalModalshow: false,
    })
  }

  render(){
    const { reportDay, dayReportConfig, reportStation, findDeviceExist, deviceExistInfo, dayReportTotalInfoArr } = this.props;
    const { abnormalModalshow, abnormalInfo, abnormalList } = this.state;
    const stationType = reportStation[0].stationType; //注意： 后期解开。不能删。
    // const stationType = 1; //注意： 调试用，后期删掉
    return (
      <div className={styles.uploadReportList}>
        <div className={styles.uploadReportTip} >{reportDay} <span>新添加<i>{dayReportTotalInfoArr && dayReportTotalInfoArr.length || '--'}</i>条</span></div>
        <div>
          <StationReportColumn dayReportConfig={dayReportConfig} stationType={stationType} />
          {dayReportTotalInfoArr.map(e=>(<EachStationReport
            key={e.dailyReport.stationCode}
            stationInfo={e.dailyReport}
            addAbnormalInfo={this.addAbnormalInfo}
            totalInfoChange={this.totalInfoChange}
            dayReportTotalInfoArr={dayReportTotalInfoArr}
          />))}
        </div>
        {abnormalModalshow && <AbnormalReportModal 
          findDeviceExist={findDeviceExist}
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
