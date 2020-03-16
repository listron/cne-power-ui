import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { eliminateDefectDetailAction } from './defectDetailReducer';
import { publicAction } from '@containers/alphaRedux/publicAction';
import searchUtil from '@utils/searchUtil';
import styles from './defectDetail.scss';
import Footer from '@components/Common/Footer';

import DetailTopSubmit from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DetailTopSubmit/DetailTopSubmit';
import ProcessInfo from '@components/Operation/NewWorkProcess/EliminateDefectDetail/ProcessInfo/ProcessInfo';
import DefectCreate from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DefectCreate/DefectCreate';
import DefectContent from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DefectContent/DefectContent';


class DefectDetail extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    changeStore: PropTypes.func,
    getDefectMessage: PropTypes.func,
    processInfo: PropTypes.array,
    getDefectAction: PropTypes.func,
    resetStore: PropTypes.func,
  };


  constructor() {
    super();
  }

  // docketId, 缺陷ID  isFinish 0 未解决 1 已解决 3 派发(告警)
  componentDidMount() {
    const { history } = this.props;
    const { search } = history.location;
    // 503306196121088 503572404424192 505877040300032
    const { page = 'defectDetail', docketId, isFinish } = searchUtil(search).parse(); //默认为缺陷列表页 判断是否存在缺陷，不存在则为添加
    if (docketId) {
      // getDefectMessage 可执行动作 基础信息 缺陷事件 处理信息 流程信息
      this.props.getDefectMessage({ docketId, isFinish });
      this.props.changeStore({ docketId });
    }
    if (!docketId && (isFinish || isFinish === 0)) {
      this.props.getDefectAction({ isFinish });
      this.props.changeStore({
        processInfo: [{
          nodeName: '创建工单',
          icon: '30006',
        }],
        isFinish,
      });
    }
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    const { docketId, theme, defectDetail, processInfo } = this.props;
    return (
      <div className={`${styles.detailWrap}`}>
        <DetailTopSubmit docketId={docketId} {...this.props} />
        <div className={styles.detailContent}>
          <div className={styles.leftParts}>
            {docketId && <DefectContent {...this.props} />}
            {!docketId && <DefectCreate {...this.props} />}
          </div>
          <ProcessInfo processInfo={processInfo} />
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.eliminateDefectDetail.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: 'light',
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: eliminateDefectDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: eliminateDefectDetailAction.changeStore, payload }),
  getDefectAction: payload => dispatch({ type: eliminateDefectDetailAction.getDefectAction, payload }),
  createDefect: payload => dispatch({ type: eliminateDefectDetailAction.createDefect, payload }),
  getDefectBaseInfo: payload => dispatch({ type: eliminateDefectDetailAction.getDefectBaseInfo, payload }),
  getDefectEventInfo: payload => dispatch({ type: eliminateDefectDetailAction.getDefectEventInfo, payload }),
  getDefectHandleInfo: payload => dispatch({ type: eliminateDefectDetailAction.getDefectHandleInfo, payload }),
  addDefectHandle: payload => dispatch({ type: eliminateDefectDetailAction.addDefectHandle, payload }),
  getProcessInfo: payload => dispatch({ type: eliminateDefectDetailAction.getProcessInfo, payload }),
  acceptanceDocket: payload => dispatch({ type: eliminateDefectDetailAction.acceptanceDocket, payload }),
  verifyDocket: payload => dispatch({ type: eliminateDefectDetailAction.verifyDocket, payload }),
  receiveDocket: payload => dispatch({ type: eliminateDefectDetailAction.receiveDocket, payload }),
  getDefectMessage: payload => dispatch({ type: eliminateDefectDetailAction.getDefectMessage, payload }),
  returnDocket: payload => dispatch({ type: eliminateDefectDetailAction.returnDocket, payload }),
  deleteDocket: payload => dispatch({ type: eliminateDefectDetailAction.deleteDocket, payload }),
  addAbleUser: payload => dispatch({ type: eliminateDefectDetailAction.addAbleUser, payload }),
  submitAction: payload => dispatch({ type: eliminateDefectDetailAction.submitAction, payload }),
  defectTypes: payload => dispatch({ type: eliminateDefectDetailAction.defectTypes, payload }),
  getBaseUsername: payload => dispatch({ type: eliminateDefectDetailAction.getBaseUsername, payload }),
  getDeviceType: params => dispatch({ //  获取某一个电站下的设备
    type: publicAction.getDeviceType,
    payload: {
      params,
      actionName: eliminateDefectDetailAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
  getStationTypeDeviceModes: params => dispatch({ //  获取某一个电站下的设备型号
    type: publicAction.getStationTypeDeviceModes,
    payload: {
      params,
      actionName: eliminateDefectDetailAction.changeStore,
      resultName: 'deviceModes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);
