import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GET_DEFECT_LIST_SAGA, DELETE_BATCH_DEFECT_SAGA } from '../../../../../constants/actionTypes/Ticket';
import List from '../../../../../components/Operation/Ticket/Defect/List';

class DefectList extends Component {
  static propTypes = {
    defectList: PropTypes.object,
    currentPage: PropTypes.number,
    currentPageSize: PropTypes.number,
    total: PropTypes.number,
    defectStatusStatistics: PropTypes.object,
    isFetching: PropTypes.bool,
    error: PropTypes.string,
    status: PropTypes.string,
    getDefectList: PropTypes.func,
    onBatchDelete: PropTypes.func,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onBatchDelete = this.onBatchDelete.bind(this);
  }

  componentDidMount() {
    var params = {
      defectSource: "3",
      stationType: "2",
      status: this.props.status,
      pageNum: this.props.currentPage - 1,
      pageSize: this.props.currentPageSize
    }
    this.props.getDefectList(params);
  }

  onChangePage(page) {
    if(page !== this.currentPage) {
      let params = {
        defectSource: "3",
        stationType: "2",
        status: this.props.status,
        pageNum: page - 1,
        pageSize: this.props.currentPageSize
      }
      this.props.getDefectList(params);
    }
  }

  onChangePageSize(pageSize) {
    if(pageSize !== this.props.currentPageSize) {
      let params = {
        defectSource: "3",
        stationType: "2",
        status: this.props.status,
        pageNum: 0,
        pageSize: pageSize
      }
      this.props.getDefectList(params);
    } 
  }

  onChangeStatus(status) {
    if(status !== this.props.status) {
      let params = {
        defectSource: "3",
        stationType: "2",
        status: status,
        pageNum: 0,
        pageSize: this.props.currentPageSize
      }
      this.props.getDefectList(params);
    }
  }

  onBatchDelete(ids) {
    this.props.onBatchDelete(ids.join(","));
  }

  render() {   
    return (
      <div>
        <List 
          list={this.props.defectList} 
          currentPage={this.props.currentPage}
          currentPageSize={this.props.currentPageSize}
          total={this.props.total}
          defectStatusStatistics={this.props.defectStatusStatistics}
          status={this.props.status}
          isFetching={this.props.isFetching}
          onChangePage={this.onChangePage}
          onChangePageSize={this.onChangePageSize}
          onChangeStatus={this.onChangeStatus}
          onDelete={this.onBatchDelete} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  defectStatusStatistics: state.operation.defect.get('defectStatusStatistics'),
  isFetching: state.operation.defect.get('isFetching'),
  error: state.operation.defect.get('error'),
  currentPage: state.operation.defect.get("currentPage"),
  currentPageSize: state.operation.defect.get("currentPageSize"),
  total: state.operation.defect.get("total"),
  status: state.operation.defect.get("status")
});

const mapDispatchToProps = (dispatch) => ({
  getDefectList: params => dispatch({ type: GET_DEFECT_LIST_SAGA, params }),
  onBatchDelete: params => dispatch({ type: DELETE_BATCH_DEFECT_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);