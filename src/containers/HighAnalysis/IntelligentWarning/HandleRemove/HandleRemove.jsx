import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './handleRemove.scss';
import { handleRemoveAction } from './handleRemoveAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import HandleRemoveContainer from '../../../../components/HighAnalysis/IntelligentWarning/HandleRemove/HandleRemoveContainer';


class HandleRemove extends Component {
  static propTypes = {
    getLostGenType: PropTypes.func,
    resetHandleRemoveStore: PropTypes.func,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    // this.props.getLostGenType({ objectType: 1 })
  }
  componentWillUnmount() {
    this.props.resetHandleRemoveStore();
  }
  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.handle} ${styles[theme]}`}>
        <CommonBreadcrumb breadData={[{ name: '手动解除' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.handleRemoveBox}>
          <HandleRemoveContainer {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.handleRemoveReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    theme: state.common.get('theme'),

  };
};
const mapDispatchToProps = (dispatch) => ({
  getHandleRemoveStatistic: payload => dispatch({ type: handleRemoveAction.getHandleRemoveStatistic, payload }),
  changeHandleRemoveStore: payload => dispatch({ type: handleRemoveAction.changeHandleRemoveStore, payload }),
  resetHandleRemoveStore: payload => dispatch({ type: handleRemoveAction.resetHandleRemoveStore, payload }),
  getHandleRemoveList: payload => dispatch({ type: handleRemoveAction.getHandleRemoveList, payload }),
  getHandleRemoveTransfer: payload => dispatch({ type: handleRemoveAction.getHandleRemoveTransfer, payload }),
  getHandleRemoveInfo: payload => dispatch({ type: handleRemoveAction.getHandleRemoveInfo, payload }),
  cancleHandleRemove: payload => dispatch({ type: handleRemoveAction.cancleHandleRemove, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: handleRemoveAction.changeHandleRemoveStore,
      resultName: 'defectTypes',
    },
  }),

});
export default connect(mapStateToProps, mapDispatchToProps)(HandleRemove)
  ;
