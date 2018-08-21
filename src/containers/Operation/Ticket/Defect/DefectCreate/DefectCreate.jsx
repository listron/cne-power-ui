import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './defectCreate.scss';
import { commonAction } from '../../../../../constants/actionTypes/commonAction';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import DefectCreateForm from '../../../../../components/Operation/Ticket/Defect/DefectCreateForm/DefectCreateForm';

class DefectCreate extends Component {
  static propTypes = {
    onChangeShowContainer: PropTypes.func,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    getStations: PropTypes.func,
    editNewDefect: PropTypes.bool,
    showContainer: PropTypes.string,
    defectDetail: PropTypes.object,
    getStationDeviceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
    getDevices: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      editDataGet: false,
    }
  } 
  componentDidMount(){
    const { editNewDefect } = this.props;
    // this.props.getStations({
    //   enterpriseId: '1010694160817111040'//to do
    // });
    if(editNewDefect){
      const { defectDetail } = this.props;
      const stationType = defectDetail.stationType;
      const stationCode = defectDetail.stationCode;
      this.props.getStationDeviceTypes({stationCode})
      this.props.getDefectTypes({stationType})
    }
  } 
  componentWillReceiveProps(nextProps){
    const { editNewDefect } = this.props;
    if(editNewDefect && nextProps.stations.length > 0 && nextProps.deviceTypes.length > 0 && nextProps.defectTypes.length > 0){
      this.setState({
        editDataGet: true,
      })
    }
  }
  onChangeShowContainer = () => {
    this.props.onChangeShowContainer({ container: 'list' })
  }
  

  render() {
    const {editDataGet} = this.state;
    return (
      <div className={styles.defectCreate} >
        <h3><span>缺陷创建</span>    <span onClick={this.onChangeShowContainer} className={styles.close}>关闭x</span></h3>
        <DefectCreateForm {...this.props} editDataGet={editDataGet} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
    showContainer: state.operation.ticket.get('showContainer'),
    editNewDefect: state.operation.ticket.get('editNewDefect'),
    isFetching: state.operation.defect.get('isFetching'),
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
});

const mapDispatchToProps = (dispatch) => ({
  getStations: params => dispatch({ type: commonAction.GET_STATIONS_SAGA, params }),
  getStationDeviceTypes: params => dispatch({ type: commonAction.GET_STATION_DEVICETYPES_SAGA, params }),
  getDevices: params => dispatch({ type: commonAction.GET_DEVICES_SAGA, params }),
  getDefectTypes: params => dispatch({ type: ticketAction.GET_DEFECTTYPES_SAGA, params }),
  onDefectCreateNew: params => dispatch({type: ticketAction.DEFECT_CREATE_SAGA, params}),
});


export default connect(mapStateToProps, mapDispatchToProps)(DefectCreate);

