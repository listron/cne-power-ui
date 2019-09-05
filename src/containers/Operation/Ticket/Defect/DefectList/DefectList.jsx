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


  filterCondition = (changeValue) => {
    const { stationType, stationCodes, defectSource, defectLevel, timeInterval, status, pageSize, createTimeStart, createTimeEnd, deviceTypeCode, defectTypeCode, sortField, sortMethod, handleUser, pageNum } = this.props;
    const filter = {
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
      handleUser,
    };
    this.props.getDefectList({ ...filter, ...changeValue });
    this.props.getDefectIdList({ ...filter, ...changeValue }); // 获取道缺陷ID列表
  }

  filterConditionChange = (value) => {
    console.log('value', value);
  }

  render() {
    const { stations, defectTypes, defectList, username, deviceTypes, defectStatusStatistics,
      createTimeStart, createTimeEnd, stationType, stationCodes, defectLevel, deviceTypeCode, defectTypeCode, defectSource, handleUser, status } = this.props;
    return (
      <div className={styles.defectList}>
        <FilterCondition
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
        />
        {/* <FilterConditions
          onChange={this.filterConditionChange}
          option={[
            {
              name: '告警级别',
              type: 'level',
              typeName: 'warnLevel',
              belong: 'multipleSelect',
            },
            {
              name: '缺陷类型',
              type: 'defectSource',
              typeName: 'defectSource',
              belong: 'multipleSelect',
            },
            {
              name: '电站类型',
              type: 'stationType',
              typeName: 'stationType',
            },
            // {
            //   name: '电站名称',
            //   type: 'stationName',
            //   belong: 'multipleSelect',
            //   typeName: 'stationCodes',
            //   data: stations,
            // },
            // {
            //   name: '电站名称',
            //   type: 'stationName',
            //   belong: 'multipleSelect',
            //   typeName: 'stationCodes',
            //   data: stations,
            // },
            {
              name: '电站名称', // 目前为止就是这一个
              type: 'parentCheckBox',
              belong: 'multipleSelect',
              typeName: 'stationCodes', // 0 1 2 全部  风电 光伏
              rules: ['stationName', 'stationCode'],
              parentName: 'provinceName',
              data: stations,
              combine: 'stationType',
              disabled: true,
            },
            {
              name: '测试单选',
              type: 'radioSelect',
              typeName: 'radioSelect',
              data: [{ label: 123, value: 345 }, { label: 567, value: 789 }],
            },
            {
              name: '我参与的',
              type: 'switch',
              typeName: 'join',
            },
          ]}
          value={{ rangeTimes: ['2019-08-3', '2019-09-3'], rangeTime: ['2019-08-3', '2019-09-3'], join: true, stationCodes: [350, 56] }}
        /> */}
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
