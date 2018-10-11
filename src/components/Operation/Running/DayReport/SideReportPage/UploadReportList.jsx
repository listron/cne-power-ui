
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import StationReportColumn from './StationReportColumn';

class UploadReportList extends Component {
  static propTypes = {
    reportDay: PropTypes.string,
    dayReportConfig: PropTypes.array
  }

  constructor(props){
    super(props);
  }

  render(){
    const { reportDay, dayReportConfig } = this.props;
    return (
      <div className={styles.uploadReportList}>
        <div className={styles.uploadReportTip} >{reportDay} <span>新添加<i></i>条</span></div>
        <div>
          <StationReportColumn dayReportConfig={dayReportConfig} />
        </div>
      </div>
    )
  }
}

export default UploadReportList;
