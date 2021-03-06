import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './historyWarning.scss';
import PropTypes from 'prop-types';
import { historyWarningAction } from './historyWarningAction';
import Footer from '../../../../components/Common/Footer';
import HistoryWarningContainer from '../../../../components/HighAnalysis/IntelligentWarning/HistoryWarning/HistoryWarningContainer';

class HistoryWarning extends Component {
  static propTypes = {
    theme: PropTypes.string,
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
    const { pageName, defectId, theme } = this.props;
    const { showPage } = this.state;
    return (
      <div className={`${styles.history} ${styles[theme]}`}>
        <div className={styles.transferColor}>
          <div className={styles.transferAlarmContainer}>
            <HistoryWarningContainer {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.historyWarningReducer.toJS(),
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
