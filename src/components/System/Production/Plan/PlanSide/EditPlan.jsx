
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import Footer from '../../../../Common/Footer';

class PlanSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.planSide}>
        我是增加页面
      </div>
    )
  }
}

export default PlanSide;
