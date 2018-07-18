

import React, { Component } from 'react';
import { Table, Button, Select, Icon } from 'antd';
import CommonPagination from '../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './departmentMain.scss';

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
    // enterpriseData: PropTypes.array,
    selectedDepartment: PropTypes.array,//选中部门
    getDepartmentList: PropTypes.func,
    // getEnterpriseDetail: PropTypes.func,
    changeDepartmentStore: PropTypes.func,

    // filterStatus: PropTypes.number, 
    // enterpriseName: PropTypes.string, 
    // enterprisePhone: PropTypes.string,
    // sort: PropTypes.string, 
    // ascend: PropTypes.bool,
    // currentPage: PropTypes.number, 
    // pageSize: PropTypes.number, 
  }

  constructor(props){
    super(props);
    this.state = {
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

  onRowSelect = (selectedRowKeys, selectedRows) => {
    // this.props.changeEnterpriseStore({
    //   selectedEnterprise:selectedRows
    // })
  }
  cancelRowSelect = () => {
    this.props.changeDepartmentStore({
      selectedDepartment:[]
    })
  }

  tableChange = (pagination,filter,sorter) => {//排序，筛选
    // const {enterpriseName,enterprisePhone,currentPage,pageSize,filterStatus} = this.props;
    // const sort = sorter.field;
    // const ascend = sorter.order==='ascend';
    // this.props.getEnterpriseList({
    //   enterpriseName,
    //   enterprisePhone,
    //   sort,
    //   ascend,
    //   currentPage,
    //   pageSize,
    //   filterStatus
    // });
  }
  showEnterpriseDetail = (record) => {
    // console.log(record);
    // const { enterpriseId } = record;
    // this.props.changeEnterpriseStore({
    //   showPage: 'detail',
    // })
    // this.props.getEnterpriseDetail({
    //   enterpriseId
    // })
  }
  departmentHandle = (value) => {//编辑，删除，分配用户/电站
    console.log(value);
    // const { selectedDepartment } = this.props;
    // if(value === 'edit'){
    //   this.props.editEnterprise({
    //     key: selectedEnterprise[0].key
    //   })
    // }else{
    //   this.props.handleEnterprise({
    //     keys:selectedEnterprise.map(e=>e.key),
    //     handle: value
    //   })
    // }
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
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
        render: (text,record,index) => (<a href={'javascript:void(0);'} onClick={()=>this.showEnterpriseDetail(record)} >{text}</a>)
      }, {
        title: '企业电话',
        dataIndex: 'enterpriseNum',
        key: 'enterpriseNum',
        render: (text,record,index) => (<span>{text}</span>)
      }, {
        title: '状态',
        dataIndex: 'enterpriseStatus',
        key: 'enterpriseStatus',
        render: (text,record) => (<span>{text===0?'否':'是'}</span>),
        sorter: true
      }, {
        title: '查看',
        dataIndex: 'handle',
        key: 'handle',
        render: (text,record)=>(
          <span>
            <span>部门</span>
            <span>成员</span>
            <span>角色</span>
            <span>电站</span>
          </span>
        )
      }
    ];
    return columns
  }

  render(){
    const { enterpriseData, selectedDepartment, totalNum, loading } = this.props;
    return (
      <div className={styles.departmentList}>
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
        表格组件
        {/* 
        <Table 
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedEnterprise.map(e=>e.key),
            onChange: this.onRowSelect
          }}
          dataSource={enterpriseData.map((e,i)=>({...e,key:i}))} 
          columns={this._createTableColumn()} 
          onChange={this.tableChange}
          pagination={false}
        />
         */}
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedDepartment.length}</span>项</span>
          <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>
        </div>
      </div>
    )
  }
}

export default DepartmentTable;
