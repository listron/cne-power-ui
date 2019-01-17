import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./handleRemove.scss";
import { handleRemoveActive } from './handleRemoveActive';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import HandleRemoveContainer from '../../../../components/HighAnalysis/IntelligentWarning/HandleRemove/HandleRemoveContainer';


class HandleRemove extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.props.getLostGenType({ objectType: 1 })
  }
  componentWillUnmount(){
    this.props.resetHandleRemoveStore()
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '手动解除',
        }
      ],
    };
    return (
      <div className={styles.handle}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.handleRemoveBox}>
          <HandleRemoveContainer {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.handleRemoveReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),

  }
}
const mapDispatchToProps = (dispatch) => ({
  getHandleRemoveStatistic: payload => dispatch({ type: handleRemoveActive.getHandleRemoveStatistic, payload }),
  changeHandleRemoveStore: payload => dispatch({ type: handleRemoveActive.changeHandleRemoveStore, payload }),
  resetHandleRemoveStore: payload => dispatch({ type: handleRemoveActive.resetHandleRemoveStore, payload }),
  getHandleRemoveList: payload => dispatch({ type: handleRemoveActive.getHandleRemoveList, payload }),
  getHandleRemoveTransfer: payload => dispatch({ type: handleRemoveActive.getHandleRemoveTransfer, payload }),
  cancleHandleRemove: payload => dispatch({ type: handleRemoveActive.cancleHandleRemove, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: handleRemoveActive.changeHandleRemoveStore,
      resultName: 'defectTypes'
    }
  }),

})
export default connect(mapStateToProps, mapDispatchToProps)(HandleRemove)