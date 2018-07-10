

import React, { Component } from 'react';
import { Table, Button, Select, Icon } from 'antd';
import CommonPagination from '../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './enterprise.scss';

const { Option } = Select;

class EnterpriseTable extends Component {
  static propTypes = {
    enterpriseList: PropTypes.array,
    selectedEnterprise: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  onPaginationChange = ({currentPage,pageSize}) => {
    console.log(currentPage,pageSize)
  }

  tableChange = (params) => {
    console.log(params);
  }

  enterpriseHandle = (value) => {
    console.log(value);
  }

  render(){
    const { enterpriseList, selectedEnterprise } = this.props;
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
    const total = 54;
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
          <CommonPagination total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          rowSelection={rowSelection}
          dataSource={enterpriseList} 
          columns={columns} 
          onChange={this.tableChange}
          pagination={false}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{total}</span>项</span>
          <span className={styles.cancel}>取消选中</span>
        </div>
      </div>
    )
  }
}

export default EnterpriseTable;
