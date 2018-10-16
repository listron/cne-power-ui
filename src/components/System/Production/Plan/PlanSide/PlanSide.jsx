
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import AddPlan from './AddPlan';
import EditPlan from './EditPlan';

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

  componentWillUnmount(){
    this.props.changePlanStore({
      planStations:[],
      continueAdd:false,
      addPlanYear:'',
      addStationCodes:[],
    })
  }

  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.planSide}>
        {/*<AddPlan {...this.props} />*/}
        { showSidePage === 'add' && <AddPlan {...this.props} /> }
        { showSidePage === 'edit' && <EditPlan {...this.props} /> }
        <Footer />
      </div>
    )
  }
}

export default PlanSide;
