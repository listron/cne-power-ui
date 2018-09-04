import React, { Component } from 'react';
import { Table, Button, Select, Icon, Popover } from 'antd';
import WarningTip from '../../../Common/WarningTip';
import PropTypes from 'prop-types';
import styles from './role.scss';
const { Option } = Select;

class RoleTable extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    isFetching: PropTypes.bool,
    totalNum: PropTypes.number,
    roleData: PropTypes.array,
    selectedRole: PropTypes.array,//勾选的数组
    getRoleList: PropTypes.func,
    changeRoleStore: PropTypes.func,
    onDeleteRole: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      hiddenWarningTipCancelText: false
    };
  }

  onRoleAdd = () =>{//进入添加角色页
    this.props.changeRoleStore({showPage: 'create'});
  }

  onRowSelect = (selectedRowKeys, selectedRows) => {
    this.props.changeRoleStore({
      selectedRole: selectedRows
    })
  }
  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });  
  }
  cancelRowSelect = () => {
    this.props.changeRoleStore({
      selectedRole:[]
    })
  }

  roleHandle = (value) => {//编辑
    const { selectedRole } = this.props;
    if(value === 'edit'){
      if(selectedRole.some(item=>item.isPre===0)) {
        this.setState({
          showWarningTip: true,
          warningTipText: '不得编辑预设角色!',
          hiddenWarningTipCancelText: true
        });
      } else {
        this.props.changeRoleStore({
          showPage: 'edit'
        });
      }
    }else if(value === 'delete'){
      if(selectedRole.some(item=>item.isPre===0)) {
        this.setState({
          showWarningTip: true,
          warningTipText: '不得删除预设角色!',
          hiddenWarningTipCancelText: true
        });
      } else {
        this.props.onDeleteRole({
          roleId: selectedRole.map(e=>e.roleId).join(',')
        });
      }
    }
  }

  createHandleOption = () => {//生成操作下拉框
    const { selectedRole } = this.props;
    // const roleDeleteRight = rightHandler && rightHandler.includes('account_role_delete');
    // const roleUpdateRight = rightHandler && rightHandler.includes('account_role_update');
    // const showAllHandler = roleDeleteRight || roleUpdateRight;
    return (
      <Select onChange={this.roleHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
        <Option value="edit" disabled={selectedRole.length>1||selectedRole.length===0}>编辑</Option>
        <Option value="delete" disabled={selectedRole.length===0}>删除</Option>
      </Select>
    );
  }
  createTableColumn = () => {//生成表头
    const columns = [
      {
        title: '名称',
        dataIndex: 'roleDesc',
        key: 'roleDesc'
      }, {
        title: '预设',
        dataIndex: 'isPre',
        key: 'isPre',
        render: (text,record) => (<span>{text===1?'否':'是'}</span>),
        sorter: (a, b) => a.isPre - b.isPre
      }, {
        title: '功能定义',
        dataIndex: 'rightData',
        key: 'rightData',
        render: (text,record)=>{
          const right = this.renderAuth(text);
          const content = (
            <div className={styles.tooltip}>{right.map((item,index)=>(<span key={index}>{item}</span>))}</div>
          );
          return (
            <Popover title={record.roleDesc} content={content}>
              <div className={styles.menu}>{right.join('|')}</div>
            </Popover>
          );
        }
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
      let name;
      if(rightEl === '') {
        name = arr[i].rightName;
      } else {
        name = rightEl+'-'+arr[i].rightName;
      }
      if(arr[i].childRightData instanceof Array && arr[i].childRightData.length > 0) {
        this.renderAuthEl(arr[i].childRightData, result, name);
      } else {
        result.push(name);
      }
    }
  }

  render(){
    const { selectedRole, roleData, isFetching, showPage } = this.props;
    const { showWarningTip, warningTipText, hiddenWarningTipCancelText } = this.state;
    // const rightHandler = localStorage.getItem('right');
    // const roleCreateRight = rightHandler && rightHandler.includes('account_role_create');
    // const userImportRight = rightHandler && rightHandler.includes('account_user_batchImport');
    return (
      <div className={styles.roleList} style={{display: showPage==='list'?'flex':'none'}}>
      {showWarningTip && <WarningTip onOK={this.onConfirmWarningTip} value={warningTipText} hiddenCancel={hiddenWarningTipCancelText} />}
        {/* <div className={styles.roleListTop} >
          <div>
            <Button className={styles.addRole} onClick={this.onRoleAdd}>
              <Icon type="plus" />
              <span className={styles.text}>角色</span>
            </Button>
            <div className={styles.handleRole}>
              {this.createHandleOption()}
            </div>
          </div>
        </div> */}
        <div className={styles.roleContent}>
          <Table 
            loading={isFetching}
            rowKey={(record)=>{return record.roleId}} 
            // rowSelection={{
            //   selectedRowKeys: selectedRole.map(e=>e.roleId),
            //   onChange: this.onRowSelect
            // }}
            dataSource={roleData} 
            columns={this.createTableColumn()} 
            onChange={this.tableChange}
            pagination={false}
          />
        </div>
        {/* <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRole.length}</span>项</span>
          {selectedRole.length > 0 &&<span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div> */}
      </div>
    )
  }
}

export default RoleTable;