import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import WorkExaminer from '../../../../components/Operation/TwoTickets/Examiner/WorkExaminer';
// import HandleExaminer from '../../../../components/Operation/TwoTickets/Examiner/HandleExaminer';
// import DetailModal from '../../../../components/Operation/TwoTickets/Examiner/DetailModal';
// import EditModal from '../../../../components/Operation/TwoTickets/Examiner/EditModal';
// import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
// import Footer from '../../../../components/Common/Footer';
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
    console.log(this.props);
    return (
      <ContentLayout
        breadcrumb={{
          breadData: [{ name: '工作计划管理' }],
          style: { paddingLeft: '40px' },
        }}
        contentClassName={styles.planContent}
      >
        <div className={styles.workPlanAnimationBox}>
          <div>工作计划列表主页面</div>
          <div>添加计划页面</div>
          <div>编辑计划页面</div>
          <div>查看计划详情</div>
        </div>
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
  // changeStore: payload => dispatch({ type: examinerAction.changeStore, payload }),
  // getSettingList: payload => dispatch({ type: examinerAction.getSettingList, payload }),
  // getSettedInfo: payload => dispatch({ type: examinerAction.getSettedInfo, payload }),
  // getSettableNodes: () => dispatch({ type: examinerAction.getSettableNodes }),
  // getSettableUsers: payload => dispatch({ type: examinerAction.getSettableUsers, payload }),
  // createSettedInfo: payload => dispatch({ type: examinerAction.createSettedInfo, payload }),
  // editSettedInfo: payload => dispatch({ type: examinerAction.editSettedInfo, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkPlan);
