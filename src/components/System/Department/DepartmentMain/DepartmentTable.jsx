

import React, { Component } from 'react';
import { Table, Button, Select, Icon, Popover } from 'antd';
import CommonPagination from '../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './departmentMain.scss';
import WarningTip from '../../../Common/WarningTip';

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
    ascend: PropTypes.bool, 
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,

    totalNum: PropTypes.number,
    departmentData: PropTypes.array,
    selectedDepartment: PropTypes.array,//选中部门
    getDepartmentList: PropTypes.func,
    getDepartmentDetail: PropTypes.func,
    deleteDepartment: PropTypes.func,
    changeDepartmentStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      showAssignUser: false,
      showAssignStation: false,
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
      ascend: this.props.ascend, 
      pageNum: currentPage,
      pageSize,
    })
  }
  onRowSelect = (selectedRowKeys, selectedRows) => {//行选择
    this.props.changeDepartmentStore({
      selectedDepartment:selectedRows
    })
  }
  onWarningTipOK = () => {//删除部门，todo
    const { selectedDepartment,deleteDepartment } = this.props;
    deleteDepartment(selectedDepartment.map(e=>e.departmentId))
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
    const ascend = sorter.order==='ascend';
    this.props.getDepartmentList({
      enterpriseId: this.props.enterpriseId,
      departmentSource: this.props.departmentSource,
      departmentName: this.props.departmentName, 
      parentDepartmentName: this.props.parentDepartmentName, 
      stationName: this.props.stationName, 
      sort, 
      ascend, 
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
  departmentHandle = (value) => {//--todo编辑，删除，分配用户/电站
    const { selectedDepartment } = this.props;
    console.log(selectedDepartment)
    if(value==='edit'){
      this.props.changeDepartmentStore({
        showPage: 'edit',
        departmentDetail: selectedDepartment[0],
      });
    }else if(value==='delete'){//信息提示栏
      // let departmentRelation = selectedDepartment.map(e=>e.relation)     //todo=>根据选中电站确定警告弹出框文字
      this.setState({
        showWarningTip: true,
        warningTipText: '删除后，将取消成员关联！'
      })
    }else if(value === 'assignUser'){
      this.setState({
        showAssignUser: true,
      })
    }else if(value === 'assignStation'){
      this.setState({
        showAssignStation: true,
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
    return (<Select onChange={this.departmentHandle} placeholder={'操作'} dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
      <Option value="edit" disabled={!editable} >编辑</Option>
      <Option value="delete" disabled={!deletable} >删除</Option>
      <Option value="assignUser" disabled={!userAssignable} >分配用户</Option>
      <Option value="assignStation" disabled={!staionAssignable} >设置电站</Option>
    </Select>)
  }
  _createTableColumn = () => {//生成表头
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'departmentName',
        key: 'departmentName',
        render: (text,record,index) => (<a href={'javascript:void(0);'} onClick={()=>this.showDepartmentDetail(record)} >{text}</a>)
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
            const content = stations.map(e=>(<div>{e}</div>)) 
            return (<span className={styles.stationColumn}>
              <span>{stations[0]}</span>
              <Popover content={content} title={`${departmentName}负责电站`} >
                <span className={styles.others}>···</span>
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

  render(){
    const { departmentData, selectedDepartment, totalNum, loading } = this.props;
    const { showWarningTip, showAssignUser, showAssignStation,warningTipText } = this.state;
    return (
      <div className={styles.departmentList}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.onWarningTipOK} value={warningTipText} />}
        {showAssignUser && null}
        {showAssignStation && null}
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
          <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>
        </div>
      </div>
    )
  }
}

export default DepartmentTable;
