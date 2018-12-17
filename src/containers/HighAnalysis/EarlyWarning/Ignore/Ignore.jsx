import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./Ignore.scss";
import { ignoreAction } from './ignoreAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import Ingore from '../../../../components/HighAnalysis/EarlyWarning/Ignore/Ignore';

class Ignore extends Component {
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
      <div className={styles.ignoreBox} >
        <CommonBreadcrumb breadData={[{ name: '待处理预警',}]} style={{ marginLeft: '38px' }} />
        <div className={styles.ignoreContainer}>
          <Ingore {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.ignore.toJS(),
    stations: state.common.get('stations').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeIgnoreStore: payload => dispatch({ type: ignoreAction.changeIgnoreStoreSaga, payload }),
  getMatrixlist: payload => dispatch({ type: ignoreAction.getMatrixlist, payload }),
  getIgnoreList: payload => dispatch({ type: ignoreAction.getIgnoreList, payload }),
  getUnignore: payload => dispatch({ type: ignoreAction.getUnignore, payload }),
  resetStore: () => dispatch({ type: ignoreAction.resetStore }),
})
export default connect(mapStateToProps, mapDispatchToProps)(Ignore)