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
  };

  componentDidMount(){
    this.props.getAllUserBase();
    this.props.getDepartmentTreeData();
    // 初入页面 请求企业下所有用户基础信息 + 请求部门列表树 + 请求默认未分配部门用户信息
  }

  // todo 树形节点暂时没有做滚动

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
  downloadTemplate: () => dispatch({ type: personnelManageAction.downloadTemplate }),
  getDepartmentTreeData: () => dispatch({ type: personnelManageAction.getDepartmentTreeData }),
  addNewDepartment: payload => dispatch({ type: personnelManageAction.addNewDepartment, payload }),
  getStationOfDepartment: payload => dispatch({ type: personnelManageAction.getStationOfDepartment, payload }),
  getUserList: payload => dispatch({ type: personnelManageAction.getUserList, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonnelManage);
