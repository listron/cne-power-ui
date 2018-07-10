import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InspectCreateForm from '../../../../../components/Operation/Ticket/Inspect/InspectCreateForm/InspectCreateForm';
import { CommonAction } from '../../../../../constants/actionTypes/commonAction';
import { TicketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
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
  }

  componentDidMount(){
    this.props.getStations({
      domainName: "cne", 
      stationType: 0, 
      app: "bi"
    });
  }

  onCloseInspectCreate = () => {
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
  loadDeviceTypeList: params => dispatch({ type: CommonAction.GET_DEVICETYPES_SAGA, params}),
  createInspect: params => dispatch({ type: TicketAction.CREATE_INSPECT_SAGA, params}),
  getStations: params => dispatch({ type: CommonAction.GET_STATIONS_SAGA, params }),
})
export default connect(mapStateToProps,mapDispatchToProps)(InspectCreate);