import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import WorkExaminer from '../../../../components/Operation/TwoTickets/Examiner/WorkExaminer';
// import HandleExaminer from '../../../../components/Operation/TwoTickets/Examiner/HandleExaminer';
// import DetailModal from '../../../../components/Operation/TwoTickets/Examiner/DetailModal';
// import EditModal from '../../../../components/Operation/TwoTickets/Examiner/EditModal';
// import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
// import Footer from '../../../../components/Common/Footer';
import { workStageAction } from './workStageReducer';
import styles from './workStage.scss';

class WorkStage extends Component {

  static propTypes = {
    // editModalShow: PropTypes.bool,
  };

  componentDidMount(){
    this.props.getTaskList();
  }

  componentWillUnmount(){
    // this.props.resetStore();
  }

  render(){
    return (
      <div className={styles.workStage}>
        {/* <CommonBreadcrumb breadData={[{name: '审核人设置'}]} style={{ marginLeft: '38px' }} /> */}
        <div>
          <div className={styles.stageContent}>
            工作台建设中。
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
  getTaskList: payload => dispatch({ type: workStageAction.getTaskList, payload }),
  // getSettedInfo: payload => dispatch({ type: examinerAction.getSettedInfo, payload }),
  // getSettableNodes: () => dispatch({ type: examinerAction.getSettableNodes }),
  // getSettableUsers: payload => dispatch({ type: examinerAction.getSettableUsers, payload }),
  // createSettedInfo: payload => dispatch({ type: examinerAction.createSettedInfo, payload }),
  // editSettedInfo: payload => dispatch({ type: examinerAction.editSettedInfo, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkStage);
