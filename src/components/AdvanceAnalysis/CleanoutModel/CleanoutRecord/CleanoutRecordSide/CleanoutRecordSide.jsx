
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanoutRecordSide.scss';

class StationManageSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  render(){
   
    return (
      <div className={styles.stationManageSide}>
       抽屉详情页
      </div>
    )
  }
}

export default StationManageSide;
