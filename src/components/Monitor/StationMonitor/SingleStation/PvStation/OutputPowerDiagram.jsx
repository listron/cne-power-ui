

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import {   } from 'antd';

class OutputPowerDiagram extends Component {
  static propTypes = {
    singleStationData: PropTypes.object,
  }

  constructor(props){
    super(props);
  }
  
  render(){
    const { singleStationData } = this.props;

    return (
      <div className={styles.outputPowerDiagram}>
        <div className={styles.outputDiagram} >

        </div>
        <div className={styles.powerDiagram} >

        </div>
        
      </div>
    )
  }
}

export default OutputPowerDiagram;
