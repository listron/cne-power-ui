import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './centerInvert.scss';
import PropTypes from 'prop-types';
// import ReportStationBox from '../../../components/ReportManage/ReportStationBox/ReportStationBox';
import Footer from '@components/Common/Footer';
import { centerInvertAction } from './centerInvertReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import ReportSearch from '../../../../../components/ReportManage/PvReport/ReportDevice/CenterInvert/Search';
import ReportTable from '../../../../../components/ReportManage/PvReport/ReportDevice/CenterInvert/Table';
import ReportHourTable from '../../../../../components/ReportManage/PvReport/ReportDevice/CenterInvert/HourTable';

class CenterInvert extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    dateType: PropTypes.string,
    getDisabledStation: PropTypes.func,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() { // 获取当前用户下没有该设备的电站
    this.props.getDisabledStation();
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    const { dateType, theme } = this.props;
    return (
      <div className={`${styles.centerInvert} ${styles[theme]}`} >
        <div className={styles.reportbox}>
          <ReportSearch {...this.props} />
          {dateType === 'hour' && <ReportHourTable {...this.props} /> || <ReportTable {...this.props} />}
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
    theme: state.common.get('theme'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: centerInvertAction.changeStore, payload }),
  resetStore: payload => dispatch({ type: centerInvertAction.resetStore, payload }),
  getCenterInverList: payload => dispatch({ type: centerInvertAction.getCenterInverList, payload }),
  getDisabledStation: payload => dispatch({ type: centerInvertAction.getDisabledStation, payload }),
  getStationDeviceTypes: params => dispatch({ //  获取某一个电站下的设备
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: centerInvertAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: centerInvertAction.changeStore,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CenterInvert);
