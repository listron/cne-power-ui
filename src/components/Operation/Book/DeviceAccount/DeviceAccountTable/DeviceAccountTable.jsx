import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import DeviceDetailsTable from './DeviceDetailsTable/DeviceDetailsTable';
import CneTable from '../../../../Common/Power/CneTable';
import styles from './deviceAccountTable.scss';

export default class DeviceAccountTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    deviceAccountList: PropTypes.object,
    getDeviceAccountList: PropTypes.func,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    regionName: PropTypes.string,
    stationCodes: PropTypes.array,
    manufactorId: PropTypes.string,
    modeId: PropTypes.string,
    getDeviceAttachments: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      detailsFlag: false,
    };
  }

  // 关闭弹窗
  onCancelFunc = () => {
    this.setState({
      detailsFlag: false,
    });
  };

  // 详情
  onShowDetail = (data) => {
    const { modeId, assetsId } = data;
    const { getDeviceAttachments } = this.props;
    // 参数
    const params = {
      modeId,
      assetsId: '0,52,53,519822824199680',
      orderField: '',
      orderMethod: '',
      pageNum: 1,
      pageSize: 10,
    };
    this.setState({
      detailsFlag: true,
    }, () => {
      // 接口
      getDeviceAttachments(params);
    });
  };

  // 排序
  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const {
      getDeviceAccountList,
      regionName,
      stationCodes,
      manufactorId,
      modeId,
      pageNum,
      pageSize,
    } = this.props;
    const { field, order } = sorter;
    // 匹配排序字段
    const sortField = {
      assetsName: '1',
      deviceModeName: '2',
      num: '3',
      manufactorName: '4',
      madeNames: '5',
    };
    const params = {
      regionName,
      stationCodes,
      manufactorId,
      modeId,
      orderField: field ? sortField[field] : '',
      orderMethod: order === 'ascend' ? (field ? 'asc' : '') : (field ? 'desc' : ''),
      pageNum,
      pageSize,
    };
    // 接口
    getDeviceAccountList(params);
  };

  render() {
    const { detailsFlag } = this.state;
    const { orderField, orderMethod } = this.props;
    const {
      loading,
      deviceAccountList: {
        dataList,
      } } = this.props;
    const columns = [{
      title: '资产名称',
      dataIndex: 'assetsName',
      sorter: true,
      width: '14%',
      textAlign: 'left',
      render: (assetsName) => <div className={styles.assetsName} title={assetsName}>{assetsName}</div>,
    }, {
      title: '设备型号',
      dataIndex: 'deviceModeName',
      sorter: true,
      textAlign: 'left',
      width: '16%',
      render: (deviceModeName) => <div className={styles.deviceModeName} title={deviceModeName}>{deviceModeName}</div>,
    }, {
      title: '设备数量',
      dataIndex: 'num',
      sorter: true,
      textAlign: 'right',
      width: '9%',
    }, {
      title: '厂家',
      dataIndex: 'manufactorName',
      sorter: true,
      textAlign: 'left',
      width: '20%',
      render: (manufactorName) => <div className={styles.manufactorName} title={manufactorName}>{manufactorName}</div>,
    }, {
      title: '制造商',
      sorter: true,
      dataIndex: 'madeNames',
      textAlign: 'left',
      width: '16%',
      render: (madeNames) => <div className={styles.madeNames} title={madeNames}>{madeNames && madeNames.length > 0 ? madeNames.join(',') : '--'}</div>,
    }, {
      title: '供货商',
      dataIndex: 'supplierNames',
      textAlign: 'left',
      width: '16%',
      render: (supplierNames) => <div className={styles.supplierNames} title={supplierNames}>{supplierNames && supplierNames.length > 0 ? supplierNames.join(',') : '--'}</div>,
    }, {
      title: '查看备品备件',
      align: 'center',
      textAlign: 'left',
      width: '10%',
      render: (text, record) => <i className={`iconfont icon-look ${styles.look}`} onClick={() => { this.onShowDetail(record); }} />,
    }];
    return (
      <div className={styles.DeviceAccountTable}>
        <CneTable
          columns={columns}
          dataSource={dataList}
          rowKey={(record, index) => (record.modeId + index) || 'key'}
          pagination={false}
          loading={loading}
          // dataError={diagnoseListError}
          sortField={['assetsName', 'deviceModeName', 'num', 'manufactorName', 'madeNames'][orderField - 1]}
          sortMethod={{ 'asc': 'ascend', 'desc': 'descend' }[orderMethod]}
          onChange={this.tableChange}
        />
        <DeviceDetailsTable onCancelFunc={this.onCancelFunc} detailsFlag={detailsFlag} {...this.props} />
      </div>
    );
  }
}
