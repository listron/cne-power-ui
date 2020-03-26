import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { eliminateDefectDetailAction } from './defectDetailReducer';
import { publicAction } from '@containers/alphaRedux/publicAction';
import searchUtil from '@utils/searchUtil';
import styles from './defectDetail.scss';
import Footer from '@components/Common/Footer';
import { localStateName } from '../../../../components/Operation/NewWorkProcess/Common/processIconCode';
import CneTips from '../../../../components/Common/Power/CneTips/index';
import DetailTopSubmit from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DetailTopSubmit/DetailTopSubmit';
import ProcessInfo from '@components/Operation/NewWorkProcess/EliminateDefectDetail/ProcessInfo/ProcessInfo';
import DefectCreate from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DefectCreate/DefectCreate';
import DefectContent from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DefectContent/DefectContent';
import DefectTask from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DefectTask/DefectTask';
import { message } from 'antd';


class DefectDetail extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    changeStore: PropTypes.func,
    getDefectMessage: PropTypes.func,
    processInfo: PropTypes.array,
    getDefectAction: PropTypes.func,
    resetStore: PropTypes.func,
    getDiagwarning: PropTypes.func,
  };


  constructor() {
    super();
    this.state = {
      scroll: false,
    };
  }


  // docketId, 缺陷ID  isFinish 0 未解决 1 已解决 3 派发(告警)
  componentDidMount() {
    const { history } = this.props;
    const { search } = history.location;
    const main = document.getElementById('main');
    main.addEventListener('scroll', (e) => this.bindScroll(e));
    const { page = 'defectDetail', docketId, isFinish, eventId = ['499876992733094', '499876992732672', '499876992732928'] } = searchUtil(search).parse(); //默认为缺陷列表页 判断是否存在缺陷，不存在则为添加
    const stationCode = 360;
    if (docketId) {
      // getDefectMessage 可执行动作 基础信息 缺陷事件 处理信息 流程信息
      this.props.getDefectMessage({ docketId });
      this.props.changeStore({ docketId });
    }
    if (!docketId && (isFinish || isFinish === '0')) {
      this.props.getDefectAction({ isFinish });
      this.props.changeStore({
        processInfo: [{
          nodeName: '创建工单',
          icon: '30006',
        }],
        isFinish,
      });
      this.props.showUser();
    }
    if (isFinish === '3') { // 派发
      this.props.changeStore({ stationCode });
      this.props.getDiagwarning({ diagWarningIds: eventId });
      this.props.getBaseUsername({ stationCode }); // 当前电站有权限的人
    }
  }


  componentWillUnmount() {
    this.props.resetStore();
  }



  bindScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const { scroll } = this.state;
    if (scrollTop > 0 && !scroll) {
      this.setState({ scroll: !scroll });
    }
    if (scrollTop === 0) {
      this.setState({ scroll: false });
    }
  }

  resetRequest = () => {
    const { docketId } = this.props;
    this.props.getDefectMessage({ docketId });
    this.props.changeStore({ showErrorTip: false });
  }


  render() {
    const { docketId, theme, defectDetail, processInfo, stateName, isFinish, showErrorTip } = this.props;
    const { scroll } = this.state;
    return (
      <div className={`${styles.detailWrap}`} ref={'detailWrap'}>
        <DetailTopSubmit docketId={docketId} {...this.props} scroll={scroll} />
        <CneTips
          visible={showErrorTip}
          mode={'warning'}
          width={260}
          onConfirm={this.resetRequest}
          confirmText={'确认'}
          tipText={'操作失败,当前工单状态已变更。'}
        />
        <div className={styles.detailContent}>
          <div className={styles.leftParts}>
            {docketId && localStateName(stateName) !== 'return' && <DefectContent {...this.props} />}
            {!docketId && isFinish !== '3' && <DefectCreate {...this.props} />}
            {docketId && localStateName(stateName) === 'return' && <DefectCreate {...this.props} />}
            {isFinish === '3' && <DefectTask {...this.props} />}
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
  getDiagwarning: payload => dispatch({ type: eliminateDefectDetailAction.getDiagwarning, payload }),
  showUser: payload => dispatch({ type: eliminateDefectDetailAction.showUser, payload }),
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
