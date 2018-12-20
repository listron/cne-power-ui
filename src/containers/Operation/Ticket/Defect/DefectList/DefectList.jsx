import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import styles from './defectList.scss';
import { ticketAction } from '../../ticketAction';
import DefectTable from '../../../../../components/Operation/Ticket/Defect/DefectTable/DefectTable';
import DefectFilter from '../../../../../components/Operation/Ticket/Defect/DefectFilter/DefectFilter';
import DefectStatus from '../../../../../components/Operation/Ticket/Defect/DefectStatus/DefectStatus';
import { commonAction } from '../../../../alphaRedux/commonAction';
import FilterCondition from '../../../../../components/Common/FilterCondition/FilterCondition';

class DefectList extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    stationCodes: PropTypes.array,
    defectSource: PropTypes.array,
    defectLevel: PropTypes.array,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.array,
    defectTypeCode: PropTypes.array,
    handleUser: PropTypes.string,
    status: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,

    selectedRowKeys: PropTypes.array,
    showTab: PropTypes.string,
    total: PropTypes.number,
    defectList: PropTypes.array,
    defectStatusStatistics: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool,

    getDefectList: PropTypes.func,
    getDefectIdList: PropTypes.func,
    onBatchDelete: PropTypes.func,
    onBatchSend: PropTypes.func,
    onBatchReject: PropTypes.func,
    onBatchClose: PropTypes.func,
    onBatchCheck: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    getDefectDetail: PropTypes.func,
    changeDefectStore: PropTypes.func,
    getLostGenType: PropTypes.func,
  };
  constructor(props, context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { stationType, stationCodes, defectSource, defectLevel, status, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, defectTypeCode, sortField, sortMethod, handleUser, pageNum } = this.props;
    let filter = {
      stationType,
      stationCodes,
      defectSource,
      defectLevel,
      status,
      pageNum,
      pageSize,
      createTimeStart,
      createTimeEnd,
      deviceTypeCode,
      defectTypeCode,
      sortField,
      sortMethod,
      handleUser
    }
    this.props.getDefectList({ ...filter });
    this.props.getLostGenType({ //获取所有损失缺陷类型
      objectType: 1
    })
  }

  componentWillReceiveProps(nextProps){
    // const { stationType, stationCodes, defectSource, defectLevel, status, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, defectTypeCode, sortField, sortMethod, handleUser, pageNum,showTab } = this.props;
    // showTab!==this.props.showTab && this.props.getDefectList({ ...filter });
  }


  componentWillUnmount(){
    console.log('我测试一下，卸不卸载')
    
  }


  filterCondition = (changeValue) => {
    const { stationType, stationCodes, defectSource, defectLevel, timeInterval, status, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, defectTypeCode, sortField, sortMethod, handleUser, pageNum } = this.props;
    // console.log('看一下', changeValue)　
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
      sortField,
      sortMethod,
      handleUser
    }
    this.props.getDefectList({ ...filter, ...changeValue });
  }

  render() {
    const { stations, defectTypes, defectList, username, deviceTypes, defectStatusStatistics } = this.props;
    return (
      <div className={styles.defectList}>
        <FilterCondition
          option={["time", "stationType", "stationName", "deviceType", "defectLevel", "defectType", "defectSource", "myJoin"]}
          stations={stations}
          deviceTypes={deviceTypes}
          defectList={defectList}
          defectTypes={defectTypes}
          username={username}
          onChange={this.filterCondition}
        />
        <DefectStatus defectStatusStatistics={defectStatusStatistics} onChange={this.filterCondition} />
        <DefectTable {...this.props} onChangeFilter={this.filterCondition} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.defect.toJS(),
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  username: Cookie.get('username'),
});

const mapDispatchToProps = (dispatch) => ({
  changeDefectStore: payload => dispatch({ type: ticketAction.CHANGE_DEFECT_STORE_SAGA, payload }),
  getDefectList: payload => dispatch({ type: ticketAction.GET_DEFECT_LIST_SAGA, payload }),
  getDefectIdList: payload => dispatch({ type: ticketAction.GET_DEFECT_ID_LIST_SAGA, payload }),
  getDefectType: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload }),
  onBatchDelete: payload => dispatch({ type: ticketAction.DELETE_BATCH_DEFECT_SAGA, payload }),
  onBatchSend: payload => dispatch({ type: ticketAction.SEND_BATCH_DEFECT_SAGA, payload }),
  onBatchReject: payload => dispatch({ type: ticketAction.REJECT_BATCH_DEFECT_SAGA, payload }),
  onBatchClose: payload => dispatch({ type: ticketAction.CLOSE_BATCH_DEFECT_SAGA, payload }),
  onBatchCheck: payload => dispatch({ type: ticketAction.CHECK_BATCH_DEFECT_SAGA, payload }),
  getDefectDetail: payload => dispatch({ type: ticketAction.GET_DEFECT_DETAIL_SAGA, payload }),

  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: ticketAction.GET_DEFECT_FETCH_SUCCESS,
      resultName: 'defectTypes'
    }
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);