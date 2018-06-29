import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InspectCreateForm from '../../../../../components/Operation/Ticket/Inspect/InspectCreateForm/InspectCreateForm';
import { 
   GET_DEVICETYPES_SAGA,
   GET_STATIONS_SAGA,
} from '../../../../../constants/actionTypes/commonAction';
import { CREATE_INSPECT_SAGA } from '../../../../../constants/actionTypes/Ticket';
class InspectCreate extends Component{
  static propTypes = {
    deviceTypeItems: PropTypes.object,
    loadDeviceTypeList: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    createInspect: PropTypes.func,
    stations: PropTypes.object,
    getStations: PropTypes.func,
  }
  constructor(props){
    super(props);

    this.onCloseInspectCreate = this.onCloseInspectCreate.bind(this);
  }

  componentDidMount(){
    this.props.getStations({
      domainName: "cne", 
      stationType: 0, 
      app: "bi"
    });
  }

  onCloseInspectCreate(){
    this.props.onChangeShowContainer({container: 'list'});
  }

  render(){
    return (
      <InspectCreateForm 
        deviceTypeItems={this.props.deviceTypeItems}
        loadDeviceTypeList={this.props.loadDeviceTypeList}
        onCloseInspectCreate={this.onCloseInspectCreate}
        createInspect={this.props.createInspect}
        stations={this.props.stations}
        getStations={this.props.getStations}
      />
    )
  }

}

const mapStateToProps = (state) => ({
  showContainer: state.operation.ticket.get('showContainer'),
  deviceTypeItems: state.common.get('deviceTypes'),
  stations: state.common.get('stations'),
})
const mapDispatchToProps = (dispatch) => ({
  loadDeviceTypeList: params => dispatch({ type: GET_DEVICETYPES_SAGA, params}),
  createInspect: params => dispatch({ type: CREATE_INSPECT_SAGA, params}),
  getStations: params => dispatch({ type: GET_STATIONS_SAGA, params }),
})
export default connect(mapStateToProps,mapDispatchToProps)(InspectCreate);