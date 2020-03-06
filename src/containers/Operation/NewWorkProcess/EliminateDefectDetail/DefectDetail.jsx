import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { eliminateDefectDetailAction } from './defectDetailReducer';
import { publicAction } from '@containers/alphaRedux/publicAction';
import searchUtil from '@utils/searchUtil';
import styles from './defectDetail.scss';
import Footer from '@components/common/Footer';

import DetailTopSubmit from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DetailTopSubmit/DetailTopSubmit';
import DefectBaseTitle from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DefectBase/DefectBaseTitle';
import DefectBaseInfo from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DefectBase/DefectBaseInfo';
import ProcessInfo from '@components/Operation/NewWorkProcess/EliminateDefectDetail/ProcessInfo/ProcessInfo';

class DefectDetail extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
  };


  constructor() {
    super();
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const { search } = history.location;
    const { page = 'defectDetail', defectId } = searchUtil(search).parse(); //默认为缺陷列表页 判断是否存在缺陷，不存在则为添加
  }


  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    const { theme, defectDetail } = this.props;
    return (
      <div className={`${styles.detailWrap}`}>
        <DetailTopSubmit />
        <div className={styles.detailContent}>
          <div className={styles.leftParts}>
            <DefectBaseTitle />
            <DefectBaseInfo />
          </div>
          <ProcessInfo />
        </div>
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
  getStationTypeDeviceModes: params => dispatch({ //  获取某一个电站下的设备
    type: publicAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: eliminateDefectDetailAction.changeStore,
      resultName: 'deviceModes',
    },
  }),
  getDeviceType: params => dispatch({ //  获取某一个电站下的设备
    type: publicAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: eliminateDefectDetailAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);
