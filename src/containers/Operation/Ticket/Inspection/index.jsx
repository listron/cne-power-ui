import React, { Component } from 'react';
import InspectionList from '../../../../components/Operation/Ticket/Inspection/InspectionList';
import { GET_INSPECTION_LIST_SAGA } from "../../../../constants/actionTypes/Ticket";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
class Inspection extends Component {
  static propTypes={
    inspectionList: PropTypes.object,
    getInspectionList: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    isFetching: PropTypes.bool,
    error: PropTypes.string,
    status: PropTypes.number,
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
      stationType: "2",
      status: this.props.status,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    }
    this.props.getInspectionList(params);
  }

  onChangeStatus(status){
    if(status !== this.props.status){
      let params = {
        stationType: "2",
        status: status,
        pageNum: this.props.pageNum,
        pageSize: this.props.pageSize,
      }
      this.props.getInspectionList(params);
    }
  }

  onChangePage(page){
    if(page !== this.props.pageNum){
      let params={
        stationType: "2",
        status: this.props.status,
        pageNum: page,
        pageSize: this.props.pageSize,
      }
      this.props.getInspectionList(params);
    }
  }

  onChangePageSize(pagesize){
    if(pagesize !== this.props.pageSize){
      let params = {
        stationType: "2",
        status: this.props.status,
        pageNum: 1,
        pagesize: pagesize,
      }
      this.props.getInspectionList(params);
    }
  }

  render() {   
    return (
        <div>
          <div>巡检处理页面</div>
          <InspectionList 
          list={this.props.inspectionList} 
          getInspectionList={this.props.getInspectionList}
          pageNum={this.props.pageNum}
          pageSize={this.props.pageSize}
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
  pageNum: state.operation.inspection.get('pageNum'),
  pageSize: state.operation.inspection.get('pageSize'),
  total: state.operation.inspection.get('total'),
  status: state.operation.inspection.get('status'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectionList: params => dispatch({ type: GET_INSPECTION_LIST_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(Inspection);