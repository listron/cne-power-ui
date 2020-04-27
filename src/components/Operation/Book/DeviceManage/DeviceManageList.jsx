import React, { Component } from 'react';
import styles from './deviceManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import WarningTip from '../../../Common/WarningTip';
import { handleRight } from '@utils/utilFunc';
import CneTable from '../../../Common/Power/CneTable/index';

class DeviceManageList extends Component {
  static propTypes = {
    tableloading: PropTypes.bool,
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
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      deviceRecord: {},
      showDeleteWarning: false,
      warningTipText: '确定要删除选中设备信息?',
    };
  }

  onSelectChange = (keys, record) => {
    this.props.changeDeviceManageStore({
      selectedRowData: record,
      selectedRowKeys: keys,
    });
  };

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getDeviceList, queryParams, sortField, sortMethod } = this.props;
    const { field, order } = sorter;
    let newSortField = sortField, newSortMethod = '2';
    if (!field || field === sortField) {
      newSortMethod = sortMethod === '1' ? '2' : '1';
    } else {
      newSortField = field;
    }
    getDeviceList({
      ...queryParams,
      sortField: newSortField,
      sortMethod: newSortMethod,
    });
  };

  showDeviceDetail = record => {
    const {
      orderField,
      orderMethod,
      getStationDeviceDetail,
      changeDeviceManageStore,
      getDevicePartInfo,
    } = this.props;
    getStationDeviceDetail({
      deviceFullCode: record.deviceFullCode,
      selectedStationIndex: record.key,
    });
    changeDeviceManageStore({ showPage: 'detail' });
    getDevicePartInfo({
      deviceFullcode: record.deviceFullCode,

    });
  };

  showDeviceEdit = record => {
    this.props.changeDeviceManageStore({ showPage: 'edit' });
    this.props.getStationDeviceDetail({
      deviceFullCode: record.deviceFullCode,
      selectedStationIndex: record.key,
    });
    this.props.getConnectDevice({
      stationCode: this.props.stationCode,
      deviceTypeCode: record.deviceTypeCode,
    });
    this.props.getPvDevice({
      deviceTypeCode: '509',
    });
  };

  deleteDevice = record => {
    this.setState({ showDeleteWarning: true, deviceRecord: record });
  };

  cancelWarningTip = () => {
    this.setState({ showDeleteWarning: false });
  };

  confirmWarningTip = () => {
    const { deleteDevice } = this.props;
    const { deviceRecord } = this.state;
    const deviceFullcodes = deviceRecord.deviceFullCode;
    deleteDevice({ deviceFullcodes: [deviceFullcodes] });
    this.setState({ showDeleteWarning: false });
  };

  render() {
    const { selectedRowKeys, sortField, sortMethod } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const deviceHandleRight = handleRight('book_operateDevice');
    const deviceBaseColumn = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        sorter: true,
        width: '15%',
        textAlign: 'left',
        render: (text, record) => (
          <div className={styles.deviceNameStyle} onClick={() => this.showDeviceDetail(record)} > {text} </div>
        ),
      },
      {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        sorter: true,
        width: '15%',
        textAlign: 'left',
        render: (text) => <div className={styles.deviceTypeName} title={text || '--'}>{text || '--'}</div>,
      },
      {
        title: '设备型号',
        dataIndex: 'deviceModeName',
        sorter: true,
        width: '15%',
        textAlign: 'left',
        render: (text) => <div className={styles.deviceModeName} title={text || '--'}>{text || '--'}</div>,
      },
      {
        title: '厂家',
        dataIndex: 'producerName',
        sorter: true,
        width: '15%',
        textAlign: 'left',
        render: (text) => <div className={styles.producerName} title={text || '--'}>{text || '--'}</div>,
      },
      {
        title: '制造商',
        dataIndex: 'madeName',
        sorter: true,
        width: '15%',
        textAlign: 'left',
        render: (text) => <div className={styles.madeName} title={text || '--'}>{text || '--'}</div>,
      },
      {
        title: '供货商',
        dataIndex: 'supplierName',
        sorter: true,
        width: '15%',
        textAlign: 'left',
        render: (text) => <div className={styles.supplierName} title={text || '--'}>{text || '--'}</div>,
      },
    ];
    const deviceListColumn = deviceHandleRight ? deviceBaseColumn.concat({
      title: '操作',
      dataIndex: 'edit',
      key: 'edit',
      width: '10%',
      render: (text, record) => {
        return (
          <div className={styles.editStyle}>
            {record.deviceTypeCode === '509' ? (<span title="编辑" className={`iconfont icon-edit ${styles.noEdit}`} />)
              : (<span title="编辑" className={`iconfont icon-edit ${styles.edit}`} onClick={() => this.showDeviceEdit(record)} />)}
            <span
              title="删除"
              className={`iconfont icon-del ${styles.del}`}
              onClick={() => this.deleteDevice(record)}
            />
          </div>
        );
      },
    }) : deviceBaseColumn;
    const { tableloading, deviceList } = this.props;
    const { showDeleteWarning, warningTipText } = this.state;
    return (
      <div className={styles.deviceManageList}>
        {showDeleteWarning && (
          <WarningTip
            onCancel={this.cancelWarningTip}
            onOK={this.confirmWarningTip}
            value={warningTipText}
          />
        )}
        <CneTable
          loading={tableloading}
          dataSource={deviceList.map((e, i) => ({ key: i, ...e }))}
          columns={deviceListColumn}
          pagination={false}
          onChange={this.tableChange}
          rowSelection={rowSelection}
          sortField={sortField}
          sortMethod={['ascend', 'descend'][sortMethod]}
        />
      </div>
    );
  }
}

export default DeviceManageList;
