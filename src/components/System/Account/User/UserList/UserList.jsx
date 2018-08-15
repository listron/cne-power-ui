

import React, { Component } from 'react';
import { Table, Button, Select, Icon, Popover, Checkbox, Upload, message } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './userList.scss';
import { getCookie } from '../../../../../utils/index.js';
import Path from '../../../../../constants/path';

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
    userStatus: PropTypes.number,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    pageSize: PropTypes.number,
    changeUserStatus: PropTypes.func,
    enterpriseId: PropTypes.string,
    pageNum: PropTypes.number,
    roleId: PropTypes.string,
    getInviteLink: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      selectedUserColumns: new Set(),//选中列暂时存在state里，如有需要可存进reducer里
    }
  }

  onRowSelect = (selectedRowKeys, selectedRows) => {//行选择
    this.props.changeUserStore({
      selectedUser: selectedRows,
    })
  }
  onInviteUser = () => {
    this.props.getInviteLink({enterpriseId: JSON.parse(this.props.enterpriseId), showPage: 'invite'});
  }
  onCreateUser = () => {
    this.props.changeUserStore({showPage: 'add'});
  }

  onPaginationChange = ({currentPage,pageSize}) => {//分页器
    this.props.getUserList({
      enterpriseId: this.props.enterpriseId,
      userStatus: this.props.userStatus,
      sort: this.props.sort, 
      ascend: this.props.ascend, 
      pageNum: currentPage,
      pageSize,
    })
  }

  onSelectColumns = (value) => {
    const { selectedUserColumns } = this.state;
    let tmpUserColumns = selectedUserColumns;
    if(value === '全选'){
      tmpUserColumns = new Set();
    }else{
      tmpUserColumns.has(value) ? tmpUserColumns.delete(value) : tmpUserColumns.add(value);
    }
    
    this.setState({selectedUserColumns: tmpUserColumns })
    let params = {
      enterpriseId: this.props.enterpriseId,
      userStatus: this.props.userStatus,
      roleId: this.props.roleId,
      pageNum: this.props.pageNum - 1,
      pageSize: this.props.pageSize,
    };
    this.props.getUserList(params);
  }

  getUserStatus = (userStatus, enterpriseStatus) => {
    if(userStatus===2){
      return '未激活';
    }else{
      switch(enterpriseStatus){
        case 3:
          return '启用';
        case 4:
          return '禁用';
        case 5:
          return '待审核';
        case 6:
          return '审核不通过';
        case 7:
          return '移除';
        default:
          return ;
      }
    }
    
  }
  
  showUserDetail = (record) => {
    const { userId } = record;
    this.props.getUserDetail({
      userId: userId,
      showPage: 'detail',
    });
  }
  
  tableChange = (pagination, filters, sorter) => {
    if(Object.keys(sorter).length !== 0){
      let order = 0;
      switch(sorter.field){
        case "roleName":
          order = sorter.order==="ascend" ? 2 : 1 ;break;
        case "spcialRoleName":
          order = sorter.order==="ascend" ? 4 : 3 ;break;
        case "enterpriseId":
          order = sorter.order==="ascend" ? 6 : 5 ;break;
        default:
          order = 0;
      }
      this.props.onChangeSort(order);
    }else{
      this.props.onChangeSort('');
    }
  }
  
  tableColumn = () => {
    const { selectedUserColumns } = this.state;
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
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
        render: (text,record) => (<span>{text}</span>),
        sorter: true
      }, {
        title: '负责电站',
        dataIndex: 'stationName',
        key: 'stationName',
        render: (text,record,index) => {
          let stations = record.stationName && record.stationName.split(',').filter(e=>!!e);
          const { userName } = record;
          if(stations && stations.length > 1){
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
            return <span>{stations ? stations[0] : ''}</span>
          }
        } 
      },  {
        title: '状态',
        dataIndex: 'userStatus',
        key: 'userStatus',
        render: (text, record, index) => {
          return (<span>{this.getUserStatus(record.userStatus, record.enterpriseStatus)}</span>);
        },
      }
    ];
    if(selectedUserColumns && selectedUserColumns.size !== 0){
      return columns.filter(e=>selectedUserColumns.has(e.title));
    }else{
      return columns;
    }
    
  }

  cancelRowSelect = () => {
    this.props.changeUserStore({
      selectedUser:[]
    })
  }

  _createUserOperate = () => {
    let selectedUser = this.props.selectedUser.toJS();
    let [editable, deletable, usable, unallowable, examinable] = [ false, false, false, false, false];
    if(selectedUser.length > 0){
      editable = selectedUser.length === 1;
      let newArray = [...new Set(selectedUser.map(e=>this.getUserStatus(e.userStatus, e.enterpriseStatus)))];
      [deletable, usable, unallowable, examinable] = newArray.length < 2 ? [true, true, true, true] : [ false, false, false, false];
    
      if(selectedUser[0].userStatus === 3){//启用
        [usable] = [false];
      }else if(selectedUser[0].userStatus === 5 || selectedUser[0].userStatus === 6){//待审核//未通过审核
        [usable, unallowable] = [false, false];
      }else if(selectedUser[0].userStatus === 4){//禁用
        [unallowable] = [false];
      }
    }else{
      [editable, deletable, usable, unallowable, examinable] = [ false, false, false, false, false];
    }

    return (<Select onChange={this.userHandle} placeholder="操作"  dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown} >
      <Option value="edit" disabled={!editable}>编辑</Option>
      <Option value="delete" disabled={!deletable}>移除</Option>
      <Option value="use" disabled={!usable}>启用</Option>
      <Option value="unallow" disabled={!unallowable}>禁用</Option>
      <Option value="examine" disabled={!examinable}>审核</Option>
    </Select>)
  } 
  
  userHandle = (value) => {
    const { selectedUser, enterpriseId, } = this.props;
    if(value === 'edit'){
      this.props.changeUserStore({
        showPage: 'edit',
        userDetail: selectedUser.toJS()[0],
      })
    }else if(value === 'delete'){//移除
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e=>e.userId).toString(),
        enterpriseUserStatus: 7,
      })
    }else if(value === 'use'){//启用
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e=>e.userId).toString(),
        enterpriseUserStatus: 3,
      })
    }else if(value === 'unallow'){//禁用
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e=>e.userId).toString(),
        enterpriseUserStatus: 4,
      })
    }else if(value === 'examine'){//待审核
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e=>e.userId).toString(),
        enterpriseUserStatus: 5,
      })
    }
    value = "";
  }
  
  beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error('You can only upload Excel file!');
    }
    return isExcel;
  }

  render(){
    const { userData, totalNum, loading, selectedUser } = this.props;
    const { selectedUserColumns } = this.state;
    const authData = getCookie('authData');
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
        dataIndex: 'userStatus',
        key: 'userStatus',
        render: (text, record, index) => {
          console.log(record);
          return (<span>{this.getUserStatus(record.userStatus, record.enterpriseStatus)}</span>);
        },
      }
    ];
    const url = Path.basePaths.newAPIBasePath + Path.APISubPaths.system.importUserBatch;
    const props = {
      name: 'file',
      action: url,
      headers: {'Authorization': 'bearer ' + ((authData && authData!== 'undefined') ? JSON.parse(authData) : '')},
      beforeUpload: this.beforeUpload,
      data: {
        enterpriseId: this.props.enterpriseId,

      },
      onChange(info) {
        if (info.file.status === 'done') {
          if(info.file.response.code === '10000'){
            message.success(`${info.file.name} 导入完成`);
            const params = {
              enterpriseId: this.props.enterpriseId,
              userStatus: this.props.userStatus,
              roleId: this.props.roleId,
              pageNum: this.props.pageNum,
              pageSize: this.props.pageSize,
            };
            this.props.getUserList(params);
          }else{
            message.error(info.file.response.message);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 导入失败，请重新导入.`);
        }
        
      },
    };
    return (
      <div className={styles.userList}>
        <div className={styles.userHelper} >
          <div className={styles.userHelperLeft} >
            <Button onClick={this.onCreateUser} className={styles.addUser} ><Icon type="plus" /><span className={styles.text}>用户</span></Button>
            <Button onClick={this.onInviteUser} >邀请用户</Button>
            <Upload {...props} className={styles.importUser}>
              <Button>批量导入</Button>
            </Upload>
            <Button  >导入模板下载</Button>
            <div className={styles.userOperate} >
              {this._createUserOperate()}
            </div>
            <Select
              className={styles.selectedColumns} 
              showArrow={false}
              dropdownMatchSelectWidth={false}
              onChange={this.onSelectColumns}
            >
              <Option key="全选" value="全选" ><Checkbox checked={selectedUserColumns.size === 0} >全选</Checkbox></Option>
              {columns.map(item=>{
                return (<Option
                          key={item.title}
                          value={item.title}
                          // disabled={selectedUserColumns.has(item.title)}
                        ><Checkbox value={item.title} checked={selectedUserColumns.has(item.title)} >{item.title}</Checkbox></Option>);
              })}
            </Select>
          </div>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedUser.toJS().map(e=>e.key),
            onChange: this.onRowSelect
          }}
          dataSource={userData && userData.toJS().map((e,i)=>({...e,key:i}))} 
          columns={this.tableColumn()} 
          onChange={this.tableChange}
          pagination={false}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中 <span className={styles.totalNum}>{selectedUser.toJS().length}</span> 项</span>
          <a className={styles.cancel} href="javascript:void(0)" onClick={this.cancelRowSelect}>取消选择</a>
          <span className={styles.operateTip} >请选择同一状态下的列表项进行操作</span>
        </div>
      </div>
    )
  }
}

export default UserList;
