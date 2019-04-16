

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './singleStationMain.scss';
import PvStation from './PvStation/PvStation';
// import WindStation from './WindStation/WindStation';
import WindStation from './NewWindStation/WindStation';

class SingleStationMain extends Component {
  static propTypes = {
    stationType: PropTypes.string,
  }
  constructor(props){
    super(props);
  }
  render(){
    const { stationType } = this.props;
    return (
      <div className={styles.singleStation}>
        {stationType === '1' && <PvStation {...this.props} />}
        {stationType === '0' && <WindStation {...this.props} />}
      </div>
    )
  }
}

export default SingleStationMain;
