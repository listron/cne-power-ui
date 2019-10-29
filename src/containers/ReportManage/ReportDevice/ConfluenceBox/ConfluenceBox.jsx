import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './confluenceBox.scss';
import PropTypes from 'prop-types';
import CommonBreadcrumb from '@components/Common/CommonBreadcrumb';
import Footer from '@components/Common/Footer';
import { confluenceBoxAction } from './confluenceBoxReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import ReportSearch from '@components//ReportManage/ReportDevice/ConfluenceBox/Search';
import ReportHourTable from '@components/ReportManage/ReportDevice/ConfluenceBox/Table';

class ConfluenceBox extends Component {
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
    const { theme } = this.props;
    return (
      <div className={`${styles.confluenceBox} ${styles[theme]}`} >
        <CommonBreadcrumb breadData={[{ name: '汇流箱' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.reportbox}>
          <ReportSearch {...this.props} />
          <ReportHourTable {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.reportManageReducer.confluenceBox.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: confluenceBoxAction.changeStore, payload }),
  resetStore: payload => dispatch({ type: confluenceBoxAction.resetStore, payload }),
  getConfluenceBoxList: payload => dispatch({ type: confluenceBoxAction.getConfluenceBoxList, payload }),
  getDisabledStation: payload => dispatch({ type: confluenceBoxAction.getDisabledStation, payload }),
  getStationDeviceTypes: params => dispatch({ //  获取某一个电站下的设备
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: confluenceBoxAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: confluenceBoxAction.changeStore,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfluenceBox);
