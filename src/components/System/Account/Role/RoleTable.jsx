import React, { Component } from 'react';
import { Table, Select, Popover, Button, Icon } from 'antd';
import WarningTip from '../../../Common/WarningTip';
import PropTypes from 'prop-types';
import styles from './role.scss';
const { Option } = Select;

// to do 可优化项：所有弹框的确认函数，可以使用一个回调函数作为参数进行函数式编程，只需将弹框的文字及下方按钮ui指定。
// 动态确认/取消后，改回调重置为null。可减少诸多记录状态的变量，利用一个交互函数进行覆盖处理。

class RoleTable extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    loading: PropTypes.bool,
    totalNum: PropTypes.number,
    roleData: PropTypes.array,
    selectedRole: PropTypes.array,//勾选的数组
    defaultMenuData: PropTypes.array,
    getRoleList: PropTypes.func,
    changeRoleStore: PropTypes.func,
    onDeleteRole: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false, // 提示弹框
      warningTipText: '', // 提示语
      showDeleteTip: false, //删除弹框
      deleteTipText: false, //删除提示语
      handleColumnDel: false, // 删除操作来源, false =>选中行后点击删除。true => 选中表格列中的直接删除
      handleColumnDelInfo: {}, // 选中表格列中直接删除记录的信息
    };
  }

  onRowSelect = (selectedRowKeys, selectedRows) => {
    this.props.changeRoleStore({
      selectedRole: selectedRows
    })
  }

  onRoleAdd = () =>{//进入添加角色页
    this.props.changeRoleStore({ showPage: 'create' });
  }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });  
  }

  onCancelDelete = () => {
    this.setState({
      showDeleteTip: false,
    }); 
  }

  getRightArr(rightData, frontText='') { // 递归生成权限数组['一级-二级-三级...',...]
    const { defaultMenuData } = this.props;
    let dataInfoArr = [];
    rightData && rightData.length > 0 && rightData.forEach(e=>{
      const hasChildRight = e && e.childRightData && e.childRightData.length > 0
      if(hasChildRight){
        const innerData = this.getRightArr(e.childRightData, e.rightName);
        dataInfoArr.push(...innerData);
      }else{
        const isDefaultRight = defaultMenuData.includes(parseInt(e.rightId)); // 默认权限不显示
        const rightText = `${frontText?`${frontText}-`:''}${e.rightName}`;
        e && e.rightName && !isDefaultRight && dataInfoArr.push(rightText);
      }
    })
    return dataInfoArr;
  }
  
  createRoloeColumn = () => {
    let column = [
      {
        title: '名称',
        dataIndex: 'roleDesc',
        key: 'roleDesc'
      }, {
        title: '预设',
        dataIndex: 'isPre',
        key: 'isPre',
        render: text => (<span>{text?'否':'是'}</span>),
      }, {
        title: '功能定义',
        dataIndex: 'rightData',
        key: 'rightData',
        render: (rightData,record)=>{
          const rightArr = this.getRightArr(rightData,'');
          const {roleDesc}=record;
          const content = (
            <div className={styles.roleTableTooltip}>
              <span>基础权限</span>
              {rightArr.map((item,index)=>(<span key={index}>{item}</span>))}
            </div>
          );
          let tableRightArr = [...rightArr];
          tableRightArr.unshift('基础权限');
          const title = <span className={styles.roleTableTitle}>{roleDesc}</span>
          return (
            <Popover  content={content}  placement="right" trigger="hover"  title={title}>
              <div className={styles.menu}>{tableRightArr.join(' | ')}</div>
            </Popover>
          );
        }
      }
    ];
    const rightHandler = localStorage.getItem('rightHandler') || '';
    const roleDeleteRight = rightHandler.split(',').includes('account_role_delete');
    const roleUpdateRight = rightHandler.split(',').includes('account_role_update');
    if (roleDeleteRight || roleUpdateRight) { // 至少有一个编辑或删除权限
      return column.concat({
        title: '操作',
        width:'100px',
        dataIndex: 'handler',
        render: (text, record) => (<span>
            {roleUpdateRight && <i
              className={`${styles.editRole} iconfont icon-edit`}
              onClick={() => this.ColumnEditRole(record)}
            />}
            {roleDeleteRight && <i
              className={`${styles.deleteRole} iconfont icon-del`}
              onClick={() => this.ColumnDeleteRole(record)}
            />}
          </span>
        )
      })
    }
    return column
  };

  cancelRowSelect = () => {
    this.props.changeRoleStore({
      selectedRole:[]
    })
  }

  roleHandle = (value) => {//编辑,删除操作
    const { selectedRole, changeRoleStore } = this.props;
    const isPreUser = selectedRole.some(item=>!item.isPre);
    if(isPreUser){
      const warningTipText = `不得${value === 'edit'?'编辑':'删除'}预设角色`;
      this.setState({
        showWarningTip: true,
        warningTipText,
        showWarningCancel: false,
      })
    }else{
      value === 'edit'?changeRoleStore({ //编辑
        showPage: 'edit',
      }): this.setState({
        showDeleteTip: true,
        warningTipText: '确认要删除么?'
      }); 
    }
  }

  ColumnEditRole = (record) => { // 列操作中直接编辑角色
    const forbiddenEdit = record.isPre === 0; // 预设角色不可删除
    if (forbiddenEdit) {
      this.setState({
        showWarningTip: true,
        warningTipText: '不得编辑预设角色',
        showWarningCancel: false,
      })
    } else {
      this.props.changeRoleStore({ //编辑
        showPage: 'edit',
        selectedRole: [record],
      })
    }
  }

  ColumnDeleteRole = (record) => { // 列操作中直接
    const forbiddenEdit = record.isPre === 0; // 预设角色不可删除
    if (forbiddenEdit) {
      this.setState({
        showWarningTip: true,
        warningTipText: '不得删除预设角色',
        showWarningCancel: false,
      })
    } else {
      this.setState({
        showDeleteTip: true,
        warningTipText: '确认要删除么?',
        handleColumnDel: true,
        handleColumnDelInfo: record,
      }); 
    }
  }

  deleteRole = () => { // 删除角色
    const { selectedRole, onDeleteRole } = this.props;
    const { handleColumnDel, handleColumnDelInfo } = this.state;
    if (handleColumnDel) { // 直接列操作删除。
      onDeleteRole({
        roleId: handleColumnDelInfo.roleId,
      });
    } else { // 选中行 后操作删除。
      onDeleteRole({
        roleId: selectedRole.map(e=>e.roleId).join(',')
      });
    }
    this.setState({
      showDeleteTip: false,
      handleColumnDel: false,
      handleColumnDelInfo: {},
    })
  }

  render(){
    const { selectedRole, roleData, loading, showPage } = this.props;
    const { showWarningTip, warningTipText, showDeleteTip } = this.state;
    const rightHandler = localStorage.getItem('rightHandler') || '';
    const roleCreateRight = rightHandler.split(',').includes('account_role_create');
    const roleDeleteRight = rightHandler.split(',').includes('account_role_delete');
    const roleUpdateRight = rightHandler.split(',').includes('account_role_update');
    const roleConfigRight = rightHandler.split(',').includes('account_role_config');
    return (
      <div className={styles.roleList} style={{display: showPage==='list'?'flex':'none'}}>
      {showWarningTip && <WarningTip onOK={this.onConfirmWarningTip} value={warningTipText} />}
      {showDeleteTip && <WarningTip onOK={this.deleteRole} value={warningTipText} onCancel={this.onCancelDelete} />}
        <div className={styles.roleContent}>
          <div className={styles.roleListTop} >
            <div>
              {roleCreateRight && <Button className={styles.addRole} onClick={this.onRoleAdd}>
                <Icon type="plus" />
                <span className={styles.text}>角色</span>
              </Button>}
              <div className={styles.handleRole}>
              {roleConfigRight && <Select onChange={this.roleHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName=  {styles.roleTableHandleDropdown}>
                {roleUpdateRight && <Option value="edit" disabled={selectedRole.length !== 1}>编辑</Option>}
                {roleDeleteRight && <Option value="delete" disabled={selectedRole.length===0}>删除</Option>}
              </Select>}
              </div>
            </div>
          </div>
          <Table 
            loading={loading}
            rowKey={(record)=>{return record.roleId}} 
            rowSelection={{
              selectedRowKeys: selectedRole.map(e=>e.roleId),
              onChange: this.onRowSelect
            }}
            dataSource={roleData} 
            columns={this.createRoloeColumn()} 
            onChange={this.tableChange}
            pagination={false}
          />
        </div>
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRole.length}</span>项</span>
          {selectedRole.length > 0 &&<span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>
      </div>
    )
  }
}

export default RoleTable;