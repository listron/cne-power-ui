import React from 'react';
import PropTypes from 'prop-types';
import styles from './CasePartSide.scss';
import AddCase from './AddCase/AddCase';
import DetailCase from './DetailCase/DetailCase';
import EditCase from './EditCase/EditCase';
class CasePartSide extends React.Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { showSidePage } = this.props;
    return (
      <div className={styles.pointSide}>
        {showSidePage === 'detail' && <DetailCase {...this.props} />}
        {showSidePage === 'add' && <AddCase {...this.props} />}
        {showSidePage === 'edit' && <EditCase {...this.props} />}
      </div>
    );
  }
}
export default (CasePartSide);
