

import React, { Component } from 'react';
import { Button, Select, Icon,Radio, Checkbox, Input,  } from 'antd';
import PropTypes from 'prop-types';
import styles from './userList.scss';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class UserSearch extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    totalNum: PropTypes.number,
    userData: PropTypes.object,
    selectedUser: PropTypes.object,//勾选的数组
    getUserList: PropTypes.func,
    getUserDetail: PropTypes.func,
    onChangeSort: PropTypes.func,//排序
    onChangePageSize: PropTypes.func,
    onChangePage: PropTypes.func,
    roleData: PropTypes.object,

    userStatus: PropTypes.number, 
    userName: PropTypes.string, 
    userPhone: PropTypes.string,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    currentPage: PropTypes.number, 
    pageSize: PropTypes.number,
    onChangeStatus: PropTypes.func, 
    onUserSearch: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      selectedRoles: [],
      selectedRolesSet: new Set(),
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
    this.props.onUserSearch({
      nameValue,
      phoneValue,
      stationValue,
    })
  }

  onSelectRoles = (e, item) => {
    console.log(e, item)
    let value = e.key;
    let { selectedRolesSet } = this.state;
    if(selectedRolesSet.has(value)){
      selectedRolesSet.delete(value)
      this.setState({
        selectedRolesSet: selectedRolesSet,
      })
    }else{
      this.setState({
        selectedRolesSet: selectedRolesSet.add(value),
      })
    }
  }

  
  onDeleteRole = (e) => {
    console.log(e)
    // let value = e.key;
    // let { selectedRolesSet } = this.state;
    // if(selectedRolesSet.has(value)){
    //   selectedRolesSet.delete(value)
    //   this.setState({
    //     selectedRolesSet: selectedRolesSet,
    //   })
    // }else{
    //   this.setState({
    //     selectedRolesSet: selectedRolesSet.add(value),
    //   })
    // }
  }

  render(){
    const { userStatus } = this.props;
    const { nameValue, phoneValue, stationValue, selectedRolesSet } = this.state;
    console.log([...selectedRolesSet])
    const roleData = ['系统管理员','企业管理员','生产管理员','运维实施工人','运维管理员'];

    return (
      <div className={styles.userSearchFilter}>
        <div className={styles.userFilter}>
          <div className={styles.userRole} >
            <span className={styles.filterCondition} >筛选条件</span>
            <Select
              notFoundContent="角色" 
              placeholder="角色"  
              showArrow={true} 
              className={styles.selectedRoles} 
              dropdownMatchSelectWidth={false} 
              labelInValue 
              onChange={this.onSelectRoles}
            >
              <Option key="不限" value={'不限'}><Checkbox>不限</Checkbox></Option>
              {roleData.map((item,index) => {
                return  <Option key={index} value={item} ><Checkbox >{item}</Checkbox></Option>;
              })}
            </Select>
          </div>
          <div className={styles.userStatus} >
            <span>状态</span>
            <RadioGroup onChange={this.onChangeStatus} defaultValue="0" value={userStatus} buttonStyle="solid" >
              <RadioButton value="0">全部</RadioButton>
              <RadioButton value="3">启用</RadioButton>
              <RadioButton value="4">禁用</RadioButton>
              <RadioButton value="5">待审核</RadioButton>
              <RadioButton value="6">未通过审核</RadioButton>
              <RadioButton value="2">未激活</RadioButton>
            </RadioGroup>
          </div>
        </div>
        {selectedRolesSet.size !== 0 && 
          <div className={styles.selectedRolesBox} >
            <span>已选条件</span>
            {[...selectedRolesSet].map((value, key) => {
              return <Button type="dashed" key={key} >{value}<Icon type="close" onClick={(value)=>this.onDeleteRole(value)} /></Button>;
            })}
            <span className={styles.emptyCondition} >清空条件</span>
          </div>
        }
        <div className={styles.userSearch}>
          <span>用户名</span><Input placeholder="请输入用户名" value={nameValue} onChange={(e) => this.setState({nameValue: e.target.value })} />
          <span>电话</span><Input placeholder="请输入电话" value={phoneValue} onChange={(e) => this.setState({phoneValue: e.target.value })} />
          <span>负责电站</span><Input placeholder="请输入负责电站" value={stationValue} onChange={(e) => this.setState({stationValue: e.target.value })} />
          <Button onClick={this.onUserSearch}>查询</Button>
          <span onClick={() => this.setState({ nameValue: '', phoneValue: '', stationValue: '', })} >重置</span>
        </div>
        
      </div>
    )
  }
}

export default UserSearch;
