import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerLost.scss';
import { Table } from 'antd';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../utils/utilFunc';
class TableList extends Component {
  static propTypes = {
    getPowerLostList: PropTypes.func,
    changePowerLostStore: PropTypes.func,
    onChangeFilter: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    dateType: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    summaryType: PropTypes.number,
    filterTable: PropTypes.number,
    summaryData: PropTypes.array,
    powerLostList: PropTypes.array,
    tableType: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
  }
  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    this.props.changePowerLostStore({ pageNum: currentPage, pageSize });
    this.props.onChangeFilter({ pageNum: currentPage, pageSize });
  }
  ontableSort = (pagination, filter, sorter) => {
    const { onChangeFilter } = this.props;
    const { field, order } = sorter;
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
      faultTime: '12',
    };
    const sortField = sortInfo[field] ? sortInfo[field] : '';
    const sortMethod = order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '';
    this.props.changePowerLostStore({ sortField, sortMethod });
    onChangeFilter({ sortField, sortMethod });
  }

  initMonthColumn = () => {
    const { filterTable } = this.props;

    const filterShow = [
      {
        title: '区域',
        dataIndex: 'regionName',
        sorter: true,
        render: (text) => {
          return <div className={styles.regionName} title={text}>{text}</div>;
        },
        // width:40,
      },
      {
        title: '电站名称',
        dataIndex: 'stationName',
        sorter: true,
        render: (text) => {
          return <div className={styles.stationName} title={text}>{text}</div>;
        },
      },
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        sorter: true,
        render: (text) => {
          return <div className={styles.deviceName} title={text}>{text}</div>;
        },
      },
      {
        title: '风机型号',
        dataIndex: 'deviceModeName',
        sorter: true,
        render: (text) => {
          return <div className={styles.deviceModeName} title={text}>{text}</div>;
        },
      },
    ];
    const show = filterShow.slice(0, filterTable);
    const columns = [
      {
        title: '统计时段',
        dataIndex: 'date',
        sorter: true,
        render(text) { return text.replace(',', '-'); },
      },
      {
        title: () => <TableColumnTitle title="限电时长" unit="h" />,
        dataIndex: 'limitHour',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      },
      {
        title: () => <TableColumnTitle title="限电损失电量" unit="万kWh" />,
        dataIndex: 'limitpower',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      },
      {
        title: () => <TableColumnTitle title="维护时长" unit="h" />,
        dataIndex: 'weihuHour',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      },
      {
        title: () => <TableColumnTitle title="风电维护损失电量" unit="万kWh" />,
        dataIndex: 'weihupower',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      },
      {
        title: () => <TableColumnTitle title="技术待命时长" unit="h" />,
        dataIndex: 'resourceValue',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      },
      {
        title: () => <TableColumnTitle title="技术待命损失电量" unit="万kWh" />,
        dataIndex: 'resourceRate',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      },
      {
        title: () => <TableColumnTitle title="远程停机时长" unit="h" />,
        dataIndex: 'equivalentHours',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      },
      {
        title: () => <TableColumnTitle title="远程停机损失电量" unit="万kWh" />,
        dataIndex: 'pr',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      }, {
        title: () => <TableColumnTitle title="电网故障时长" unit="h" />,
        dataIndex: 'lostPower',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      }, {
        title: () => <TableColumnTitle title="电网故障损失电量" unit="万kWh" />,
        dataIndex: 'limitPowerHours',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,

      }, {
        title: () => <TableColumnTitle title="故障停机时长" unit="h" />,
        dataIndex: 'guzhangHours',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,

      }, {
        title: () => <TableColumnTitle title="故障停机损失电量" unit="万kWh" />,
        dataIndex: 'guazhangpower',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,

      }, {
        title: () => <TableColumnTitle title="就地停机时长" unit="h" />,
        dataIndex: 'jiudihour',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,

      }, {
        title: () => <TableColumnTitle title="就地停机损失电量" unit="万kWh" />,
        dataIndex: 'jiudipower',
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className: styles.numRight,
      },
    ];
    columns.unshift(...show);
    return columns;
  }


  render() {
    const { total, pageSize, pageNum, powerLostList, loading } = this.props;
    const columns = this.initMonthColumn();
    const dataSource = powerLostList.map((e, i) => ({
      ...e, key: i,

    }));
    return (
      <React.Fragment>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          onChange={this.ontableSort}
          scroll={{ x: 2235 }}
          className={styles.tableStyles}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          pagination={false} />
      </React.Fragment>
    );
  }
}

export default TableList;
