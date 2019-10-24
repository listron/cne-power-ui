import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './weatherStation.scss';
import PropTypes from 'prop-types';
// import ReportStationBox from '../../../components/ReportManage/ReportStationBox/ReportStationBox';
import CommonBreadcrumb from '@components/Common/CommonBreadcrumb';
import Footer from '@components/Common/Footer';
import { weatherStationAction } from './weatherStationReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import ReportSearch from '../../../../components//ReportManage/ReportDevice/WeatherStation/Search';
import ReportTable from '../../../../components/ReportManage/ReportDevice/WeatherStation/Table';
import ReportHourTable from '../../../../components/ReportManage/ReportDevice/WeatherStation/HourTable';

class WeatherStation extends Component {
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
      <div className={`${styles.weatherStation} ${styles[theme]}`} >
        <CommonBreadcrumb breadData={[{ name: '气象站' }]} style={{ marginLeft: '38px' }} />
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
    ...state.reportManageReducer.weatherStation.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: weatherStationAction.changeStore, payload }),
  resetStore: payload => dispatch({ type: weatherStationAction.resetStore, payload }),
  getWeatherStationList: payload => dispatch({ type: weatherStationAction.getWeatherStationList, payload }),
  getDisabledStation: payload => dispatch({ type: weatherStationAction.getDisabledStation, payload }),
  getStationDeviceTypes: params => dispatch({ //  获取某一个电站下的设备
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: weatherStationAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: weatherStationAction.changeStore,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherStation);
