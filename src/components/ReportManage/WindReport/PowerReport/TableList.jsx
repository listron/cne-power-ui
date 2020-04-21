import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerReport.scss';
import CneTable from '@components/Common/Power/CneTable';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../utils/utilFunc';


class TableList extends Component {
  static propTypes = {
    changePowerReportStore: PropTypes.func,
    onChangeFilter: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    powerReportList: PropTypes.array,
    filterTable: PropTypes.number,
    loading: PropTypes.bool,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    this.props.changePowerReportStore({ pageNum: currentPage, pageSize });
    this.props.onChangeFilter({ pageNum: currentPage, pageSize });
  }

  ontableSort = (pagination, filter, sorter) => {
    const { sortField, sortMethod } = this.props;
    const { field } = sorter;
    const sortInfo = {
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      time: '4',
      windSpeedAvg: '5',
      genValid: '6',
      genTime: '7',
      equivalentHours: '8',
      limitGen: '9',
      limitTime: '10',
      faultGen: '11',
      faultHours: '12',
    };
    let newField = sortField, newSort = 'desc';
    if (!field || field === sortInfo[field]) { // 点击同一列
      newSort = sortMethod === 'desc' ? 'asc' : 'desc';
    } else { // 换列排序
      newField = sortInfo[field];
    }
    this.props.changePowerReportStore({ sortField: newField, sortMethod: newSort });
    this.props.onChangeFilter({ sortField: newField, sortMethod: newSort });
  }

  initMonthColumn = () => {
    const { filterTable } = this.props;
    const filterDevice = [{
      title: '区域',
      dataIndex: 'regionName',
      sorter: true,
      textAlign: 'left',
      className: styles.regionName,
      render: (text) => {
        return <div className={styles.regionNameText} title={text}>{text}</div>;
      },
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
      textAlign: 'left',
      className: styles.stationName,
      render: (text) => {
        return <div className={styles.stationNameText} title={text}>{text}</div>;
      },
    }, {
      title: '设备型号',
      dataIndex: 'deviceModeName',
      sorter: true,
      className: styles.deviceModeName,
      textAlign: 'left',
      render: (text) => {
        return <div className={styles.deviceModeNameText} title={text}>{text}</div>;
      },
    }];
    const filterShow = [
      {
        title: '区域',
        dataIndex: 'regionName',
        sorter: true,
        textAlign: 'left',
        width: 100,
        render: (text) => {
          return <div className={styles.regionNameText} title={text}>{text}</div>;
        },
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        width: 120,
        textAlign: 'left',
        sorter: true,
        render: (text) => {
          return <div className={styles.stationNameText} title={text}>{text}</div>;
        },
      }, {
        title: '设备名称',
        textAlign: 'left',
        dataIndex: 'deviceName',
        width: 120,
        sorter: true,
        render: (text) => {
          return <div className={styles.deviceNameText} title={text}>{text}</div>;
        },
      }, {
        title: '风机型号',
        textAlign: 'left',
        dataIndex: 'deviceModeName',
        width: 250,
        sorter: true,
        render: (text) => {
          return <div className={styles.deviceModeNameText} title={text}>{text}</div>;
        },
      },
    ];
    const show = filterTable > 3 ? filterShow.slice(0, filterTable) : filterDevice.slice(0, filterTable);
    const columns = [
      {
        title: '统计时段',
        dataIndex: 'date',
        textAlign: 'center',
        sorter: true,
        width: 100,
        render(text) { return text.replace(/-/g, '/').replace(',', '-'); },
      }, {
        title: () => <TableColumnTitle title="平均风速" unit="m/s" />,
        dataIndex: 'windSpeedAvg',
        textAlign: 'right',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        sorter: true,
        width: 100,
      }, {
        title: () => <TableColumnTitle title="发电量" unit="kWh" />,
        dataIndex: 'genValid',
        textAlign: 'right',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        sorter: true,
        width: 100,
      }, {
        title: () => <TableColumnTitle title="发电时间" unit="h" />,
        dataIndex: 'genTime',
        textAlign: 'right',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        sorter: true,
        width: 100,
      }, {
        title: () => <TableColumnTitle title="等效利用小时数" unit="h" />,
        dataIndex: 'equivalentHours',
        textAlign: 'right',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        sorter: true,
        width: 150,
      }, {
        title: () => <TableColumnTitle title="限电损失电量" unit="kWh" />,
        dataIndex: 'limitGen',
        textAlign: 'right',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        sorter: true,
        width: 125,
      }, {
        title: () => <TableColumnTitle title="限电时长" unit="h" />,
        dataIndex: 'limitTime',
        textAlign: 'right',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        sorter: true,
        width: 100,
      }, {
        title: () => <TableColumnTitle title="故障损失电量" unit="kWh" />,
        dataIndex: 'faultGen',
        textAlign: 'right',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        sorter: true,
        width: 125,
      }, {
        title: () => <TableColumnTitle title="故障时长" unit="h" />,
        dataIndex: 'faultHours',
        textAlign: 'right',
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        sorter: true,
        width: 100,
      },
    ];
    columns.unshift(...show);
    return columns;
  }


  render() {
    const { total, pageSize, pageNum, loading, powerReportList, filterTable, sortField, sortMethod } = this.props;
    const columns = this.initMonthColumn();
    const dataSource = powerReportList.map((e, i) => ({
      ...e, key: i,
    }));
    const xWidth = [1090, 1220, 1350, 1480];
    const sortMap = ['regionName', 'stationName', 'deviceName', 'deviceModeName', 'time', 'windSpeedAvg', 'genValid', 'genTime', 'equivalentHours', 'limitGen', 'limitTime', 'faultGen', 'faultHours'];
    return (
      <React.Fragment>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <CneTable
          loading={loading}
          sortField={sortMap[sortField]}
          sortMethod={sortMethod === 'desc' ? 'descend' : 'ascend'}
          columns={columns}
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
