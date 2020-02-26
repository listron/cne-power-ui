import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { meterDetailAction } from './meterDetailReducer';
import MeterTop from '@components/Operation/WorkProcess/MeterDetail/MeterTop/MeterTop.jsx';
import MeterBaseInfo from '@components/Operation/WorkProcess/MeterDetail/MeterBaseInfo/MeterBaseInfo.jsx';
import MeterProcess from '@components/Operation/WorkProcess/MeterDetail/MeterProcess/MeterProcess.jsx';
import MeterDisposeInfo from '@components/Operation/WorkProcess/MeterDetail/MeterDisposeInfo/MeterDisposeInfo.jsx';
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
    getProcessBaseInfo({meterId});
    // 获取流程可操作人数据
    getOperableUser({meterId});
    // 获取流程信息
    getProcessList({meterId});
    // 获取处理信息
    getReadMeter({meterId});
    // 获取流程可执行动作
    getProcessAction({meterId});
  }

  render() {
    const { theme = 'light' } = this.props;
    return (
      <div className={`${styles.meterDetailBox} ${theme}`}>
        <MeterTop {...this.props} />
        <div className={styles.meterContent}>
          <div className={styles.contentLeft}>
            <MeterBaseInfo {...this.props} />
            <MeterDisposeInfo {...this.props} />
          </div>
          <div className={styles.contentRight}>
            <MeterProcess {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.meterDetail.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: meterDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: meterDetailAction.changeStore, payload }),
  getProcessBaseInfo: payload => dispatch({ type: meterDetailAction.getProcessBaseInfo, payload }),
  getOperableUser: payload => dispatch({ type: meterDetailAction.getOperableUser, payload }),
  getProcessList: payload => dispatch({ type: meterDetailAction.getProcessList, payload }),
  getReadMeter: payload => dispatch({ type: meterDetailAction.getReadMeter, payload }),
  getAddUser: payload => dispatch({ type: meterDetailAction.getAddUser, payload }),
  getProcessAction: payload => dispatch({ type: meterDetailAction.getProcessAction, payload }),
  getSubmitAction: payload => dispatch({ type: meterDetailAction.getSubmitAction, payload }),
  getSaveAction: payload => dispatch({ type: meterDetailAction.getSaveAction, payload }),
  getRotateImg: payload => dispatch({ type: meterDetailAction.getRotateImg, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeterDetail);
