import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentExpert.scss';
import AddIntelligent from './AddIntelligent';
import EditIntelligent from './EditIntelligent';
import ShowIntelligent from './ShowIntelligent';

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
        {showSidePage === 'show' && <ShowIntelligent {...this.props} />}
      </div>
      )
    }
  }

  export default IntelligentSide;