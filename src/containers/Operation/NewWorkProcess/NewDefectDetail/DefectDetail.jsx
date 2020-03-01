import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {newDefectDetailAction} from './defectDetailReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import searchUtil from '@utils/searchUtil';
import styles from './defectDetail.scss';
import WarningTip from '../../../../components/Common/WarningTip';
import DetailContiner from '../../../../components/Operation/NewWorkProcess/Defect/DetailContiner';
import DefectCreate from '../../../../components/Operation/NewWorkProcess/Defect/DefectCreate';
import { Icon } from 'antd';

class DefectDetail extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    getDefectDetail: PropTypes.func,
    getDefectCommonList: PropTypes.func,
    changeStore: PropTypes.func,
    defectDetail: PropTypes.object,
    getRelevancedocket: PropTypes.func,
    processData: PropTypes.array,
    resetStore: PropTypes.func,
    hasModify: PropTypes.bool,
    defectId: PropTypes.string,
  };


  constructor() {
    super();
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    };
  }

  componentDidMount() {
    const { history, getDefectDetail, getDefectCommonList, getRelevancedocket } = this.props;
    const { search } = history.location;
    const { page = 'defectDetail', defectId } = searchUtil(search).parse(); //默认为缺陷列表页 判断是否存在缺陷，不存在则为添加
    this.props.changeStore({ defectId });
    if (defectId) {
      getDefectDetail({ defectId });
      getRelevancedocket({ defectId });
    }
    getDefectCommonList({ languageType: '1' }); // languageType 1 缺陷
  }


  componentWillUnmount() {
    this.props.resetStore();
  }

  onCancelEdit = () => { // 回退按钮
    const { hasModify } = this.props;
    if (hasModify) {
      this.setState({ showWarningTip: true });
    }
    if (!hasModify) {
      this.onConfirmWarningTip();
    }

  }

  onCancelWarningTip = () => { // 取消
    this.setState({ showWarningTip: false });
  }

  onConfirmWarningTip = () => { // 确认退出
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}?page=list&tab=defect`);
    this.props.changeStore({ hasModify: false });
  }

  renderTitle(status, defectId) { // 渲染标题 根据状态
    let result = '';
    if (defectId) {
      // 0 待提交 1 审核缺陷 2 处理缺陷 3 验收缺陷  4 已完成
      switch (status) {
        case '0': result = '驳回原因'; break;
        case '1': result = '消缺详情'; break; // 审核缺陷
        case '2': result = '消缺详情'; break; // 处理缺陷
        case '3': result = '消缺详情'; break; // 处理缺陷
        default:
          result = '消缺详情'; break;
      }
    } else {
      result = '新建工单';
    }
    return result;
  }

  render() {
    const { theme, defectDetail, defectId } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const { defectStatus, rejectReason } = defectDetail; // defectStatus  当前的流程状态 defectStatus=1 为待提交状态
    return (
      // <div className={`${styles.detailWrap} ${styles[theme]}`}>
      <div className={`${styles.detailWrap}`}>
        {showWarningTip && <WarningTip onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.header}>
          <div className={styles.text} title={rejectReason}>{this.renderTitle(defectStatus, defectId)}{defectStatus === '0' && `:${rejectReason}`}</div>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
        </div>
        <div className={styles.defectDetailCont}>
          {defectId && defectStatus !== '0' && <DetailContiner {...this.props} />}
          {defectId && defectStatus === '0' && <DefectCreate {...this.props} editDefect={true} />}
          {!defectId && <DefectCreate {...this.props} editDefect={false} />}
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.newDefectDetail.toJS(),
  stations: state.common.get('stations').toJS(),
  // theme: state.common.get('theme'),
  theme: 'light',
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: newDefectDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: newDefectDetailAction.changeStore, payload }),
  getDefectDetail: payload => dispatch({ type: newDefectDetailAction.getDefectDetail, payload }),
  getRelevancedocket: payload => dispatch({ type: newDefectDetailAction.getRelevancedocket, payload }),
  getDefectCommonList: payload => dispatch({ type: newDefectDetailAction.getDefectCommonList, payload }),
  getDefectTypes: payload => dispatch({ type: newDefectDetailAction.getDefectTypes, payload }),
  sendDefect: payload => dispatch({ type: newDefectDetailAction.sendDefect, payload }),
  rejectDefect: payload => dispatch({ type: newDefectDetailAction.rejectDefect, payload }),
  closeDefect: payload => dispatch({ type: newDefectDetailAction.closeDefect, payload }),
  handleDefect: payload => dispatch({ type: newDefectDetailAction.handleDefect, payload }),
  checkDefect: payload => dispatch({ type: newDefectDetailAction.checkDefect, payload }),
  getKnowledgebase: payload => dispatch({ type: newDefectDetailAction.getKnowledgebase, payload }),
  likeKnowledgebase: payload => dispatch({ type: newDefectDetailAction.likeKnowledgebase, payload }),
  createDefect: payload => dispatch({ type: newDefectDetailAction.createDefect, payload }),
  getStationDeviceTypes: params => dispatch({ //  获取某一个电站下的设备
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: newDefectDetailAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
  getLostGenType: params => dispatch({ // 获取缺陷类型
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: newDefectDetailAction.changeStore,
      resultName: 'defectTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);
