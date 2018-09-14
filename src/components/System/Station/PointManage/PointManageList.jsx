import React, { Component } from 'react';
import styles from './pointManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';

class PointManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    pointList: PropTypes.array,
    getStationList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getStationList, queryParams } = this.props;
    getStationList({
      ...queryParams,
      orderField: sorter.field,
      orderType: sorter.order==='ascend'?0:1,
    })
  }

  render() {
    const pointListColumn = [
      {
        title: '测点编号',
        dataIndex: 'deviceName',
        key: 'deviceName',
      },{
        title: '点号描述',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
      },{
        title: '第三方测点名称',
        dataIndex: 'deviceModeName',
        key: 'deviceModeName',
        sorter: true,
      },{
        title: '英文名称',
        dataIndex: 'producerName',
        key: 'producerName',
        sorter: true,
      },{
        title: '分组名称',
        dataIndex: 'connectDeviceName',
        key: 'connectDeviceName',
      },{
        title: '数据类型',
        dataIndex: 'deviceCapacity',
        key: 'deviceCapacity',
        sorter: true,
      },{
        title: '测点类型',
        dataIndex: 'pointType',
        key: 'pointType',
        sorter: true,
      },{
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },{
        title: '系数',
        dataIndex: 'ratio',
        key: 'ratio',
      },{
        title: '点小数位',
        dataIndex: 'decimalNumber',
        key: 'decimalNumber',
      },
    ];
    const { loading, pointList } = this.props;
    return (
      <div className={styles.pointManageList}>
        <Table
          loading={loading}
          onChange={this.tableChange}
          columns={pointListColumn}
          dataSource={pointList.map((e,i)=>({key: i,...e}))}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
    );
  }
}

export default PointManageList;
