import React, { Component } from 'react';
import styles from './deviceManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';

class DeviceManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    deviceList: PropTypes.array,
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
      sortField: sorter.field,
      sortMethod: sorter.order==='ascend'?'asc':'desc',
    })
  }

  render() {
    const deviceListColumn = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
      },{
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
      },{
        title: '设备型号',
        dataIndex: 'deviceModeName',
        key: 'deviceModeName',
        sorter: true,
      },{
        title: '生产厂商',
        dataIndex: 'producerName',
        key: 'producerName',
      },{
        title: '关联设备',
        dataIndex: 'connectDeviceName',
        key: 'connectDeviceName',
        sorter: true,
      },{
        title: '装机容量',
        dataIndex: 'deviceCapacity',
        key: 'deviceCapacity',
        sorter: true,
      },{
        title: '是否显示',
        dataIndex: 'enableDisplay',
        key: 'enableDisplay',
        sorter: true,
        render: (text, record) => record.enableDisplay?'是':'否'
      },
    ];
    const { loading, deviceList } = this.props;
    return (
      <div className={styles.deviceManageList}>
        <Table
          loading={loading}
          onChange={this.tableChange}
          columns={deviceListColumn}
          dataSource={deviceList.map((e,i)=>({key: i,...e}))}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
    );
  }
}

export default DeviceManageList;
