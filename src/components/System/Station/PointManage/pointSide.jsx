
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pointSide.scss';
import AddPoint from './AddPoint/AddPoint';
import DetailPoint from './DetailPoint/DetailPoint';
import EditPoint from './EditPoint/EditPoint';


class PointSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { showSidePage } = this.props;
    return (
      <div className={styles.pointSide}>
        {showSidePage === 'detail' && <DetailPoint {...this.props} />}
        {showSidePage === 'add' && <AddPoint {...this.props} />}
        {showSidePage === 'edit' && <EditPoint {...this.props} />}
      </div>
    );
  }
}

export default PointSide;
