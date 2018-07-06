

import React, { Component } from 'react';
import { Table, Button, Select, Pagination } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

class EnterpriseTable extends Component {
  static propTypes = {
    enterpriseList: PropTypes.array,
    selectedEnterprise: PropTypes.array,
  }

  constructor(props){
    super(props);
  }
  tableChange = (params) => {
    console.log(params);
  }
  changePageSize = (value) => {
    console.log(value);
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
    return (
      <div>
        <div>
          <Button>添加企业</Button>
          <Select onChange={this.enterpriseHandle} style={{width:'100px'}} placeholder={'操作'}>
            <Option value="edit">编辑</Option>
            <Option value="open">启用</Option>
            <Option value="close">禁用</Option>
          </Select>
          <span>合计：54</span>
          <span>每页：</span>
          <Select onChange={this.changePageSize} style={{width:'100px'}} placeholder={'10'}>
            <Option value={10} >10</Option>
            <Option value={20} >20</Option>
            <Option value={50} >50</Option>
          </Select>
          <Pagination simple defaultCurrent={2} total={50} />
        </div>
        <Table 
          rowSelection={rowSelection}
          dataSource={enterpriseList} 
          columns={columns} 
          onChange={this.tableChange}
          pagination={false}
        />
      </div>
    )
  }
}

export default EnterpriseTable;
