import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {message} from 'antd';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import DefectDetailForm from '../../../../../components/Operation/Ticket/Defect/DefectDetailForm/DefectDetailForm';

class DefectDetail extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    defectId: PropTypes.string,
    defectList: PropTypes.object,
    defectDetail: PropTypes.object,
    commonList: PropTypes.object,
    getDefectDetail: PropTypes.func,
    getCommonList: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    onSend: PropTypes.func,
    onClose: PropTypes.func,
    onReject: PropTypes.func,
    onHandle: PropTypes.func,
    onCheck: PropTypes.func,
    changeDefectStore: PropTypes.func,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if(this.props.defectId) {
      this.props.getDefectDetail({
        defectId: this.props.defectId
      });
      this.props.getCommonList({
        languageType: '1'
      });
    }  
    
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.defectId && nextProps.defectId !== this.props.defectId) {
      this.props.getDefectDetail({
        defectId: nextProps.defectId
      });
    }
  }

  onPrev = () => {
    let defectList = this.props.defectList;
    let defectId = this.props.defectId;
    let index = defectList.findIndex(item => {
      return item.get('defectId') === defectId
    });
    if(index !== -1) {
      if(index !== 0) {
        this.props.changeDefectStore({
          defectId: defectList.getIn([index-1, 'defectId'])}
        );
      } else {
        message.info('已经是第一条');
      }
    }
  }

  onNext = () => {
    let defectList = this.props.defectList;
    let defectId = this.props.defectId;
    let index = defectList.findIndex(item => {
      return item.get('defectId') === defectId
    });
    if(index !== -1) {
      if(index !== defectList.size - 1) {
        this.props.changeDefectStore({
          defectId: defectList.getIn([index+1, 'defectId'])}
        );
      } else {
        message.info('已经是最后一条');
      }
    }
  }

  onCloseDetail = () => {
    this.props.onChangeShowContainer({container: 'list'});
  }

  render() {   
    return (
      <DefectDetailForm 
        detail={this.props.defectDetail}
        loading={this.props.loading}
        commonList={this.props.commonList}
        onCloseDetail={this.onCloseDetail}
        onClose={this.props.onClose}
        onSend={this.props.onSend}
        onReject={this.props.onReject}
        onHandle={this.props.onHandle}
        onCheck={this.props.onCheck}
        onNext={this.onNext}
        onPrev={this.onPrev} />    
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  loading: state.operation.defect.get('loading'),
  error: state.operation.defect.get('error'),
  defectDetail: state.operation.defect.get('defectDetail'),
  defectId: state.operation.defect.get('defectId'),
  commonList: state.operation.defect.get('commonList'),
});

const mapDispatchToProps = (dispatch) => ({
  changeDefectStore: payload => dispatch({type:ticketAction.CHANGE_DEFECT_STORE_SAGA, payload}),
  getDefectDetail: payload => dispatch({ type: ticketAction.GET_DEFECT_DETAIL_SAGA, payload }),
  getCommonList: payload => dispatch({ type: ticketAction.GET_DEFECT_LANGUAGE_SAGA, payload }),
  onSend: payload => dispatch({ type: ticketAction.SEND_DEFECT_SAGA, payload }),
  onReject: payload => dispatch({ type: ticketAction.REJECT_DEFECT_SAGA, payload }),
  onClose: payload => dispatch({ type: ticketAction.CLOSE_DEFECT_SAGA, payload }),
  onHandle: payload => dispatch({ type: ticketAction.HANDLE_DEFECT_SAGA, payload }),
  onCheck: payload => dispatch({ type: ticketAction.CHECK_DEFECT_SAGA, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);