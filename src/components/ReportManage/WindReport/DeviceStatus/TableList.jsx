import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceStatus.scss';
import { Radio } from 'antd';
import CommonPagination from '../../../Common/CommonPagination';
import CneTable from '@components/Common/Power/CneTable';
import { numWithComma, dataFormats } from '../../../../utils/utilFunc';


class TableList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    getDeviceStatusList: PropTypes.func,
    changeDeviceStatusStore: PropTypes.func,
    onChangeFilter: PropTypes.func,
    getDeviceStatusDetail: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    filterTable: PropTypes.number,
    deviceStatusList: PropTypes.array,
    statusDetailList: PropTypes.array,
    tableType: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    params: PropTypes.object,

  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    this.props.changeDeviceStatusStore({ pageNum: currentPage, pageSize });
    this.props.onChangeFilter({ pageNum: currentPage, pageSize });
  }

  ontableSort = (pagination, filter, sorter) => {
    const { onChangeFilter, tableType, sortField, sortMethod } = this.props;
    const { field } = sorter;
    const sortInfo = {
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      date: '4',
      deviceStatusName: '5',
      num: '6',
      statusTime: '7',
      statusHours: '8',
      avgTime: '9',
    };
    const detailSortInfo = {
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      deviceStatusName: '4',
      happenTime: '5',
      statusTime: '6',
      statusHours: '7',
      statusDescribe: '8',
    };
    let newField = sortField, newSort = 'desc';
    const tmpTableField = tableType === 'all' ? sortInfo[field] : detailSortInfo[field];
    if (!field || field === tmpTableField) { // 同列点击
      newSort = sortMethod === 'desc' ? 'asc' : 'desc';
    } else { // 换列排序
      newField = tmpTableField;
    }
    this.props.changeDeviceStatusStore({ sortField: newField, sortMethod: newSort });
    onChangeFilter({ sortField: newField, sortMethod: newSort });
  }

  initMonthColumn = () => {
    const { filterTable } = this.props;
    const filterDevice = [{
      title: '区域',
      dataIndex: 'regionName',
      textAlign: 'left',
      width: '10%',
      render: (text) => <div className={styles.regionNameText} title={text}>{text}</div>,
      sorter: true,
    }, {
      title: '电站名称',
      textAlign: 'left',
      width: '11%',
      dataIndex: 'stationName',
      sorter: true,
      render: (text) => <div className={styles.stationNameText} title={text}>{text}</div>,
    }, {
      title: '设备型号',
      dataIndex: 'deviceModeName',
      textAlign: 'left',
      width: '11%',
      sorter: true,
      render: (text) => <div className={styles.deviceModeNameText} title={text}>{text}</div>,
    }];
    const filterShow = [
      {
        title: '区域',
        dataIndex: 'regionName',
        textAlign: 'left',
        width: '9%',
        sorter: true,
        render: (text) => <div className={styles.regionNameText} title={text}>{text}</div>,
      }, {
        title: '电站名称',
        width: '10%',
        dataIndex: 'stationName',
        sorter: true,
        textAlign: 'left',
        render: (text) => <div className={styles.stationNameText} title={text}>{text}</div>,
      }, {
        title: '设备名称',
        dataIndex: 'deviceName',
        width: '10%',
        sorter: true,
        textAlign: 'left',
        render: (text) => <div className={styles.deviceNameText} title={text}>{text}</div>,
      }, {
        title: '风机型号',
        dataIndex: 'deviceModeName',
        width: '15%',
        sorter: true,
        textAlign: 'left',
        render: (text) => <div className={styles.deviceModeNameText} title={text}>{text}</div>,
      },
    ];
    const show = filterTable > 3 ? filterShow.slice(0, filterTable) : filterDevice.slice(0, filterTable);
    const columns = [{
      title: '统计时段',
      dataIndex: 'date',
      sorter: true,
      textAlign: 'center',
      width: '10.5%',
      render(text) { return text.replace(/-/g, '/').replace(',', '-'); },
    }, {
      title: '设备状态',
      dataIndex: 'deviceStatusName',
      textAlign: 'left',
      width: '10%',
      sorter: true,
    }, {
      title: '次数',
      dataIndex: 'num',
      sorter: true,
      width: '6.5%',
      textAlign: 'right',
      render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
    }, {
      title: '状态时长(s)',
      dataIndex: 'statusTime',
      sorter: true,
      width: '10%',
      textAlign: 'right',
      render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
    }, {
      title: '状态小时数(h)',
      dataIndex: 'statusHours',
      sorter: true,
      width: '10%',
      textAlign: 'right',
      render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
    }, {
      title: '平均时长',
      dataIndex: 'avgTime',
      sorter: true,
      width: '9%',
      textAlign: 'right',
    }];
    filterTable > 4 ? columns : columns.unshift(...show);
    return columns;
  }

  detailColumn = () => {
    const columns = [
      {
        title: '区域',
        dataIndex: 'regionName',
        width: '9%',
        textAlign: 'left',
        sorter: true,
        render: (text) => <div className={styles.regionNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        textAlign: 'left',
        width: '10%',
        sorter: true,
        render: (text) => <div className={styles.stationNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '设备名称',
        dataIndex: 'deviceName',
        textAlign: 'left',
        width: '10%',
        sorter: true,
        render: (text) => <div className={styles.deviceNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '风机型号',
        dataIndex: 'deviceModeName',
        textAlign: 'left',
        width: '15%',
        sorter: true,
        render: (text) => <div className={styles.deviceModeNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '设备状态',
        textAlign: 'left',
        dataIndex: 'deviceStatus',
        width: '10%',
        sorter: true,
      }, {
        title: '发生时间',
        textAlign: 'center',
        dataIndex: 'happenTime',
        width: '10%',
        sorter: true,
      }, {
        title: '状态时长(s)',
        textAlign: 'right',
        dataIndex: 'statusTime',
        sorter: true,
        width: '10%',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '状态小时数(h)',
        dataIndex: 'statusHours',
        sorter: true,
        textAlign: 'right',
        width: '10%',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '状态描述',
        width: '14%',
        dataIndex: 'statusDescribe',
        sorter: true,
        textAlign: 'left',
        render: (text) => <div className={styles.statusDescribeText} title={text}>{text}</div>,
      },
    ];
    return columns;
  }

  changeTable = (e) => {
    const tableType = e.target.value;
    this.props.changeDeviceStatusStore({ tableType, sortField: '0', sortMethod: 'asc' });
    tableType === 'all' && this.props.getDeviceStatusList({ ...this.props.params, sortField: '0', sortMethod: 'asc' });
    tableType === 'detail' && this.props.getDeviceStatusDetail({ ...this.props.params, sortField: '0', sortMethod: 'asc' });
  }

  render() {
    const { total, pageSize, pageNum, deviceStatusList, tableType, statusDetailList, loading, sortField, sortMethod } = this.props;
    const columns = tableType === 'all' ? this.initMonthColumn() : this.detailColumn();
    const dataSource = tableType === 'all' ? deviceStatusList.map((e, i) => ({ ...e, key: i })) : statusDetailList.map((e, i) => ({ ...e, key: i }));
    const sortInfoMap = ['regionName', 'stationName', 'deviceName', 'deviceModeName', 'date', 'deviceStatusName', 'num', 'statusTime', 'statusHours', 'avgTime'];
    const detailSortInfo = ['regionName', 'stationName', 'deviceName', 'deviceModeName', 'deviceStatusName', 'happenTime', 'statusTime', 'statusHours', 'statusDescribe'];
    return (
      <React.Fragment>
        <div className={styles.tableHeader}>
          <div>
            <Radio.Group value={tableType} buttonStyle="solid" onChange={this.changeTable}>
              <Radio.Button value="all">汇总</Radio.Button>
              <Radio.Button value="detail">明细</Radio.Button>
            </Radio.Group>
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <CneTable
          loading={loading}
          sortField={tableType === 'all' ? sortInfoMap[sortField] : detailSortInfo[sortField]}
          sortMethod={sortMethod === 'desc' ? 'descend' : 'ascend'}
          columns={columns}
          dataSource={dataSource}
          onChange={this.ontableSort}
          className={styles.tableStyles}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          pagination={false} />
      </React.Fragment>
    );
  }
}

export default TableList;
