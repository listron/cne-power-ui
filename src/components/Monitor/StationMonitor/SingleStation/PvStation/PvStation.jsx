

import React, { Component } from 'react';
import propTypes from 'prop-types';
import PvStationTop from './PvStationTop';
import OutputPowerDiagram from './OutputPowerDiagram';
import CardSection from './CardSection';
import styles from './pvStation.scss';

class PvStation extends Component {
  static propTypes = {
  }

  constructor(props){
    super(props);
  }
  
  render(){
    return (
      <div className={styles.pvStation}>
        <PvStationTop {...this.props} />
        <OutputPowerDiagram {...this.props} />  
        <CardSection {...this.props} />
      </div>
    )
  }
}

export default PvStation;
