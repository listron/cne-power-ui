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
    container: PropTypes.string,
    defectDetail: PropTypes.object,
    getStationDeviceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
    getDevices: PropTypes.func,
    getCommonList: PropTypes.func,
    changeCommonStore: PropTypes.func,
    getSliceDevices: PropTypes.func,
    getLostGenType: PropTypes.func,
    editDefect:PropTypes.bool,
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


  componentWillReceiveProps(nextProps) {
    const { container, defectDetail } = nextProps;
    if (container === 'edit' && defectDetail.defectId !== this.props.defectDetail.defectId) {
      const stationCode=defectDetail.stationCode
      this.props.getLostGenType({ stationCode, objectType: 1 });
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
    const { container, defectDetail, editDefect } = this.props;
    let rejectReason;
    if (container === 'edit') {
      const processData = defectDetail.processData || [];
      const processLength = processData.length || [];
      if (processLength > 0) {
        rejectReason = processData[processLength - 1].defectProposal;
      }
    }
    return (
      <div className={styles.defectCreate}>
        {showWarningTip && <WarningTip onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.createTop}>
          <span className={styles.text}>{editDefect ? rejectReason:'新建缺陷'}</span>
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
  commonFetching: state.common.get('commonFetching'),
});

const mapDispatchToProps = (dispatch) => ({
  changeCommonStore: payload => dispatch({ type: commonAction.changeCommonStore, payload }),
  changeDefectStore: payload => dispatch({ type: ticketAction.CHANGE_DEFECT_STORE_SAGA, payload }),
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  getDefectDetail: payload => dispatch({ type: ticketAction.GET_DEFECT_DETAIL_SAGA, payload }),
  getCommonList: payload => dispatch({ type: ticketAction.GET_DEFECT_LANGUAGE_SAGA, payload }),
  getDefectTypes: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload }),
  onDefectCreateNew: payload => dispatch({ type: ticketAction.DEFECT_CREATE_SAGA, payload }),
  submitDefect: payload => dispatch({ type: ticketAction.SUBMIT_DEFECT_SAGA, payload }),
  getKnowledgebase: payload => dispatch({ type: ticketAction.getKnowledgebase, payload }),
  likeKnowledgebase: payload => dispatch({ type: ticketAction.likeKnowledgebase, payload }),
  getStationDeviceTypes: params => dispatch({ //  获取某一个电站下的设备
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: ticketAction.GET_DEFECT_FETCH_SUCCESS,
      resultName: 'deviceTypes'
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

