import React, { Component } from 'react';
import styles from './deviceManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import WarningTip from '../../../Common/WarningTip';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';

class DeviceManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    deviceList: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    getDeviceList: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
    getStationDeviceDetail: PropTypes.func,
    deleteDevice: PropTypes.func,
    getDevicePartInfo: PropTypes.func,
    getConnectDevice: PropTypes.func,
    getPvDevice: PropTypes.func,
    orderMethod: PropTypes.string,
    orderField: PropTypes.string,
 
  }
  constructor(props) {
    super(props);
    this.state = {
      deviceRecord: {},
      showDeleteWarning: false,
      warningTipText: '确定要删除选中设备信息?'
    }
  }

  onSelectChange = (keys, record) => {
    this.props.changeDeviceManageStore({
      selectedRowData: record,
      selectedRowKeys: keys,
    })
  }

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getDeviceList, queryParams } = this.props;
    const { field, order } = sorter;
    getDeviceList({
      ...queryParams,
      sortField: field ? field : '',
      sortMethod: order ? (sorter.order === 'ascend' ? '1' : '2') : '',
    })
  }

  showDeviceDetail = (record) => {
    const { orderField, orderMethod, getStationDeviceDetail, changeDeviceManageStore, getDevicePartInfo } = this.props;
    getStationDeviceDetail({
      deviceFullCode: record.deviceFullCode,
      selectedStationIndex: record.key,
    })
    changeDeviceManageStore({ showPage: 'detail' })
    getDevicePartInfo({
      deviceFullcode: record.deviceFullCode,
      orderField,
      orderMethod,
    })
  }
  showDeviceEdit = (record) => {

    this.props.changeDeviceManageStore({ showPage: 'edit' })
    this.props.getStationDeviceDetail({
      deviceFullCode: record.deviceFullCode,
      selectedStationIndex: record.key,
    })
    this.props.getConnectDevice({
      stationCode: this.props.stationCode,
      deviceTypeCode: record.deviceTypeCode,
    })
    this.props.getPvDevice({
      deviceTypeCode: '509',
    })

  }
  deleteDevice = (record) => {
    this.setState({ showDeleteWarning: true, deviceRecord: record });
  }
  cancelWarningTip = () => {
    this.setState({ showDeleteWarning: false })
  }
  confirmWarningTip = () => {
    const { deleteDevice } = this.props;
    const { deviceRecord } = this.state;
    const deviceFullcodes = deviceRecord.deviceFullCode;
    deleteDevice({ deviceFullcodes: [deviceFullcodes] })
    this.setState({ showDeleteWarning: false })
  }

  render() {
    const { selectedRowKeys } = this.props;
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
        render: (text, record) => (<span className={styles.deviceNameStyle} onClick={() => this.showDeviceDetail(record)} >{text}</span>)
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
      }, {
        title: '设备型号',
        dataIndex: 'deviceModeName',
        key: 'deviceModeName',
        sorter: true,
      }, {
        title: '厂家',
        dataIndex: 'producerName',
        key: 'producerName',
        sorter: true,
      }, {
        title: '制造商',
        dataIndex: 'madeName',
        key: 'madeName',
        sorter: true,
        render(text) { return text ? text : '--' },
      }, {
        title: '供货商',
        dataIndex: 'supplierName',
        key: 'supplierName',
        sorter: true,
        render(text) { return text ? text : '--' },
      },
      //  {
      //   title: '生产厂商',
      //   dataIndex: 'producerName',
      //   key: 'producerName',
      // }, {
      //   title: '关联设备',
      //   dataIndex: 'connectDeviceName',
      //   key: 'connectDeviceName',
      //   sorter: true,
      // }, {
      //   title: () => <TableColumnTitle title="装机容量" unit="kW" />,
      //   dataIndex: 'deviceCapacity',
      //   key: 'deviceCapacity',
      //   render(text) { return numWithComma(text); },
      //   sorter: true,
      // }, {
      //   title: '是否显示',
      //   dataIndex: 'enableDisplay',
      //   key: 'enableDisplay',
      //   sorter: true,
      //   render: (text, record) => record.enableDisplay ? '是' : '否'
      // }, 
      {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render: (text, record) => {
          return (
            <div className={styles.editStyle}>
              {record.deviceTypeCode === '509' ? <span style={{ cursor: 'not-allowed', color: '#f5f5f5' }} title="编辑" className="iconfont icon-edit"></span> : <span className={styles.edit} title="编辑" style={{ cursor: 'pointer' }} className="iconfont icon-edit" onClick={() => this.showDeviceEdit(record)}></span>}
              <span title="删除" className="iconfont icon-del" onClick={() => this.deleteDevice(record)}></span>
            </div>
          )
        }
      }
    ];
    const { loading, deviceList } = this.props;
    const { showDeleteWarning, warningTipText } = this.state;
    return (
      <div className={styles.deviceManageList}>
        {showDeleteWarning && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <Table
          loading={loading}
          onChange={this.tableChange}
          rowSelection={rowSelection}
          columns={deviceListColumn}
          dataSource={deviceList.map((e, i) => ({ key: i, ...e }))}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default DeviceManageList;
