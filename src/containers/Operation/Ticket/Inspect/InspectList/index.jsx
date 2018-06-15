import React, { Component } from 'react';
import List from '../../../../../components/Operation/Ticket/Inspect/List';
import { GET_INSPECT_LIST_SAGA } from "../../../../../constants/actionTypes/Ticket";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
class InspectList extends Component {
  static propTypes={
    inspectList: PropTypes.object,
    getInspectList: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    isFetching: PropTypes.bool,
    error: PropTypes.object,
    status: PropTypes.string,
    inspectStatusStatistics: PropTypes.object,
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
      pageNum: this.props.pageNum - 1,
      pageSize: this.props.pageSize
    }
    this.props.getInspectList(params);
  }

  onChangeStatus(status){
    if(status !== this.props.status){
      let params = {
        stationType: "2",
        status: status,
        pageNum: this.props.pageNum - 1,
        pageSize: this.props.pageSize,
      }
      this.props.getInspectList(params);
    }
  }

  onChangePage(page){
    if(page !== this.props.pageNum){
      let params={
        stationType: "2",
        status: this.props.status,
        pageNum: page - 1,
        pageSize: this.props.pageSize,
      }
      this.props.getInspectList(params);
    }
  }

  onChangePageSize(pagesize){
    if(pagesize !== this.props.pageSize){
      let params = {
        stationType: "2",
        status: this.props.status,
        pageNum: 0,
        pagesize: pagesize,
      }
      this.props.getInspectList(params);
    }
  }

  render() {   
    console.log(this.props.inspectStatusStatistics)
    return (
      <div>
        <div>巡检处理页面</div>
          <List 
            list={this.props.inspectList} 
            getInspectionList={this.props.getInspectList}
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
  inspectList: state.operation.inspect.get('inspectList'),
  isFetching: state.operation.inspect.get('isFetching'),
  error: state.operation.inspect.get('error'),
  pageNum: state.operation.inspect.get('pageNum'),
  pageSize: state.operation.inspect.get('pageSize'),
  total: state.operation.inspect.get('total'),
  status: state.operation.inspect.get('status'),
  inspectStatusStatistics: state.operation.inspect.get('defectStatusStatistics'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectList: params => dispatch({ type: GET_INSPECT_LIST_SAGA, params }),
})

export default connect(mapStateToProps,mapDispatchToProps)(InspectList);