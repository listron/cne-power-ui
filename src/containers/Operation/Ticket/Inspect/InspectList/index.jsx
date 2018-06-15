import React, { Component } from 'react';
import InspectionList from '../../../../../components/Operation/Ticket/Inspect/InspectList';
import { GET_INSPECTION_LIST_SAGA } from "../../../../../constants/actionTypes/Ticket";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
class InspectList extends Component {
  static propTypes={
    inspectionList: PropTypes.object,
    getInspectionList: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    isFetching: PropTypes.bool,
    error: PropTypes.object,
    status: PropTypes.number,
    inspectStatusStatistics: PropTypes.any,
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
      total: this.props.total,
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
        total: this.props.total,
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
        total: this.props.total,
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
        total: this.props.total,
      }
      this.props.getInspectionList(params);
    }
  }

  render() {   
    console.log(this.props.inspectStatusStatistics)
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
        inspectStatusStatistics={this.props.inspectStatusStatistics}
          />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  inspectionList: state.operation.inspection.get('inspectionList'),
  isFetching: state.operation.inspection.get('isFetching'),
  error: state.operation.inspection.get('error'),
  pageNum: state.operation.inspection.get('pageNum'),
  pageSize: state.operation.inspection.get('pageSize'),
  total: state.operation.inspection.get('total'),
  status: state.operation.inspection.get('status'),
  inspectStatusStatistics: state.operation.inspection.get('defectStatusStatistics'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectionList: params => dispatch({ type: GET_INSPECTION_LIST_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(InspectList);