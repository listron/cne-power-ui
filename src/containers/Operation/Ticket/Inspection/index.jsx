import React, { Component } from 'react';
import InspectionList from '../../../../components/Operation/Ticket/Inspection/InspectionList';
import { GET_INSPECTION_LIST_SAGA } from "../../../../constants/actionTypes/Ticket";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

class Inspection extends Component {
  static propTypes={
    inspectionList: PropTypes.object,
    getInspectionList: PropTypes.func,
    currentPage: PropTypes.number,
    currentPageSize: PropTypes.number,
    total: PropTypes.number,
    isFetching: PropTypes.bool,
    error: PropTypes.string,
    status: PropTypes.string,
  }

  constructor(props,context) {
    super(props);
    this.state = {};
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
  }

  componentDidMount(){
    var params = {
      status: this.props.status,
      pageNum: this.props.currentPage - 1,
      pageSize: this.props.currentPageSize,
    }
    this.props.getInspectionList(params);
  }

  onChangeStatus(status){
    if(status !== this.props.status){
      let params = {
        status: status,
        pageNum: this.props.currentPage - 1,
        pageSize: this.props.currentPageSize,
      }
      this.props.getInspectionList(params);
    }
  }

  onChangePage(){

  }

  onChangePageSize(){
    
  }

  render() {   
    return (
        <div>
          <div>巡检处理页面</div>
          <InspectionList 
          inspectionList={this.props.inspectionList} 
          getInspectionList={this.props.getInspectionList}
          currentPage={this.props.currentPage}
          currentPageSize={this.props.currentPageSize}
          total={this.props.total}
          status={this.props.status}
          isFetching={this.props.isFetching}
          onChangePage={this.onChangePage}
          onChangePageSize={this.onChangePageSize}
          onChangeStatus={this.onChangeStatus}
           />
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  inspectionList: state.operation.inspection.get('inspectionList'),
  isFetching: state.login.get('isFetching'),
  error: state.login.get('error'),
  currentPage: state.operation.inspection.get('currentPage'),
  currentPageSize: state.operation.inspection.get('currentPageSize'),
  total: state.operation.inspection.get('total'),
  status: state.operation.inspection.get('status'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectionList: params => dispatch({ type: GET_INSPECTION_LIST_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(Inspection);