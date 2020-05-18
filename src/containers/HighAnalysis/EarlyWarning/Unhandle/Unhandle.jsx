import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './newUnhandle.scss';
import { unhandleAction } from './unhandleAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import Footer from '../../../../components/Common/Footer';
import UnhandleContainer from '../../../../components/HighAnalysis/EarlyWarning/Unhandle/Unhandle';

class Unhandle extends Component {
  static propTypes = {
    getDictionaryInfo: PropTypes.func,
    resetStore: PropTypes.func,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);

  }

  componentDidMount() {
    this.props.getDictionaryInfo({ dictionaryTypes: ['ignore_reason'], area: 0 });
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    const { theme = 'light' } = this.props;
    return (
      <div className={`${styles.UnhandleBox} ${styles[theme]}`} >
        <UnhandleContainer {...this.props} />
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.unhandle.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeUnhandleStore: payload => dispatch({ type: unhandleAction.changeUnhandleStoreSaga, payload }),
  getUnhandleList: payload => dispatch({ type: unhandleAction.getUnhandleList, payload }),
  toorder: payload => dispatch({ type: unhandleAction.toorder, payload }),
  ignoreList: payload => dispatch({ type: unhandleAction.ignoreList, payload }),
  getForewarningDetail: payload => dispatch({ type: unhandleAction.getForewarningDetail, payload }),
  getSequencechart: payload => dispatch({ type: unhandleAction.getSequencechart, payload }),
  getMatrixlist: payload => dispatch({ type: unhandleAction.getMatrixlist, payload }),
  resetStore: () => dispatch({ type: unhandleAction.resetStore }),
  getDictionaryInfo: params => dispatch({
    type: commonAction.getDictionaryInfo,
    payload: {
      params,
      actionName: unhandleAction.getUnhandleFetchSuccess,
      resultName: 'ignoreReason',
    },
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Unhandle);
