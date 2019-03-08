import React, { Component } from 'react';
import styles from './deviceManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';

class DeviceManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    deviceList: PropTypes.array,
    getDeviceList: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  onSelectChange = (keys, record) => {
    console.log('record:',record);
    this.props.changeDeviceManageStore({
      selectedRowData:record,
      selectedRowKeys:keys,
    })
  }
  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getDeviceList, queryParams } = this.props;
    const { field, order } = sorter;
    getDeviceList({
      ...queryParams,
      sortField: field?field:'',
      sortMethod: order?(sorter.order==='ascend'?'1':'2'):'',
    })
  }
  showDeviceDetail=(record)=>{
    this.props.getStationDeviceDetail({
      deviceFullCode: record.deviceFullCode,
      selectedStationIndex:record.key,
    })
    this.props.changeDeviceManageStore({showPage:'detail'})
  }
  showDeviceEdit=(record)=>{
    this.props.changeDeviceManageStore({showPage:'edit'})
    this.props.getStationDeviceDetail({
      deviceFullCode: record.deviceFullCode,
      selectedStationIndex:record.key,
    })
  }
  render() {
    const {selectedRowKeys} = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const deviceListColumn = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
      render: (text, record) =>(<span className={styles.deviceNameStyle} onClick={()=>this.showDeviceDetail(record)} >{text}</span>)
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
        render: text=>(<span>{parseInt(text) >= 0 ?`${text}kW`:'--'}</span>),
        sorter: true,
      },{
        title: '是否显示',
        dataIndex: 'enableDisplay',
        key: 'enableDisplay',
        sorter: true,
        render: (text, record) => record.enableDisplay?'是':'否'
      },{
        title: '编辑',
        dataIndex: 'edit',
        key: 'edit',
        render: (text, record) =>  (<span style={{ marginRight: '4px' }} title="编辑" className="iconfont icon-edit" onClick={()=>this.showDeviceEdit(record)}></span>)
      }
    ];
    const { loading, deviceList } = this.props;
    return (
      <div className={styles.deviceManageList}>
        <Table
          loading={loading}
          onChange={this.tableChange}
          rowSelection={rowSelection}
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
