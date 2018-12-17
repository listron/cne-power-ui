import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./cleanWarning.scss";
import { cleanWarningAction } from './cleanWarningAction';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import CleanWarningMain from '../../../../components/HighAnalysis/CleanoutModel/CleanWarning/CleanWarningMain';
import CleanWarningSide from '../../../../components/HighAnalysis/CleanoutModel/CleanWarning/CleanWarningSide';

class CleanWarning extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    resetCleanWarningStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount(){
    this.props.resetCleanWarningStore();
  }

  render() {
    console.log(this.props);
    const { showPage } = this.props;
    return (
      <div className={styles.cleanWarningBox}>
        <CommonBreadcrumb  breadData={[{ name: '清洗预警' }]} style={{ marginLeft: '38px' }} />
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
    )
  }
}
const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.cleanWarning.toJS(),
  stations: state.common.get('stations').toJS()
})
const mapDispatchToProps = (dispatch) => ({
  changeCleanWarningStore: payload => dispatch({type:cleanWarningAction.CHANGE_CLEAN_WARNING_STORE, payload}),
  resetCleanWarningStore: payload => dispatch({type: cleanWarningAction.RESET_STORE})
})
export default connect(mapStateToProps, mapDispatchToProps)(CleanWarning)