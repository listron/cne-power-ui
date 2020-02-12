import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './meterRead.scss';
import MeterReadTable from './MeterReadTable';

class MeterReadSingleSatation extends Component{
  static propTypes= {

  }
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className={styles.meterReadSingle}>
        <div className={styles.meterReadSingleTop}>
          <div className={styles.text}>电表设置</div>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
        </div>
        <MeterReadTable {...this.props} />
      </div>
    );
  }
}

export default MeterReadSingleSatation;
