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
 } from '../../../../../constants/actionTypes/Ticket';
 import { GET_DEVICETYPES_SAGA } from '../../../../../constants/actionTypes/commonAction';

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
    deviceTypes: PropTypes.array,
    stationCode: PropTypes.string,
    onChangeShowContainer: PropTypes.func,
    inspectList: PropTypes.object,
    setInspectId: PropTypes.func,
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
      });
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
        inspectDetail={this.props.inspectDetail}
        getDeviceTypeList={this.props.getDeviceTypeList}
        deviceTypes={this.props.deviceTypes}
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
  deviceTypes: state.common.get('deviceTypes').toJS(),
}) 

const mapDispatchToProps = (dispatch) => ({
  getInspectDetail: params => dispatch({ type: GET_INSPECT_DETAIL_SAGA, params }),
  addInspectAbnormal: params => dispatch({ type: ADD_INSPECT_ABNORMAL_SAGA, params}),
  getDeviceTypeList: params => dispatch({ type: GET_DEVICETYPES_SAGA, params}),
  setInspectId: params => dispatch({ type: SET_INSPECT_ID_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(InspectDetail);










