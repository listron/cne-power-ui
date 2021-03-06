import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentExpert.scss';
import AddIntelligent from './AddIntelligent';
import EditIntelligent from './EditIntelligent';
import ShowIntelligent from './ShowIntelligent';

class IntelligentSide extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    theme: PropTypes.string,
  }

  render() {
    const { showPage, theme } = this.props;
    return (
      <div className={`${styles.intelligentSide} ${styles[theme]}`} >
        {showPage === 'add' && <AddIntelligent {...this.props} />}
        {showPage === 'edit' && <EditIntelligent {...this.props} />}
        {showPage === 'detail' && <ShowIntelligent {...this.props} />}
      </div>
    );
  }
}

export default IntelligentSide;
