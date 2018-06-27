import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import InspectDetailForm from '../../../../../components/Operation/Ticket/Inspect/InspectDetailForm/InspectDetailForm';
import { 
  GET_INSPECT_DETAIL_SAGA,
  ADD_INSPECT_ABNORMAL_SAGA,
  CHANGE_SHOW_CONTAINER_SAGA,
  SET_INSPECT_ID_SAGA,
  GET_DEFECTTYPES_SAGA,
  TRANSFORM_DEFECT_SAGA,
  SET_INSPECT_CHECK_SAGA,
  FINISH_INSPECT_SAGA,
 } from '../../../../../constants/actionTypes/Ticket';
 import { GET_DEVICETYPES_SAGA } from '../../../../../constants/actionTypes/commonAction'

class InspectDetail extends Component{
  static propTypes = {
    inspectDetail: PropTypes.object,
    onCloseInspectDetail: PropTypes.func,
    onClose: PropTypes.func,
    onSend: PropTypes.func,
    onReject: PropTypes.func,
    isFetching: PropTypes.bool,
    inspectId: PropTypes.string,
    getInspectDetail: PropTypes.func,
    getDeviceTypeList: PropTypes.func,
    getDefectTypes: PropTypes.func,
    deviceTypes: PropTypes.object,
    defectTypes: PropTypes.object,
    onChangeShowContainer: PropTypes.func,
    inspectList: PropTypes.object,
    setInspectId: PropTypes.func,
    transformDefect: PropTypes.func,
    finishInspect: PropTypes.func,
    setInspectCheck: PropTypes.func,
    addInspectAbnormal: PropTypes.func,
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

  onPrev(){
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

  onNext(){
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

  onCloseInspectDetail(){
    this.props.onChangeShowContainer({container: 'list'});
  }
  render(){
    return(
      <InspectDetailForm
        onNext={this.onNext}
        onPrev={this.onPrev}
        onCloseInspectDetail={this.onCloseInspectDetail}
        deviceTypes={this.props.deviceTypes}
        defectTypes={this.props.defectTypes}
        getDefectTypes={this.props.getDefectTypes}
        getDeviceTypeList={this.props.getDeviceTypeList}
        inspectDetail={this.props.inspectDetail}
        transformDefect={this.props.transformDefect}
        finishInspect={this.props.finishInspect}
        setInspectCheck={this.props.setInspectCheck}
        addInspectAbnormal={this.props.addInspectAbnormal}
      />
    )
  }

}

const mapStateToProps = (state) => ({
  isFetching: state.operation.inspect.get('isFetching'),
  inspectList: state.operation.inspect.get('inspectList'),
  error: state.operation.inspect.get('error'),
  inspectDetail: state.operation.inspect.get('inspectDetail'),
  inspectId: state.operation.inspect.get('inspectId'),
  commonFetching: state.common.get('commonFetching'),
  deviceTypes: state.common.get('deviceTypes'),
  defectTypes: state.operation.defect.get('defectTypes'),
}) 

const mapDispatchToProps = (dispatch) => ({
  onChangeShowContainer: params => dispatch({ type: CHANGE_SHOW_CONTAINER_SAGA, params}),
  getInspectDetail: params => dispatch({ type: GET_INSPECT_DETAIL_SAGA, params}),
  addInspectAbnormal: params => dispatch({ type: ADD_INSPECT_ABNORMAL_SAGA, params}),
  setInspectId: params => dispatch({ type: SET_INSPECT_ID_SAGA, params}),
  getDeviceTypeList: params => dispatch({ type: GET_DEVICETYPES_SAGA, params}),
  getDefectTypes: params => dispatch({ type: GET_DEFECTTYPES_SAGA, params}),
  transformDefect: params => dispatch({ type: TRANSFORM_DEFECT_SAGA, params}),
  setInspectCheck: params => dispatch({ type: SET_INSPECT_CHECK_SAGA, params}),
  finishInspect: params => dispatch({ type: FINISH_INSPECT_SAGA, params}),
})

export default connect(mapStateToProps,mapDispatchToProps)(InspectDetail);










