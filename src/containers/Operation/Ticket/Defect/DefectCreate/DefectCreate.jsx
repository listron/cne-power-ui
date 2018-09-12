import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './defectCreate.scss';
import { Icon } from 'antd';
import { commonAction } from '../../../../../constants/actionTypes/commonAction';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import DefectCreateForm from '../../../../../components/Operation/Ticket/Defect/DefectCreateForm/DefectCreateForm';
import WarningTip from '../../../../../components/Common/WarningTip';

class DefectCreate extends Component {
  static propTypes = {
    onChangeShowContainer: PropTypes.func,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    getStations: PropTypes.func,
    showContainer: PropTypes.string,
    defectDetail: PropTypes.object,
    getStationDeviceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
    getDevices: PropTypes.func,
    getCommonList: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      editDataGet: false,
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
      const stationCodes = defectDetail.stationCode;
      this.props.getStationDeviceTypes({stationCodes})
      this.props.getDefectTypes({stationType})
    }
    this.props.getCommonList({
      languageType: '1'
    });
  } 
  componentWillReceiveProps(nextProps){
    const { showContainer } = this.props;
    if(showContainer==='edit' && nextProps.stations.length > 0 && nextProps.deviceTypes.length > 0 && nextProps.defectTypes.length > 0){
      this.setState({
        editDataGet: true,
      })
    }
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
  }

  render() {
    const { editDataGet, showWarningTip, warningTipText } = this.state;
    const { showContainer } = this.props;
    return (
      <div className={styles.defectCreate}>
        {showWarningTip && <WarningTip style={{marginTop:'250px',width: '210px',height:'88px'}} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.createTop}>
          <span className={styles.text}>{showContainer==='create'?'新建缺陷':`驳回原因：`}</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
        </div>
        <div className={styles.createContent}>
          <DefectCreateForm {...this.props} editDataGet={editDataGet} />
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
    deviceTypes: state.common.get('stationDeviceTypes').toJS(),
    devices: state.common.get('devices').toJS(),
    error: state.operation.defect.get('error'),
    defectTypes: state.operation.defect.get('defectTypes').toJS(),
    defectDetail: state.operation.defect.get('defectDetail').toJS(),
    deviceTypeItems: state.common.get('stationDeviceTypes'),
    deviceAreaItems: state.common.get('partitions'),
    deviceItems: state.common.get('devices'),
    commonList: state.operation.defect.get('commonList'),
});

const mapDispatchToProps = (dispatch) => ({
  getStations: payload => dispatch({ type: commonAction.GET_STATIONS_SAGA, payload }),
  getStationDeviceTypes: payload => dispatch({ type: commonAction.GET_STATION_DEVICETYPES_SAGA, payload }),
  getCommonList: payload => dispatch({ type: ticketAction.GET_DEFECT_LANGUAGE_SAGA, payload }),
  getStationAreas: payload => dispatch({ type: commonAction.GET_PARTITIONS_SAGA, payload}),
  getDevices: payload => dispatch({ type: commonAction.GET_DEVICES_SAGA, payload }),
  getDefectTypes: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload }),
  onDefectCreateNew: payload => dispatch({type: ticketAction.DEFECT_CREATE_SAGA, payload}),
});


export default connect(mapStateToProps, mapDispatchToProps)(DefectCreate);

