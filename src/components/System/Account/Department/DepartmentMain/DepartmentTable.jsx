

import React, { Component } from 'react';
import { Table, Button, Select, Icon, Popover } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './departmentMain.scss';
import WarningTip from '../../../../Common/WarningTip';
import AssignUserModal from '../AssignUserModal/AssignUserModal';
import AssignStationModal from '../AssignStationModal/AssignStationModal';

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

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      hiddenWarningTipCancelText: false
    }
  }

  onDepartmentAdd = () =>{//进入添加部门页
    this.props.changeDepartmentStore({showPage: 'add'});
  }
  onPaginationChange = ({currentPage,pageSize}) => {//分页器
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
      selectedDepartment:selectedRows
    })
  }
  onWarningTipOK = () => {//删除部门，拒绝编辑部门提示框
    const { selectedDepartment,deleteDepartment } = this.props;
    const selectedDepartmentHasChild = selectedDepartment.map(e=>e.hasChildren).some(e=>!!e);//有子部门不得删除
    const forbiddenDelete = selectedDepartment.some(e=>e.departmentSource === 0); //预设电站不得删除
    this.setState({
      showWarningTip:false,
      hiddenWarningTipCancelText: false
    })
    forbiddenDelete || selectedDepartmentHasChild || deleteDepartment({
      departmentId: selectedDepartment.map(e=>e.departmentId).join(','),
      enterpriseId: this.props.enterpriseId
    });
  }
  cancelRowSelect = () => {//取消行选择
    this.props.changeDepartmentStore({
      selectedDepartment:[]
    })
  }
  cancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip:false
    })
  }
  tableChange = (pagination,filter,sorter) => {//部门排序
    const sort = sorter.field;
    const ascend = sorter.order==='ascend'?'0':'1';
    this.props.getDepartmentList({
      enterpriseId: this.props.enterpriseId,
      departmentSource: this.props.departmentSource,
      departmentName: this.props.departmentName, 
      parentDepartmentName: this.props.parentDepartmentName, 
      stationName: this.props.stationName, 
      sort:`${sort},${ascend}`, 
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
    if(value==='edit'){
      const forbiddenEdit = selectedDepartment.some(e=>e.departmentSource === 0);
      if(forbiddenEdit){
        this.setState({
          showWarningTip: true,
          warningTipText: '不得编辑预设部门!',
          hiddenWarningTipCancelText: true
        })
      }else{
        this.props.changeDepartmentStore({
          showPage: 'edit',
          departmentDetail: selectedDepartment[0],
        });
      }
    }else if(value==='delete'){
      const selectedDepartmentHasChild = selectedDepartment.map(e=>e.hasChildren).some(e=>!!e);
      const selectedDepartmentHasMember = selectedDepartment.map(e=>e.hasMember).some(e=>!!e);
      const forbiddenDelete = selectedDepartment.some(e=>e.departmentSource === 0)
      if(forbiddenDelete){
        this.setState({
          showWarningTip: true,
          warningTipText: '不得删除预设部门!',
          hiddenWarningTipCancelText: true
        })
      }else if(selectedDepartmentHasChild){
        this.setState({
          showWarningTip: true,
          warningTipText: '请先删除子部门!',
          hiddenWarningTipCancelText: true
        })
      }else if(selectedDepartmentHasMember){
        this.setState({
          showWarningTip: true,
          warningTipText: '删除后,将取消成员关联!',
          hiddenWarningTipCancelText: false
        })
      }else{
        this.setState({
          showWarningTip: true,
          warningTipText: '是否确认删除!',
          hiddenWarningTipCancelText: false
        })
      }
      
    }else if(value === 'assignUser'){
      this.props.changeDepartmentStore({
        showAssignUserModal: true,
      })
    }else if(value === 'assignStation'){
      this.props.changeDepartmentStore({
        showAssignStationModal: true,
      })
    }
  }
  _createHandleOption = () => {//部门操作下拉框生成
    const { selectedDepartment } = this.props;
    let [editable, deletable, userAssignable, staionAssignable] = [false,false,false,false];  
    
    if(selectedDepartment.length > 0){
      editable = selectedDepartment.length === 1;
      [deletable, userAssignable, staionAssignable] = [true,true,true];
    }       
    return (<Select onChange={this.departmentHandle} placeholder="操作" value="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.departmentHandleDropdown}>
      <Option value="edit" disabled={!editable} ><span className="iconfont icon-edit"></span>编辑</Option>
      <Option value="delete" disabled={!deletable} ><span className="iconfont icon-remove"></span>删除</Option>
      <Option value="assignUser" disabled={!userAssignable} ><span className="iconfont icon-role"></span>分配用户</Option>
      <Option value="assignStation" disabled={!staionAssignable} ><span className="iconfont icon-powerstation"></span>设置电站</Option>
    </Select>)
  }
  _createTableColumn = () => {//生成表头
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'departmentName',
        key: 'departmentName',
        render: (text,record,index) => (
          <a href={'javascript:void(0);'} className={styles.tableDepartmentName} onClick={()=>this.showDepartmentDetail(record)} >{text}</a>
        )
      }, {
        title: '所属部门',
        dataIndex: 'parentDepartmentName',
        key: 'parentDepartmentName',
      }, {
        title: '预设',
        dataIndex: 'departmentSource',
        key: 'departmentSource',
        render: (text,record) => (<span>{text===0?'是':'否'}</span>),
        sorter: true
      }, {
        title: '负责电站',
        dataIndex: 'stationName',
        key: 'stationName',
        render: (text,record) => {
          let stations = record.stationName.split(',').filter(e=>!!e);
          const { departmentName } = record;
          if(stations.length > 1){
            const content = (<ul>
              {stations.map(e=>(<li key={e} className={styles.eachStation}>
                <span className={styles.square}></span>
                <span>{e}</span>
              </li>))}
            </ul>) 
            return (<span className={styles.stationColumn}>
              <span>{stations[0]}</span>
              <Popover placement="right" content={content}  title={`${departmentName}负责电站`} overlayClassName={styles.responsibleDetails}>
                <Icon className={styles.others} type="ellipsis" />
              </Popover>
            </span>)
          }else{
            return <span>{stations[0]?stations[0]:''}</span>
          }
        }
      }
    ];
    return columns
  }

  renderAssignUserModal() {
    const { userId, enterpriseName, enterpriseId, allDepartment, departmentUser, getDepartmentUser, setDepartmentUser, changeDepartmentStore, selectedDepartment} = this.props;
    return (
      <AssignUserModal
        currentUserId={userId}
        enterpriseId={enterpriseId}
        enterpriseName={enterpriseName}
        departmentList={allDepartment}
        userList={departmentUser}
        getUserList={getDepartmentUser}
        onSetDepartmentUser={setDepartmentUser}
        onCancel={()=>changeDepartmentStore({showAssignUserModal: false})}
        selectedDepartment={selectedDepartment}
      />
    );
  }

  renderAssignStationModal() {
    const { enterpriseName, enterpriseId, allDepartment, DepartmentStation, getDepartmentStation, setDepartmentStation, changeDepartmentStore, selectedDepartment} = this.props;
    return (
      <AssignStationModal
        enterpriseId={enterpriseId}
        enterpriseName={enterpriseName}
        departmentList={allDepartment}
        stationList={DepartmentStation}
        getStationList={getDepartmentStation}
        onSetDepartmentStation={setDepartmentStation}
        onCancel={()=>changeDepartmentStore({showAssignStationModal: false})}
        selectedDepartment={selectedDepartment}
      />
    );
  }

  render(){
    const { departmentData, selectedDepartment, totalNum, loading, showAssignUserModal, showAssignStationModal } = this.props;
    const { showWarningTip, warningTipText, hiddenWarningTipCancelText } = this.state;
    return (
      <div className={styles.departmentList}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.onWarningTipOK} value={warningTipText} hiddenCancel={hiddenWarningTipCancelText} />}
        <div className={styles.departmentListTop} >
          <div>
            <Button className={styles.addDepartment} onClick={this.onDepartmentAdd}>
              <Icon type="plus" />
              <span className={styles.text}>部门</span>
            </Button>
            <div className={styles.handleDepartment}>
              {this._createHandleOption()}
            </div>
          </div>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedDepartment.map(e=>e.key),
            onChange: this.onRowSelect
          }}
          dataSource={departmentData.map((e,i)=>({...e,key:i}))} 
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
