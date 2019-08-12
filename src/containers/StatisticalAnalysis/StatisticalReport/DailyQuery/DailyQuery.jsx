import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './dailyQuery.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { dailyQueryAction } from './dailyQueryAction';
import Footer from '../../../../components/Common/Footer/index';
import DailySearch from '../../../../components/StatisticalAnalysis/StatisticalReport/DailyQuery/DailySearch';

class DailyQuery extends Component {
  static propTypes = {

  }

  render(){
    return(
      <div className={styles.dailyQuery}>
        <CommonBreadcrumb breadData={[{name: '日报查询'}]} style={{ marginLeft: '40px' }} />
        <div className={styles.dailyQueryBox}>
          <DailySearch {...this.props} />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyQuery);
