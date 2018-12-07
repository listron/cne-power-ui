import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./Unhandle.scss";
import { unhandleAction } from './unhandleAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import UnhandleContainer from '../../../../components/HighAnalysis/EarlyWarning/Unhandle/Unhandle'

class Unhandle extends Component {
  static propTypes = {

  }
  constructor(props, context) {
    super(props, context)

  }

  componentDidMount(){
    // this.props.getLostGenType({objectType:1,stationCodes:350})
    // this.props.getLostGenType({objectType:1})
  }

  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '待处理预警',
        }
      ],
    };
    return (
      <div className={styles.UnhandleBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.unhandleContainer}>
          <UnhandleContainer {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.advanceAanlysisReducer.unhandle.toJS(),
    stations: state.common.get('stations').toJS(),

  }
}

const mapDispatchToProps = (dispatch) => ({
  changeUnhandleStore: payload => dispatch({ type: unhandleAction.changeUnhandleStoreSaga, payload }),
  getUnhandleList: payload => dispatch({type:unhandleAction.getUnhandleList, payload}),
  toorder: payload => dispatch({type:unhandleAction.toorder, payload}),
  ignoreList: payload => dispatch({type:unhandleAction.ignoreList, payload}),
  getForewarningDetail: payload => dispatch({type:unhandleAction.getForewarningDetail, payload}),
  getSequencechart: payload => dispatch({type:unhandleAction.getSequencechart, payload}),
  resetStore: () => dispatch({ type: unhandleAction.resetStore }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params, 
      actionName: unhandleAction.getUnhandleFetchSuccess, 
      resultName: 'defectTypes'
    }
  }),
})
export default connect(mapStateToProps, mapDispatchToProps)(Unhandle)