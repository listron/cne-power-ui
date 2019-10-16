import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import WorkExaminer from '../../../../components/Operation/TwoTickets/Examiner/WorkExaminer';
// import HandleExaminer from '../../../../components/Operation/TwoTickets/Examiner/HandleExaminer';
// import DetailModal from '../../../../components/Operation/TwoTickets/Examiner/DetailModal';
// import EditModal from '../../../../components/Operation/TwoTickets/Examiner/EditModal';
// import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
// import Footer from '../../../../components/Common/Footer';
// import { examinerAction } from './examinerReducer';
import styles from './workPlan.scss';

class WorkPlan extends Component {

  static propTypes = {
    // editModalShow: PropTypes.bool,
  };

  componentDidMount(){
    
  }

  componentWillUnmount(){
    // this.props.resetStore();
  }

  render(){
    return (
      <div className={styles.workPlan}>
        {/* <CommonBreadcrumb breadData={[{name: '审核人设置'}]} style={{ marginLeft: '38px' }} /> */}
        <div>
          <div className={styles.planContent}>
            工作计划管理，建设中。
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // ...state.operation.examiner.toJS(),
  // stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  // resetStore: () => dispatch({ type: examinerAction.resetStore }),
  // changeStore: payload => dispatch({ type: examinerAction.changeStore, payload }),
  // getSettingList: payload => dispatch({ type: examinerAction.getSettingList, payload }),
  // getSettedInfo: payload => dispatch({ type: examinerAction.getSettedInfo, payload }),
  // getSettableNodes: () => dispatch({ type: examinerAction.getSettableNodes }),
  // getSettableUsers: payload => dispatch({ type: examinerAction.getSettableUsers, payload }),
  // createSettedInfo: payload => dispatch({ type: examinerAction.createSettedInfo, payload }),
  // editSettedInfo: payload => dispatch({ type: examinerAction.editSettedInfo, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkPlan);
