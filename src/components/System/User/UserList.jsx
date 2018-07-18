

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
    userData: PropTypes.object,
    selectedUser: PropTypes.object,//勾选的数组
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
  getUserStaion = (text) => {
    switch(text){
      case 1:
        return '激活';
      case 2:
        return '未激活';
      case 3:
        return '启用';
      default:
        '禁用';
    }
  }
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
        render: (text,record,index) => (<div><span>{text}</span><Popover content={'content'} title={'title'} placement="right" trigger="hover" ><Icon type="ellipsis" /></Popover></div>),
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

  render(){
    const { userData, selectedUser, totalNum, loading,  } = this.props;
    const {  } = this.state;
    return (
      <div className={styles.userList}>
        <Table 
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedUser.map(e=>e.key),
            onChange: this.onRowSelect
          }}
          dataSource={userData.toJS().map((e,i)=>({...e,key:i}))} 
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
