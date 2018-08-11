import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import InspectDetailForm from '../../../../../components/Operation/Ticket/Inspect/InspectDetailForm/InspectDetailForm';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import { commonAction } from '../../../../../constants/actionTypes/commonAction';

class InspectDetail extends Component{
  static propTypes = {
    inspectDetail: PropTypes.object,
    isFetching: PropTypes.bool,
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
    setInspectId: PropTypes.func,
    transformDefect: PropTypes.func,
    finishInspect: PropTypes.func,
    setInspectCheck: PropTypes.func,
    addInspectAbnormal: PropTypes.func,
    onDeleteAbnormal: PropTypes.func,
    getInspectStandard: PropTypes.func,
    inspectStandard: PropTypes.object,
  }
  constructor(props){
    super(props);
    this.state={

    }
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onCloseInspectDetail = this.onCloseInspectDetail.bind(this);
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
    let inspectList = this.props.inspectList;
    let inspectId = this.props.inspectId;
    let index = inspectList.findIndex(item => {
      return item.get('inspectId') === inspectId;
    })
    if(index !== -1){
      if(index !== 0){
        this.props.setInspectId(inspectList.getIn([index-1,'inspectId']));
      }else{
        message.info('已经是第一条');
      }
    }
  }

  onNext = () => {
    let inspectList = this.props.inspectList;
    let inspectId = this.props.inspectId;
    let index = inspectList.findIndex(item => {
      return item.get('inspectId') === inspectId;
    })
    if(index !== -1){
      if(index !== inspectList.size - 1){
        this.props.setInspectId(inspectList.getIn([index+1,'inspectId']));
      }else{
        message.info('已经是最后一条')
      }
    }
  }

  onCloseInspectDetail = () => {
    this.props.onChangeShowContainer({container: 'list'});
  }
  render(){
    return(
      <InspectDetailForm
        onNext={this.onNext}
        onPrev={this.onPrev}
        onCloseInspectDetail={this.onCloseInspectDetail}
        defectTypes={this.props.defectTypes}
        getDefectTypes={this.props.getDefectTypes}
        inspectDetail={this.props.inspectDetail}
        transformDefect={this.props.transformDefect}
        finishInspect={this.props.finishInspect}
        setInspectCheck={this.props.setInspectCheck}
        addInspectAbnormal={this.props.addInspectAbnormal}
        loadDeviceTypeList={this.props.loadDeviceTypeList}
        loadDeviceAreaList={this.props.loadDeviceAreaList}
        loadDeviceList={this.props.loadDeviceList}
        deviceTypeItems={this.props.deviceTypeItems}
        deviceAreaItems={this.props.deviceAreaItems}
        deviceItems={this.props.deviceItems}
        onDeleteAbnormal={this.props.onDeleteAbnormal}
        getInspectStandard={this.props.getInspectStandard}
        inspectStandard={this.props.inspectStandard}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.operation.inspect.get('isFetching'),
  inspectList: state.operation.inspect.get('inspectList'),
  error: state.operation.inspect.get('error'),
  inspectDetail: state.operation.inspect.get('inspectDetail'),
  inspectId: state.operation.inspect.get('inspectId'),
  commonFetching: state.common.get('commonFetching'),
  defectTypes: state.operation.defect.get('defectTypes'),
  deviceTypeItems: state.common.get('deviceTypes'),
  deviceAreaItems: state.common.get('partitions'),
  deviceItems: state.common.get('devices'),
  inspectStandard: state.operation.inspect.get('inspectStandard'),
}) 

const mapDispatchToProps = (dispatch) => ({
  getInspectDetail: params => dispatch({ type: ticketAction.GET_INSPECT_DETAIL_SAGA, params}),
  addInspectAbnormal: params => dispatch({ type: ticketAction.ADD_INSPECT_ABNORMAL_SAGA, params}),
  getDefectTypes: params => dispatch({ type: ticketAction.GET_DEFECTTYPES_SAGA, params}),
  transformDefect: params => dispatch({ type: ticketAction.TRANSFORM_DEFECT_SAGA, params}),
  setInspectCheck: params => dispatch({ type: ticketAction.SET_INSPECT_CHECK_SAGA, params}),
  finishInspect: params => dispatch({ type: ticketAction.FINISH_INSPECT_SAGA, params}),
  loadDeviceTypeList: params => dispatch({ type: commonAction.GET_DEVICETYPES_SAGA, params}),
  loadDeviceAreaList: params => dispatch({ type: commonAction.GET_PARTITIONS_SAGA, params}),
  loadDeviceList: params => dispatch({ type: commonAction.GET_DEVICES_SAGA, params}),
  setInspectId: params => dispatch({ type: ticketAction.SET_INSPECT_ID_SAGA, params }),
  onDeleteAbnormal: params => dispatch({ type: ticketAction.DELETE_ABNORMAL_SAGA, params }),
  getInspectStandard: params => dispatch({ type: ticketAction.GET_INSPECT_STANDARD_SAGA, params}),
})

export default connect(mapStateToProps,mapDispatchToProps)(InspectDetail);










