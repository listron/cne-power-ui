

import React, { Component } from 'react';
import { Table, Button, Select, Icon } from 'antd';
import CommonPagination from '../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './enterpriseList.scss';

const { Option } = Select;

class EnterpriseTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    totalNum: PropTypes.number,
    enterpriseData: PropTypes.array,
    selectedEnterprise: PropTypes.array,//勾选的数组
    getEnterpriseList: PropTypes.func,
    getEnterpriseDetail: PropTypes.func,
    changeEnterpriseAttr: PropTypes.func,

    filterStatus: PropTypes.number, 
    enterpriseName: PropTypes.string, 
    enterprisePhone: PropTypes.string,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    currentPage: PropTypes.number, 
    pageSize: PropTypes.number, 
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  onPaginationChange = ({currentPage,pageSize}) => {//分页器
    const {enterpriseName,sort,ascend,enterprisePhone,filterStatus} = this.props;
    this.props.getEnterpriseList({
      enterpriseName,
      enterprisePhone,
      sort,
      ascend,
      currentPage,
      pageSize,
      filterStatus
    });
  }

  onRowSelect = (selectedRowKeys, selectedRows) => {
    this.props.changeEnterpriseAttr({
      selectedEnterprise:selectedRows
    })
  }
  cancelRowSelect = () => {
    this.props.changeEnterpriseAttr({
      selectedEnterprise:[]
    })
  }

  tableChange = (pagination,filter,sorter) => {//排序，筛选
    const {enterpriseName,enterprisePhone,currentPage,pageSize,filterStatus} = this.props;
    const sort = sorter.field;
    const ascend = sorter.order==='ascend';
    this.props.getEnterpriseList({
      enterpriseName,
      enterprisePhone,
      sort,
      ascend,
      currentPage,
      pageSize,
      filterStatus
    });
  }
  showEnterpriseDetail = (record) => {
    console.log(record);
    const { enterpriseId } = record;
    this.props.changeEnterpriseAttr({
      showPage: 'detail',
    })
    this.props.getEnterpriseDetail({
      enterpriseId
    })
  }
  enterpriseHandle = (value) => {//编辑，禁用，启用
    console.log(value);
    // const { selectedEnterprise } = this.props;
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
  _createHandleOption = () => {//生成操作下拉框
    const { selectedEnterprise } = this.props;
    let [editable,openable,closeable] = [true,true,true];  
    if(selectedEnterprise.length > 0){
      editable = selectedEnterprise.length === 1;
      const statusSet = new Set(selectedEnterprise.map(e => e.enterpriseStatus));
      const statusArray = [...statusSet];
      if(statusArray.length > 1){
        openable = false;
        closeable = false;
      }else if(statusArray.length === 1){
        openable = statusArray[0]===0;
        closeable = statusArray[0]===1;
      }
    }       
    return (<Select onChange={this.enterpriseHandle} placeholder={'操作'} dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
      <Option value="edit" disabled={!editable} >编辑</Option>
      <Option value="open" disabled={!openable} >启用</Option>
      <Option value="close" disabled={!closeable} >禁用</Option>
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
    const { enterpriseData, selectedEnterprise, totalNum, loading } = this.props;
    return (
      <div className={styles.enterpriseList}>
        <div className={styles.enterpriseListTop} >
          <div>
            <Button className={styles.addEnterprise}>
              <Icon type="plus" />
              <span className={styles.text}>企业</span>
            </Button>
            <div className={styles.handleEnterprise}>
              {this._createHandleOption()}
            </div>
          </div>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
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
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedEnterprise.length}</span>项</span>
          <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>
        </div>
      </div>
    )
  }
}

export default EnterpriseTable;
