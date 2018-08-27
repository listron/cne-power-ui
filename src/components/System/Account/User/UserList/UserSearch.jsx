

import React, { Component } from 'react';
import { Button, Select, Icon,Radio, Checkbox, Input,Tag  } from 'antd';
import PropTypes from 'prop-types';
import styles from './userList.scss';

const Option = Select.Option;

class UserSearch extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    getUserList: PropTypes.func,
    roleAllList: PropTypes.object,
    pageNum: PropTypes.number,
    userStatus: PropTypes.number,
    pageSize: PropTypes.number,
    onChangeStatus: PropTypes.func, 
    onUserSearch: PropTypes.func,
    enterpriseId: PropTypes.string,
    roleId: PropTypes.string,
    username: PropTypes.string,
    stationName: PropTypes.string,
    phoneNum: PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state = {
      nameValue: '',
      phoneValue: '',
      stationValue: '',
    }
  }

  onChangeStatus = (e) => {
    this.props.onChangeStatus(e.target.value);
  }
  onUserSearch = () => {
    const { nameValue, phoneValue, stationValue } = this.state;
    let params = {
      enterpriseId: this.props.enterpriseId,
      userStatus: this.props.userStatus,
      pageNum: 1,
      pageSize: this.props.pageSize,
      username: nameValue,
      phoneNum: phoneValue,
      stationName: stationValue,
      roleId: this.props.roleId,
    };
    this.props.getUserList(params);
  }

  onSelectRoles = (value,item) => {
    let { roleId } = this.props;
    let tmpSelectedRoles = new Set(roleId.split(',').filter(e=>!!e));
    let role = item.key===undefined ? item.roleId.toString() : item.key;//key存在=>筛选;roleId存在=>删除
    tmpSelectedRoles.has(role) ? tmpSelectedRoles.delete(role) : tmpSelectedRoles.add(role);
    roleId = role === '不限' ? '' : [...tmpSelectedRoles].join(',');
    let params = {
      enterpriseId: this.props.enterpriseId,
      userStatus: this.props.userStatus,
      roleId: roleId.toString(),
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
      username: this.props.username,
      stationName: this.props.stationName,
      phoneNum: this.props.phoneNum,
    };
    this.props.getUserList(params);
  }

  onResetUserList = (item) => {
    let params = {
      enterpriseId: this.props.enterpriseId,
      userStatus: 0,
      roleId: '',
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
      username: '',
      phoneNum: '',
      stationName: '',
    };
    this.props.getUserList(params);
    this.setState({
      nameValue: '', 
      phoneValue: '', 
      stationValue: '',
    })
  }

  emptyCondition = () => {
    let params = {
      enterpriseId: this.props.enterpriseId,
      userStatus: 0,
      roleId: '',
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    };
    this.props.getUserList(params);
  }

  

  render(){
    const { roleId, roleAllList } = this.props;
    const { nameValue, phoneValue, stationValue } = this.state;
    let roleIdSet = new Set(roleId.split(',').filter(e=>!!e));
    
    let roleSelectId = roleAllList && roleAllList.toJS().filter(e=>{
      return roleIdSet.has(e.roleId.toString())
    });
    return (
      <div className={styles.userSearchFilter}>
        <div className={styles.userFilter}>
          <div className={styles.userRole} >
            <span className={styles.filterCondition} >筛选条件</span>
            <Select 
              placeholder="角色"  
              showArrow={true} 
              className={styles.selectedRoles} 
              dropdownMatchSelectWidth={false}
              onSelect={this.onSelectRoles}
            >
              <Option key="不限" value={'不限'}><Checkbox checked={roleIdSet.size === 0} >不限</Checkbox></Option>
              {roleAllList && roleAllList.toJS().map((item) => {
                return  (<Option key={item.roleId} value={item.roleDesc} >
                          <Checkbox
                            checked={roleIdSet.has(item.roleId.toString())} 
                            value={item.roleDesc}
                          >
                            {item.roleDesc}
                          </Checkbox>
                        </Option>);
              })}
            </Select>
          </div>
          {/* <div className={styles.userStatus} > 产品建议暂时去掉
            <span>状态</span>
            <RadioGroup onChange={this.onChangeStatus} defaultChecked={true} defaultValue={0} value={userStatus} buttonStyle="solid" >
              <RadioButton value={0} >全部</RadioButton>
              <RadioButton value={3} >启用</RadioButton>
              <RadioButton value={4} >禁用</RadioButton>
              <RadioButton value={5} >待审核</RadioButton>
              <RadioButton value={6} >未通过审核</RadioButton>
              <RadioButton value={2} >未激活</RadioButton>
            </RadioGroup>
          </div> */}
        </div>
        {roleIdSet.size !== 0 && 
          <div className={styles.selectedRolesBox} >
            <span>已选条件</span>
            {roleSelectId.map((item, key) => {
              return <Tag closable key={item.roleId} className={styles.selectedRole} value={item.roleDesc} onClose={() => this.onSelectRoles(item.roleDesc,item)} >{item.roleDesc}</Tag>;
            })}
            <span className={styles.emptyCondition} onClick={this.emptyCondition} >清空条件</span>
          </div>
        }
        <div className={styles.userSearch}>
          <span>用户名</span><Input placeholder="请输入用户名" value={nameValue} onChange={(e) => this.setState({nameValue: e.target.value })} />
          <span>电话</span><Input placeholder="请输入电话" value={phoneValue} onChange={(e) => this.setState({phoneValue: e.target.value })} />
          <span>负责电站</span><Input placeholder="请输入负责电站" value={stationValue} onChange={(e) => this.setState({stationValue: e.target.value })} />
          <Button onClick={this.onUserSearch}>查询</Button>
          <span onClick={this.onResetUserList} style={{cursor: 'pointer'}}>重置</span>
        </div>
        
      </div>
    )
  }
}

export default UserSearch;
