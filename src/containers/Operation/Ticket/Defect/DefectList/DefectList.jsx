import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import styles from './defectList.scss';
import { ticketAction } from '../../ticketAction';
import DefectTable from '../../../../../components/Operation/Ticket/Defect/DefectTable/DefectTable';
import DefectStatus from '../../../../../components/Operation/Ticket/Defect/DefectStatus/DefectStatus';
import { commonAction } from '../../../../alphaRedux/commonAction';
import FilterCondition from '../../../../../components/Common/FilterCondition/FilterCondition';
import FilterConditions from '../../../../../components/Common/FilterConditions/FilterCondition';

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
    const filter = {
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
      handleUser,
    };
    this.props.getDefectList({ ...filter });
    this.props.getDefectIdList({ ...filter }); // 获取道缺陷ID列表
    this.props.getLostGenType({ //获取所有损失缺陷类型
      objectType: 1,
    });
  }


  // filterCondition = (changeValue) => {
  //   const { stationType, stationCodes, defectSource, defectLevel, timeInterval, status, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, defectTypeCode, sortField, sortMethod, handleUser, pageNum } = this.props;
  //   const filter = {
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
  //     sortField,
  //     sortMethod,
  //     handleUser,
  //   };
  //   this.props.getDefectList({ ...filter, ...changeValue });
  //   this.props.getDefectIdList({ ...filter, ...changeValue }); // 获取道缺陷ID列表
  // }

  filterConditionChange = (value) => {
    const { username, timeInterval, status, pageSize, sortField, sortMethod, pageNum } = this.props;
    const { rangeTimes, stationType, stationCodes, deviceTypeCode, defectLevel, defectTypeCode, defectSource, join } = value;
    const [createTimeStart = '', createTimeEnd = ''] = rangeTimes;
    const handleUser = join && username || '';
    const tableParams = { timeInterval, status, pageSize, sortField, sortMethod, pageNum };
    const params = {
      stationType, stationCodes, defectSource, defectLevel, createTimeStart, createTimeEnd, deviceTypeCode, defectTypeCode, handleUser,
    };
    this.props.changeDefectStore({ ...tableParams, ...params });
    this.props.getDefectList({ ...tableParams, ...params });
    this.props.getDefectIdList({ ...tableParams, ...params });
  }

  render() {
    const { stations, defectTypes, defectList, username, deviceTypes, defectStatusStatistics,
      createTimeStart, createTimeEnd, stationType, stationCodes, defectLevel, deviceTypeCode, defectTypeCode, defectSource, handleUser, status } = this.props;
    const defectTypeTab = [];
    defectTypes.forEach(e => { e.list && e.list.length > 0 && defectTypeTab.push(...e.list); });
    let defectTypeList = [];
    defectTypeTab.map(e => {
      e.list && e.list.length > 0 && e.list.forEach((lastItem) => {
        lastItem.parentName = e.name;
      });
      defectTypeList = [...defectTypeList, ...e.list];
    });
    return (
      <div className={styles.defectList}>
        {/* <FilterCondition
          option={['time', 'stationType', 'stationName', 'deviceType', 'defectLevel', 'defectType', 'defectSource', 'myJoin']}
          stations={stations}
          deviceTypes={deviceTypes}
          defectList={defectList}
          defectTypes={defectTypes}
          username={username}
          onChange={this.filterCondition}
          defaultValue={{
            createTimeStart: createTimeStart,
            createTimeEnd: createTimeEnd,
            stationType: stationType,
            stationCodes: stationCodes,
            defectSource: defectSource,
            defectLevel: defectLevel,
            deviceTypeCode: deviceTypeCode,
            defectTypeCode: defectTypeCode,
            handleUser: handleUser,
          }}
        /> */}
        <FilterConditions
          onChange={this.filterConditionChange}
          option={[
            {
              name: ' 发生时间',
              type: 'time',
              belong: 'timeSelect',
              typeName: 'rangeTimes',
            },
            {
              name: '电站类型',
              type: 'stationType',
              typeName: 'stationType',
            },
            {
              name: '电站名称',
              type: 'parentCheckBox',
              belong: 'multipleSelect',
              typeName: 'stationCodes',
              rules: ['stationName', 'stationCode'],
              parentName: 'provinceName',
              data: stations,
            },
            {
              name: '设备类型',
              type: 'multipleType',
              belong: 'multipleSelect',
              typeName: 'deviceTypeCode',
              rules: ['deviceTypeName', 'deviceTypeCode'],
              data: deviceTypes,
            },
            {
              name: '缺陷级别',
              type: 'defectLevel',
              typeName: 'defectLevel',
              belong: 'multipleSelect',
            },
            {
              name: '缺陷类型',
              type: 'parentCheckBox',
              belong: 'multipleSelect',
              typeName: 'defectTypeCode',
              parentName: 'parentName',
              rules: ['name', 'id'],
              data: defectTypeList,
            },
            {
              type: 'defectSource',
              belong: 'multipleSelect',
              typeName: 'defectSource',
              disabled: true,
            },
            {
              name: '我参与的',
              type: 'switch',
              typeName: 'join',
              disabled: true,
            },
          ]}
          value={{
            stationType: stationType,
            stationCodes: stationCodes,
            defectSource: defectSource,
            defectLevel: defectLevel,
            deviceTypeCode: deviceTypeCode,
            defectTypeCode: defectTypeCode,
            rangeTimes: (createTimeStart || createTimeEnd) && [createTimeStart, createTimeEnd] || [],
            join: handleUser,
          }}
        />
        <DefectStatus defectStatusStatistics={defectStatusStatistics} onChange={this.filterCondition} defaultValue={status} />
        <DefectTable {...this.props} onChangeFilter={this.filterCondition} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.defect.toJS(),
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  username: state.common.get('username'),
  theme: state.common.get('theme'),
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
      resultName: 'defectTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);
