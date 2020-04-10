import React from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Table, message, Tooltip } from 'antd';
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../utils/utilFunc';
import { divideFormarts, multiplyFormarts, powerPoint } from '../../PvCommon/PvDataformat';
import CneTable from '@components/Common/Power/CneTable';
class PvStationList extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPaginationChange: PropTypes.func,
    monitorPvUnit: PropTypes.object,
    theme: PropTypes.string,
    loading: PropTypes.bool,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      sortName: 'stationName',
      descend: false,
      sortMethod: '', // 排序方式
      sortField: '', // 排序字段
    };
  }

  sortFieldMap = { // 表格排序字段 => api
    stationName: 'stationName',
    regionName: 'regionName',
    stationPower: 'stationPower',
    instantaneous: 'instantaneous',
    dayPower: 'dayPower',
    monthPower: 'monthPower',
    yearPower: 'yearPower',
    stationCapacity: 'stationCapacity',
    stationUnitCount: 'stationUnitCount',
    equivalentHours: 'equivalentHours',
    alarmNum: 'alarmNum',
    loadRate: 'loadRate',
    anomalousBranchNum: 'anomalousBranchNum',
    stationStatus: 'stationStatus',
  };

  tableSortMap = { // api存储字段 => 表格排序字段
    stationName: 'stationName',
    regionName: 'regionName',
    stationPower: 'stationPower',
    instantaneous: 'instantaneous',
    dayPower: 'dayPower',
    monthPower: 'monthPower',
    yearPower: 'yearPower',
    stationCapacity: 'stationCapacity',
    stationUnitCount: 'stationUnitCount',
    equivalentHours: 'equivalentHours',
    alarmNum: 'alarmNum',
    loadRate: 'loadRate',
    anomalousBranchNum: 'anomalousBranchNum',
    stationStatus: 'stationStatus',
  };

  sortMethodMap = {
    descend: 'descend',
    ascend: 'ascend',
  }

  ontableSort = (pagination, filters, sorter) => {
    const { field } = sorter || {};
    const { sortField, sortMethod } = this.state;
    let newField = sortField, newSort = 'descend';
    if (!field || (sortField === this.sortFieldMap[field])) { // 点击的是正在排序的列
      newSort = sortMethod === 'descend' ? 'ascend' : 'descend'; // 交换排序方式
    } else { // 切换列
      newField = this.sortFieldMap[field];
    }
    this.setState({
      sortMethod: newSort,
      sortField: newField,
      sortName: sorter.field,
      descend: newSort === 'descend',
    });
    // this.setState({
    // sortName: sorter.field,
    //   descend: sorter.order === 'descend', });
  }

  showTip = (e) => {
    message.destroy();
    message.config({ top: 225, maxCount: 1 });
    message.warning('电站未接入,无法查看详情', 2);
  }


  initColumn = () => {
    const { monitorPvUnit = {} } = this.props;
    const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
    const getStatusName = {
      '400': 'normal',
      '500': 'interrupt',
      '900': 'notConnected',
    };
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        defaultSortOrder: 'ascend',
        sorter: true,
        textAlign: 'left',
        className: styles.stationName,
        render: (value, record) => {
          const stationStatus = record.stationStatus || '';
          if (stationStatus === '900') {
            return <div title={value} className={styles.stationNameText} onClick={this.showTip}>{value}</div>;
          }
          return (
            <a href={`#/monitor/singleStation/${record.stationCode}`}>
              <div title={value} className={styles.stationNameText}>{value}</div>
            </a>
          );

        },
      },
      {
        title: '区域',
        dataIndex: 'regionName',
        sorter: true,
        textAlign: 'left',
        className: styles.regionName,
        render: (value) => <div className={styles.stationrovince} title={value}>{value}</div>,
      },
      {
        title: () => <TableColumnTitle title="实时功率" unit={realCapacityUnit} className="nonePadding" />,
        dataIndex: 'stationPower',
        sorter: true,
        className: `${styles.stationPower} ${styles.numberStyle}`,
        render: value => dataFormats(divideFormarts(value, realTimePowerUnit), '--', 2, true),
      },

      {
        title: () => <TableColumnTitle title="瞬时辐照" unit="W/m²" className="nonePadding" />,
        dataIndex: 'instantaneous',
        className: `${styles.instantaneous} ${styles.numberStyle}`,
        render: (value) => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: '负荷率',
        dataIndex: 'loadRate',
        sorter: true,
        className: `${styles.loadRate} ${styles.numberStyle}`,
        render: (value) => dataFormats(value, '--', 2, true) + '%',
      },
      {
        title: () => <TableColumnTitle title="日发电量" unit={powerUnit} className="nonePadding" />,
        dataIndex: 'dayPower',
        sorter: true,
        className: `${styles.dayPower} ${styles.numberStyle}`,
        render: value => powerPoint(divideFormarts(value, powerUnit)),
      },
      {
        title: () => <TableColumnTitle title="日等效时" unit={'h'} className="nonePadding" />,
        dataIndex: 'equivalentHours',
        sorter: true,
        className: `${styles.equivalentHours} ${styles.numberStyle}`,
        render: (value, record) => {
          return (
            <div className={styles.equivalentHoursText}>
              <span className={record.equivalentHoursValidation && styles.specialColor} >{dataFormats(value, '--', 2, true)}</span>
              <div className={styles.tooltipName}>
                {record.equivalentHoursValidation &&
                  <Tooltip placement="top" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={record.equivalentHoursValidation}>
                    <i className="iconfont icon-help" />
                  </Tooltip>
                }
              </div>
            </div>);
        },
      },
      {
        title: () => <TableColumnTitle title="月发电量" unit={powerUnit} className="nonePadding" />,
        dataIndex: 'monthPower',
        render: value => powerPoint(divideFormarts(value, powerUnit)),
        sorter: true,
        className: `${styles.monthPower} ${styles.numberStyle}`,
      },
      {
        title: () => <TableColumnTitle title="年发电量" unit={powerUnit} className="nonePadding" />,
        dataIndex: 'yearPower',
        render: value => powerPoint(divideFormarts(value, powerUnit)),
        sorter: true,
        className: `${styles.yearPower} ${styles.numberStyle}`,
      },
      {
        title: () => <TableColumnTitle title="装机容量" unit={realCapacityUnit} className="nonePadding" />,
        dataIndex: 'stationCapacity',
        sorter: true,
        className: `${styles.stationCapacity} ${styles.numberStyle}`,
        render: (value) => dataFormats(realCapacityUnit === 'MW' ? value : multiplyFormarts(value, 1000), '--', 2),
      },
      {
        title: () => <TableColumnTitle title="装机" unit="台" className="nonePadding" />,
        dataIndex: 'stationUnitCount',
        sorter: true,
        className: `${styles.stationUnitCount} ${styles.numberStyle}`,
        render: (value) => { return numWithComma(value); },
      },
      {
        title: () => <TableColumnTitle title="异常支路数" unit={'个'} className="nonePadding" />,
        dataIndex: 'anomalousBranchNum',
        sorter: true,
        className: `${styles.anomalousBranchNum} ${styles.numberStyle}`,
        render: value => value ? value : 0,
      },
      {
        title: () => <TableColumnTitle title="告警" unit={'个'} className="nonePadding" />,
        dataIndex: 'alarmNum',
        sorter: true,
        className: `${styles.alarmNum} ${styles.numberStyle}`,
        render: value => value ? value : 0,
      },
      {
        title: '状态',
        dataIndex: 'stationStatus',
        sorter: true,
        className: styles.stationStatus,
        render: (value) => {
          return (
            <div className={styles.currentStation}>
              <div className={styles[getStatusName[value]]} ></div>
            </div>);
        },
      },
    ];
    return columns;
  }

  createTableSource = (data) => { // 数据源的排序，翻页
    const { sortName, descend } = this.state;
    const tableSource = data.sort((a, b) => { // 手动排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['stationName', 'regionName'];
      const arrayNumSort = [
        'stationPower',
        'instantaneous',
        'dayPower',
        'monthPower',
        'yearPower',
        'stationCapacity',
        'stationUnitCount',
        'equivalentHours',
        'alarmNum',
        'loadRate',
        'anomalousBranchNum',
        'stationStatus'];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].localeCompare(b[sortName]));
      }
    });
    return tableSource;
  }


  render() {
    const { sortMethod, sortField } = this.state;
    const { stationDataList, pageSize, currentPage, onPaginationChange, theme, loading } = this.props;
    const dataSort = this.createTableSource(stationDataList);
    const startRow = (currentPage - 1) * pageSize;
    let endRow = currentPage * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    const datalist = dataSort.slice(startRow, endRow).map((e, index) => { return { key: e.stationCode, ...e }; });
    const totalNum = stationDataList.length;
    return (
      <div className={styles.pvStationList}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} total={totalNum} onPaginationChange={onPaginationChange} theme={theme} />
        </div>
        <CneTable
          loading={loading}
          columns={this.initColumn()}
          dataSource={datalist}
          sortField={this.tableSortMap[sortField]}
          sortMethod={this.sortMethodMap[sortMethod] || false}
          onChange={this.ontableSort}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          dataError={false} />
      </div>
    );
  }
}
export default (PvStationList);
