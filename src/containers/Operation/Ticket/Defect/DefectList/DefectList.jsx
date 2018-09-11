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
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    defectSource: PropTypes.string,
    defectLevel: PropTypes.string,
    timeInterval: PropTypes.string,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    defectTypeCode: PropTypes.string,
    handleUser: PropTypes.string,
    status: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sort: PropTypes.string,

    selectedRowKeys: PropTypes.array,
    showTab: PropTypes.string,
    total: PropTypes.number,
    defectList: PropTypes.object,
    defectStatusStatistics: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool,

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
    // const { stationType, stationCodes, defectSource, defectLevel, timeInterval, status, pageNum, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, defectTypeCode, sort, handleUser} = this.props;
    // if(this.props.showTab === 'defect') {
    //   var params = {
    //     stationType,
    //     stationCodes,
    //     defectSource,
    //     defectLevel,
    //     timeInterval,
    //     status,
    //     pageNum,
    //     pageSize,
    //     createTimeStart,
    //     createTimeEnd,
    //     deviceTypeCode,
    //     defectTypeCode,
    //     sort,
    //     handleUser
    //   }
    //   this.props.getDefectList(params);
    //   this.props.getDefectType({
    //     stationType: 2//全部
    //   }); 
    // }
  }

  onChangeFilter = (obj) => {
    const { stationType, stationCodes, defectSource, defectLevel, timeInterval, status, pageNum, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, defectTypeCode, sort, handleUser} = this.props;
    let filter = {
      stationType,
      stationCodes,
      defectSource,
      defectLevel,
      timeInterval,
      status,
      pageNum,
      pageSize,
      createTimeStart,
      createTimeEnd,
      deviceTypeCode,
      defectTypeCode,
      sort,
      handleUser
    }
    let newFiter = Object.assign({}, filter, obj);
    this.props.getDefectList(newFiter)
  }

  render() {
    return (
      <div className={styles.defectList}>
        <DefectFilter {...this.props} onChangeFilter={this.onChangeFilter} />
        <DefectTable 
          {...this.props} 
          onChangeFilter={this.onChangeFilter} />
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
  sort: state.operation.defect.get('sort'),       
  createTimeStart: state.operation.defect.get('createTimeStart'), 
  createTimeEnd: state.operation.defect.get('createTimeEnd'),	 
  deviceTypeCode: state.operation.defect.get('deviceTypeCode'),	 
  defectTypeCode: state.operation.defect.get('defectTypeCode'),
  defectTypes: state.operation.defect.get('defectTypes'),
  handleUser: state.operation.defect.get('handleUser'),
  username: Cookie.get('username'),
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