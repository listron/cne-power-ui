import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StationLists from '../../../components/Operation/WorkStage/StationLists';
import RecordsList from '../../../components/Operation/WorkStage/RecordsList';
import { RunningLog, TicketsLog } from '../../../components/Operation/WorkStage/RunLogTickets';
// import DetailModal from '../../../../components/Operation/TwoTickets/Examiner/DetailModal';
// import EditModal from '../../../../components/Operation/TwoTickets/Examiner/EditModal';
import ContentLayout from '@components/Common/ContentLayout';
import { workStageAction } from './workStageReducer';
import styles from './workStage.scss';

class WorkStage extends Component {

  static propTypes = {
    theme: PropTypes.string,
    stations: PropTypes.array,
    resetStore: PropTypes.func,
    changeStore: PropTypes.func,
    getTaskList: PropTypes.func,
    getRunningLog: PropTypes.func,
    getTickets: PropTypes.func,
  };

  componentDidMount(){
    const { stations } = this.props;
    stations.length > 0 && this.stageQuery(stations);
  }

  componentDidUpdate(preProps){
    const preStations = preProps.stations;
    const { stations } = this.props;
    stations.length > 0 && preStations.length === 0 && this.stageQuery(stations); // 刷新 | 得到电站数据
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  stageQuery = (stageStations) => { // 页面整体数据请求及记录
    this.props.changeStore({ stageStations }); // 默认当前用户所有电站
    this.props.getTaskList({ // 记事列表
      stationCodes: stageStations.map(e => e.stationCode),
      startDate: '2019-10-17 00:00:00',
      endDate: '2019-10-17 23:59:59',
    });
    this.props.getRunningLog({
      stationCodes: stageStations.map(e => e.stationCode),
      startDate: '2019-10-17 00:00:00',
      endDate: '2019-10-17 23:59:59',
    });
    this.props.getTickets({
      stationCodes: stageStations.map(e => e.stationCode),
      startDate: '2019-10-17 00:00:00',
      endDate: '2019-10-17 23:59:59',
    });
  }

  render(){
    const { theme = 'light', stageStations, stations, stageLoading, stageNumInfo, stageList } = this.props;
    return (
      <ContentLayout
        breadcrumb={{
          breadData: [{ name: '工作台' }],
          style: { paddingLeft: '40px' },
        }}
        // contentClassName={styles.workStage}
      >
        <StationLists
          {...this.props}
          stageQuery={this.stageQuery}
        />
        <RecordsList
          {...this.props}
        />
        <div className={styles.allDetailLogs}>
          <RunningLog {...this.props} />
          <TicketsLog {...this.props} />
          <div>日历计划</div>
        </div>
        <div>统一弹框组件</div>
        {/* <div>添加工作记事弹框</div>
        <div>查看工作记事弹框</div>
        <div>编辑工作记事弹框</div>
        <div>添加计划弹框</div>
        <div>批量查看计划弹框</div> */}
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
  getRunningLog: payload => dispatch({ type: workStageAction.getRunningLog, payload }),
  getTickets: payload => dispatch({ type: workStageAction.getTickets, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkStage);
