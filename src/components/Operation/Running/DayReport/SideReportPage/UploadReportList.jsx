
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import StationReportColumn from './StationReportColumn';
import EachStationReport from './EachStationReport';

class UploadReportList extends Component {
  static propTypes = {
    reportDay: PropTypes.string,
    dayReportConfig: PropTypes.array,
    reportStation: PropTypes.array,
    dayReportTotalInfoArr: PropTypes.array,
    toChangeDayReportStore: PropTypes.func,
    totalReportInfoChange: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  removeStation = (station) => {
    console.log('to remove station')
    console.log(station)
  }

  addAbnormalInfo = (station) => {
    console.log(' add abnormal info')
    console.log(station)
  }


  render(){
    const { reportDay, dayReportConfig, reportStation, totalReportInfoChange, dayReportTotalInfoArr } = this.props;
    // const stationType = reportStation[0].stationType; //注意： 后期解开。不能删。
    const stationType = 1; //注意： 调试用，后期删掉
    return (
      <div className={styles.uploadReportList}>
        <div>{reportDay}</div>
        <div>
          <StationReportColumn dayReportConfig={dayReportConfig} stationType={stationType} />
          {dayReportTotalInfoArr.map(e=>(<EachStationReport 
            stationInfo={e.dailyReport}
            removeStation={this.removeStation}
            addAbnormalInfo={this.addAbnormalInfo}
            totalReportInfoChange={totalReportInfoChange}
            dayReportTotalInfoArr={dayReportTotalInfoArr}
          />))}
        </div>
      </div>
    )
  }
}

export default UploadReportList;
