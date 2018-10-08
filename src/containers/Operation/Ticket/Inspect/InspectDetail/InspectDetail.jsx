import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import InspectDetailForm from '../../../../../components/Operation/Ticket/Inspect/InspectDetailForm/InspectDetailForm';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import { commonAction } from '../../../../alphaRedux/commonAction';

class InspectDetail extends Component{
  static propTypes = {
    inspectDetail: PropTypes.object,
    loading: PropTypes.bool,
    inspectId: PropTypes.string,
    getInspectDetail: PropTypes.func,
    getDefectTypes: PropTypes.func,
    defectTypes: PropTypes.object,
    loadDeviceTypeList: PropTypes.func,
    loadDeviceAreaList: PropTypes.func,
    loadDeviceList: PropTypes.func,
    deviceTypeItems: PropTypes.object,
    deviceAreaItems: PropTypes.object,
    deviceItems: PropTypes.object,
    onChangeShowContainer: PropTypes.func,
    inspectList: PropTypes.object,
    inspectIdList: PropTypes.object,
    setInspectId: PropTypes.func,
    transformDefect: PropTypes.func,
    finishInspect: PropTypes.func,
    setInspectCheck: PropTypes.func,
    addInspectAbnormal: PropTypes.func,
    onDeleteAbnormal: PropTypes.func,
    getInspectStandard: PropTypes.func,
    inspectStandard: PropTypes.object,
    changeInspectStore: PropTypes.func,
  }
  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(this.props.inspectId) {
      this.props.getInspectDetail({
        inspectId: this.props.inspectId,
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.inspectId && nextProps.inspectId !== this.props.inspectId){
      this.props.getInspectDetail({
        inspectId: nextProps.inspectId,
      })
    }
  }

  onPrev = () => {
    const { inspectIdList, inspectId } = this.props;
    let index = inspectIdList.findIndex(item => {
      return item === inspectId;
    })
    if(index !== -1){
      if(index !== 0){
        this.props.changeInspectStore({
          inspectId: inspectIdList.get(index-1)}
        );
      }else{
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        message.info('已经是第一条');
      }
    }
  }

  onNext = () => {
    const { inspectIdList, inspectId } = this.props;
    let index = inspectIdList.findIndex(item => {
      return item === inspectId;
    })
    if(index !== -1){
      if(index !== inspectIdList.size - 1){
        this.props.changeInspectStore({
          inspectId: inspectIdList.get(index+1)}
        );
      } else{
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        message.info('已经是最后一条')
      }
    }
  }

  onCloseInspectDetail = () => {
    this.props.onChangeShowContainer({container: 'list'});
  }
  render(){
    return(
      <InspectDetailForm {...this.props} 
        onCloseInspectDetail={this.onCloseInspectDetail}
        onPrev={this.onPrev}
        onNext={this.onNext} />
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.operation.inspect.get('loading'),
  inspectList: state.operation.inspect.get('inspectList'),
  inspectIdList: state.operation.inspect.get('inspectIdList'),
  error: state.operation.inspect.get('error'),
  inspectDetail: state.operation.inspect.get('inspectDetail'),
  inspectId: state.operation.inspect.get('inspectId'),
  commonFetching: state.common.get('commonFetching'),
  defectTypes: state.operation.defect.get('defectTypes'),
  deviceTypeItems: state.common.get('stationDeviceTypes'),
  deviceAreaItems: state.common.get('partitions'),
  deviceItems: state.common.get('devices'),
  inspectStandard: state.operation.inspect.get('inspectStandard'),
}) 

const mapDispatchToProps = (dispatch) => ({
  changeInspectStore: payload => dispatch({type:ticketAction.CHANGE_INSPECT_STORE_SAGA, payload}),
  getInspectDetail: payload => dispatch({ type: ticketAction.GET_INSPECT_DETAIL_SAGA, payload}),
  addInspectAbnormal: payload => dispatch({ type: ticketAction.ADD_INSPECT_ABNORMAL_SAGA, payload}),
  getDefectTypes: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload}),
  transformDefect: payload => dispatch({ type: ticketAction.TRANSFORM_DEFECT_SAGA, payload}),
  setInspectCheck: payload => dispatch({ type: ticketAction.SET_INSPECT_CHECK_SAGA, payload}),
  finishInspect: payload => dispatch({ type: ticketAction.FINISH_INSPECT_SAGA, payload}),
  loadDeviceTypeList: payload => dispatch({ type: commonAction.GET_STATION_DEVICETYPES_SAGA, payload}),
  loadDeviceAreaList: payload => dispatch({ type: commonAction.GET_PARTITIONS_SAGA, payload}),
  loadDeviceList: payload => dispatch({ type: commonAction.GET_DEVICES_SAGA, payload}),
  setInspectId: payload => dispatch({ type: ticketAction.SET_INSPECT_ID_SAGA, payload }),
  onDeleteAbnormal: payload => dispatch({ type: ticketAction.DELETE_ABNORMAL_SAGA, payload }),
  getInspectStandard: payload => dispatch({ type: ticketAction.GET_INSPECT_STANDARD_SAGA, payload}),
})

export default connect(mapStateToProps,mapDispatchToProps)(InspectDetail);










