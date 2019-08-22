import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './dailyQuery.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { commonAction } from '../../../alphaRedux/commonAction';
import { dailyQueryAction } from './dailyQueryAction';
import Footer from '../../../../components/Common/Footer/index';
import DailySearch from '../../../../components/StatisticalAnalysis/StatisticalReport/DailyQuery/DailySearch';
import QuotaList from '../../../../components/StatisticalAnalysis/StatisticalReport/DailyQuery/QuotaList';
import FaultList from '../../../../components/StatisticalAnalysis/StatisticalReport/DailyQuery/FaultList';
import LimitList from '../../../../components/StatisticalAnalysis/StatisticalReport/DailyQuery/LimitList';

class DailyQuery extends Component {
  static propTypes = {
    tableType: PropTypes.string,
    resetStore: PropTypes.func,
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render(){
    const { tableType } = this.props;
    return(
      <div className={styles.dailyQuery}>
        <CommonBreadcrumb breadData={[{name: '日报查询'}]} style={{ marginLeft: '40px' }} />
        <div className={styles.dailyQueryBox}>
          <DailySearch {...this.props} />
          {tableType === 'quotaList' && <QuotaList {...this.props} />}
          {tableType === 'faultList' && <FaultList {...this.props} />}
          {tableType === 'limitList' && <LimitList {...this.props} />}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.dailyQueryReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeDailyQueryStore: payload => dispatch({ type: dailyQueryAction.changeDailyQueryStore, payload}),
  resetStore: payload => dispatch({ type: dailyQueryAction.resetStore, payload}),
  getQuota: payload => dispatch({ type: dailyQueryAction.getQuota, payload}),
  getFault: payload => dispatch({ type: dailyQueryAction.getFault, payload}),
  getQuotaList: payload => dispatch({ type: dailyQueryAction.getQuotaList, payload}),
  getFaultList: payload => dispatch({ type: dailyQueryAction.getFaultList, payload}),
  getLimitList: payload => dispatch({ type: dailyQueryAction.getLimitList, payload}),
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload: {
    ...payload,
    actionName: dailyQueryAction.changeDailyQueryStore,
  }}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyQuery);
