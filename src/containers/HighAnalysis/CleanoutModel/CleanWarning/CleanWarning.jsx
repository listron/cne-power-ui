import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./cleanWarning.scss";
import { cleanWarningAction } from './cleanWarningAction';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
// import CleanWarningMain from '../../../../components/HighAnalysis/CleanoutModel/CleanWarning/CleanWarningMain';
import CleanWarningSide from '../../../../components/HighAnalysis/CleanoutModel/CleanWarning/CleanWarningSide';

class CleanWarning extends Component {
  static propTypes = {
    showPage: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'list'
    }
  }

  onShowSideChange = ({showSidePage}) => {
    this.setState({ showSidePage });
  }

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }

  render() {
    console.log(this.props);
    const { showSidePage } = this.state;
    const { showPage } = this.props;
    return (
      <div className={styles.cleanWarningBox} id="cleanWarningBox">
        <CommonBreadcrumb  breadData={[{ name: '清洗预警' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.cleanWarningContainer}>
          {/* <CleanWarningMain {...this.props} /> */}
          <TransitionContainer
            show={showPage!=='list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <CleanWarningSide
              {...this.props} 
              showSidePage={showSidePage}
              onShowSideChange={this.onShowSideChange} 
            />
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
  // changeCleanoutWarningStore: payload => dispatch({type:cleanWarningAction.CHANGE_CLEANOUT_WARNING_STORE_SAGA, payload}),
})
export default connect(mapStateToProps, mapDispatchToProps)(CleanWarning)