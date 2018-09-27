import React, { Component } from 'react';
import { Table, Select, Popover, Button, Icon } from 'antd';
import WarningTip from '../../../Common/WarningTip';
import PropTypes from 'prop-types';
import styles from './role.scss';
const { Option } = Select;

class RoleTable extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    loading: PropTypes.bool,
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

  getRightArr(rightData, frontText='') { // 递归生成权限数组['一级-二级-三级...',...]
    let dataInfoArr = [];
    rightData && rightData.length > 0 && rightData.forEach(e=>{
      const hasChildRight = e && e.childRightData && e.childRightData.length > 0
      if(hasChildRight){
        const innerData = this.getRightArr(e.childRightData, e.rightName);
        dataInfoArr.push(...innerData);
      }else{
        const rightText = `${frontText?`${frontText}-`:''}${e.rightName}`
        e && e.rightName && dataInfoArr.push(rightText);
      }
    })
    return dataInfoArr;
  }
  
  createRoloeColumn = () => [
    {
      title: '名称',
      dataIndex: 'roleDesc',
      key: 'roleDesc'
    }, {
      title: '预设',
      dataIndex: 'isPre',
      key: 'isPre',
      render: text => (<span>{text?'否':'是'}</span>),
      sorter: true
    }, {
      title: '功能定义',
      dataIndex: 'rightData',
      key: 'rightData',
      render: (rightData,record)=>{
        const rightArr = this.getRightArr(rightData,'');
        const {roleDesc}=record;
        const content = (
          <div className={styles.tooltip}>{rightArr.map((item,index)=>(<span key={index}>{item}</span>))}</div>
        );
        return (
          <Popover  content={content}  placement="right" trigger="hover"  title={roleDesc}>
            <div className={styles.menu}>{rightArr.join(' | ')}</div>
          </Popover>
        );
      }
    }
  ];

  cancelRowSelect = () => {
    this.props.changeRoleStore({
      selectedRole:[]
    })
  }

  roleHandle = (value) => {//编辑
    const { selectedRole, changeRoleStore, onDeleteRole } = this.props;
    const isPreUser = selectedRole.some(item=>!item.isPre);
    if(isPreUser){
      const warningTipText = `不得${value === 'edit'?'编辑':'删除'}预设角色`;
      this.setState({
        showWarningTip: true,
        warningTipText,
      })
    }else{
      value === 'edit'?changeRoleStore({
        showPage: 'edit',
      }):onDeleteRole({
        roleId: selectedRole.map(e=>e.roleId).join(',')
      });
    }
  }

  render(){
    const { selectedRole, roleData, loading, showPage } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const rightHandler = localStorage.getItem('rightHandler');
    const roleCreateRight = rightHandler && rightHandler.split(',').includes('account_role_create');
    const roleDeleteRight = rightHandler && rightHandler.split(',').includes('account_role_delete');
    const roleUpdateRight = rightHandler && rightHandler.split(',').includes('account_role_update');
    const roleConfigRight = rightHandler && rightHandler.split(',').includes('account_role_config');
    return (
      <div className={styles.roleList} style={{display: showPage==='list'?'flex':'none'}}>
      {showWarningTip && <WarningTip onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.roleContent}>
          <div className={styles.roleListTop} >
            <div>
              {roleCreateRight && <Button className={styles.addRole} onClick={this.onRoleAdd}>
                <Icon type="plus" />
                <span className={styles.text}>角色</span>
              </Button>}
              <div className={styles.handleRole}>
              {roleConfigRight && <Select onChange={this.roleHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName=  {styles.handleDropdown}>
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