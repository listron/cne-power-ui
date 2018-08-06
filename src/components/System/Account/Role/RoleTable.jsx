import React, { Component } from 'react';
import { Table, Button, Select, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './role.scss';

const { Option } = Select;

class RoleTable extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    totalNum: PropTypes.number,
    roleData: PropTypes.array,
    selectedRole: PropTypes.array,//勾选的数组
    getRoleList: PropTypes.func,
    changeRoleStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  onRowSelect = (selectedRowKeys, selectedRows) => {
    this.props.changeRoleStore({
      selectedRole: selectedRows
    })
  }
  cancelRowSelect = () => {
    this.props.changeRoleStore({
      selectedRole:[]
    })
  }

  // tableChange = (pagination,filter,sorter) => {//排序，筛选
  //   const sort = sorter.field;
  //   const ascend = sorter.order==='ascend';
  //   this.props.getRoleList({
  //     sort,
  //     ascend,
  //   });
  // }

  roleHandle = (value) => {//编辑，禁用，启用
    console.log(value);
    // const { selectedRole } = this.props;
    // if(value === 'edit'){
    //   this.props.editEnterprise({
    //     key: selectedRole[0].key
    //   })
    // }else{
    //   this.props.handleEnterprise({
    //     keys:selectedRole.map(e=>e.key),
    //     handle: value
    //   })
    // }
  }

  createHandleOption = () => {//生成操作下拉框
    const { selectedRole } = this.props;      
    return (
      <Select disabled={selectedRole.length===0} onChange={this.roleHandle} placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
        <Option value="edit" disabled={selectedRole.length>1}>编辑</Option>
        <Option value="open">删除</Option>
      </Select>
    );
  }
  createTableColumn = () => {//生成表头
    const columns = [
      {
        title: '名称',
        dataIndex: 'roleName',
        key: 'roleName'
      }, {
        title: '预设',
        dataIndex: 'isPre',
        key: 'isPre',
        render: (text,record) => (<span>{text===1?'否':'是'}</span>),
        sorter: (a, b) => a.text - b.text
      }, {
        title: '功能定义',
        dataIndex: 'rightData',
        key: 'rightData',
        render: (text,record)=>(
          this.renderAuth(text).join('|')
        )
      }
    ];
    return columns;
  }

  renderAuth(rightData) {
    let result = [];
    let rightEl = ''
    this.renderAuthEl(rightData, result, rightEl);
    return result;
  }

  renderAuthEl(arr, result, rightEl) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i].childRightData instanceof Array) {
        this.renderAuthEl(arr[i].childRightData, result, arr[i].rightName+'-');
      } else {
        result.push(rightEl+'-'+arr[i].rightName);
      }
    }
  }

  render(){
    const { selectedRole, roleData, isFetching } = this.props;
    return (
      <div className={styles.roleList}>
        <div className={styles.roleListTop} >
          <div>
            <Button className={styles.addRole}>
              <Icon type="plus" />
              <span className={styles.text}>角色</span>
            </Button>
            <div className={styles.handleRole}>
              {this.createHandleOption()}
            </div>
          </div>
        </div>
        <Table 
          loading={isFetching}
          rowKey={(record)=>{return record.roleId}} 
          rowSelection={{
            selectedRowKeys: selectedRole.map(e=>e.key),
            onChange: this.onRowSelect
          }}
          dataSource={roleData} 
          columns={this.createTableColumn()} 
          onChange={this.tableChange}
          pagination={false}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRole.length}</span>项</span>
          <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>
        </div>
      </div>
    )
  }
}

export default RoleTable;
