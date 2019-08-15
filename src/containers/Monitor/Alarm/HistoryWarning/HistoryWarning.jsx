import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './historyWarning.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { historyWarningAction } from './historyWarningAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import WorkOrder from '../../../Operation/Ticket/WorkOrder/WorkOrder';



import Footer from '../../../../components/Common/Footer';
import HistoryWarningContainer from '../../../../components/Monitor/Alarm/HistoryWarning/HistoryWarningContainer';

class HistoryWarning extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showPage: false,
    };
  }


  componentWillUnmount() {
    this.props.resetHistoryWarningStore();
  }
  onEnterToggleSide = () => {//动态切换页面,开
    this.setState({ showPage: true });
  }

  onEndToggleSide = () => {//动态切换页面,关
    this.setState({ showPage: false });
    this.props.changeHistoryWarningStore({ defectId: '' });
  }
  prevChange = (value) => { // 切换到当前页
    this.props.changeHistoryWarningStore({ ...value });
  }
  render() {
    const { pageName, defectId } = this.props;
    const { showPage } = this.state;
    return (
      <div className={styles.history}>
        <CommonBreadcrumb breadData={[{ name: '历史告警' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.transferColor}>
          <div className={styles.transferAlarmContainer}>
            <HistoryWarningContainer {...this.props} />
            <TransitionContainer
              show={pageName === 'detail'}
              timeout={500}
              effect="side"
              onEnter={this.onEnterToggleSide}
              onExited={this.onEndToggleSide}
            >
              <WorkOrder defectId={defectId} otherFrom={true} pageName={'list'} onChange={this.prevChange}
                showPage={showPage}
              />
            </TransitionContainer>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.historyWarningReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeHistoryWarningStore: payload => dispatch({ type: historyWarningAction.changeHistoryWarningStore, payload }),
  resetHistoryWarningStore: payload => dispatch({ type: historyWarningAction.resetHistoryWarningStore, payload }),
  getHistoryarningList: payload => dispatch({ type: historyWarningAction.getHistoryarningList, payload }),
  getHistoryTicketInfo: payload => dispatch({ type: historyWarningAction.getHistoryTicketInfo, payload }),
  getHistoryRelieveInfo: payload => dispatch({ type: historyWarningAction.getHistoryRelieveInfo, payload }),




});
export default connect(mapStateToProps, mapDispatchToProps)(HistoryWarning);
