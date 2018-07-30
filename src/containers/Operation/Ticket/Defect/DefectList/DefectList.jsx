import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TicketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import DefectTable from '../../../../../components/Operation/Ticket/Defect/DefectTable/DefectTable';
import DefectFilter from '../../../../../components/Operation/Ticket/Defect/DefectFilter/DefectFilter';

class DefectList extends Component {
  static propTypes = {
    defectList: PropTypes.object,
    currentPage: PropTypes.number,
    currentPageSize: PropTypes.number,
    selectedRowKeys: PropTypes.array,
    sort: PropTypes.string,
    showTab: PropTypes.string,
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
  }

  componentDidMount() {
    if(this.props.showTab === 'defect') {
      var params = {
        defectSource: '3',
        stationType: '2',
        status: this.props.status,
        pageNum: this.props.currentPage - 1,
        pageSize: this.props.currentPageSize,
        sort: this.props.sort
      }
      this.props.getDefectList(params);
    }
  }

  onChangePage = (page) => {
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

  onChangePageSize = (pageSize) => {
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

  onChangeStatus = (status) => {
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

  onSorter = (sort) => {
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

  onBatchDelete = (ids) => {
    this.props.onBatchDelete({defectId: ids.join(',')});
  }

  onBatchSend = (ids) => {
    this.props.onBatchSend({defectId: ids.join(',')});
  }

  onBatchReject = (ids) => {
    this.props.onBatchReject({defectId: ids.join(',')});
  }

  onBatchClose = (ids) => {
    this.props.onBatchClose({defectId: ids.join(',')});
  }

  onBatchCheck = (ids, checkResult) => {
    this.props.onBatchCheck({
      defectId: ids.join(','),
      checkResult
    });
  }

  onShowDetail = (defectId,record) => {
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
  onAdd = () => {
    this.props.onChangeShowContainer({container: 'create'});
  }

  render() {
    return (
      <div>
        <DefectFilter {...this.props} />
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

  stationType: state.operation.defect.get('stationType'),
  stationCodes: state.operation.defect.get('stationCodes'),    
  defectSource: state.operation.defect.get('defectSource'),   
  defectLevel: state.operation.defect.get('defectLevel'),	  
  timeInterval: state.operation.defect.get('timeInterval'),   
  status: state.operation.defect.get('status'),          
  pageNum: state.operation.defect.get('pageNum'),       
  pageSize: state.operation.defect.get('pageSize'),       
  createTimeStart: state.operation.defect.get('createTimeStart'), 
  createTimeEnd: state.operation.defect.get('createTimeEnd'),	 
  deviceTypeCode: state.operation.defect.get('deviceTypeCode'),	 
  defectTypeCode: state.operation.defect.get('defectTypeCode'),
  handleUser: state.operation.defect.get('handleUser'), 
  sort: state.operation.defect.get('sort'),
});

const mapDispatchToProps = (dispatch) => ({
  getDefectList: params => dispatch({ type: TicketAction.GET_DEFECT_LIST_SAGA, params }),
  setDefectId: params => dispatch({ type: TicketAction.SET_DEFECT_ID_SAGA, params }),
  onBatchDelete: params => dispatch({ type: TicketAction.DELETE_BATCH_DEFECT_SAGA, params }),
  onBatchSend: params => dispatch({ type: TicketAction.SEND_BATCH_DEFECT_SAGA, params }),
  onBatchReject: params => dispatch({ type: TicketAction.REJECT_BATCH_DEFECT_SAGA, params }),
  onBatchClose: params => dispatch({ type: TicketAction.CLOSE_BATCH_DEFECT_SAGA, params }),
  onBatchCheck: params => dispatch({ type: TicketAction.CHECK_BATCH_DEFECT_SAGA, params }),
  onChangeSelectRows: params => dispatch({ type: TicketAction.SET_SELECTED_DEFECT_SAGA, params }),
  getDefectDetail: params => dispatch({ type: TicketAction.GET_DEFECT_DETAIL_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);