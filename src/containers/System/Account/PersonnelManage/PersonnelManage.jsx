import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './personnel.scss';
import PropTypes from 'prop-types';
import { personnelManageAction } from './personnelManageReducer';
import ContentLayout from '@components/Common/ContentLayout';
// import { commonAction } from '../../../alphaRedux/commonAction';
// import TransitionContainer from '../../../../components/Common/TransitionContainer';
import PersonnelLists from '../../../../components/System/Account/PersonnelManage/PersonnelManageLists/PersonnelLists';
import PersonnelManageSides from '../../../../components/System/Account/PersonnelManage/PersonnelManageSides/PersonnelManageSides';

class PersonnelManage extends Component {
  static propTypes = {
    theme: PropTypes.string,
  };

  componentDidMount(){
    this.props.getUserList({});
  }

  render() {
    const { theme } = this.props;
    console.log(this.props);
    return (
      <ContentLayout
        breadcrumb={{
          breadData: [{ name: '工作计划管理' }],
          style: { paddingLeft: '40px' },
        }}
        theme={theme}
        contentClassName={`${styles.personnelManage} ${styles[theme]}`}
      >
        <PersonnelLists {...this.props} />
        <PersonnelManageSides {...this.props} />
      </ContentLayout>
    );
  }
}

const mapStateToProps = state => ({
  ...state.system.personnelManage,
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: personnelManageAction.resetStore }),
  changeStore: payload => dispatch({ type: personnelManageAction.changeStore, payload }),
  getUserList: payload => dispatch({ type: personnelManageAction.getUserList, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonnelManage);
