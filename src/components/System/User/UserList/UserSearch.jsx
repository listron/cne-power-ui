

import React, { Component } from 'react';
import { Table, Button, Select, Icon,Radio, Popover, Menu, Dropdown, Checkbox, Input,  } from 'antd';
// import CommonPagination from '../../../Common/CommonPagination';
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
    changeUserAttr: PropTypes.func,
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
  // onCheckboxChange = (e) => {
  //   console.log(`checked = ${e.target.checked}`);
  //   console.log(e.target);
  //   if(e.target.checked){
  //     this.state.selectedRoles.push
  //     this.setState({
  //       // selectedRoles.filter
  //     })
      
  //   }
  // }

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

  onSelectRoles = (e,item) => {
    // console.log(e)
    // console.log(e.domEvent.isPropagationStopped())
    // e.domEvent.isPropagationStopped(true)
    // console.log(e.domEvent.isPropagationStopped())
    let { selectedRoles } = this.state;
    let roleName = e.key;
    
    let selectedRolesSet = new Set(selectedRoles);
    if(selectedRolesSet.has(roleName)){
      selectedRolesSet.delete(roleName);
      console.log('200')
    }else{
      selectedRoles.push(roleName);
      selectedRolesSet = new Set(selectedRoles);
      console.log('404')
    }
    console.log(selectedRolesSet);
    this.setState({ selectedRoles: [...selectedRolesSet]})
    return;
  }

  onResetOneRole = (e) => {
    console.log(e)
  }

  handleMenuClick = (e) => {
    // console.log(e);
    // console.log(e.target)
    // this.state.selectedRoles.push(e.target.value);
    // this.setState({ selectedRoles: this.state.selectedRoles})
  }
  
  render(){
    const { userData, selectedUser, totalNum, loading, currentPage, pageSize, userStatus } = this.props;
    const { selectedRowKeys, selectedRoles, nameValue, phoneValue, stationValue } = this.state;
    console.log(selectedRoles)
    const roleData = ['系统管理员','企业管理员','生产管理员','运维实施工人','运维管理员'];
    const handleData = ['编辑','移除','启用','禁用','审核'];
    const roleMenu=(
      <Menu  onClick={this.onSelectRoles} >
        {roleData.map((item,index) => {
          return <Menu.Item key={item} ><Checkbox onClick={(e)=>console.log(e.isPropagationStopped) }>{item}</Checkbox></Menu.Item>;
        })}
      </Menu>
    )
    const handleMenu=(
      <Menu  onClick={this} >
        {handleData.map((item,index) => {
          return <Menu.Item key={item}   >{item}</Menu.Item>;
        })}
      </Menu>
    )

    return (
      <div className={styles.userList}>
        <div className={styles.userFilter}>
          <div>
            <span>筛选条件</span>
            <Dropdown overlay={roleMenu}  >
              <Button style={{ marginLeft: 8 }}>
                角色 <Icon type="down" />
              </Button>
            </Dropdown>
            {selectedRoles.length !== 0 && 
              <div>
                <span>已选条件</span>
                {selectedRoles.map((value, key) => {
                  return <Button type="dashed" key={value.toString()} >{value.toString()}<Icon type="close" onClick={this.onResetOneRole} /></Button>;
                })}
                <span>清空条件</span>
              </div>
            }
          </div>
          {/* <div>
            <Select mode="mutiple" placeholder="角色" onChange={this.onSelectRoles} showArrow={true} className={styles.selectedRoles} dropdownMatchSelectWidth={false} >
              <Option key="不限"><Checkbox>不限</Checkbox></Option>
              {roleData.map((item,index) => {
                return <Option key={item} ><Checkbox>{item}</Checkbox></Option>;
              })}
            </Select>
          </div> */}
          <div>
            <span>状态</span>
            <RadioGroup onChange={this.onChangeStatus} defaultValue="0" value={userStatus.toString()} buttonStyle="solid" >
              <RadioButton value="0">全部</RadioButton>
              <RadioButton value="3">启用</RadioButton>
              <RadioButton value="4">禁用</RadioButton>
              <RadioButton value="5">待审核</RadioButton>
              <RadioButton value="6">未通过审核</RadioButton>
              <RadioButton value="2">未激活</RadioButton>
            </RadioGroup>
          </div>
        </div>
        <div className={styles.userSearch}>
          <span>用户名</span><Input placeholder="请输入用户名" value={nameValue} onChange={(e) => this.setState({nameValue: e.target.value })} />
          <span>电话</span><Input placeholder="请输入电话" value={phoneValue} onChange={(e) => this.setState({phoneValue: e.target.value })} />
          <span>负责电站</span><Input placeholder="请输入负责电站" value={stationValue} onChange={(e) => this.setState({stationValue: e.target.value })} />
          <Button onClick={this.onUserSearch}>查询</Button>
          <span onClick={() => this.setState({ nameValue: '', phoneValue: '', stationValue: '', })} >重置</span>
        </div>
        <div className={styles.userOperate} >
          <Button onClick={this.onCreateUser} className={styles.addUser} ><Icon type="plus" /><span className={styles.text}>用户</span></Button>
          <Button>邀请用户</Button>
          <Button>批量导入</Button>
          <Button  >导入模板下载</Button>
          <Dropdown overlay={handleMenu}  >
            <Button className={styles.handleMenu} style={{ marginLeft: 8 }}>
              操作 <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
      </div>
    )
  }
}

export default UserSearch;
