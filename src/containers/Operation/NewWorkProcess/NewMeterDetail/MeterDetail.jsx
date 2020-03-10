import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import CneTips from '@components/Common/Power/CneTips';
import {newMeterDetailAction} from './meterDetailReducer';
import MeterTop from '@components/Operation/NewWorkProcess/MeterDetail/MeterTop/MeterTop.jsx';
import MeterBaseInfo from '@components/Operation/NewWorkProcess/MeterDetail/MeterBaseInfo/MeterBaseInfo.jsx';
import MeterProcess from '@components/Operation/NewWorkProcess/MeterDetail/MeterProcess/MeterProcess.jsx';
import MeterDisposeInfo from '@components/Operation/NewWorkProcess/MeterDetail/MeterDisposeInfo/MeterDisposeInfo.jsx';
import searchUtil from '@utils/searchUtil';
import styles from './meterDetail.scss';

class MeterDetail extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    resetStore: PropTypes.func,
    getProcessBaseInfo: PropTypes.func,
    getOperableUser: PropTypes.func,
    getProcessList: PropTypes.func,
    getReadMeter: PropTypes.func,
    getProcessAction: PropTypes.func,
    loading: PropTypes.bool,
    readMeterData: PropTypes.object,
    stateChangeStatus: PropTypes.bool,
  };

  componentDidMount() {
    const {
      getProcessBaseInfo,
      history,
      getOperableUser,
      getProcessList,
      getReadMeter,
      getProcessAction,
    } = this.props;
    const { search } = history.location;
    const { meterId } = searchUtil(search).parse(); // 抄表详情页
    // 获取抄表基本信息
    getProcessBaseInfo({meterId, loading: true});
    // 获取流程可操作人数据
    getOperableUser({meterId});
    // 获取流程信息
    getProcessList({meterId, loading: true});
    // 获取处理信息
    getReadMeter({meterId, loading: true});
    // 获取流程可执行动作
    getProcessAction({meterId});
  }

  componentWillUnmount() { // 卸载的时候要注意
    const { resetStore } = this.props;
    resetStore();
  }

  onConfirmWarningTip = () => {
    // 强制刷新
    window.location.reload();
  };

  render() {
    const { theme = 'light', loading, readMeterData: {isChangeMeter}, stateChangeStatus } = this.props;
    return (
      <div className={`${styles.meterDetailBox} ${theme}`}>
        <MeterTop {...this.props} />
        {loading ? <div className={styles.meterLoading}>
            <Spin />
          </div> : (
          <div className={styles.meterContent}>
            <div className={styles.contentLeft}>
              <MeterBaseInfo {...this.props} />
              <MeterDisposeInfo {...this.props} />
            </div>
            <div className={styles.contentRight}>
              <MeterProcess {...this.props} />
            </div>
          </div>
        )}
        <CneTips
          visible={stateChangeStatus || isChangeMeter === 1}
          width={260}
          mode={'warning'}
          onCancel={() => {}}
          onConfirm={this.onConfirmWarningTip}
          tipText={stateChangeStatus ? '当前工单状态已变更，点击“确定”刷新页面！' : '当前电表设置已变更，点击“确定”刷新页面！'}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.newMeterDetail.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: newMeterDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: newMeterDetailAction.changeStore, payload }),
  getProcessBaseInfo: payload => dispatch({ type: newMeterDetailAction.getProcessBaseInfo, payload }),
  getOperableUser: payload => dispatch({ type: newMeterDetailAction.getOperableUser, payload }),
  getProcessList: payload => dispatch({ type: newMeterDetailAction.getProcessList, payload }),
  getReadMeter: payload => dispatch({ type: newMeterDetailAction.getReadMeter, payload }),
  getAddUser: payload => dispatch({ type: newMeterDetailAction.getAddUser, payload }),
  getProcessAction: payload => dispatch({ type: newMeterDetailAction.getProcessAction, payload }),
  getSubmitAction: payload => dispatch({ type: newMeterDetailAction.getSubmitAction, payload }),
  getReceiveAction: payload => dispatch({ type: newMeterDetailAction.getReceiveAction, payload }),
  getSaveAction: payload => dispatch({ type: newMeterDetailAction.getSaveAction, payload }),
  getRotateImg: payload => dispatch({ type: newMeterDetailAction.getRotateImg, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeterDetail);
