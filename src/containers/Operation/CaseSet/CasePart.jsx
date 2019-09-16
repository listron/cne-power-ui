import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { casePartAction } from './casePartAction';
import styles from './casePart.scss';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import Footer from '../../../components/Common/Footer';
import TransitionContainer from '../../../components/Common/TransitionContainer';
import CasePartSide from '../../../components/Operation/CaseSet/CasePartSide';
import CaseSearch from '../../../components/Operation/CaseSet/CaseSearch';
import CaseHanlde from '../../../components/Operation/CaseSet/CaseHanlde';
import CaseList from '../../../components/Operation/CaseSet/CaseList';

class CasePart extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    showPage: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showSidePage: 'add',
    };
  }
  componentWillUnmount() {
    this.props.resetStore(); // 重置数据
  }
  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage,
    });
  };
  render() {
    const { showSidePage } = this.state;
    const { showPage } = this.props;
    return (
      <div className={styles.casePart}>
        <CommonBreadcrumb breadData={[{ name: '案例集' }]} style={{ marginLeft: '38px', backgroundColor: '#fff' }} />
        <div className={styles.casePartBox}>
          <div className={styles.casePartMain}>
            <div className={styles.casePartContent}>
              <CaseSearch {...this.props} />
              <CaseHanlde {...this.props} />
              <CaseList {...this.props} />
            </div>
          </div>
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <CasePartSide {...this.props} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} />
          </TransitionContainer>

        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.operation.casePartReducer.toJS(),
    stations: state.common.get('stations').toJS(),

  };
};
const mapDispatchToProps = (dispatch) => ({
  changeCasePartStore: payload => dispatch({ type: casePartAction.changeCasePartStore, payload }),
  resetStore: payload => dispatch({ type: casePartAction.resetStore, payload }),
  getCasePartList: payload => dispatch({ type: casePartAction.getCasePartList, payload }),
  getDeviceMode: payload => dispatch({ type: casePartAction.getDeviceMode, payload }),
  getQuestionList: payload => dispatch({ type: casePartAction.getQuestionList, payload }),
  getCasePartDetail: payload => dispatch({ type: casePartAction.getCasePartDetail, payload }),
  addCasePart: payload => dispatch({ type: casePartAction.addCasePart, payload }),
  likeCase: payload => dispatch({ type: casePartAction.likeCase, payload }),
  editCasePart: payload => dispatch({ type: casePartAction.editCasePart, payload }),
  deleteCasePart: payload => dispatch({ type: casePartAction.deleteCasePart, payload }),
  queryUseName: payload => dispatch({ type: casePartAction.queryUseName, payload }),
  importCase: payload => dispatch({ type: casePartAction.importCase, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(CasePart);
