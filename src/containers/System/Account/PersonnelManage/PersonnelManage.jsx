import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './personnel.scss';
import PropTypes from 'prop-types';
import { personnelManageAction } from './personnelManageReducer';
import ContentLayout from '@components/Common/ContentLayout';
// import { commonAction } from '../../../alphaRedux/commonAction';
// import TransitionContainer from '../../../../components/Common/TransitionContainer';
import PersonnelMain from '../../../../components/System/Account/PersonnelManage/PersonnelMain/PersonnelMain';
import PersonnelManageSides from '../../../../components/System/Account/PersonnelManage/PersonnelManageSides/PersonnelManageSides';

class PersonnelManage extends Component {
  static propTypes = {
    theme: PropTypes.string,
    getAllUserBase: PropTypes.func,
    getDepartmentTreeData: PropTypes.func,
    getUserList: PropTypes.func,
    getRoleAllList: PropTypes.func,
  };

  componentDidMount(){
    this.props.getUserList();
    this.props.getAllUserBase();
    this.props.getDepartmentTreeData();
    this.props.getRoleAllList();
    // 初入页面 请求企业下所有用户基础信息 + 请求部门列表树 + 请求默认未分配部门用户信息
  }

  render() {
    const { theme } = this.props;
    return (
      <ContentLayout
        breadcrumb={{
          breadData: [{ name: '人员管理' }],
          style: { paddingLeft: '40px' },
        }}
        theme={theme}
        contentClassName={`${styles.personnelManage} ${styles[theme]}`}
      >
        <PersonnelMain {...this.props} />
        <PersonnelManageSides {...this.props} />
      </ContentLayout>
    );
  }
}

const mapStateToProps = state => ({
  ...state.system.personnelManage,
  theme: state.common.get('theme'),
  stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: personnelManageAction.resetStore }),
  changeStore: payload => dispatch({ type: personnelManageAction.changeStore, payload }),
  getAllUserBase: payload => dispatch({ type: personnelManageAction.getAllUserBase, payload }),
  getDepartmentAllUser: payload => dispatch({ type: personnelManageAction.getDepartmentAllUser, payload }),
  assignUsers: payload => dispatch({ type: personnelManageAction.assignUsers, payload }),
  downloadTemplate: () => dispatch({ type: personnelManageAction.downloadTemplate }),
  getDepartmentTreeData: () => dispatch({ type: personnelManageAction.getDepartmentTreeData }),
  addNewDepartment: payload => dispatch({ type: personnelManageAction.addNewDepartment, payload }),
  getStationOfDepartment: payload => dispatch({ type: personnelManageAction.getStationOfDepartment, payload }),
  editDepartment: payload => dispatch({ type: personnelManageAction.editDepartment, payload }),
  preDeleteDepartmentCheck: payload => dispatch({ type: personnelManageAction.preDeleteDepartmentCheck, payload }),
  deleteDepartment: payload => dispatch({ type: personnelManageAction.deleteDepartment, payload }),
  getUserList: payload => dispatch({ type: personnelManageAction.getUserList, payload }),
  editDepartmentStations: payload => dispatch({ type: personnelManageAction.editDepartmentStations, payload }),
  getUserDetailInfo: payload => dispatch({ type: personnelManageAction.getUserDetailInfo, payload }),
  setUserStatus: payload => dispatch({ type: personnelManageAction.setUserStatus, payload }),
  getRoleAllList: payload => dispatch({ type: personnelManageAction.getRoleAllList, payload }),
  addUser: payload => dispatch({ type: personnelManageAction.addUser, payload }),
  editUser: payload => dispatch({ type: personnelManageAction.editUser, payload }),
  getDepartmentsStationMap: payload => dispatch({ type: personnelManageAction.getDepartmentsStationMap, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonnelManage);
