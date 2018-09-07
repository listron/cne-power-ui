

import React, { Component } from 'react';
import { Input, Button, Icon, Table } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import stationManageTableColumn from './stationManageTableColumn';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';


class StationManageTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    stationList: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {

    }
  }

  onStationAdd = () => {
    console.log('add 电站')
  }

  onPaginationChange = (...rest) => {
    console.log(rest)
  }

  downloadTemplet = () => {
    console.log('down load templet')
  }

  tableChange = (pagination,filter,sorter) => {//部门排序
    const sort = sorter.field;
    const ascend = sorter.order==='ascend'?'0':'1';
    console.log(sort, ascend);
    // this.props.getDepartmentList({
    //   enterpriseId: this.props.enterpriseId,
    //   departmentSource: this.props.departmentSource,
    //   departmentName: this.props.departmentName, 
    //   parentDepartmentName: this.props.parentDepartmentName, 
    //   stationName: this.props.stationName, 
    //   sort:`${sort},${ascend}`, 
    //   pageNum: this.props.pageNum,
    //   pageSize: this.props.pageSize,
    // })
  }

  render(){
    const { loading, stationList } = this.props;
    const column = [
      {
        title: '电站',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        render: (record) => {
          return (
            <span className={styles.stationName}>{record.stationName}</span>
          )
        }
      },
      ...stationManageTableColumn,
      {
        title: '部门设置',
        dataIndex: 'departmentStatus',
        key: 'departmentStatus',
        render: (text, record, index) => {
          return (<span className={styles.setDepartment}>{record.departmentStatus}</span>)
        }
      },{
        title: '操作',
        dataIndex: 'handler',
        key: 'handler',
        render: (text, record, index) => {
          return (<span className={styles.handler}>删除</span>)
        }
      }
    ];
    return (
      <div>
        <div>
          <Button onClick={this.onStationAdd}>
            <Icon type="plus" />
            <span>电站</span>
          </Button>
          <Button onClick={this.downloadTemplet}>下载电站配置模板</Button>
          <CommonPagination total={100} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          loading={loading}
          dataSource={ stationList.map((e, i) => ({...e, key: i})) } 
          columns={column} 
          onChange={this.tableChange}
          pagination={false}
        />
      </div>
    )
  }
}

export default StationManageTable;
