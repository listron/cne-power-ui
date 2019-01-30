
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './dayReportAll.scss';
import SideReportPage from './SideReportPage/SideReportPage';
import ReportDetail from './DayReportEditDetail/ReportDetail';
import ReportEdit from './DayReportEditDetail/ReportEdit';
import Footer from '../../../Common/Footer';

class DayReportSide extends Component {
  static propTypes = {
    sidePage: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { sidePage } = this.props;
    return (
      <div className={styles.dayReportSide}>
        { sidePage === 'report' && <SideReportPage {...this.props} /> }
        { sidePage === 'detail' && <ReportDetail {...this.props} /> }
        { sidePage === 'edit' && <ReportEdit {...this.props} /> }
        <Footer />
      </div>
    )
  }
}

export default DayReportSide;
