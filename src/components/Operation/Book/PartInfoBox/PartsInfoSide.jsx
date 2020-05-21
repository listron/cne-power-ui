
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './partInfoBox.scss';
import AddPartsInfo from './AddPartsInfo';
import EditPartsInfo from './EditPartsInfo';




class PartsInfoSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,

  }

  constructor(props) {
    super(props);
  }

  render() {
    const { showSidePage } = this.props;
    return (
      <div className={styles.partsInfoSide}>
        {showSidePage === 'add' && <AddPartsInfo {...this.props} />}
        {showSidePage === 'edit' && <EditPartsInfo {...this.props} />}
      </div>
    );
  }
}

export default PartsInfoSide;
