
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanoutRecordSide.scss';
import CleanoutRecordDetail from './CleanoutRecordDetail';
import CleanoutPlanRecord from './CleanoutPlanRecord';

class CleanoutRecordSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  constructor(props){
    super(props);
    
  }
  

  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.cleanoutRecordSide}>
       { showSidePage === 'detail' && <CleanoutRecordDetail {...this.props} /> }
       { showSidePage === 'planRecord' && <CleanoutPlanRecord {...this.props} /> }
   
      </div>
    )
  }
}

export default CleanoutRecordSide;
