

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styles from './list.scss';
import CneButton from '@components/Common/Power/CneButton';
// const { Option } = Select;

class ListSearch extends Component {
  static propTypes = {
    // departmentStations: PropTypes.array,
    // departmentAllUsers: PropTypes.array,
    userListParams: PropTypes.object,
    userListPageInfo: PropTypes.object,
    getUserList: PropTypes.func,
    changeStore: PropTypes.func,
  }

  state = {
    nameText: '',
    phoneText: '',
    stationText: '',
  }

  componentWillReceiveProps(nextProps){
    const { userListParams } = nextProps;
    const { username, phoneNum, stationName } = userListParams;
    const preListParams = this.props.userListParams;
    if (username !== preListParams.username || phoneNum !== preListParams.phoneNum || stationName !== preListParams.stationName) {
      this.setState({
        nameText: username,
        phoneText: phoneNum,
        stationText: stationName,
      });
    }
  }

  nameChange = ({ target }) => {
    this.setState({ nameText: target.value.trim() });
  }

  phoneChange = ({ target }) => {
    this.setState({ phoneText: target.value.trim() });
  }

  stationChange = ({ target }) => {
    this.setState({ stationText: target.value.trim() });
  }

  toSearchList = () => { // 查询
    const { nameText, phoneText, stationText } = this.state;
    const { userListParams, userListPageInfo } = this.props;
    const newUserListParams = {
      ...userListParams,
      username: nameText,
      phoneNum: phoneText,
      stationName: stationText,
    };
    const newUserListPageInfo = {
      ...userListPageInfo,
      pageNum: 1,
      pageSize: 10,
    };
    this.props.changeStore({
      userListParams: newUserListParams,
      userListPageInfo: newUserListPageInfo,
    });
    this.props.getUserList({
      ...newUserListParams,
      ...newUserListPageInfo,
    });
  }

  toResetList = () => { // 重置
    const { userListParams, userListPageInfo } = this.props;
    const initState = {
      nameText: '',
      phoneText: '',
      stationText: '',
    };
    this.setState({ ...initState });
    const newUserListParams = {
      ...userListParams,
      username: '',
      phoneNum: '',
      stationName: '',
    };
    const newUserListPageInfo = {
      ...userListPageInfo,
      pageNum: 1,
      pageSize: 10,
    };
    this.props.changeStore({
      userListParams: newUserListParams,
      userListPageInfo: newUserListPageInfo,
    });
    this.props.getUserList({
      ...newUserListParams,
      ...newUserListPageInfo,
    });
  }

  render(){
    // const { departmentStations, departmentAllUsers } = this.props;
    // const stationNames = departmentStations.map(e => e.stationName);
    // const userNames = departmentAllUsers.map(e => e.username);
    const { userListParams } = this.props;
    const { nameText, phoneText, stationText } = this.state;
    const { username, phoneNum, stationName } = userListParams;
    const hasSearchCondition = username || phoneNum || stationName;
    return (
      <div className={styles.listSearch}>
        {/* <Select
          mode="multiple"
          style={{ width: '240px' }}
          placeholder="请选择"
          value={users}
          onChange={this.handleParticipant}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          className={styles.searchSelect}
        >
          {departmentAllUsers.map(e => {
            const { username, userFullName } = e || {};
            const userText = (username && userFullName) ? `${userFullName}(${username})` : (username || userFullName);
            return <Option key={`${username}`} value={`${username}`}>{userText}</Option>;
          })}
        </Select> */}
        <span className={styles.searchTitle}>用户名</span>
        <Input style={{width: '130px'}} value={nameText} placeholder="请输入..." onChange={this.nameChange} />
        <span className={styles.searchTitle}>电话</span>
        <Input style={{width: '160px'}} value={phoneText} placeholder="请输入..." onChange={this.phoneChange} />
        <span className={styles.searchTitle}>负责电站</span>
        <Input style={{width: '200px'}} value={stationText} placeholder="请输入..." onChange={this.stationChange} />
        <CneButton onClick={this.toSearchList}>查询</CneButton>
        {hasSearchCondition && <span className={styles.reset} onClick={this.toResetList}>重置</span>}
      </div>
    );
  }
}

export default ListSearch;
