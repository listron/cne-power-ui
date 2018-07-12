import React, { Component } from 'react';
import InspectTable from '../../../../../components/Operation/Ticket/Inspect/InspectTable/InspectTable';
 import { TicketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

class InspectList extends Component {
  static propTypes={
    inspectList: PropTypes.object,
    getInspectList: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sort: PropTypes.string,
    total: PropTypes.number,
    isFetching: PropTypes.bool,
    error: PropTypes.object,
    status: PropTypes.string,
    showTab: PropTypes.string,
    inspectStatusStatistics: PropTypes.object,
    setInspectId: PropTypes.func,
    onShowInspectDetail: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    showContainer: PropTypes.string,
    inspectCheckBatch: PropTypes.func,
  }

  constructor(props,context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if(this.props.showTab === 'inspect') {
      var params = {
        stationType: '2',
        status: this.props.status,
        pageNum: this.props.pageNum - 1,
        pageSize: this.props.pageSize,
        sort: this.props.sort
      }
      this.props.getInspectList(params);
    }
  }

  onChangeStatus = (status) => {
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

  onChangeSort = (sort) => {
    let params = {
      stationType: "2",
      status: status,
      pageNum: 0,
      pageSize: this.props.pageSize,
      sort: sort,
    }
    this.props.getInspectList(params);
  }

  onShowDetail = (inspectId) => {
    this.props.setInspectId(inspectId);
    this.props.onChangeShowContainer({container: 'detail'});
  }

  onShowCreate = () => {
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
  sort: state.operation.inspect.get('sort'),
  total: state.operation.inspect.get('total'),
  status: state.operation.inspect.get('status'),
  inspectStatusStatistics: state.operation.inspect.get('inspectStatusStatistics'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectList: params => dispatch({ type: TicketAction.GET_INSPECT_LIST_SAGA, params }),
  setInspectId: params => dispatch({ type: TicketAction.SET_INSPECT_ID_SAGA, params }),
  inspectCheckBatch: params => dispatch({ type: TicketAction.INSPECT_CHECK_BATCH_SAGA, params}),
})
export default connect(mapStateToProps,mapDispatchToProps)(InspectList);