

import React, { Component } from '../../../../../node_modules/_@types_react@16.4.7@@types/react';
import PropTypes from 'C:/Users/admin/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/prop-types';

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
