
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import AddPlan from './AddPlan';
import EditPlan from './EditPlan';

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
        { showSidePage === 'add' && <AddPlan {...this.props} /> }
        { showSidePage === 'edit' && <EditPlan {...this.props} /> }
      </div>
    )
  }
}

export default PlanSide;
