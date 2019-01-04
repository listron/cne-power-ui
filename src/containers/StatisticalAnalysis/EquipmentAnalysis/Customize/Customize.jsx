import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./customize.scss";
import PropTypes from 'prop-types';
import { customizeAction } from './customizeAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';

class Customize extends Component {
  static propTypes = {
    resetStore:PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
  }

  componentWillUnmount(){
    this.props.resetStore()
  }

  render() {
    return (
      <div className={styles.customizeBox}>
        <CommonBreadcrumb breadData={[{name:'自定义对比'}]} style={{marginLeft:'38px'}} />
        <div className={styles.customizeContainer}>
          
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.statisticalAnalysisReducer.customize.toJS(),
    stations: state.common.get('stations').toJS(),
  })
}
const mapDispatchToProps = (dispatch) => ({
  changeCleanoutRecordStore: payload => dispatch({ type: customizeAction.changeManufacturersStoreSaga, payload }),
  resetStore: () => dispatch({ type: customizeAction.resetStore }),
})
export default connect(mapStateToProps, mapDispatchToProps)(Customize)