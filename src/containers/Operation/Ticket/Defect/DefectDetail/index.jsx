import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {message} from 'antd';
import { 
  GET_DEFECT_DETAIL_SAGA,
  GET_LANGUAGE_SAGA
 } from '../../../../../constants/actionTypes/Ticket';
import Detail from '../../../../../components/Operation/Ticket/Defect/Detail';

class DefectDetail extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    defectId: PropTypes.string,
    defectList: PropTypes.object,
    defectDetail: PropTypes.object,
    commonList: PropTypes.object,
    getDefectDetail: PropTypes.func,
    getCommonList: PropTypes.func,
    onCloseDetail: PropTypes.func,
    onSend: PropTypes.func,
    onClose: PropTypes.func,
    onReject: PropTypes.func,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
  }

  componentDidMount() {
    this.props.getDefectDetail({
      defectId: this.props.defectId
    });
    this.props.getCommonList({
      languageType: "1"
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.defectId !== this.props.defectId) {
      this.props.getDefectDetail({
        defectId: nextProps.defectId
      });
    }
  }

  onPrev() {
    let defectList = this.props.defectList;
    let defectId = this.props.defectId;
    let index = defectList.findIndex(item => {
      return item.get("defectId") === defectId
    });
    if(index !== -1) {
      if(index !== 0) {
        this.props.getDefectDetail({
          defectId: defectList.get([index-1, "defectId"])
        });
      } else {
        message.info("已经是第一条");
      }
    }
  }

  onNext() {
    let defectList = this.props.defectList;
    let defectId = this.props.defectId;
    let index = defectList.findIndex(item => {
      return item.get("defectId") === defectId
    });
    if(index !== -1) {
      if(index !== defectList.size - 1) {
        this.props.getDefectDetail({
          defectId: defectList.get([index+1, "defectId"])
        });
      } else {
        message.info("已经是最后一条");
      }
    }
  }

  render() {   
    return (
      <Detail 
        detail={this.props.defectDetail} 
        commonList={this.props.commonList}
        onCloseDetail={this.props.onCloseDetail}
        onClose={this.props.onClose}
        onSend={this.props.onSend}
        onReject={this.props.onReject}
        isFetching={this.props.isFetching}
        onNext={this.onNext}
        onPrev={this.onPrev} />
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  isFetching: state.operation.defect.get('isFetching'),
  error: state.operation.defect.get('error'),
  defectDetail: state.operation.defect.get("defectDetail"),
  defectId: state.operation.defect.get("defectId"),
  commonList: state.operation.defect.get('commonList'),
});

const mapDispatchToProps = (dispatch) => ({
  getDefectDetail: params => dispatch({ type: GET_DEFECT_DETAIL_SAGA, params }),
  getCommonList: params => dispatch({ type: GET_LANGUAGE_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);