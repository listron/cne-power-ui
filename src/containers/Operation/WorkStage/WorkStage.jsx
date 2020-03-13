import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import StationLists from '../../../components/Operation/WorkStage/StationLists';
import RecordsList from '../../../components/Operation/WorkStage/RecordsList';
import { RunningLog, TicketsLog } from '../../../components/Operation/WorkStage/RunLogTickets';
import PlanList from '../../../components/Operation/WorkStage/PlanList';
import HandleRecord from '../../../components/Operation/WorkStage/RecordModals/HandleRecord';
import AddPlan from '../../../components/Operation/WorkStage/PlanModals/AddPlan';
import PlanHandle from '../../../components/Operation/WorkStage/PlanModals/PlanHandle';

import ContentLayout from '@components/Common/ContentLayout';
import { workStageAction } from './workStageReducer';
import { commonAction } from '../../alphaRedux/commonAction';
import styles from './workStage.scss';

class WorkStage extends Component {

  static propTypes = {
    theme: PropTypes.string,
    stations: PropTypes.array,
    pageLoading: PropTypes.bool,
    showModal: PropTypes.bool,
    modalKey: PropTypes.string,
    resetStore: PropTypes.func,
    changeStore: PropTypes.func,
    getTaskList: PropTypes.func,
    getRunningLog: PropTypes.func,
    getTickets: PropTypes.func,
    getPlanList: PropTypes.func,
  };

  componentDidMount(){
    const { stations } = this.props;
    stations.length > 0 && this.stageQuery(stations, true);
  }

  componentDidUpdate(preProps){
    const preStations = preProps.stations;
    const { stations } = this.props;
    stations.length > 0 && preStations.length === 0 && this.stageQuery(stations.filter(e => (e.stationType === 1 && e.isConnected === 1)), true); // 刷新 | 得到电站数据
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  stageQuery = (stageStations, pageLoading = false) => { // 页面整体数据请求及记录 => f5 或 选择电站触发.
    const stationCodes = stageStations.map(e => e.stationCode);
    if (!stationCodes || stationCodes.length === 0) {
      // 不让传[],~测试伙伴提bug他们不改还退群发脾气, 喏~前端做个简单屏蔽~ 毕竟~不能总跟**过不去。
      // 不传电站数据时, 界面数据清空.
      this.props.changeStore({
        stageStations,
        stageList: [],
        stageNumInfo: {},
        stageLoading: false,
        pageLoading: false,
        runLogInfo: {},
        runLogLoading: false,
        ticketsInfo: {},
        ticketsLoading: false,
        planList: [],
        planListLoading: false,
      });
    } else {
      this.props.changeStore({ stageStations, pageLoading }); // 默认当前用户所有电站
      this.props.getTaskList({ stationCodes }); // 记事列表
      this.props.getRunningLog({ stationCodes }); // 运行记录
      this.props.getTickets({ stationCodes }); // 两票三制
      this.props.getPlanList({ stationCodes }); // 计划日历
    }
  }

  handleCancel = () => {
    this.props.changeStore({
      showModal: false,
      modalKey: null,
    });
  }

  modalTitleInfo = { // 各弹框key: addRecord增记事 editRecord改记事, recordDetail记事详情, addPlan添加计划, handlePlan下发删除计划 
    addRecord: '添加工作记事',
    editRecord: '编辑工作记事',
    recordDetail: '工作记事详情',
    planDetail: '工作计划详情',
    addPlan: '添加计划',
    // handlePlan: ''
  }

  render(){
    //  modalKey 各类型弹框对应的key: addRecord增记事 editRecord改记事, recordDetail记事详情, addPlan添加计划, handlePlan下发删除计划 
    const { pageLoading, theme = 'light' } = this.props;
    return (
      <ContentLayout
        // breadcrumb={{
        //   breadData: [{ name: '工作台' }],
        //   style: { paddingLeft: '40px' },
        // }}
        theme={theme}
        contentClassName={`${styles.workStage} ${styles[theme]}`}
      >
        <StationLists {...this.props} stageQuery={this.stageQuery} />
        <Spin spinning={pageLoading}>
          <RecordsList {...this.props} />
          <div className={styles.allDetailLogs}>
            <RunningLog {...this.props} />
            <TicketsLog {...this.props} />
            <PlanList {...this.props} />
          </div>
          <HandleRecord {...this.props} />
          <AddPlan {...this.props} />
          <PlanHandle {...this.props} />
        </Spin>
      </ContentLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.workStage.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: workStageAction.resetStore }),
  changeStore: payload => dispatch({ type: workStageAction.changeStore, payload }),
  getTaskList: payload => dispatch({ type: workStageAction.getTaskList, payload }),
  addNewRecord: payload => dispatch({ type: workStageAction.addNewRecord, payload }),
  deletRecord: payload => dispatch({ type: workStageAction.deletRecord, payload }),
  editRecord: payload => dispatch({ type: workStageAction.editRecord, payload }),
  getRecordDetail: payload => dispatch({ type: workStageAction.getRecordDetail, payload }),
  setPlanComplete: payload => dispatch({ type: workStageAction.setPlanComplete, payload }),
  getPlanDetail: payload => dispatch({ type: workStageAction.getPlanDetail, payload }),
  addPlan: payload => dispatch({ type: workStageAction.addPlan, payload }),
  getRunningLog: payload => dispatch({ type: workStageAction.getRunningLog, payload }),
  getTickets: payload => dispatch({ type: workStageAction.getTickets, payload }),
  getPlanList: payload => dispatch({ type: workStageAction.getPlanList, payload }),
  handlePlanStatus: payload => dispatch({ type: workStageAction.handlePlanStatus, payload }),

  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: workStageAction.fetchSuccess,
      resultName: 'stationDeviceTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkStage);
