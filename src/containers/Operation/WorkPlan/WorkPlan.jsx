import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WorkPlanList from '../../../components/Operation/WorkPlan/WorkPlanList';
import HandleWorkPlan from '../../../components/Operation/WorkPlan/HandleWorkPlan';
import PlanDetail from '../../../components/Operation/WorkPlan/PlanDetail';
import { workPlanAction } from './workPlanReducer';
import ContentLayout from '@components/Common/ContentLayout';
import styles from './workPlan.scss';

class WorkPlan extends Component {

  static propTypes = {
    resetStore: PropTypes.func,
  };

  componentDidMount(){
    
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  render(){
    return (
      <ContentLayout
        breadcrumb={{
          breadData: [{ name: '工作计划管理' }],
          style: { paddingLeft: '40px' },
        }}
        contentClassName={styles.planContent}
      >
        <WorkPlanList {...this.props} />
        <HandleWorkPlan {...this.props} />
        <PlanDetail {...this.props} />
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
  editWorkPlan: payload => dispatch({ type: workPlanAction.editWorkPlan, payload }),
  deleteWorkPlan: payload => dispatch({ type: workPlanAction.deleteWorkPlan, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkPlan);
