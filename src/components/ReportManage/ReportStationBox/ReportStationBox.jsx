import React from 'react';
import PropTypes from 'prop-types';
import styles from './reportStationBox.scss';
import ReportSeach from './ReportSeach';
import ReportTable from './ReportTable';

class ReportStationBox extends React.Component {
  static propTypes = {

  }
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className={styles.reportContainer}>
        <ReportSeach {...this.props} />
        <ReportTable {...this.props} />

      </div>
    );
  }
}
export default (ReportStationBox);

