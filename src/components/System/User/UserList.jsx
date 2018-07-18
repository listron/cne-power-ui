

import React, { Component } from 'react';
import { Table, Button, Select, Icon, Popover } from 'antd';
// import CommonPagination from '../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './userList.scss';

const { Option } = Select;

class UserList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    totalNum: PropTypes.number,
    userData: PropTypes.array,
    selectedUser: PropTypes.array,//勾选的数组
    getUserList: PropTypes.func,
    getUserDetail: PropTypes.func,
    changeUserAttr: PropTypes.func,

    userStatus: PropTypes.number, 
    userName: PropTypes.string, 
    userPhone: PropTypes.string,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    currentPage: PropTypes.number, 
    pageSize: PropTypes.number, 
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  onPaginationChange = ({currentPage,pageSize}) => {//分页器
    const {userName,sort,ascend,userPhone,userStatus} = this.props;
    this.props.getUserList({
      userName,
      userPhone,
      sort,
      ascend,
      currentPage,
      pageSize,
      userStatus
    });
  }

  // onRowSelect = (selectedRowKeys, selectedRows) => {
  //   this.props.changeUserAttr({
  //     selectedUser:selectedRows
  //   })
  // }
  // cancelRowSelect = () => {
  //   this.props.changeUserAttr({
  //     selectedUser:[]
  //   })
  // }

  // tableChange = (pagination,filter,sorter) => {//排序，筛选
  //   const {userName,userPhone,currentPage,pageSize,userStatus} = this.props;
  //   const sort = sorter.field;
  //   const ascend = sorter.order==='ascend';
  //   this.props.getUserList({
  //     userName,
  //     userPhone,
  //     sort,
  //     ascend,
  //     currentPage,
  //     pageSize,
  //     userStatus
  //   });
  // }
  showUserDetail = (record) => {
    console.log(record);
    const { userId } = record;
    this.props.changeUserAttr({
      showPage: 'detail',
    })
    this.props.getUserDetail({
      userId
    })
  }
  // userHandle = (value) => {//编辑，禁用，启用
  //   console.log(value);
  //   // const { selectedUser } = this.props;
  //   // if(value === 'edit'){
  //   //   this.props.editUser({
  //   //     key: selectedUser[0].key
  //   //   })
  //   // }else{
  //   //   this.props.handleUser({
  //   //     keys:selectedUser.map(e=>e.key),
  //   //     handle: value
  //   //   })
  //   // }
  // }

  // _createHandleOption = () => {//生成操作下拉框
  //   const { selectedUser } = this.props;
  //   let [editable,openable,closeable] = [true,true,true];  
  //   if(selectedUser.length > 0){
  //     editable = selectedUser.length === 1;
  //     const statusSet = new Set(selectedUser.map(e => e.userStatus));
  //     const statusArray = [...statusSet];
  //     if(statusArray.length > 1){
  //       openable = false;
  //       closeable = false;
  //     }else if(statusArray.length === 1){
  //       openable = statusArray[0]===0;
  //       closeable = statusArray[0]===1;
  //     }
  //   }       
  //   return (<Select onChange={this.userHandle} placeholder={'操作'} dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
  //     <Option value="edit" disabled={!editable} >编辑</Option>
  //     <Option value="open" disabled={!openable} >启用</Option>
  //     <Option value="close" disabled={!closeable} >禁用</Option>
  //   </Select>)
  // }
  tableColumn = () => {//表头
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
        render: (text,record,index) => (<div><span>{text}</span><Popover content={'content'} title={} placement="right" trigger="hover" ><Icon type="ellipsis" /></Popover></div>),
      },  {
        title: '状态',
        dataIndex: 'userStatus',
        key: 'userStatus',
        sorter: true,
      }
    ];
    return columns;
  }

  render(){
    const { userData, selectedUser, totalNum, loading,  } = this.props;
    const {  } = this.state;
    return (
      <div className={styles.userList}>
        {/* <div className={styles.userListTop} >
          <div>
            <div className={styles.handleUser}>
              {this._createHandleOption()}
            </div>
          </div>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div> */}
        <Table 
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedUser.map(e=>e.key),
            onChange: this.onRowSelect
          }}
          dataSource={userData.map((e,i)=>({...e,key:i}))} 
          columns={this.tableColumn()} 
          onChange={this.tableChange}
          pagination={false}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedUser.length}</span>项</span>
          <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>
        </div>
      </div>
    )
  }
}

export default UserList;
