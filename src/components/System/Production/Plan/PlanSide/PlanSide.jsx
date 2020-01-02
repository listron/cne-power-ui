
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import AddPlan from './AddPlan';
import AddEditPlan from './AddEditPlan';

import Footer from '../../../../Common/Footer';

class PlanSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    addStationCodes:PropTypes.array,
    changePlanStore:PropTypes.func,
  }

  constructor(props){
    super(props);
  }



  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.planSide}>
        { showSidePage === 'add' && <AddPlan {...this.props} /> }
        { showSidePage === 'edit' && <AddEditPlan {...this.props} /> }
        {/* <Footer /> */}
      </div>
    )
  }
}

export default PlanSide;
