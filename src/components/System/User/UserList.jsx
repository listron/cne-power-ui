

import React, { Component } from 'react';
import { Table, Button, Select, Icon,Radio, Popover, Menu, Dropdown, Checkbox, Input,  } from 'antd';
// import CommonPagination from '../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './userList.scss';

const { Option } = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
class UserList extends Component {
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
  }

  constructor(props){
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRoles: [],
    }
  }
  onCheckboxChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  }

  onChangeStatus = (e) => {
    this.props.onChangeStatus(e.target.value);
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
    console.log(record);
    const { userId } = record;
    this.props.changeUserAttr({
      showPage: 'detail',
    })
    this.props.getUserDetail({
      userId
    })
  }
  tableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
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
        render: (text,record,index) => (<div><span>{text.split(',')[0]}</span><Popover content={text.split(',').map((item,i)=>{return <p key={i}>{item}</p>})} title={'负责电站'} placement="right" trigger="hover" ><Icon type="ellipsis" /></Popover></div>),
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
    this,this.setState({
      selectedRowKeys: [],
    })
  }
  handleMenuClick = () => {
    console.log('-----------------');
  }
  
  
  render(){
    const { userData, selectedUser, totalNum, loading, currentPage, pageSize, roleData, userStatus } = this.props;
    console.log(this.props)
    const { selectedRowKeys, selectedRoles } = this.state;
    const rowSelection={
      selectedRowKeys,
      onChange: (selectedRowKeys,selectedRows) => {
        console.log(selectedRowKeys,selectedRows)
        this.setState({
          selectedRowKeys: selectedRowKeys,
        });
      }
    }
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
    const menu=(
      <Menu onClick={this.handleMenuClick}>
        {roleData.toJS().map((item,index) => {
          console.log(item)
          return <Menu.Item key={index}><Checkbox onChange={this.onCheckboxChange}>{item}</Checkbox></Menu.Item>;
        })}
      </Menu>
    )

    return (
      <div className={styles.userList}>
        <div className={styles.userFilter}>
          <div>
            <span>筛选条件</span>
            <Dropdown overlay={menu} mutiple="true">
              <Button style={{ marginLeft: 8 }}>
                角色 <Icon type="down" />
              </Button>
            </Dropdown>
            {selectedRoles.length !== 0 && 
              <div>
                <span>已选条件</span>
                <Button type="dashed">Dashed</Button>
              </div>
            }
          </div>
          <div>
            <span>状态</span>
            <RadioGroup onChange={this.onChangeStatus} defaultValue="0" value={userStatus} >
              <RadioButton value="0">全部</RadioButton>
              <RadioButton value="1">启用</RadioButton>
              <RadioButton value="2">禁用</RadioButton>
              <RadioButton value="3">未激活</RadioButton>
            </RadioGroup>
          </div>
        </div>
        <div className={styles.userQuery}>
          <div>用户名<Input placeholder="请输入" /></div>
          <div>用户名<Input placeholder="请输入" /></div>
          <div>用户名<Input placeholder="请输入" /></div>
          <Button>查询</Button>
        </div>
        <Table 
          loading={loading}
          rowSelection={rowSelection}
          dataSource={userData.toJS().map((e,i)=>({...e,key:i}))} 
          columns={this.tableColumn()} 
          onChange={this.tableChange}
          pagination={pagination}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
          <a className={styles.cancel} href="javascript:void(0)" onClick={this.cancelRowSelect}>取消选择</a>
        </div>
      </div>
    )
  }
}

export default UserList;
