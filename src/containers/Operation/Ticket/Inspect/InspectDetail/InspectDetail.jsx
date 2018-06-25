import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import Detail from '../../../../../components/Operation/Ticket/Inspect/Detail/Detail';
import { 
  GET_INSPECT_DETAIL_SAGA,
  ADD_INSPECT_ABNORMAL_SAGA,
  GET_DEVICE_TYPE_LIST_SAGA,
  CHANGE_SHOW_CONTAINER_SAGA,
  SET_INSPECT_ID_SAGA,
 } from '../../../../../constants/actionTypes/Ticket';

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
    // getDeviceTypeList: PropTypes.func,
    deviceTypeList: PropTypes.object,
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
    this.props.getInspectDetail({
      inspectId: this.props.inspectId,
      stationCodes: this.props.inspectDetail.get("stationCode"),
    })
    // this.props.getDeviceTypeList({
    //   stationCodes: this.props.inspectDetail.get("stationCode"),
    // })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.inspectId !== this.props.inspectId){
      this.props.getInspectDetail({
        inspectId: nextProps.inspectId,
        stationCodes: nextProps.inspectDetail.get("stationCode"),
      })
      // this.props.getDeviceTypeList({
      //   stationCodes: this.props.stationCode,
      // })
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
    this.props.onChangeShowContainer({container: 'inspectList'});
  }
  render(){
    return(
      <Detail 
        isFetching={this.props.isFetching}
        inspectDetail={this.props.inspectDetail}
        onCloseInspectDetail={this.onCloseInspectDetail}
        onClose={this.props.onClose}
        onSend={this.props.onSend}
        onReject={this.props.onReject}
        onNext={this.onNext}
        onPrev={this.onPrev}
        // getDeviceTypeList={this.props.getDeviceTypeList}
        deviceTypeList={this.props.deviceTypeList}
      />
    )
  }

}

const mapStateToProps = (state) => ({
  isFetching: state.operation.inspect.get("isFetching"),
  inspectList: state.operation.inspect.get("inspectList"),
  error: state.operation.inspect.get("error"),
  inspectDetail: state.operation.inspect.get("inspectDetail"),
  inspectId: state.operation.inspect.get("inspectId"),
  deviceTypeList: state.operation.inspect.get("deviceTypeList"),
  // stationCode: state.operation.inspect.getIn(["inspectDetail","stationCode"]).toString(),
}) 

const mapDispatchToProps = (dispatch) => ({
  getInspectDetail: params => dispatch({ type: GET_INSPECT_DETAIL_SAGA, params }),
  addInspectAbnormal: params => dispatch({ type: ADD_INSPECT_ABNORMAL_SAGA, params}),
  // getDeviceTypeList: params => dispatch({ type: GET_DEVICE_TYPE_LIST_SAGA, params}),
  onChangeShowContainer: params => dispatch({ type: CHANGE_SHOW_CONTAINER_SAGA, params}),
  setInspectId: params => dispatch({ type: SET_INSPECT_ID_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(InspectDetail);










