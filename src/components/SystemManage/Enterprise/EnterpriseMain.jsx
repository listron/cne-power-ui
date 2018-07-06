

import React, { Component } from 'react';
import { Radio , Table } from 'antd';
import PropTypes from 'prop-types';
import EnterpriseSearch from './EnterpriseSearch'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class EnterpriseMain extends Component {
  static propTypes = {
    enterpriseList: PropTypes.array,
    selectedEnterprise: PropTypes.array,
  }

  constructor(props){
    super(props);
  }

  selectStatus = (e) => {
    console.log(e.target.value)
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
          <div>
            <span>状态</span>
            <RadioGroup onChange={this.selectStatus}>
              <RadioButton value={0}>全部</RadioButton>
              <RadioButton value={1}>启用</RadioButton>
              <RadioButton value={2}>禁用</RadioButton>
            </RadioGroup>
          </div>
          <EnterpriseSearch />
          这个是啥？
          <Table 
            rowSelection={rowSelection}
            dataSource={enterpriseList} 
            columns={columns} 
            onChange={this.tableChange}
            pagination={null}
          />
      </div>
    )
  }
}

export default EnterpriseMain;
