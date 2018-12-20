import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './defectCreate.scss';
import { Icon } from 'antd';
import { commonAction } from '../../../../alphaRedux/commonAction';
import { ticketAction } from '../../ticketAction';
import DefectCreateForm from '../../../../../components/Operation/Ticket/Defect/DefectCreateForm/DefectCreateForm';
import WarningTip from '../../../../../components/Common/WarningTip';

class DefectCreate extends Component {
  static propTypes = {
    onChangeShowContainer: PropTypes.func,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    devices: PropTypes.array,
    defectTypes: PropTypes.array,
    getStations: PropTypes.func,
    showContainer: PropTypes.string,
    defectDetail: PropTypes.object,
    getStationDeviceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
    getDevices: PropTypes.func,
    getCommonList: PropTypes.func,
    changeCommonStore: PropTypes.func,
    getSliceDevices: PropTypes.func,
    getLostGenType: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    }
  }
  componentDidMount() {
    this.props.getCommonList({ languageType: '1' });
  }
  

  componentWillReceiveProps(nextProps){
    const { showContainer,defectDetail } = nextProps;
    if (showContainer === 'edit' && defectDetail.defectId!==this.props.defectDetail.defectId) {
      const stationCode = defectDetail.stationCode;
      const deviceTypeCode = defectDetail.deviceTypeCode;
      this.props.getStationDeviceTypes({ stationCodes: stationCode });
      this.props.getLostGenType({ stationCode, objectType: 1 });
      this.props.getDevices({ stationCode, deviceTypeCode })
    }
  }

  onCancelEdit = () => { //取消编辑
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!'
    });
  }

  onCancelWarningTip = () => {  //取消的事件
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => { // 确定的事件
    this.setState({
      showWarningTip: false,
    });
    this.props.onChangeShowContainer({ container: 'list' });
    this.props.changeCommonStore({
      stationDeviceTypes: [],
      devices: [],
    });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    const { showContainer, defectDetail } = this.props;
    let rejectReason;
    if (showContainer === 'edit') {
      const processData = defectDetail.processData;
      const processLength = processData.length || [];
      if (processLength > 0) {
        rejectReason = processData[processLength - 1].defectProposal;
      }
    }
    return (
      <div className={styles.defectCreate}>
        {showWarningTip && <WarningTip onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.createTop}>
          <span className={styles.text}>{showContainer === 'create' ? '新建缺陷' : rejectReason}</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
        </div>
        <div className={styles.createContent}>
          <DefectCreateForm {...this.props} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.defect.toJS(),
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  commonFetching: state.common.get('commonFetching'),
});

const mapDispatchToProps = (dispatch) => ({
  changeCommonStore: payload => dispatch({ type: commonAction.changeCommonStore, payload }),
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  getDefectDetail: payload => dispatch({ type: ticketAction.GET_DEFECT_DETAIL_SAGA, payload }),
  getCommonList: payload => dispatch({ type: ticketAction.GET_DEFECT_LANGUAGE_SAGA, payload }),
  getDefectTypes: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload }),
  onDefectCreateNew: payload => dispatch({ type: ticketAction.DEFECT_CREATE_SAGA, payload }),
  submitDefect: payload => dispatch({ type: ticketAction.SUBMIT_DEFECT_SAGA, payload }),
  getSliceDevices: params => dispatch({
    type: commonAction.getSliceDevices,
    payload: {
      params,
      actionName: ticketAction.GET_DEFECT_FETCH_SUCCESS,
    }
  }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: ticketAction.GET_DEFECT_FETCH_SUCCESS,
      resultName: 'deviceTypes'
    }
  }),
  getDevices: params => dispatch({ // 获取设备类型
    type: commonAction.getDevices,
    payload: {
      params,
      actionName: ticketAction.GET_DEFECT_FETCH_SUCCESS,
      resultName: 'devices'
    }
  }),
  getStationAreas: params => dispatch({
    type: commonAction.getPartition,
    payload: {
      params,
      actionName: ticketAction.GET_DEFECT_FETCH_SUCCESS,
      resultName: 'partitions'
    }
  }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: ticketAction.GET_DEFECT_FETCH_SUCCESS,
      resultName: 'defectTypes'
    }
  }),
});


export default connect(mapStateToProps, mapDispatchToProps)(DefectCreate);

