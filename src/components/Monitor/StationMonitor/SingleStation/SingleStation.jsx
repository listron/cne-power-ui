

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './singleStation.scss'
import PvStation from './PvStation/PvStation';
import WindStation from './WindStation/WindStation';

class UserMain extends Component {
  static propTypes = {
    stationType: PropTypes.number,
  }

  constructor(props){
    super(props);
  }
  
  render(){
    const { stationType } = this.props;
    return (
      <div className={styles.singleStation}>
         {stationType === 0 && <PvStation {...this.props} />}
         {stationType === 1 && <WindStation {...this.props} />}
      </div>
    )
  }
}

export default UserMain;
