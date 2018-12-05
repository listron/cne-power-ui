import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./Unhandle.scss";
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';

class Unhandle extends Component {
  static propTypes = {
   
  }
  constructor(props, context) {
    super(props, context)
    
  }
 
  render() {
    return (
      <div className={styles.UnhandleBox} >
         <FilterCondition />
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
  changeCleanoutRecordStore: payload => dispatch({ type: UnhandleAction.changeUnhandleStoreSage, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(Unhandle)