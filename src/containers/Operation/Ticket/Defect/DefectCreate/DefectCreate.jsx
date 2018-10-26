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
  };
  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    }
  } 
  componentDidMount(){
    const { showContainer } = this.props;
    // this.props.getStations({
    //   enterpriseId: '1010694160817111040'//to do
    // });
    if(showContainer === 'edit'){
      const { defectDetail } = this.props;
      const stationType = defectDetail.stationType;
      const stationCode = defectDetail.stationCode;
      const deviceTypeCode = defectDetail.deviceTypeCode;
      this.props.getStationDeviceTypes({stationCodes:stationCode});
      this.props.getDefectTypes({stationType});
      this.props.getDevices({stationCode,deviceTypeCode})
    }
    this.props.getCommonList({
      languageType: '1'
    });
  } 

  onCancelEdit = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!'
    });
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {
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
    if(showContainer==='edit') {
      const processData = defectDetail.processData;
      const processLength = processData.length;
      if(processLength > 0) {
        rejectReason = processData[processLength - 1].defectProposal;
      }
    }
    return (
      <div className={styles.defectCreate}>
        {showWarningTip && <WarningTip style={{marginTop:'250px',width: '210px',height:'88px'}} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.createTop}>
          <span className={styles.text}>{showContainer==='create'?'新建缺陷':rejectReason}</span>
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
    showContainer: state.operation.ticket.get('showContainer'),
    loading: state.operation.defect.get('loading'),
    commonFetching: state.common.get('commonFetching'),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.operation.defect.get('deviceTypes').toJS(),
    devices: state.operation.defect.get('devices').toJS(),
    error: state.operation.defect.get('error'),
    defectTypes: state.operation.defect.get('defectTypes').toJS(),
    defectDetail: state.operation.defect.get('defectDetail').toJS(),
    deviceTypeItems: state.common.get('deviceTypes'),
    deviceAreaItems: state.operation.defect.get('partitions'),
    deviceItems: state.operation.defect.get('devices'),
    commonList: state.operation.defect.get('commonList'),
    allSeries: state.operation.defect.get('allSeries'), // 所有光伏组件
    firstPartitionCode: state.operation.defect.get('firstPartitionCode'), // 第一方阵code
});

const mapDispatchToProps = (dispatch) => ({
  changeCommonStore: payload => dispatch({type:commonAction.changeCommonStore, payload}),
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  getDefectDetail: payload => dispatch({ type: ticketAction.GET_DEFECT_DETAIL_SAGA, payload }),
  getCommonList: payload => dispatch({ type: ticketAction.GET_DEFECT_LANGUAGE_SAGA, payload }),
  getDefectTypes: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload }),
  onDefectCreateNew: payload => dispatch({type: ticketAction.DEFECT_CREATE_SAGA, payload}),
  submitDefect: payload => dispatch({type: ticketAction.SUBMIT_DEFECT_SAGA, payload}),
  getSliceDevices: params => dispatch({
    type: commonAction.getSliceDevices,
    payload: {
      params, 
      deviceTypeAction: ticketAction.GET_DEFECT_FETCH_SUCCESS,
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
  getDevices: params => dispatch({
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
});


export default connect(mapStateToProps, mapDispatchToProps)(DefectCreate);

