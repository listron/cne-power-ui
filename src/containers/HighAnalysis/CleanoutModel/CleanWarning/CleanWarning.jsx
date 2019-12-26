import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './cleanWarning.scss';
import { cleanWarningAction } from './cleanWarningAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import CleanWarningMain from '../../../../components/HighAnalysis/CleanoutModel/CleanWarning/CleanWarningMain';
import CleanWarningSide from '../../../../components/HighAnalysis/CleanoutModel/CleanWarning/CleanWarningSide';

class CleanWarning extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    resetCleanWarningStore: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.resetCleanWarningStore();
  }

  render() {
    const { showPage, theme } = this.props;
    return (
      <div className={`${styles.cleanWarningBox} ${styles[theme]}`}>
        <div className={styles.cleanWarningContainer}>
          <CleanWarningMain {...this.props} />
          <TransitionContainer
            show={showPage !== 'list'}
            timeout={500}
            effect="side"
          >
            <CleanWarningSide {...this.props} />
          </TransitionContainer>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.cleanWarning.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});
const mapDispatchToProps = (dispatch) => ({
  changeCleanWarningStore: payload => dispatch({ type: cleanWarningAction.CHANGE_CLEAN_WARNING_STORE, payload }),
  resetCleanWarningStore: payload => dispatch({ type: cleanWarningAction.RESET_STORE }),
  getCleanWarningList: payload => dispatch({ type: cleanWarningAction.getCleanWarningList, payload }),
  getCleanWarningDetail: payload => dispatch({ type: cleanWarningAction.getCleanWarningDetail, payload }),
  getTotalDustEffect: payload => dispatch({ type: cleanWarningAction.getTotalDustEffect, payload }),
  getMatrixDustEffect: payload => dispatch({ type: cleanWarningAction.getMatrixDustEffect, payload }),
  getWeather: params => dispatch({
    type: commonAction.getWeather, payload: {
      params,
      actionName: cleanWarningAction.GET_CLEAN_WARNING_FETCH_SUCCESS,
      resultName: 'weatherList',
    },
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(CleanWarning)
  ;
