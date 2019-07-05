import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './deviceAccount.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { deviceAccountAction } from './deviceAccountAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import Footer from '../../../../components/Common/Footer';
import DeviceAccountBox from '../../../../components/Operation/Book/DeviceAccount/DeviceAccountBox';

class DeviceAccount extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
  }

  componentWillUnmount() {
    const { resetStore } = this.props;
    resetStore();
  }

  render() {
    const { } = this.props;
    const breadCrumbData = {
      breadData: [{name: '设备台账'}],
    };
    return (
      <div className={styles.containerDiv}>
        <CommonBreadcrumb {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.containerBg}>
          <div className={styles.container}>
            <DeviceAccountBox {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.operation.deviceAccount.toJS(),
    stations: state.common.get('stations').toJS(),
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: deviceAccountAction.resetStore }),
  getRegion: params => dispatch({ type: commonAction.getRegion, payload: {// 获取用户权限的电站区域
      params,
      actionName: deviceAccountAction.changeDeviceAccountStore,
      resultName: 'regionList',
    } }),
  changeDeviceAccountStore: payload => dispatch({ type: deviceAccountAction.changeDeviceAccountStore, payload }),
  getDeviceAccountList: payload => dispatch({ type: deviceAccountAction.getDeviceAccountList, payload }),
  getStationsManufactorsList: payload => dispatch({ type: deviceAccountAction.getStationsManufactorsList, payload }),
  getDeviceModeList: payload => dispatch({ type: deviceAccountAction.getDeviceModeList, payload }),
  getDeviceAttachments: payload => dispatch({ type: deviceAccountAction.getDeviceAttachments, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(DeviceAccount);
