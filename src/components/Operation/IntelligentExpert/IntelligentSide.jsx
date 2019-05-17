import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentExpert.scss';
import AddIntelligent from './AddIntelligent';
import EditIntelligent from './EditIntelligent';

class IntelligentSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  render() {
    const { showSidePage } = this.props;
    return (
      <div className={styles.intelligentSide}>
        {showSidePage === 'add' && <AddIntelligent {...this.props} /> }
        {showSidePage === 'edit' && <EditIntelligent {...this.props} /> }
      </div>
      )
    }
  }

  export default IntelligentSide;