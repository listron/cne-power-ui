import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  GET_DEFECT_LIST_SAGA, 
  DELETE_BATCH_DEFECT_SAGA,
  SET_DEFECT_ID_SAGA,
  SEND_BATCH_DEFECT_SAGA,
  REJECT_BATCH_DEFECT_SAGA,
  CLOSE_BATCH_DEFECT_SAGA,
  CHECK_BATCH_DEFECT_SAGA,
  SET_SELECTED_DEFECT_SAGA,
  GET_DEFECT_DETAIL_SAGA
} from '../../../../../constants/actionTypes/Ticket';
import DefectTable from '../../../../../components/Operation/Ticket/Defect/DefectTable/DefectTable';

class DefectList extends Component {
  static propTypes = {
    defectList: PropTypes.object,
    currentPage: PropTypes.number,
    currentPageSize: PropTypes.number,
    selectedRowKeys: PropTypes.array,
    sort: PropTypes.string,
    total: PropTypes.number,
    defectStatusStatistics: PropTypes.object,
    isFetching: PropTypes.bool,
    error: PropTypes.object,
    status: PropTypes.string,
    getDefectList: PropTypes.func,
    setDefectId: PropTypes.func,
    onBatchDelete: PropTypes.func,
    onBatchSend: PropTypes.func,
    onBatchReject: PropTypes.func,
    onBatchClose: PropTypes.func,
    onBatchCheck: PropTypes.func,
    onChangeSelectRows: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    getDefectDetail: PropTypes.func,
  };
  constructor(props,context) {
    super(props);
    this.state = {};
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onBatchDelete = this.onBatchDelete.bind(this);
    this.onBatchSend = this.onBatchSend.bind(this);
    this.onBatchReject = this.onBatchReject.bind(this);
    this.onBatchClose = this.onBatchClose.bind(this);
    this.onBatchCheck = this.onBatchCheck.bind(this);
    this.onShowDetail = this.onShowDetail.bind(this);
    this.onSorter = this.onSorter.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  componentDidMount() {
    var params = {
      defectSource: '3',
      stationType: '2',
      status: '5',
      pageNum: 0,
      pageSize: 10,
      sort: ''
    }
    this.props.getDefectList(params);
  }

  onChangePage(page) {
    if(page !== this.currentPage) {
      let params = {
        defectSource: '3',
        stationType: '2',
        status: this.props.status,
        pageNum: page - 1,
        pageSize: this.props.currentPageSize,
        sort: this.props.sort
      }
      this.props.getDefectList(params);
    }
  }

  onChangePageSize(pageSize) {
    if(pageSize !== this.props.currentPageSize) {
      let params = {
        defectSource: '3',
        stationType: '2',
        status: this.props.status,
        pageNum: 0,
        pageSize: pageSize,
        sort: this.props.sort
      }
      this.props.getDefectList(params);
    } 
  }

  onChangeStatus(status) {
    if(status !== this.props.status) {
      let params = {
        defectSource: '3',
        stationType: '2',
        status: status,
        pageNum: 0,
        pageSize: this.props.currentPageSize,
        sort: this.props.sort
      }
      this.props.getDefectList(params);
    }
  }

  onSorter(sort) {
    if(sort !== this.props.sort) {
      let params = {
        defectSource: '3',
        stationType: '2',
        status: this.props.status,
        pageNum: 0,
        pageSize: this.props.currentPageSize,
        sort: sort
      }
      this.props.getDefectList(params);
    }
  }

  onBatchDelete(ids) {
    this.props.onBatchDelete({defectID: ids.join(',')});
  }

  onBatchSend(ids) {
    this.props.onBatchSend({defectID: ids.join(',')});
  }

  onBatchReject(ids) {
    this.props.onBatchReject({defectID: ids.join(',')});
  }

  onBatchClose(ids) {
    this.props.onBatchClose({defectID: ids.join(',')});
  }

  onBatchCheck(ids, checkResult) {
    this.props.onBatchCheck({
      defectID: ids.join(','),
      checkResult
    });
  }

  onShowDetail(defectId,record) {
    if(record.defectStatus === 0 || record.defectStatus === '0'){
      this.props.getDefectDetail({
        container: 'create',
        editNewDefect:true,
        defectId
      });
    }else{
      this.props.setDefectId(defectId);
      this.props.onChangeShowContainer({container: 'detail'});
    }
  }
  onAdd(){
    this.props.onChangeShowContainer({container: 'create'});
  }

  render() {   
    return (
      <div>
        <DefectTable 
          list={this.props.defectList} 
          currentPage={this.props.currentPage}
          currentPageSize={this.props.currentPageSize}
          total={this.props.total}
          defectStatusStatistics={this.props.defectStatusStatistics}
          status={this.props.status}
          isFetching={this.props.isFetching}
          onAdd={this.onAdd}
          onChangePage={this.onChangePage}
          onChangePageSize={this.onChangePageSize}
          onChangeStatus={this.onChangeStatus}
          onSorter={this.onSorter}
          onShowDetail={this.onShowDetail}
          onDelete={this.onBatchDelete}
          onSend={this.onBatchSend}
          onReject={this.onBatchReject}
          onClose={this.onBatchClose}
          onCheck={this.onBatchCheck}
          selectedRowKeys={this.props.selectedRowKeys}
          onChangeSelectRows={this.props.onChangeSelectRows} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  defectStatusStatistics: state.operation.defect.get('defectStatusStatistics'),
  isFetching: state.operation.defect.get('isFetching'),
  error: state.operation.defect.get('error'),
  currentPage: state.operation.defect.get('currentPage'),
  currentPageSize: state.operation.defect.get('currentPageSize'),
  total: state.operation.defect.get('total'),
  status: state.operation.defect.get('status'),
  sort: state.operation.defect.get('sort'),
  selectedRowKeys: state.operation.defect.get('selectedRowKeys').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getDefectList: params => dispatch({ type: GET_DEFECT_LIST_SAGA, params }),
  setDefectId: params => dispatch({ type: SET_DEFECT_ID_SAGA, params }),
  onBatchDelete: params => dispatch({ type: DELETE_BATCH_DEFECT_SAGA, params }),
  onBatchSend: params => dispatch({ type: SEND_BATCH_DEFECT_SAGA, params }),
  onBatchReject: params => dispatch({ type: REJECT_BATCH_DEFECT_SAGA, params }),
  onBatchClose: params => dispatch({ type: CLOSE_BATCH_DEFECT_SAGA, params }),
  onBatchCheck: params => dispatch({ type: CHECK_BATCH_DEFECT_SAGA, params }),
  onChangeSelectRows: params => dispatch({ type: SET_SELECTED_DEFECT_SAGA, params }),
  getDefectDetail: params => dispatch({ type: GET_DEFECT_DETAIL_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);