import React, { Component } from 'react';
import InspectTable from '../../../../../components/Operation/Ticket/Inspect/InspectTable/InspectTable';
import { 
  GET_INSPECT_LIST_SAGA, 
  SET_INSPECT_ID_SAGA,
  INSPECT_CHECK_BATCH_SAGA,
 } from "../../../../../constants/actionTypes/Ticket";
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
    setInspectId: PropTypes.func,
    onShowInspectDetail: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    inspectCheckBatch: PropTypes.func,
  }

  constructor(props,context) {
    super(props);
    this.state = {};
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onShowDetail = this.onShowDetail.bind(this);
    this.onShowCreate = this.onShowCreate.bind(this);
  }

  onChangeStatus(status){
    if(status !== this.props.status){
      let params = {
        stationType: "2",
        status: status,
        pageNum: 0,
        pageSize: this.props.pageSize,
      }
      this.props.getInspectList(params);
    }
  }

  onShowDetail(inspectId){
    this.props.setInspectId(inspectId);
    this.props.onChangeShowContainer({container: 'detail'});
  }

  onShowCreate(){
    this.props.onChangeShowContainer({container: 'create'});
  }  

  render() {
    return (
      <div>
        <InspectTable 
          list={this.props.inspectList}
          pageNum={this.props.pageNum}
          pageSize={this.props.pageSize}
          total={this.props.total}
          status={this.props.status}
          isFetching={this.props.isFetching}
          onChangeSort={this.onChangeSort}
          onChangePage={this.onChangePage}
          onChangePageSize={this.onChangePageSize}
          onChangeStatus={this.onChangeStatus}
          onShowDetail={this.onShowDetail}
          onShowCreate={this.onShowCreate}
          inspectStatusStatistics={this.props.inspectStatusStatistics}
          getInspectList={this.props.getInspectList}
          inspectCheckBatch={this.props.inspectCheckBatch}
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
  inspectStatusStatistics: state.operation.inspect.get('inspectStatusStatistics'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectList: params => dispatch({ type: GET_INSPECT_LIST_SAGA, params }),
  setInspectId: params => dispatch({ type: SET_INSPECT_ID_SAGA, params }),
  inspectCheckBatch: params => dispatch({ type: INSPECT_CHECK_BATCH_SAGA, params}),
})
export default connect(mapStateToProps,mapDispatchToProps)(InspectList);