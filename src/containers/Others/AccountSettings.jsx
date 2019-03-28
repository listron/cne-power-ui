import React, { Component } from 'react';
import { Tabs } from 'antd';
import styles from './accountSettings.scss';
import { othersAction } from '../alphaRedux/othersAction';
import { connect } from 'react-redux';
import EditUserName from '../../components/Others/AccountSettings/EditUserName';
import EditPasswordForm from '../../components/Others/AccountSettings/EditPasswordForm';
import EdiPhone from '../../components/Others/AccountSettings/EdiPhone';

const TabPane = Tabs.TabPane;

class AccountSettings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.accountSettings}>
        <h3 className={styles.accountSettingsTitle}>账户管理</h3>
        <Tabs tabPosition={'left'}>
          <TabPane tab="账户信息" key="1">
            <EditUserName {...this.props} />
          </TabPane>
          <TabPane tab="修改密码" key="2">
            <EditPasswordForm {...this.props} />
          </TabPane>
          <TabPane tab="修改手机" key="3">
            <EdiPhone {...this.props} />
          </TabPane>
        </Tabs>
      </div>
      )
    }
  }
  
  const mapStateToProps = (state) => ({
    loading: state.othersReducer.get('loading')
  });
  
  const mapDispatchToProps = (dispatch) => ({
    editUserName: payload => dispatch({ type: othersAction.editUserName, payload, }),
    editPassword: payload => dispatch({ type: othersAction.editPassword, payload, }),
    editPhone: payload => dispatch({ type: othersAction.editPhone, payload, }),
  })
  
  export default connect(mapStateToProps,mapDispatchToProps)(AccountSettings);