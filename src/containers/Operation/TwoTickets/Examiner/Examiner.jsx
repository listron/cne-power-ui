import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WorkExaminer from '../../../../components/Operation/TwoTickets/Examiner/WorkExaminer';
import HandleExaminer from '../../../../components/Operation/TwoTickets/Examiner/HandleExaminer';
import DetailModal from '../../../../components/Operation/TwoTickets/Examiner/DetailModal';
import EditModal from '../../../../components/Operation/TwoTickets/Examiner/EditModal';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import { examinerAction } from './examinerReducer';
import styles from './examiner.scss';

class Examiner extends Component {

  static propTypes = {
    editModalShow: PropTypes.bool,
    detailModalShow: PropTypes.bool,
    templateType: PropTypes.number,
    tableParams: PropTypes.object,
    getSettingList: PropTypes.func,
    getSettableNodes: PropTypes.func,
    changeStore: PropTypes.func,
    resetStore: PropTypes.func,
  };

  componentDidMount(){
    const { tableParams, getSettingList, getSettableNodes } = this.props;
    getSettingList({ ...tableParams });
    getSettableNodes();
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  sideTransformChange = (sideTransform) => {
    this.setState({ sideTransform });
  }

  tabChange = (e) => { // 工作票 < = > 操作票
    const { innerHTML } = e.target;
    const { changeStore, getSettableNodes, getSettingList } = this.props;
    const tabInfo = {
      '工作票': 1,
      '操作票': 2,
    };
    const newTableParams = {
      stationCodes: [],
      sortField: '', //station_name state, create_time
      sortMethod: '', // 排序规则 "asc"：正序  "desc"：倒序
      pageNum: 1,
      pageSize: 10,
    };
    const tabName = tabInfo[innerHTML];
    if (tabName) {
      changeStore({
        templateType: tabInfo[innerHTML],
        tableParams: { ...newTableParams },
      });
      getSettableNodes();
      getSettingList({ ...newTableParams });
    }
  }

  render(){
    const { templateType, editModalShow, detailModalShow } = this.props;
    // WorkExaminer 与 HandleExaminer组件，现完全相同，为防止后期表格或操作异化，暂作两个复制组件
    return (
      <div className={styles.examiner}>
        <CommonBreadcrumb breadData={[{name: '审核人设置'}]} style={{ marginLeft: '38px' }} />
        <div className={styles.examinerList}>
          <div className={styles.listContent}>
            <div className={styles.tabs} onClick={this.tabChange}>
              <span className={templateType === 1 ? styles.active : styles.inactive}>工作票</span>
              <span className={templateType === 2 ? styles.active : styles.inactive}>操作票</span>
            </div>
            {templateType === 1 && <WorkExaminer {...this.props} />}
            {templateType === 2 && <HandleExaminer {...this.props} />}
          </div>
          {editModalShow && <EditModal {...this.props} />}
          {detailModalShow && <DetailModal {...this.props} />}
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.examiner.toJS(),
  stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: examinerAction.resetStore }),
  changeStore: payload => dispatch({ type: examinerAction.changeStore, payload }),
  getSettingList: payload => dispatch({ type: examinerAction.getSettingList, payload }),
  getSettedInfo: payload => dispatch({ type: examinerAction.getSettedInfo, payload }),
  getSettableNodes: () => dispatch({ type: examinerAction.getSettableNodes }),
  getSettableUsers: payload => dispatch({ type: examinerAction.getSettableUsers, payload }),
  createSettedInfo: payload => dispatch({ type: examinerAction.createSettedInfo, payload }),
  editSettedInfo: payload => dispatch({ type: examinerAction.editSettedInfo, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Examiner);
