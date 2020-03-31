import React, { Component } from 'react';
import { Table, Select, Popover, Button, Icon, Modal, Spin } from 'antd';
import WarningTip from '../../../Common/WarningTip';
import PropTypes from 'prop-types';
import styles from './role.scss';
import CneTable from '@components/Common/Power/CneTable';
import CneButton from '@components/Common/Power/CneButton';
const { Option } = Select;

// to do 可优化项：所有弹框的确认函数，可以使用一个回调函数作为参数进行函数式编程，只需将弹框的文字及下方按钮ui指定。
// 动态确认/取消后，改回调重置为null。可减少诸多记录状态的变量，利用一个交互函数进行覆盖处理。
class RoleTable extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    // loading: PropTypes.bool,
    roleTableLoading: PropTypes.bool,
    // totalNum: PropTypes.number,
    roleData: PropTypes.array,
    selectedRole: PropTypes.array, //勾选的数组
    // defaultMenuData: PropTypes.array,
    // getRoleList: PropTypes.func,
    changeRoleStore: PropTypes.func,
    onDeleteRole: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false, // 提示弹框
      warningTipText: '', // 提示语
      showDeleteTip: false, //删除弹框
      // deleteTipText: false, //删除提示语
      handleColumnDel: false, // 删除操作来源, false =>选中行后点击删除。true => 选中表格列中的直接删除
      handleColumnDelInfo: {}, // 选中表格列中直接删除记录的信息
      visibleModel: false,
      recordData: [], // 点击每行的出现的内容
      modelName: '', // 弹出框名字
      tableLoading: true, // 弹出表格时显示loading
    };
  }

  onRowSelect = (selectedRowKeys, selectedRows) => {
    this.props.changeRoleStore({
      selectedRole: selectedRows,
    });
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
    // const { defaultMenuData } = this.props;
    let dataInfoArr = [];
    rightData && rightData.length > 0 && rightData.forEach(e=>{
      const hasChildRight = e && e.childRightData && e.childRightData.length > 0
      if(hasChildRight){
        const innerData = this.getRightArr(e.childRightData, e.rightName);
        dataInfoArr.push(...innerData);
      }else{
        // const isDefaultRight = defaultMenuData.includes(parseInt(e.rightId)); // 默认权限不显示
        const rightText = `${frontText?`${frontText}-`:''}${e.rightName}`;
        e && e.rightName && dataInfoArr.push(rightText);
      }
    });

    return dataInfoArr;
  }

  createRoloeColumn = () => {
    let column = [
      {
        title: '名称',
        dataIndex: 'roleDesc',
        key: 'roleDesc',
        // width:'220px',
        width:'24%',
      },
      {
        title: '权限',
        dataIndex: 'operateName',
        key: 'operateName',
        className: styles.operateNameBox,
        // width:'80px',
        width:'8%',
      },
      {
        title: '功能定义',
        dataIndex: 'rightData',
        key: 'rightData',
        // width:'550px',
        className:styles.rightData,
        render: (rightData, record)=>{
          const rightArr = this.getRightArr(rightData, '');
          return (<div className={styles.menu} onClick={() => this.showModel(record)}>{rightArr.join(' | ')}</div>);
        },
      },
    ];
    const rightHandler = localStorage.getItem('rightHandler') || '';
    const roleDeleteRight = rightHandler.split(',').includes('account_role_delete');
    const roleUpdateRight = rightHandler.split(',').includes('account_role_update');
    if (roleDeleteRight || roleUpdateRight) { // 至少有一个编辑或删除权限
      return column.concat({
        title: '操作',
        // width: '100px',
        width:'10%',
        dataIndex: 'handler',
        className: styles.handlerBox,
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
        ),
      });
    }
    return column;
  };

  cancelRowSelect = () => {
    this.props.changeRoleStore({
      selectedRole:[],
    });
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
      });
    }else{
      value === 'edit'?changeRoleStore({ //编辑
        showPage: 'edit',
      }): this.setState({
        showDeleteTip: true,
        warningTipText: '确认要删除么?',
      });
    }
  }

  showModel = (record) => { // 点击某行显示权限列表
    const rightdataArr = this.getRightTree(record.rightData);
    setTimeout(() => {
      this.setState({
        tableLoading: false,
      });
    }, 500);
    this.setState({
      visibleModel: true,
      recordData: rightdataArr,
      modelName: record.roleDesc,
    });
  }

  getRightTree (data) { // 递归筛选三级菜单
    // const { defaultMenuData } = this.props; // 默认权限ID
    return data.map(e => {
      const { rightId, rightName, childRightData = [] } = e || {};
      if (childRightData && childRightData.length > 0) {
        const tmpRighData = this.getRightTree(childRightData);
        if (tmpRighData.length > 0) {
        return {
            rightId,
            rightName,
            childRightData: tmpRighData,
          };
        }
        // return defaultMenuData.includes(+rightId) ? false : { // 二级菜单有默认权限的时候筛选里层的数据
        //     rightId,
        //     rightName,
        //     childRightData: [],
        //   };
      }
      // else if (defaultMenuData.includes(+rightId)) {
      //   return false;
      // }
        return { ...e };
    }).filter(e => !!e);
  }

  handleOk = e => {
    this.setState({
      visibleModel: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visibleModel: false,
      tableLoading: true,
    });
  };

  ColumnEditRole = (record) => { // 列操作中直接编辑角色
    const forbiddenEdit = record.isPre === 0; // 预设角色不可删除
    if (forbiddenEdit) {
      this.setState({
        showWarningTip: true,
        warningTipText: '不得编辑预设角色',
        showWarningCancel: false,
      });
    } else {
      this.props.changeRoleStore({ //编辑
        showPage: 'edit',
        selectedRole: [record],
      });
    }
  }

  ColumnDeleteRole = (record) => { // 列操作中直接
    const forbiddenEdit = record.isPre === 0; // 预设角色不可删除
    if (forbiddenEdit) {
      this.setState({
        showWarningTip: true,
        warningTipText: '不得删除预设角色',
        showWarningCancel: false,
      });
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
        roleId: selectedRole.map(e=>e.roleId).join(','),
      });
    }
    this.setState({
      showDeleteTip: false,
      handleColumnDel: false,
      handleColumnDelInfo: {},
    });
  }

  render(){
    const { selectedRole, roleData, showPage, roleTableLoading } = this.props;
    const { showWarningTip, warningTipText, showDeleteTip, recordData, modelName, tableLoading } = this.state;
    const rightHandler = localStorage.getItem('rightHandler') || '';
    const roleCreateRight = rightHandler.split(',').includes('account_role_create');
    const roleDeleteRight = rightHandler.split(',').includes('account_role_delete');
    const roleUpdateRight = rightHandler.split(',').includes('account_role_update');
    const roleConfigRight = rightHandler.split(',').includes('account_role_config');
    const initTableScroll = roleData.length > 0 && { y: 900 } || {};
    const totalNum = roleData.length;
    const footer = (        
      <div className={styles.tableFooter}>
        <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRole.length}</span>项</span>
        {selectedRole.length > 0 &&<span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
      </div>);
    return (
      <div className={styles.roleList} style={{display: showPage==='list'?'flex':'none'}}>
      {showWarningTip && <WarningTip onOK={this.onConfirmWarningTip} value={warningTipText} />}
      {showDeleteTip && <WarningTip onOK={this.deleteRole} value={warningTipText} onCancel={this.onCancelDelete} />}
        <div className={styles.roleContent}>
          <div className={styles.roleListTop} >
            <div className={styles.rolelistTopBox}>
              {roleCreateRight && <CneButton className={styles.addRole} onClick={this.onRoleAdd}>
                <div className={styles.icon}>
                  <span className={'iconfont icon-newbuilt'} />
                </div>角色
              </CneButton>}
              <div className={styles.handleRole}>
              {roleConfigRight && <Select onChange={this.roleHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName = {styles.roleTableHandleDropdown}>
                {roleUpdateRight && <Option value="edit" disabled={selectedRole.length !== 1}>编辑</Option>}
                {roleDeleteRight && <Option value="delete" disabled={selectedRole.length===0}>删除</Option>}
              </Select>}
              </div>
            </div>
            <div className={styles.totalNum}>合计：{totalNum}</div>
          </div>
          <div className={styles.tableBox}>
            <CneTable
              loading={roleTableLoading}
              rowKey={(record)=>{return record.roleId;}}
              rowSelection={{
                selectedRowKeys: selectedRole.map(e=>e.roleId),
                onChange: this.onRowSelect,
              }}
              dataSource={roleData}
              columns={this.createRoloeColumn()}
              onChange={this.tableChange}
              pagination={false}
              scroll={initTableScroll}
              className={styles.tableStyle}
              footer={()=> selectedRole.length > 0 && footer }
            />
          </div>
        </div>
        {/* <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRole.length}</span>项</span>
          {selectedRole.length > 0 &&<span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div> */}
        <Modal
          title={modelName}
          visible={this.state.visibleModel}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          mask={false}
          wrapClassName={styles.tableModal}
          width={625}
          footer={null}
        >
          <Spin spinning={tableLoading}>
            {!tableLoading &&
            <div className={styles.rightTable}>
              <div className={styles.tableHeader}>
                <div className={styles.secondColumn}>二级菜单</div>
                <div className={styles.thirdColumn}>三级菜单</div>
              </div>
              {recordData && recordData.length > 0 && recordData.map(e => {
                return (
                  <div className={styles.tableContent}>
                    {e.childRightData && e.childRightData.map(m => {
                      return (
                        <div className={styles.rows}>
                          <div className={styles.secondMenu}>{m.rightName}</div>
                          <div className={styles.thirdMenu}>
                            {m.childRightData && m.childRightData.map(item => {
                              return (
                                <span className={styles.rightName}>
                                  <span className={styles.text}>{item.rightName}</span>
                                  <span className={styles.partition}>|</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>}
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default RoleTable;






