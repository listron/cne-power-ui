import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './malfunction.scss';
import { Radio } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import CommonPagination from '../../../Common/CommonPagination';
import { numWithComma, dataFormats } from '../../../../utils/utilFunc';


class TableList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    getMalfunctionList: PropTypes.func,
    changeMalfunctionStore: PropTypes.func,
    getMalfunctionDetail: PropTypes.func,
    onChangeFilter: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    filterTable: PropTypes.number,
    malfunctionList: PropTypes.array,
    malfunctionDetailList: PropTypes.array,
    tableType: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    params: PropTypes.object,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    this.props.changeMalfunctionStore({ pageNum: currentPage, pageSize });
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
      num: '5',
      faultTime: '6',
      faultHours: '7',
      faultGen: '8',
      faultDescribe: '9',
    };
    const detailSortInfo = {
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      belongComponent: '4',
      faultDescribe: '5',
      faultStartTime: '6',
      faultEndTime: '7',
      faultCode: '8',
      faultTime: '9',
      faultHours: '10',
    };
    let newField = sortField, newSort = 'desc';
    const tmpTableField = tableType === 'all' ? sortInfo[field] : detailSortInfo[field];
    if (!field || field === tmpTableField) { // 同列点击
      newSort = sortMethod === 'desc' ? 'asc' : 'desc';
    } else { // 换列排序
      newField = tmpTableField;
    }
    this.props.changeMalfunctionStore({ sortField: newField, sortMethod: newSort });
    onChangeFilter({ sortField: newField, sortMethod: newSort });
  }
  initMonthColumn = () => {
    const { filterTable } = this.props;
    const filterDevice = [{
      title: '区域',
      dataIndex: 'regionName',
      sorter: true,
      textAlign: 'left',
      width: '9%',
      render: (text) => <div className={styles.regionNameText} title={text || '--'}>{text || '--'}</div>,
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
      textAlign: 'left',
      width: '10%',
      render: (text) => <div className={styles.stationNameText} title={text || '--'}>{text || '--'}</div>,
    }, {
      title: '设备型号',
      dataIndex: 'deviceModeName',
      sorter: true,
      textAlign: 'left',
      width: '10%',
      render: (text) => <div className={styles.deviceModeNameText} title={text || '--'}>{text || '--'}</div>,
    }];
    const filterShow = [
      {
        title: '区域',
        dataIndex: 'regionName',
        sorter: true,
        textAlign: 'left',
        width: '9%',
        render: (text) => <div className={styles.regionNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        sorter: true,
        textAlign: 'left',
        width: '10%',
        render: (text) => <div className={styles.stationNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '设备名称',
        dataIndex: 'deviceName',
        sorter: true,
        textAlign: 'left',
        width: '10%',
        render: (text) => <div className={styles.deviceNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '风机型号',
        dataIndex: 'deviceModeName',
        sorter: true,
        textAlign: 'left',
        width: '15%',
        render: (text) => <div className={styles.deviceModeNameText} title={text || '--'}>{text || '--'}</div>,
      },
    ];

    const show = filterTable > 3 ? filterShow.slice(0, filterTable) : filterDevice.slice(0, filterTable);
    const showFault = [
      {
        title: '区域',
        dataIndex: 'regionName',
        sorter: true,
        textAlign: 'left',
        width: '9%',
        render: (text) => <div className={styles.regionNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        sorter: true,
        textAlign: 'left',
        width: '10%',
        render: (text) => <div className={styles.stationNameText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '故障描述',
        dataIndex: 'deviceFaultName',
        sorter: true,
        textAlign: 'left',
        width: '14%',
        render: (text) => <div className={styles.deviceFaultNameText} title={text || '--'}>{text || '--'}</div>,
      }];
    const columns = [
      {
        title: '统计时段',
        dataIndex: 'date',
        sorter: true,
        textAlign: 'center',
        width: '10%',
        render(text) { return text.replace(/-/g, '/').replace(',', '-'); },
      }, {
        title: '次数',
        dataIndex: 'num',
        sorter: true,
        textAlign: 'right',
        width: '8%',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '故障时长(s)',
        dataIndex: 'faultTime',
        sorter: true,
        textAlign: 'right',
        width: '10%',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '故障小时数(h)',
        dataIndex: 'faultHours',
        sorter: true,
        textAlign: 'right',
        width: '10%',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '损失电量',
        dataIndex: 'faultGen',
        sorter: true,
        textAlign: 'right',
        width: '10%',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      },
    ];
    filterTable > 4 ? columns.unshift(...showFault) : columns.unshift(...show);
    return columns;
  }

  detailColumn = () => {
    const columns = [
      {
        title: '区域',
        dataIndex: 'regionName',
        sorter: true,
        fixed: 'left',
        textAlign: 'left',
        width: 100,
        render: (text) => <div className={styles.regionNameText} title={text}>{text}</div>,
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        sorter: true,
        fixed: 'left',
        textAlign: 'left',
        width: 120,
        render: (text) => <div className={styles.stationNameText} title={text}>{text}</div>,
      }, {
        title: '设备名称',
        dataIndex: 'deviceName',
        sorter: true,
        fixed: 'left',
        textAlign: 'left',
        width: 120,
        render: (text) => <div className={styles.deviceNameText} title={text}>{text}</div>,
      }, {
        title: '风机型号',
        dataIndex: 'deviceModeName',
        sorter: true,
        fixed: 'left',
        textAlign: 'left',
        width: 150,
        render: (text) => <div className={styles.deviceModeNameText} title={text}>{text}</div>,
      }, {
        title: '所属部件',
        dataIndex: 'belongComponent',
        sorter: true,
        textAlign: 'left',
        width: 120,
        render: (text) => <div className={styles.belongComponentText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '故障描述',
        dataIndex: 'faultDescribe',
        sorter: true,
        textAlign: 'left',
        width: 140,
        render: (text) => <div className={styles.faultDescribeText} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '故障开始时间',
        dataIndex: 'faultStartTime',
        sorter: true,
        textAlign: 'center',
        width: 140,
      }, {
        title: '故障结束时间',
        dataIndex: 'faultEndTime',
        textAlign: 'center',
        sorter: true,
        width: 140,
      }, {
        title: '故障代码',
        dataIndex: 'faultCode',
        sorter: true,
        textAlign: 'right',
        width: 120,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '故障时长(s)',
        dataIndex: 'faultTime',
        sorter: true,
        textAlign: 'right',
        width: 140,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '故障小时数(h)',
        dataIndex: 'faultHours',
        textAlign: 'right',
        sorter: true,
        width: 150,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '损失电量(kWh)',
        dataIndex: 'faultGen',
        textAlign: 'right',
        // sorter: true,
        width: 150,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '风速(m/s)',
        dataIndex: 'windSpeedAvg',
        // sorter: true,
        textAlign: 'right',
        width: 120,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '有功功率(kW)',
        dataIndex: 'usePower',
        textAlign: 'right',
        // sorter: true,
        width: 150,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '发电机转速(Rpm)',
        dataIndex: 'speed',
        textAlign: 'right',
        // sorter: true,
        width: 160,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: '桨叶角(℃)',
        dataIndex: 'bladeAngle',
        textAlign: 'right',
        // sorter: true,
        width: 120,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      },
    ];
    return columns;
  }

  changeTable = (e) => {
    const tableType = e.target.value;
    this.props.changeMalfunctionStore({ tableType });
    tableType === 'all' && this.props.getMalfunctionList({ ...this.props.params });
    tableType === 'detail' && this.props.getMalfunctionDetail({ ...this.props.params });
  }

  render() {
    const { total, pageSize, pageNum, malfunctionList, tableType, malfunctionDetailList, loading, sortField, sortMethod } = this.props;
    const columns = tableType === 'all' ? this.initMonthColumn() : this.detailColumn();
    const dataSource = tableType === 'all' ? malfunctionList.map((e, i) => ({ ...e, key: i })) : malfunctionDetailList.map((e, i) => ({ ...e, key: i }));
    const sortInfoMap = ['regionName', 'stationName', 'deviceName', 'deviceModeName', 'date', 'num', 'faultTime', 'faultHours', 'faultGen', 'faultDescribe'];
    const detailSortInfo = ['regionName', 'stationName', 'deviceName', 'deviceModeName', 'belongComponent', 'faultDescribe', 'faultStartTime', 'faultEndTime', 'faultCode', 'faultTime', 'faultHours'];
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
          columns={columns}
          sortField={tableType === 'all' ? sortInfoMap[sortField] : detailSortInfo[sortField]}
          sortMethod={sortMethod === 'desc' ? 'descend' : 'ascend'}
          dataSource={dataSource}
          onChange={this.ontableSort}
          scroll={{ x: 'max-content' }}
          className={styles.tableStyles}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          pagination={false} />
      </React.Fragment>
    );
  }
}

export default TableList;
