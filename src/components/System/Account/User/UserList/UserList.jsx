

import React, { Component } from 'react';
import { Table, Button, Select, Icon, Popover, Checkbox, Upload, message, Modal, Radio } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './userList.scss';
import { getCookie } from '../../../../../utils/index.js';
import Path from '../../../../../constants/path';
import WarningTip from '../../../../Common/WarningTip';

// to do 可优化项：所有弹框的确认函数，可以使用一个回调函数作为参数进行函数式编程，只需将弹框的文字及下方按钮ui指定。
// 动态确认/取消后，改回调重置为null。可减少诸多记录状态的变量，利用一个交互函数进行覆盖处理。
const RadioGroup = Radio.Group;
const { Option } = Select;

const { APIBasePath } = Path.basePaths;
const {system} = Path.APISubPaths;
class UserList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    userData: PropTypes.object,
    selectedUser: PropTypes.object,//勾选的数组
    getUserList: PropTypes.func,
    getUserDetail: PropTypes.func,
    changeUserStore: PropTypes.func,
    onChangeSort: PropTypes.func,//排序
    userStatus: PropTypes.number,
    order: PropTypes.string,
    ascend: PropTypes.bool,
    changeUserStatus: PropTypes.func,
    enterpriseId: PropTypes.string,
    roleId: PropTypes.string,
    getInviteLink: PropTypes.func,
    username: PropTypes.string,
    stationName: PropTypes.string,
    phoneNum: PropTypes.string,
    selectedKey: PropTypes.object,
    downLoadUserTemplate: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      columnsHandleArr: ['用户名', '用户姓名', '电话', '角色', '特殊权限', '负责电站', '状态', '操作'],
      selectedUserColumns: new Set(['用户名', '用户姓名', '电话', '角色', '特殊权限', '负责电站', '状态', '操作']),//选中列
      showDeleteTip: false,
      showExamineTip: false,
      deleteWarningTip: '确认要移除么？',
      pageNum: 1,
      examineStatus: 3,//审核状态 默认通过审核变为启用状态, 
      deleteHanlde: false, // 记录删除操作来源 true => 直接列操作删除, false => 勾选行后，下拉删除。
      deleteUserInfo: {}, // 直接进行列操作时,暂存的用户信息
    }
  }

  componentDidMount() {
    const params = {
      enterpriseId: this.props.enterpriseId,
      roleId: this.props.roleId,
      userStatus: this.props.userStatus,
      username: this.props.username,
      phoneNum: this.props.phoneNum,
      stationName: this.props.stationName,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
      order: '',
    };
    this.props.getUserList(params);
  }

  onRowSelect = (record, selected, selectedRows, nativeEvent) => {//行选择
    this.props.changeUserStore({
      selectedUser: selectedRows,
      selectedKey: selectedRows.map(e => e.key),
    });
  }
  onSelectAll = (selected, selectedRows, changeRows) => {//行选择（全选/反选)
    this.props.changeUserStore({
      selectedUser: selectedRows,
      selectedKey: selectedRows.map(e => e.key),
    });
  }
  onInviteUser = () => {
    this.props.getInviteLink({ enterpriseId: JSON.parse(this.props.enterpriseId), showPage: 'invite' });
  }
  onCreateUser = () => {
    this.props.changeUserStore({ showPage: 'add' });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.props.getUserList({
      enterpriseId: this.props.enterpriseId,
      userStatus: this.props.userStatus,
      order: this.props.order,
      ascend: this.props.ascend,
      pageNum: currentPage,
      pageSize,
      roleId: this.props.roleId,
      username: this.props.username,
      stationName: this.props.stationName,
      phoneNum: this.props.phoneNum,
    })
  }

  onSelectColumns = (value) => {
    const { selectedUserColumns, columnsHandleArr } = this.state;
    let tmpUserColumns = selectedUserColumns;
    if (value === '全选') {
      tmpUserColumns = new Set(columnsHandleArr);
      // tmpUserColumns = new Set(['用户名','用户姓名','电话','角色','特殊权限','所在部门','负责电站','状态']);
    } else {
      tmpUserColumns.has(value) ? tmpUserColumns.delete(value) : tmpUserColumns.add(value);
    }

    this.setState({ selectedUserColumns: tmpUserColumns })
    let params = {
      enterpriseId: this.props.enterpriseId,
      userStatus: this.props.userStatus,
      roleId: this.props.roleId,
      pageNum: this.props.pageNum - 1,
      pageSize: this.props.pageSize,
    };
    this.props.getUserList(params);
  }
  onExamineChange = (e) => {
    this.setState({
      examineStatus: e.target.value,
    });
  }

  getUserStatus = (userStatus) => {
    if (userStatus === 2) {
      return '未激活';
    } else if (userStatus === 1) {
      return '激活';
    }
  }

  getEnterpriseStatus = (enterpriseStatus) => {
    switch (enterpriseStatus) {
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
        return;
    }
  }

  confirmExamineTip = () => {
    const { selectedUser, enterpriseId, selectedKey } = this.props;
    this.props.changeUserStatus({
      enterpriseId,
      userId: selectedUser.toJS().map(e => e.userId).toString(),
      enterpriseUserStatus: this.state.examineStatus,
      selectedKey: selectedKey || [],
    });
    this.setState({
      showExamineTip: false,
      examineStatus: 3,
    });
  }
  cancelExamineTip = () => {
    this.setState({
      showExamineTip: false,
    })
  }

  showUserDetail = (record) => {
    const { userId } = record;
    this.props.getUserDetail({
      userId: userId,
      showPage: 'detail',
    });
  }

  tableChange = (pagination, filters, sorter) => {
    if (Object.keys(sorter).length !== 0) {
      let order = 0;
      switch (sorter.field) {
        case "roleName":
          order = sorter.order === "ascend" ? 2 : 1; break;
        case "spcialRoleName":
          order = sorter.order === "ascend" ? 4 : 3; break;
        case "enterpriseId":
          order = sorter.order === "ascend" ? 6 : 5; break;
        default:
          order = 0;
      }
      this.props.onChangeSort(order);
    } else {
      this.props.onChangeSort('');
    }
  }

  tableColumn = () => {
    const { selectedUserColumns } = this.state;
    let columns = [
      {
        title: '用户名',
        width: '200px',
        dataIndex: 'username',
        key: 'username',
        render: (text, record, index) => (<a href={'javascript:void(0)'} className={styles.username} onClick={() => this.showUserDetail(record)} >{text}</a>)
      }, {
        title: '用户姓名',
        width: '200px',
        dataIndex: 'userFullName',
        key: 'userFullName',
        render: (text, record, index) => (<span>{text}</span>)
      }, {
        title: '电话',
        width: '200px',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
        render: (text, record) => (<span>{text}</span>),
      }, {
        title: '角色',
        width: '200px',
        dataIndex: 'roleName',
        key: 'roleName',
        render: (text, record) => (<span>{text}</span>),
      }, {
        title: '特殊权限',
        width: '200px',
        dataIndex: 'spcialRoleName',
        key: 'spcialRoleName',
        render: (text, record) => (<span>{text}</span>),
      },
      // {
      //   title: '所在部门',
      //   dataIndex: 'departmentName',
      //   key: 'departmentName',
      //   render: (text,record) => (<span>{text}</span>),
      // }, 
      {
        title: '负责电站',
        width: '200px',
        dataIndex: 'stationName',
        key: 'stationName',
        render: (text, record, index) => {
          let stations = record.stationName && record.stationName.split(',').filter(e => !!e);
          const { username } = record;
          if (stations && stations.length > 1) {
            const content = (<ul>
              {stations.map(e => (<li key={e} className={styles.eachStation} >
                <span className={styles.square} ></span><span>{e}</span>
              </li>))}
            </ul>)
            return (
              <div>
                <span>{stations[0]}</span>
                <Popover
                  content={content}
                  title={username + '负责电站'}
                  placement="right"
                  trigger="hover"
                  overlayClassName={styles.responsibleDetails}
                >
                  <Icon type="ellipsis" />
                </Popover>
              </div>
            )
          } else {
            return <span>{stations ? stations[0] : ''}</span>
          }
        }
      }, {
        title: '状态',
        width: '200px',
        dataIndex: 'userStatus',
        key: 'userStatus',
        render: (text, record, index) => {
          return (<span>{this.getEnterpriseStatus(record.enterpriseStatus)}</span>);
        },
      },
    ];
    const rightHandler = localStorage.getItem('rightHandler');
    const userDeleteRight = rightHandler && rightHandler.split(',').includes('account_user_delete');
    const userEditRight = rightHandler && rightHandler.split(',').includes('account_user_edit');
    if (userDeleteRight || userEditRight) { // 至少拥有一个编辑/ 删除权限
      return columns.filter(e => selectedUserColumns.has(e.title)).concat({
        title: '操作',
        width: '100px',
        dataIndex: 'handler',
        render: (text, record) => (<span>
          {userEditRight && <i
            className={`${styles.editUser} iconfont icon-edit`}
            onClick={() => this.editUser(record)}
          />}
          {userDeleteRight && <i
            className={`${styles.deleteUser} iconfont icon-remove`}
            onClick={() => this.deleteUser(record)}
          />}
        </span>
        )
      })
    }
    return columns.filter(e => selectedUserColumns.has(e.title))
  }

  cancelRowSelect = () => {
    this.props.changeUserStore({
      selectedUser: [],
      selectedKey: [],
    })
  }

  _createUserOperate = (rightHandler) => {
    let selectedUser = this.props.selectedUser.toJS();
    const userDeleteRight = rightHandler && rightHandler.split(',').includes('account_user_delete');
    const userEnableRight = rightHandler && rightHandler.split(',').includes('account_user_enable');
    const userDisableRight = rightHandler && rightHandler.split(',').includes('account_user_disable');
    const userEditRight = rightHandler && rightHandler.split(',').includes('account_user_edit');
    const userAuditRight = rightHandler && rightHandler.split(',').includes('account_user_audit');
    const showAllHandler = userDeleteRight || userEnableRight || userDisableRight || userEditRight || userAuditRight;
    if (!showAllHandler) { return null; }
    let [editable, deletable, usable, unallowable, examinable] = [true, true, true, true, true];
    if (selectedUser.length > 0) {
      editable = false;
      selectedUser.forEach(e => {
        if ([3, 5, 6].includes(e.enterpriseStatus)) { // 已启用、待审核、未通过 不可启用
          usable = false;
        }
        if ([4, 5, 6, 7].includes(e.enterpriseStatus)) { // 待审核、未通过、禁用、移除 不可禁用
          unallowable = false;
        }
        if ([3].includes(e.enterpriseStatus)) { // 启用用户 不可审核
          examinable = false;
        }
      })
    } else {
      [editable, deletable, usable, unallowable, examinable] = [false, false, false, false, false];
    }

    // if (selectedUser.length > 0) {
    //   editable = selectedUser.length === 1;
    //   let newArray = [...new Set(selectedUser.map(e => this.getEnterpriseStatus(e.enterpriseStatus)))];
    //   [deletable, usable, unallowable, examinable] = newArray.length < 2 ? [true, true, true, true] : [false, false, false, false];
    //   if (selectedUser[0].enterpriseStatus === 3) {//启用
    //     usable = false;
    //   } else if (selectedUser[0].enterpriseStatus === 5 || selectedUser[0].enterpriseStatus === 6) {//待审核//未通过审核
    //     usable = false, unallowable = false;
    //   } else if (selectedUser[0].enterpriseStatus === 4) {//禁用
    //     unallowable = false;
    //   } else if (selectedUser[0].enterpriseStatus === 7) {//移除
    //     unallowable = false;
    //   }
    // } else {
    //   [editable, deletable, usable, unallowable, examinable] = [false, false, false, false, false];
    // }
    return (<Select onSelect={this.userHandle} placeholder="操作" value="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown} >
      {userEditRight && <Option value="edit" disabled={!editable}><i className="iconfont icon-edit"></i><span>编辑</span></Option>}
      {userDeleteRight && <Option value="delete" disabled={!deletable}><i className="iconfont icon-remove"></i><span>移除</span></Option>}
      {userEnableRight && <Option value="use" disabled={!usable}><i className="iconfont icon-enable"></i><span>启用</span></Option>}
      {userDisableRight && <Option value="unallow" disabled={!unallowable}><i className="iconfont icon-disable"></i><span>禁用</span></Option>}
      {userAuditRight && <Option value="examine" disabled={!examinable}><i className="iconfont icon-examine1"></i><span>审核</span></Option>}
    </Select>)
  }

  userHandle = (value) => {
    const { selectedUser, enterpriseId, } = this.props;
    if (value === 'edit') {
      this.props.getUserDetail({ userId: selectedUser.toJS()[0].userId });
      this.props.changeUserStore({ showPage: 'edit', });
    } else if (value === 'delete') {//移除
      this.setState({
        showDeleteTip: true,
        warningText: '',
      });
    } else if (value === 'use') {//启用
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e => e.userId).toString(),
        enterpriseUserStatus: 3,
      });
    } else if (value === 'unallow') {//禁用
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e => e.userId).toString(),
        enterpriseUserStatus: 4,
      });
    } else if (value === 'examine') {//审核
      this.setState({
        showExamineTip: true,
      });
    }
  }

  editUser = (record) => { // 列操作 => 编辑用户
    this.props.getUserDetail({ userId: record.userId });
    this.props.changeUserStore({ showPage: 'edit', });
  }

  deleteUser = (record) => { // 列操作 => 删除用户
    this.setState({
      showDeleteTip: true,
      warningText: '',
      deleteHanlde: true,
      deleteUserInfo: record,
    });
  }

  beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error('You can only upload Excel file!');
    }
    return isExcel;
  }

  cancelDeleteTip = () => {
    this.setState({
      showDeleteTip: false,
    })
  }
  confirmDeleteTip = () => { // 用户确认删除。
    const { selectedUser, enterpriseId, } = this.props;
    const { deleteHanlde, deleteUserInfo } = this.state;
    if (deleteHanlde) { // 删除操作来源于直接列中点击删除
      this.props.changeUserStatus({
        enterpriseId,
        userId: deleteUserInfo.userId,
        enterpriseUserStatus: 7,
      });
    } else { // 删除操作来源于点击选中行 => 删除
      this.props.changeUserStatus({
        enterpriseId,
        userId: selectedUser.toJS().map(e => e.userId).toString(),
        enterpriseUserStatus: 7,
      });
      this.props.changeUserStore({
        selectedUser: [],
      });
    }
    this.setState({
      deleteHanlde: false,
      deleteUserInfo: {},
      showDeleteTip: false,
    });
  }

  downloadTemplate = () => {
    const { downLoadUserTemplate } = this.props;
    const url = `${APIBasePath}${system.downLoadUserTemplate}`;
    const authData = localStorage.getItem('authData') || '';
    downLoadUserTemplate({
      url,
      method: 'get',
      fileName: '导入用户模板.xlsx',
      params: {},
      headers: { 'Authorization': 'bearer ' + authData },
    });
  }

  examineModal = () => (
    <Modal
      onOk={this.cancelExamineTip}
      onCancel={this.confirmExamineTip}
      visible={true}
      footer={null}
      closable={false}
      maskClosable={false}
      maskStyle={{ backgroundColor: 'rgba(153,153,153,0.2)' }}
      wrapClassName={styles.warningTipWrapBox}
      width="560px"
      height="250px"
    >
      <div className={styles.warningTip} >
        <div className={styles.textArea}>
          <Icon type="exclamation-circle-o" className={styles.icon} />
          <span className={styles.text}>是否通过审核？</span>
        </div>
        <div className={styles.handleRadio}>
          <RadioGroup name="radiogroup" defaultValue={3} onChange={this.onExamineChange} >
            <Radio value={3}>通过</Radio>
            <Radio value={6}>不通过</Radio>
          </RadioGroup>
        </div>
        <div className={styles.handle}>
          <span onClick={this.cancelExamineTip} >取消</span>
          <span onClick={this.confirmExamineTip} className={styles.confirmExamine} >确认</span>
        </div>
      </div>
    </Modal>
  );

  render() {
    const { pageSize, pageNum, userData, totalNum, loading, selectedUser, selectedKey, downloading } = this.props;
    const { selectedUserColumns, showDeleteTip, showExamineTip, deleteWarningTip, columnsHandleArr } = this.state;
    const authData = localStorage.getItem('authData')|| '';
    console.log(authData);
    const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.importUserBatch;
    const uploadProps = {
      name: 'file',
      action: url,
      headers: { 'Authorization': 'bearer ' + ((authData && authData !== 'undefined') ? authData : '') },
      beforeUpload: this.beforeUpload,
      data: {
        enterpriseId: this.props.enterpriseId,
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.code === '10000') {
            message.success(`${info.file.name} 导入完成`);
            const params = {
              enterpriseId: this.props.enterpriseId,
              userStatus: this.props.userStatus,
              roleId: this.props.roleId,
              pageNum: this.props.pageNum,
              pageSize: this.props.pageSize,
            };
            this.props.getUserList(params);
          } else {
            message.error(info.file.response.message);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 导入失败，请重新导入.`);
        }
      },
    };
    const rightHandler = localStorage.getItem('rightHandler');
    const userCreateRight = rightHandler && rightHandler.split(',').includes('account_user_create');
    const userImportRight = rightHandler && rightHandler.split(',').includes('account_user_batchImport');
    const userInvite = rightHandler && rightHandler.split(',').includes('account_user_invite');
    const userDeleteRight = rightHandler && rightHandler.split(',').includes('account_user_delete');
    const userEditRight = rightHandler && rightHandler.split(',').includes('account_user_edit');
    let requiredColumn = ['用户名', '电话', '负责电站', '状态'];
    if (userDeleteRight || userEditRight) { // 至少拥有一个编辑/ 删除权限
      requiredColumn = requiredColumn.concat('操作');
    }
    return (
      <div className={styles.userList}>
        {showDeleteTip && <WarningTip
          onCancel={this.cancelDeleteTip}
          onOK={this.confirmDeleteTip}
          value={deleteWarningTip}
        />}
        {showExamineTip && this.examineModal()}
        <div className={styles.userHelper} >
          <div className={styles.userHelperLeft} >
            {userCreateRight && <Button onClick={this.onCreateUser} className={styles.addUser} ><Icon type="plus" /><span className={styles.text}>用户</span></Button>}
            {/* <Button onClick={this.onInviteUser} >邀请用户</Button> */}
            {userInvite && <Button onClick={this.onInviteUser} >邀请用户</Button>}
            {userImportRight && <Upload {...uploadProps} className={styles.importUser}>
              <Button>批量导入</Button>
            </Upload>}
            <Button className={styles.templateDown} onClick={this.downloadTemplate} loading={downloading} >导入模板下载</Button>
            <div className={selectedUser.toJS().length > 0 ? styles.selectedOperate : styles.userOperate} >
              {this._createUserOperate(rightHandler)}
            </div>
            <div className={styles.selectedColumnsBox} >
              <Select
                dropdownClassName={styles.dropdownMenu}
                className={styles.selectedColumns}
                showArrow={false}
                dropdownMatchSelectWidth={false}
                onSelect={this.onSelectColumns}
              >
                <Option key="全选" value="全选" >
                  <Checkbox checked={selectedUserColumns.size === columnsHandleArr.length} >全选</Checkbox>
                </Option>
                {columnsHandleArr.map(item => (<Option
                  key={item}
                  value={item}
                  disabled={requiredColumn.includes(item)}
                >
                  <Checkbox
                    value={item}
                    checked={selectedUserColumns.has(item)}
                    disabled={requiredColumn.includes(item)}
                  >{item}</Checkbox>
                </Option>)
                )}
              </Select>
            </div>
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedKey && selectedKey.toJS() || [],
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll,
          }}
          dataSource={userData && userData.toJS().map((e, i) => ({ ...e, key: i }))}
          columns={this.tableColumn()}
          onChange={this.tableChange}
          pagination={false}
          className={styles.userTable}
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
