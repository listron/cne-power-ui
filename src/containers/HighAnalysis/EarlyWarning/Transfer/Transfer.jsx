import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./cleanoutRecord.scss";
import { transferAction } from './transferAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';

class Transfer extends Component {
  static propTypes = {
   
  }
  constructor(props, context) {
    super(props, context)
    
  }
 
  render() {
    return (
      <div className={styles.transferBox} >
       
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.advanceAanlysisReducer.cleanoutRecordReducer.toJS(),
    stations: state.common.get('stations'),
   
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeTransferStoreSaga: payload => dispatch({ type: transferAction.changeTransferStoreSaga, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(Transfer)