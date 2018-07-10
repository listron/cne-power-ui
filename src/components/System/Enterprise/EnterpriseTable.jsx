

import React, { Component } from 'react';
import { Table, Button, Select, Icon } from 'antd';
import CommonPagination from '../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';

const { Option } = Select;

class EnterpriseTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    totalEnterprise: PropTypes.number,
    enterpriseList: PropTypes.array,
    selectedEnterprise: PropTypes.array,//勾选的数组
    getEnterpriseList: PropTypes.func,
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

  enterpriseHandle = (value) => {
    console.log(value);
  }

  render(){
    const { enterpriseList, selectedEnterprise, totalEnterprise, loading } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedEnterprise,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
      }
    };
    const columns = [
      {
        title: '企业名称',
        dataIndex: 'stationName',
        key: 'stationName',
        render: (text,record,index) => (<a href={'javascript:void(0);'}>{text}</a>)
      }, {
        title: '企业电话',
        dataIndex: 'stationPhone',
        key: 'stationPhone',
        render: (text,record,index) => (<span>{text}</span>)
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
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
    return (
      <div className={styles.enterpriseList}>
        <div className={styles.enterpriseListTop} >
          <div>
            <Button className={styles.addEnterprise}>
              <Icon type="plus" />
              <span className={styles.text}>企业</span>
            </Button>
            <div className={styles.handleEnterprise}>
              <Select onChange={this.enterpriseHandle} placeholder={'操作'} dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
                <Option value="edit" disabled={true}>编辑</Option>
                <Option value="open">启用</Option>
                <Option value="close">禁用</Option>
              </Select>
            </div>
          </div>
          <CommonPagination total={totalEnterprise} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          loading={loading}
          rowSelection={rowSelection}
          dataSource={enterpriseList} 
          columns={columns} 
          onChange={this.tableChange}
          pagination={false}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{totalEnterprise}</span>项</span>
          <span className={styles.cancel}>取消选中</span>
        </div>
      </div>
    )
  }
}

export default EnterpriseTable;
