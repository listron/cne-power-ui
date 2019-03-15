

import React, { Component } from 'react';
import { Table, Button, Select, Icon, Popover } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './departmentMain.scss';
import WarningTip from '../../../../Common/WarningTip';
import AssignUserModal from '../AssignUserModal/AssignUserModal';
import AssignStationModal from '../AssignStationModal/AssignStationModal';

// to do 可优化项：所有弹框的确认函数，可以使用一个回调函数作为参数进行函数式编程，只需将弹框的文字及下方按钮ui指定。
// 动态确认/取消后，改回调重置为null。可减少诸多记录状态的变量，利用一个交互函数进行覆盖处理。

const { Option } = Select;

class DepartmentTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,

    enterpriseId: PropTypes.string,
    departmentSource: PropTypes.number,
    departmentName: PropTypes.string,
    parentDepartmentName: PropTypes.string,
    stationName: PropTypes.string,
    sort: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    allDepartment: PropTypes.object,
    departmentUser: PropTypes.object,
    DepartmentStation: PropTypes.object,
    userId: PropTypes.string,
    enterpriseName: PropTypes.string,
    showAssignUserModal: PropTypes.bool,
    showAssignStationModal: PropTypes.bool,

    totalNum: PropTypes.number,
    departmentData: PropTypes.array,
    selectedDepartment: PropTypes.array,//选中部门
    getDepartmentList: PropTypes.func,
    getDepartmentDetail: PropTypes.func,
    deleteDepartment: PropTypes.func,
    changeDepartmentStore: PropTypes.func,
    getDepartmentUser: PropTypes.func,
    getDepartmentStation: PropTypes.func,
    setDepartmentUser: PropTypes.func,
    setDepartmentStation: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false, // 行选择后多个部门的编辑与删除
      warningTipText: '',

      handleWarningTip: false, // 直接操作列
      handleTipText: '',
      handlRemove: false, // 用于区分删除操作来源于哪个动作的关键字=> 列直接操作：true， 选中行下拉框操作: false,
      handlRemoveInfo: {}, // 直接删除的部门信息。
    }
  }

  onDepartmentAdd = () => {//进入添加部门页
    this.props.changeDepartmentStore({ showPage: 'add' });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.props.getDepartmentList({
      enterpriseId: this.props.enterpriseId,
      departmentSource: this.props.departmentSource,
      departmentName: this.props.departmentName,
      parentDepartmentName: this.props.parentDepartmentName,
      stationName: this.props.stationName,
      sort: this.props.sort,
      pageNum: currentPage,
      pageSize,
    })
  }

  onRowSelect = (selectedRowKeys, selectedRows) => {//行选择
    this.props.changeDepartmentStore({
      selectedDepartment: selectedRows
    })
  }

  onWarningTipOK = () => {// 删除部门
    const { selectedDepartment, deleteDepartment, enterpriseId } = this.props;
    const { handlRemove, handlRemoveInfo } = this.state;
    this.setState({
      showWarningTip: false
    });
    if (handlRemove) { // 直接操作删除。
      deleteDepartment({
        departmentId: `${handlRemoveInfo.departmentId}`,
        enterpriseId: enterpriseId
      });
    } else { // 选中行/多行后，删除选中的部门。
      deleteDepartment({
        departmentId: selectedDepartment.map(e => e.departmentId).join(','),
        enterpriseId: enterpriseId
      });
    }
    this.setState({ // 操作完成后，重置提示框状态。
      showWarningTip: false,
      warningTipText: '',
      handlRemove: false,
      handlRemoveInfo: {},
    });
  }

  handleWarningOK = () => { // 被禁止的操作提示框 确认
    this.setState({
      handleWarningTip: false, // 直接操作列
      handleTipText: '',
    });
  }

  cancelRowSelect = () => {//取消行选择
    this.props.changeDepartmentStore({
      selectedDepartment: []
    })
  }

  cancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
    })
  }

  tableChange = (pagination, filter, sorter) => {//部门排序
    const sort = sorter.field;
    const ascend = sorter.order === 'ascend' ? '0' : '1';
    this.props.getDepartmentList({
      enterpriseId: this.props.enterpriseId,
      departmentSource: this.props.departmentSource,
      departmentName: this.props.departmentName,
      parentDepartmentName: this.props.parentDepartmentName,
      stationName: this.props.stationName,
      sort: `${sort},${ascend}`,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    })
  }

  showDepartmentDetail = (record) => {//点击跳转至详情
    const { departmentId } = record;
    this.props.changeDepartmentStore({
      showPage: 'detail',
    })
    this.props.getDepartmentDetail({
      departmentId
    })
  }

  departmentHandle = (value) => {//编辑，删除，分配用户/电站
    const { selectedDepartment } = this.props;
    if (value === 'edit') {
      const forbiddenEdit = selectedDepartment.some(e => e.departmentSource === 0);
      if (forbiddenEdit) {
        this.setState({
          handleWarningTip: true,
          handleTipText: '不得编辑预设部门!',
        })
      } else {
        this.props.changeDepartmentStore({
          showPage: 'edit',
          departmentDetail: selectedDepartment[0],
        });
      }
    } else if (value === 'delete') {
      const selectedDepartmentHasChild = selectedDepartment.map(e => e.hasChildren).some(e => !!e);
      // const selectedDepartmentHasMember = selectedDepartment.map(e => e.hasMember).some(e => !!e);
      const forbiddenDelete = selectedDepartment.some(e=>e.departmentSource === 0)
      if(forbiddenDelete){
        this.setState({
          handleWarningTip: true,
          handleTipText: '不得删除预设部门!',
        })
      } else if (selectedDepartmentHasChild) {
        this.setState({
          handleWarningTip: true,
          handleTipText: '请先删除子部门!',
        })
      } else {
        this.setState({
          showWarningTip: true,
          warningTipText: '删除后,将取消成员关联!'
        })
      }
    } else if (value === 'assignUser') {
      this.props.changeDepartmentStore({
        showAssignUserModal: true,
      })
    } else if (value === 'assignStation') {
      this.props.changeDepartmentStore({
        showAssignStationModal: true,
      })
    }
  }

  editDepartment = (record) => { // 直接操作编辑部门
    if (record.departmentSource === 0) { // 预设部门
      this.setState({
        handleWarningTip: true,
        handleTipText: '不得编辑预设部门!',
      })
    } else {
      this.props.changeDepartmentStore({
        showPage: 'edit',
        departmentDetail: record,
      });
    }
  }

  deleteDepartment = (record) => { // 直接操作删除部门
    if (record.departmentSource === 0) {
      this.setState({
        handleWarningTip: true,
        handleTipText: '不得删除预设部门!',
      })
    } else if (record.hasChildren) {
      this.setState({
        handleWarningTip: true,
        handleTipText: '请先删除子部门!',
      })
    } else {
      this.setState({
        handlRemove: true,
        handlRemoveInfo: record,
        showWarningTip: true,
        warningTipText: '删除后,将取消成员关联!',
      })
    }
  }

  _createHandleOption = (rightHandler) => {//部门操作下拉框生成
    const departmentDeleteRight = rightHandler && rightHandler.split(',').includes('account_department_delete');
    const departmentUpdateRight = rightHandler && rightHandler.split(',').includes('account_department_update');
    const departmentUserRight = rightHandler && rightHandler.split(',').includes('account_department_user');
    const departmentStationRight = rightHandler && rightHandler.split(',').includes('account_department_station');
    const showAllHandler = departmentDeleteRight || departmentUpdateRight || departmentUserRight || departmentStationRight;
    if (!showAllHandler) { return null; }
    const { selectedDepartment } = this.props;
    let [editable, deletable, userAssignable, staionAssignable] = [false, false, false, false];
    if (selectedDepartment.length > 0) {
      editable = (selectedDepartment.length === 1) && selectedDepartment[0].departmentSource !== 0;
      deletable = selectedDepartment.every(e => e.departmentSource === 1);
      userAssignable = true;
      staionAssignable = true;
    }
    return (<Select onChange={this.departmentHandle} placeholder="操作" value="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.departmentHandleDropdown}>
      {departmentUpdateRight && <Option value="edit" disabled={!editable} ><span className="iconfont icon-edit"></span>编辑</Option>}
      {departmentDeleteRight && <Option value="delete" disabled={!deletable} ><span className="iconfont icon-remove"></span>删除</Option>}
      {departmentUserRight && <Option value="assignUser" disabled={!userAssignable} ><span className="iconfont icon-role"></span>分配用户</Option>}
      {departmentStationRight && <Option value="assignStation" disabled={!staionAssignable} ><span className="iconfont icon-powerstation"></span>设置电站</Option>}
    </Select>)
  }

  _createTableColumn = () => {//生成表头
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'departmentName',
        width:'200px',
        key: 'departmentName',
        render: (text, record, index) => (
          <a href={'javascript:void(0);'} className={styles.tableDepartmentName} onClick={() => this.showDepartmentDetail(record)} ><div title={text} className={styles.departmentName} >{text}</div></a>
        )
      }, {
        title: '所属部门',
        width:'200px',
        dataIndex: 'parentDepartmentName',
        key: 'parentDepartmentName',
        // render: (text,record,index) => (        
        //  <div className={styles.parentDepartmentName}>{text}</div>
        // )
      }, {
        title: '预设',
        width:'200px',
        dataIndex: 'departmentSource',
        key: 'departmentSource',
        render: (text, record) => (<span className={styles.departmentSource}>{text === 0 ? '是' : '否'}</span>),
        sorter: true
      }, {
        title: '负责电站',
        width:'200px',
        dataIndex: 'stationName',
        key: 'stationName',
        render: (text, record) => {
          let stations = record.stationName.split(',').filter(e => !!e);
          const { departmentName } = record;
          if (stations.length > 1) {
            const content = (<ul>
              {stations.map((e, i) => (<li key={i} className={styles.eachStation}>
                <span className={styles.square}></span>
                <span>{e}</span>
              </li>))}
            </ul>)
            return (<span className={styles.stationColumn}>
              <span>{stations[0]}</span>
              <Popover placement="right" content={content} title={`${departmentName}负责电站`} overlayClassName={styles.responsibleDetails}>
                <Icon className={styles.others} type="ellipsis" />
              </Popover>
            </span>)
          } else {
            return <span>{stations[0] ? stations[0] : ''}</span>
          }
        }
      }
    ];
    const rightHandler = localStorage.getItem('rightHandler');
    const departmentDeleteRight = rightHandler && rightHandler.split(',').includes('account_department_delete');
    const departmentUpdateRight = rightHandler && rightHandler.split(',').includes('account_department_update');
    if (departmentDeleteRight || departmentUpdateRight) { // 至少有编辑或删除权限时。
      return columns.concat({
        title: '操作',
        width:'100px',
        dataIndex: 'handler',
        render: (text, record) => (<span>
            {departmentDeleteRight && <i
              className={`${styles.editDepartment} iconfont icon-edit`}
              onClick={() => this.editDepartment(record)}
            />}
            {departmentUpdateRight && <i
              className={`${styles.deleteDepartment} iconfont icon-del`}
              onClick={() => this.deleteDepartment(record)}
            />}
          </span>
        )
      })
    }
    return columns
  }

  renderAssignUserModal() {
    const { userId, enterpriseName, enterpriseId, allDepartment, departmentUser, getDepartmentUser, setDepartmentUser, changeDepartmentStore, selectedDepartment } = this.props;
    return (
      <AssignUserModal
        currentUserId={userId}
        enterpriseId={enterpriseId}
        enterpriseName={enterpriseName}
        departmentList={allDepartment}
        userList={departmentUser}
        getUserList={getDepartmentUser}
        onSetDepartmentUser={setDepartmentUser}
        onCancel={() => changeDepartmentStore({ showAssignUserModal: false })}
        selectedDepartment={selectedDepartment}
      />
    );
  }

  renderAssignStationModal() {
    const { enterpriseName, enterpriseId, allDepartment, DepartmentStation, getDepartmentStation, setDepartmentStation, changeDepartmentStore, selectedDepartment } = this.props;
    return (
      <AssignStationModal
        enterpriseId={enterpriseId}
        enterpriseName={enterpriseName}
        departmentList={allDepartment}
        stationList={DepartmentStation}
        getStationList={getDepartmentStation}
        onSetDepartmentStation={setDepartmentStation}
        onCancel={() => changeDepartmentStore({ showAssignStationModal: false })}
        selectedDepartment={selectedDepartment}
      />
    );
  }

  render() {
    const { pageSize, pageNum, departmentData, selectedDepartment, totalNum, loading, showAssignUserModal, showAssignStationModal } = this.props;
    const { showWarningTip, warningTipText, handleWarningTip, handleTipText, } = this.state;
    const rightHandler = localStorage.getItem('rightHandler');
    const departmentCreateRight = rightHandler && rightHandler.split(',').includes('account_department_create');
    return (
      <div className={styles.departmentList}>
        {showWarningTip && <WarningTip
          onCancel={this.cancelWarningTip}
          onOK={this.onWarningTipOK}
          value={warningTipText}
        />}
        {handleWarningTip && <WarningTip
          onOK={this.handleWarningOK}
          value={handleTipText}
          hiddenCancel={true}
        />}
        <div className={styles.departmentListTop} >
          <div>
            {departmentCreateRight && <Button className={styles.addDepartment} onClick={this.onDepartmentAdd}>
              <Icon type="plus" />
              <span className={styles.text}>部门</span>
            </Button>}
            <div className={styles.handleDepartment}>
              {this._createHandleOption(rightHandler)}
            </div>
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedDepartment.map(e => e.key),
            onChange: this.onRowSelect
          }}
          dataSource={departmentData.map((e, i) => ({ ...e, key: i }))}
          columns={this._createTableColumn()}
          onChange={this.tableChange}
          pagination={false}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedDepartment.length}</span>项</span>
          {selectedDepartment.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>
        {showAssignUserModal && this.renderAssignUserModal()}
        {showAssignStationModal && this.renderAssignStationModal()}
      </div>
    )
  }
}

export default DepartmentTable;
