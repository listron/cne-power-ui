

import React, { Component } from 'react';
import { Table, Button, Select, Icon, Radio, Popover, Menu, Dropdown, Checkbox, Input,  } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './userList.scss';
import UserSearch from './UserSearch'; 
const { Option } = Select;
class UserList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    totalNum: PropTypes.number,
    userData: PropTypes.object,
    selectedUser: PropTypes.object,//勾选的数组
    getUserList: PropTypes.func,
    getUserDetail: PropTypes.func,
    changeUserStore: PropTypes.func,
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
    changeUserStatus: PropTypes.func,
    enterpriseId: PropTypes.string,
    createUserInfo: PropTypes.func,
    pageNum: PropTypes.number,

  }

  constructor(props){
    super(props);
    this.state = {
      
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

  onRowSelect = (selectedRowKeys, selectedRows) => {//行选择
    console.log(selectedRowKeys, selectedRows);
    this.props.changeUserStore({
      selectedUser: selectedRows,
    })
  }
  onInviteUser = () => {
    this.props.changeUserStore({showPage: 'invite'});
  }
  onCreateUser = () => {
    this.props.changeUserStore({showPage: 'add'});
  }
  getUserStaion = (text) => {
    switch(text){
      case 0:
        return '全部';
      case 1:
        return '激活';
      case 2:
        return '未激活';
      case 3:
        return '启用';
      case 4:
        return '禁用';
      case 5:
        return '待审核';
      case 5:
        return '审核不通过';
      case 6:
        return '移除';
      default:
        return ;
    }
  }
  
  showUserDetail = (record) => {
    const { userId } = record;
    this.props.changeUserStore({
      showPage: 'detail',
    })
    this.props.getUserDetail({
      userId
    })
  }
  
  tableChange = (pagination, filters, sorter) => {
    if(Object.keys(sorter).length !== 0){
      let sortRules = '0,1';
      this.props.onChangeSort(sortRules);
    }else{
      this.props.onChangeSort('');
    }
  }
  
  tableColumn = () => {
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        render: (text, record, index) => (<a href={'javascript:void(0)'} onClick={() => this.showUserDetail(record)} >{text}</a>)
      }, {
        title: '真实姓名',
        dataIndex: 'trueName',
        key: 'trueName',
        render: (text,record,index) => (<span>{text}</span>)
      }, {
        title: '电话',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
        render: (text,record) => (<span>{text}</span>),
      }, {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        render: (text,record) => (<span>{text}</span>),
        sorter: true
      }, {
        title: '特殊权限',
        dataIndex: 'spcialRoleName',
        key: 'spcialRoleName',
        render: (text,record) => (<span>{text}</span>),
        sorter: true
      }, {
        title: '所在企业',
        dataIndex: 'enterpriseId',
        key: 'enterpriseId',
        render: (text,record) => (<span>{text}</span>),
        sorter: true
      }, {
        title: '负责电站',
        dataIndex: 'stationName',
        key: 'stationName',
        render: (text,record,index) => {
          let stations = record.stationName.split(',').filter(e=>!!e);
          const { userName } = record;
          if(stations.length > 1){
            const content = (<ul>
              {stations.map(e=>(<li key={e} className={styles.eachStation} >
                <span className={styles.square} ></span><span>{e}</span>
              </li>))}
            </ul>)
            return (
              <div>
                <span>{stations[0]}</span>
                <Popover 
                  content={content} 
                  title={userName + '负责电站'} 
                  placement="right" 
                  trigger="hover"
                  overlayClassName={styles.responsibleDetails}
                >
                  <Icon type="ellipsis" />
                </Popover>
              </div>
            )
          }else{
            return <span>{stations[0] ? stations[0] : ''}</span>
          }
          
        } 
      },  {
        title: '状态',
        dataIndex: 'userStation',
        key: 'userStation',
        render: (text, record, index) => (<span>{this.getUserStaion(text)}</span>),
        sorter: true,
      }
    ];
    return columns;
  }

  cancelRowSelect = () => {
    this.props.changeUserStore({
      selectedUser:[]
    })
  }

  _createUserOperate = () => {
    const { selectedUser } = this.props;
    let [editable, deletable, usable, unallowable, examinable] = [ false, false, false, false, false];
    if(selectedUser.toJS().length > 0){
      console.log(selectedUser.toJS())
      editable = selectedUser.toJS().length === 1;
      [deletable, usable, unallowable, examinable] = [true, true, true, true];
    }

    return (<Select onChange={this.userHandle} placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown} >
      <Option value="edit" disabled={!editable}>编辑</Option>
      <Option value="delete" disabled={!deletable}>移除</Option>
      <Option value="use" disabled={!usable}>启用</Option>
      <Option value="unallow" disabled={!unallowable}>禁用</Option>
      <Option value="examine" disabled={!examinable}>审核</Option>
    </Select>)
  } 

  userHandle = (value) => {
    console.log(value)
    const { selectedUser, enterpriseId, roleId, pageNum, pageSize } = this.props;
    console.log(selectedUser.toJS()[0])
    if(value === 'edit'){
      this.props.changeUserStore({
        showPage: 'edit',
        userDetail: selectedUser.toJS()[0],
      })
    }else if(value === 'delete'){
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e=>e.userId).toString(),
        enterpriseUserStatus: 7,
      })
    }else if(value === 'use'){
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e=>e.userId).toString(),
        enterpriseUserStatus: 3,
      })
    }else if(value === 'unallow'){
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e=>e.userId).toString(),
        enterpriseUserStatus: 4,
      })
    }else if(value === 'examine'){
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e=>e.userId).toString(),
        enterpriseUserStatus: 5,
      })
    }
    this.props.getUserList({
      enterpriseId,
      roleId,
      pageNum,
      pageSize,
    })
  }
  
  render(){
    const { userData, totalNum, loading, currentPage, pageSize, selectedUser } = this.props;
    console.log(selectedUser.toJS())
    const pagination={
      defaultCurrent: 1,
      position: 'top',
      total: totalNum,
      showSizeChanger: true,
      current: currentPage,
      pageSize: pageSize,
      onShowSizeChange: (current, pageSize) => {
        this.props.onChangePageSize(pageSize);
      },
      onChange: (current) => {
        this.props.onChangePage(current);
      }
    }
    
    return (
      <div className={styles.userList}>
        <div className={styles.userHelper} >
          <Button onClick={this.onCreateUser} className={styles.addUser} ><Icon type="plus" /><span className={styles.text}>用户</span></Button>
          <Button onClick={this.onInviteUser} >邀请用户</Button>
          <Button>批量导入</Button>
          <Button  >导入模板下载</Button>
          <div className={styles.userOperate} >
            {this._createUserOperate()}
          </div>
        </div>
        <Table 
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedUser.toJS().map(e=>e.key),
            onChange: this.onRowSelect
          }}
          dataSource={userData.toJS().map((e,i)=>({...e,key:i}))} 
          columns={this.tableColumn()} 
          onChange={this.tableChange}
          pagination={pagination}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedUser.toJS().length}</span>项</span>
          <a className={styles.cancel} href="javascript:void(0)" onClick={this.cancelRowSelect}>取消选择</a>
        </div>
      </div>
    )
  }
}

export default UserList;
