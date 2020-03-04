import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { eliminateDefectDetailAction } from './defectDetailReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import searchUtil from '@utils/searchUtil';
import styles from './defectDetail.scss';
import { Icon } from 'antd';

import DetailTopSubmit from '@components/Operation/NewWorkProcess/EliminateDefectDetail/DetailTopSubmit/DetailTopSubmit';

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
        消缺详情
        <DetailTopSubmit />
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
  getDefectDetail: payload => dispatch({ type: eliminateDefectDetailAction.getDefectDetail, payload }),
  getDefectTypes: payload => dispatch({ type: eliminateDefectDetailAction.getDefectTypes, payload }),
  sendDefect: payload => dispatch({ type: eliminateDefectDetailAction.sendDefect, payload }),
  rejectDefect: payload => dispatch({ type: eliminateDefectDetailAction.rejectDefect, payload }),
  closeDefect: payload => dispatch({ type: eliminateDefectDetailAction.closeDefect, payload }),
  handleDefect: payload => dispatch({ type: eliminateDefectDetailAction.handleDefect, payload }),
  checkDefect: payload => dispatch({ type: eliminateDefectDetailAction.checkDefect, payload }),
  createDefect: payload => dispatch({ type: eliminateDefectDetailAction.createDefect, payload }),
  getStationDeviceTypes: params => dispatch({ //  获取某一个电站下的设备
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: eliminateDefectDetailAction.changeStore,
      resultName: 'deviceTypes',
    },
  }),
  getLostGenType: params => dispatch({ // 获取缺陷类型
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: eliminateDefectDetailAction.changeStore,
      resultName: 'defectTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);
