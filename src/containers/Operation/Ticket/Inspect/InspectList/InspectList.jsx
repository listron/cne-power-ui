import React, { Component } from 'react';
import InspectTable from '../../../../../components/Operation/Ticket/Inspect/InspectTable/InspectTable';
import { ticketAction } from '../../../../../constants/actionTypes/operation/ticketAction';
import InspectFilter from '../../../../../components/Operation/Ticket/Inspect/InspectFilter/InspectFilter';
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

  onChangePageSize = (pageSize) => {
    if(pageSize !== this.props.pageSize) {
      let params = {
        defectSource: '3',
        stationType: '2',
        status: this.props.status,
        pageNum: 0,
        pageSize: pageSize,
        sort: this.props.sort,
      }
      this.props.getInspectList(params);
    } 
  }

  onChangePage = (page) => {
    if(page !== this.props.pageNum) {
      let params = {
        stationType: '2',
        status: this.props.status,
        pageNum: page - 1,
        pageSize: this.props.pageSize,
        sort: this.props.sort,
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
        sort: this.props.sort,
      }
      this.props.getInspectList(params);
    }
  }

  onChangeSort = (sort) => {
    if(sort !== this.props.sort) {
      let params = {
        stationType: "2",
        status: this.props.status,
        pageNum: 0,
        pageSize: this.props.pageSize,
        sort: sort,
      }
      this.props.getInspectList(params);
    }
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
        <InspectFilter {...this.props} />
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
  sort: state.operation.inspect.get('sort'),
  total: state.operation.inspect.get('total'),
  inspectStatusStatistics: state.operation.inspect.get('inspectStatusStatistics'),

  stationType: state.operation.inspect.get('stationType'),
  stationCodes: state.operation.inspect.get('stationCodes'),      
  timeInterval: state.operation.inspect.get('timeInterval'),   
  status: state.operation.inspect.get('status'),          
  pageNum: state.operation.inspect.get('pageNum'),       
  pageSize: state.operation.inspect.get('pageSize'),       
  createTimeStart: state.operation.inspect.get('createTimeStart'), 
  createTimeEnd: state.operation.inspect.get('createTimeEnd'),	 
  deviceTypeCode: state.operation.inspect.get('deviceTypeCode'),
  sort: state.operation.inspect.get('sort'),
  selfDefect: state.operation.defect.get('selfDefect'),
  hasAbnormal: state.operation.inspect.get('hasAbnormal'),
  userName: state.common.get('userName'), 
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  getInspectList: params => dispatch({ type: ticketAction.GET_INSPECT_LIST_SAGA, params }),
  setInspectId: params => dispatch({ type: ticketAction.SET_INSPECT_ID_SAGA, params }),
  inspectCheckBatch: params => dispatch({ type: ticketAction.INSPECT_CHECK_BATCH_SAGA, params}),
})
export default connect(mapStateToProps,mapDispatchToProps)(InspectList);