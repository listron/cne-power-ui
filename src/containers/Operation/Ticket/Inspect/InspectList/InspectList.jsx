import React, { Component } from 'react';
import styles from './insepectList.scss';
import InspectTable from '../../../../../components/Operation/Ticket/Inspect/InspectTable/InspectTable';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import InspectFilter from '../../../../../components/Operation/Ticket/Inspect/InspectFilter/InspectFilter';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class InspectList extends Component {
  static propTypes={
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    timeInterval: PropTypes.string,
    status: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sort: PropTypes.string,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    handleUser: PropTypes.string,
    hasAbnormal:  PropTypes.bool,

    selectedRowKeys: PropTypes.array,
    total: PropTypes.number,
    inspectList: PropTypes.object,
    inspectStatusStatistics: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.object,
    showTab: PropTypes.string,
    getInspectList: PropTypes.func,
    getInspectDetail: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    inspectCheckBatch: PropTypes.func,
  }

  constructor(props,context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { stationType, stationCodes, timeInterval, status, pageNum, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, sort, handleUser, hasAbnormal} = this.props;
    if(this.props.showTab === 'inspect') {
      var params = {
        stationType,
        stationCodes,
        timeInterval,
        status,
        pageNum,
        pageSize,
        sort,
        createTimeStart,
        createTimeEnd,
        deviceTypeCode,
        handleUser,
        hasAbnormal
      }
      this.props.getInspectList(params);
    }
  }

  onChangeFilter = (obj) => {
    const { stationType, stationCodes, timeInterval, status, pageNum, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, sort, handleUser, hasAbnormal} = this.props;
    let filter = {
      stationType,
      stationCodes,
      timeInterval,
      status,
      pageNum,
      pageSize,
      sort,
      createTimeStart,
      createTimeEnd,
      deviceTypeCode,
      handleUser,
      hasAbnormal
    }
    let newFiter = Object.assign({}, filter, obj);
    this.props.getInspectList(newFiter)
  }  

  render() {
    return (
      <div className={styles.defectList}>
        <InspectFilter {...this.props} />
        <InspectTable 
          {...this.props} 
          onChangeFilter={this.onChangeFilter} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  inspectList: state.operation.inspect.get('inspectList'),
  inspectStatusStatistics: state.operation.inspect.get('inspectStatusStatistics'),
  loading: state.operation.inspect.get('loading'),
  error: state.operation.inspect.get('error'),
  sort: state.operation.inspect.get('sort'),
  total: state.operation.inspect.get('total'),
  selectedRowKeys: state.operation.defect.get('selectedRowKeys').toJS(),

  stationType: state.operation.inspect.get('stationType'),
  stationCodes: state.operation.inspect.get('stationCodes'),      
  timeInterval: state.operation.inspect.get('timeInterval'),   
  status: state.operation.inspect.get('status'),          
  pageNum: state.operation.inspect.get('pageNum'),       
  pageSize: state.operation.inspect.get('pageSize'),
  sort: state.operation.inspect.get('sort'),       
  createTimeStart: state.operation.inspect.get('createTimeStart'), 
  createTimeEnd: state.operation.inspect.get('createTimeEnd'),	 
  deviceTypeCode: state.operation.inspect.get('deviceTypeCode'),
  selfDefect: state.operation.defect.get('selfDefect'),
  handleUser: state.operation.defect.get('handleUser'),
  username: Cookie.get('username'),
  stations: state.common.get('stations'),
  deviceTypes: state.common.get('stationDeviceTypes'),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectList: payload => dispatch({ type: ticketAction.GET_INSPECT_LIST_SAGA, payload }),
  getInspectDetail: payload => dispatch({ type: ticketAction.GET_INSPECT_DETAIL_SAGA, payload }),
  inspectCheckBatch: payload => dispatch({ type: ticketAction.CHECK_BATCH_INSPECT_SAGA, payload}),
})
export default connect(mapStateToProps, mapDispatchToProps)(InspectList);