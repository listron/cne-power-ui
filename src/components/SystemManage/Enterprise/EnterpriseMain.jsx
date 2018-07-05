

import React, { Component } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

class EnterpriseMain extends Component {
  static propTypes = {
    enterpriseList: PropTypes.array,
    selectedEnterprise: PropTypes.array,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { enterpriseList } = this.props;
    let { selectedEnterprise } = this.props;
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
      }, {
        title: '企业电话',
        dataIndex: 'stationPhone',
        key: 'stationPhone',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true
      }, {
        title: '查看',
        dataIndex: 'handle',
        key: 'handle',
      }
    ];
    return (
      <div>
          这个是啥？
          <Table 
            rowSelection={rowSelection}
            dataSource={enterpriseList} 
            columns={columns} 
            onChange={this.tableChange}
          />
      </div>
    )
  }
}

export default EnterpriseMain;
