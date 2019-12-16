import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './combineInvert.scss';
import PropTypes from 'prop-types';
import Footer from '@components/Common/Footer';
import { combineInvertAction } from './combineInvertReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import ReportSearch from '@components//ReportManage/ReportDevice/CombineInvert/Search';
import ReportTable from '@components/ReportManage/ReportDevice/CombineInvert/Table';
import ReportHourTable from '@components/ReportManage/ReportDevice/CombineInvert/HourTable';

class CombineInvert extends Component {
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
      <div className={`${styles.combineInvert} ${styles[theme]}`} >
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
    ...state.reportManageReducer.combineInvert.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: combineInvertAction.changeStore, payload }),
  resetStore: payload => dispatch({ type: combineInvertAction.resetStore, payload }),
  getCombineInvertList: payload => dispatch({ type: combineInvertAction.getCombineInvertList, payload }),
  getDisabledStation: payload => dispatch({ type: combineInvertAction.getDisabledStation, payload }),
  getStationDeviceTypes: params => dispatch({ //  获取某一个电站下的设备
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: combineInvertAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: combineInvertAction.changeStore,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CombineInvert);
