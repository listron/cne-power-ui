import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WorkPlanList from '../../../components/Operation/WorkPlan/WorkPlanList';
import WorkPlanSide from '../../../components/Operation/WorkPlan/WorkPlanSide';
import { workPlanAction } from './workPlanReducer';
import { commonAction } from '../../alphaRedux/commonAction';
import ContentLayout from '@components/Common/ContentLayout';
import styles from './workPlan.scss';

class WorkPlan extends Component {

  static propTypes = {
    theme: PropTypes.string,
    planParams: PropTypes.object,
    planListPageParams: PropTypes.object,
    getWorkPlanList: PropTypes.func,
    resetStore: PropTypes.func,
    getInspectUsers: PropTypes.func,
  };

  componentDidMount(){
    const { planParams, planListPageParams } = this.props;
    this.props.getInspectUsers({ createUser: '' });
    this.props.getWorkPlanList({ ...planParams, ...planListPageParams });
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  render(){
    const { theme } = this.props;
    return (
      <ContentLayout
        breadcrumb={{
          breadData: [{ name: '工作计划管理' }],
          style: { paddingLeft: '40px' },
        }}
        theme={theme}
        contentClassName={`${styles.planContent} ${styles[theme]}`}
      >
        <WorkPlanList {...this.props} />
        <WorkPlanSide {...this.props} />
      </ContentLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.workPlan.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: workPlanAction.resetStore }),
  changeStore: payload => dispatch({ type: workPlanAction.changeStore, payload }),

  getInspectUsers: payload => dispatch({ type: workPlanAction.getInspectUsers, payload }),
  getWorkPlanList: payload => dispatch({ type: workPlanAction.getWorkPlanList, payload }),
  getWorkPlanDetail: payload => dispatch({ type: workPlanAction.getWorkPlanDetail, payload }),
  addWorkPlan: payload => dispatch({ type: workPlanAction.addWorkPlan, payload }),
  setWorkPlanStatus: payload => dispatch({ type: workPlanAction.setWorkPlanStatus, payload }),
  editWorkPlan: payload => dispatch({ type: workPlanAction.editWorkPlan, payload }),
  deleteWorkPlan: payload => dispatch({ type: workPlanAction.deleteWorkPlan, payload }),

  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: workPlanAction.fetchSuccess,
      resultName: 'stationDeviceTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkPlan);
