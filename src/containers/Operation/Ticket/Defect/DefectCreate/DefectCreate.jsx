import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './defectCreate.scss';
import {
  GET_DEFECTTYPES_SAGA,
  DEFECT_CREATE_SAGA,
} from '../../../../../constants/actionTypes/Ticket';
import {
  GET_STATIONS_SAGA,
  GET_DEVICETYPES_SAGA,
  GET_DEVICES_SAGA,
} from '../../../../../constants/actionTypes/commonAction';
import CreateNewDefect from '../../../../../components/Operation/Ticket/Defect/CreateNewDefect/CreateNewDefect';

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
    getDeviceTypes: PropTypes.func,
    getDefectTypes: PropTypes.func,
    loadDeviceList: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.onChangeShowContainer = this.onChangeShowContainer.bind(this);
    this.state = {
      editDataGet: false,
    }
  } 
  componentDidMount(){
    const { editNewDefect } = this.props;
    this.props.getStations({
      domainName: "cne", 
      stationType: 0, 
      app: "bi"
    });
    if(editNewDefect){
      const { defectDetail } = this.props;
      const stationType = defectDetail.stationType;
      const stationCodes = defectDetail.stationCode;
      this.props.getDeviceTypes({stationCodes})
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
  onChangeShowContainer(){
    this.props.onChangeShowContainer({ container: 'list' })
  }
  

  render() {
    const {editDataGet} = this.state;
    return (
      <div className={styles.defectCreate} >
        <h3><span>缺陷创建</span>    <span onClick={this.onChangeShowContainer} className={styles.close}>关闭x</span></h3>
        <CreateNewDefect {...this.props} editDataGet={editDataGet} />
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
    deviceTypes: state.common.get('deviceTypes').toJS(),
    devices: state.common.get('devices').toJS(),
    error: state.operation.defect.get('error'),
    defectTypes: state.operation.defect.get('defectTypes').toJS(),
    defectDetail: state.operation.defect.get('defectDetail').toJS(),
    deviceTypeItems: state.common.get('deviceTypes'),
    deviceAreaItems: state.common.get('partitions'),
    deviceItems: state.common.get('devices'),
});

const mapDispatchToProps = (dispatch) => ({
  getStations: params => dispatch({ type: GET_STATIONS_SAGA, params }),
  getDeviceTypes: params => dispatch({ type: GET_DEVICETYPES_SAGA, params }),
  getDevices: params => dispatch({ type: GET_DEVICES_SAGA, params }),
  getDefectTypes: params => dispatch({ type: GET_DEFECTTYPES_SAGA, params }),
  onDefectCreateNew: params => dispatch({type: DEFECT_CREATE_SAGA, params}),
  loadDeviceList: params => dispatch({ type: GET_DEVICES_SAGA, params}),
});


export default connect(mapStateToProps, mapDispatchToProps)(DefectCreate);

