import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import styles from './defectList.scss';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import DefectTable from '../../../../../components/Operation/Ticket/Defect/DefectTable/DefectTable';
import DefectFilter from '../../../../../components/Operation/Ticket/Defect/DefectFilter/DefectFilter';

class DefectList extends Component {
  static propTypes = {
    defectList: PropTypes.object,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    selectedRowKeys: PropTypes.array,
    sort: PropTypes.string,
    showTab: PropTypes.string,
    total: PropTypes.number,
    defectStatusStatistics: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.object,
    status: PropTypes.string,
    getDefectList: PropTypes.func,
    onBatchDelete: PropTypes.func,
    onBatchSend: PropTypes.func,
    onBatchReject: PropTypes.func,
    onBatchClose: PropTypes.func,
    onBatchCheck: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    getDefectDetail: PropTypes.func,
    changeDefectStore: PropTypes.func,
    getDefectType: PropTypes.func,
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
        pageNum: this.props.pageNum,
        pageSize: this.props.pageSize,
        sort: this.props.sort
      }
      this.props.getDefectList(params);
      this.props.getDefectType({
        stationType: 2//全部
      }); 
    }
  }

  onChangePage = (page) => {
    if(page !== this.pageNum) {
      let params = {
        defectSource: '3',
        stationType: '2',
        status: this.props.status,
        pageNum: page - 1,
        pageSize: this.props.pageSize,
        sort: this.props.sort
      }
      this.props.getDefectList(params);
    }
  }

  onChangePageSize = (pageSize) => {
    if(pageSize !== this.props.pageSize) {
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
        pageSize: this.props.pageSize,
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
        pageSize: this.props.pageSize,
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
      this.props.changeDefectStore({defectId});
      this.props.onChangeShowContainer({container: 'detail'});
    }
  }
  onAdd = () => {
    this.props.onChangeShowContainer({container: 'create'});
  }

  render() {
    return (
      <div className={styles.defectList}>
        <DefectFilter {...this.props} />
        <DefectTable 
          {...this.props} 
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
           />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  defectList: state.operation.defect.get('defectList'),
  defectStatusStatistics: state.operation.defect.get('defectStatusStatistics'),
  loading: state.operation.defect.get('loading'),
  error: state.operation.defect.get('error'),
  total: state.operation.defect.get('total'),
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
  defectTypes: state.operation.defect.get('defectTypes'),
  sort: state.operation.defect.get('sort'),
  selfDefect: state.operation.defect.get('selfDefect'),
  userName: Cookie.get('username'), 
  stations: state.common.get('stations'),
  deviceTypes: state.common.get('deviceTypes'),
});

const mapDispatchToProps = (dispatch) => ({
  changeDefectStore: payload => dispatch({type:ticketAction.CHANGE_DEFECT_STORE_SAGA, payload}),
  getDefectList: payload => dispatch({ type: ticketAction.GET_DEFECT_LIST_SAGA, payload }),
  getDefectType: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload }),
  onBatchDelete: payload => dispatch({ type: ticketAction.DELETE_BATCH_DEFECT_SAGA, payload }),
  onBatchSend: payload => dispatch({ type: ticketAction.SEND_BATCH_DEFECT_SAGA, payload }),
  onBatchReject: payload => dispatch({ type: ticketAction.REJECT_BATCH_DEFECT_SAGA, payload }),
  onBatchClose: payload => dispatch({ type: ticketAction.CLOSE_BATCH_DEFECT_SAGA, payload }),
  onBatchCheck: payload => dispatch({ type: ticketAction.CHECK_BATCH_DEFECT_SAGA, payload }),
  getDefectDetail: payload => dispatch({ type: ticketAction.GET_DEFECT_DETAIL_SAGA, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);