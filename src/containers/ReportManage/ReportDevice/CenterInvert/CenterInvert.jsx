import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './centerInvert.scss';
import PropTypes from 'prop-types';
// import ReportStationBox from '../../../components/ReportManage/ReportStationBox/ReportStationBox';
import CommonBreadcrumb from '@components/Common/CommonBreadcrumb';
import Footer from '@components/Common/Footer';
import { centerInvertAction } from './centerInvertReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import ReportSearch from '../../../../components//ReportManage/ReportDevice/CenterInvert/Search';
import ReportTable from '../../../../components/ReportManage/ReportDevice/CenterInvert/Table';
import ReportDayTable from '../../../../components/ReportManage/ReportDevice/CenterInvert/DayTable';

class CenterInvert extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentWillUnmount() {
    this.props.resetStore();
  }
  render() {

    return (
      <div className={styles.centerInvert} >
        <CommonBreadcrumb breadData={[{ name: '集中式逆变器' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.reportbox}>
          <ReportSearch {...this.props} />
          {/* <ReportTable {...this.props} /> */}
          <ReportDayTable {...this.props} />
          {/* <ReportStationBox {...this.props} /> */}
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.reportManageReducer.centerInvert.toJS(),
    stations: state.common.get('stations').toJS(),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: centerInvertAction.changeStore, payload }),
  resetStore: payload => dispatch({ type: centerInvertAction.resetStore, payload }),
  getCenterInverList: payload => dispatch({ type: centerInvertAction.getCenterInverList, payload }),
  exportCenterInvert: payload => dispatch({ type: centerInvertAction.exportCenterInvert, payload }),
  getStationDeviceTypes: params => dispatch({ //  获取某一个电站下的设备
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: centerInvertAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CenterInvert);
