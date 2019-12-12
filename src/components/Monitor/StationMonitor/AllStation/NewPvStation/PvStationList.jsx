import React from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Progress, Table, message } from 'antd';
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../utils/utilFunc';
import { divideFormarts, multiplyFormarts, powerPoint } from '../../PvCommon/PvDataformat';
class PvStationList extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPaginationChange: PropTypes.func,
    windMonitorStation: PropTypes.object,
    pvMonitorStation: PropTypes.object,
    monitorPvUnit: PropTypes.object,
    theme: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      sortName: 'stationName',
      descend: false,
    };
  }

  ontableSort = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend',
    });
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
        render: (value, record) => {
          const stationStatus = record.stationStatus || '';
          if (stationStatus === '900') {
            return <div title={value} className={styles.stationName} onClick={this.showTip}>{value}</div>;
          }
          return (
            <a href={`#/monitor/singleStation/${record.stationCode}`}>
              <div title={value} className={styles.stationName}>{value}</div>
            </a>
          );

        },
      },
      {
        title: '区域',
        dataIndex: 'regionName',
        sorter: true,
        render: (value) => <div className={styles.stationrovince}>{value}</div>,
      },
      {
        title: () => <TableColumnTitle title="实时功率" unit={realCapacityUnit} className="nonePadding" />,
        dataIndex: 'stationPower',
        sorter: true,
        className: styles.numberStyle,
        render: value => dataFormats(divideFormarts(value, realTimePowerUnit), '--', 2, true),
      },

      {
        title: () => <TableColumnTitle title="瞬时辐照" unit="W/m²" className="nonePadding" />,
        dataIndex: 'instantaneous',
        className: styles.numberStyle,
        render: (value) => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: '负荷率',
        dataIndex: 'loadRate',
        sorter: true,
        className: styles.numberStyle,
        render: (value) => dataFormats(value, '--', 2, true) + '%',
      },
      {
        title: () => <TableColumnTitle title="日发电量" unit={powerUnit} className="nonePadding" />,
        dataIndex: 'dayPower',
        sorter: true,
        className: styles.numberStyle,
        render: value => powerPoint(divideFormarts(value, powerUnit)),
      },
      {
        title: () => <TableColumnTitle title="日等效时" unit={'h'} className="nonePadding" />,
        dataIndex: 'equivalentHours',
        sorter: true,
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true),
      },
      {
        title: () => <TableColumnTitle title="月发电量" unit={powerUnit} className="nonePadding" />,
        dataIndex: 'monthPower',
        render: value => powerPoint(divideFormarts(value, powerUnit)),
        sorter: true,
        className: styles.numberStyle,
      },
      {
        title: () => <TableColumnTitle title="年发电量" unit={powerUnit} className="nonePadding" />,
        dataIndex: 'yearPower',
        render: value => powerPoint(divideFormarts(value, powerUnit)),
        sorter: true,
        className: styles.numberStyle,
      },
      {
        title: () => <TableColumnTitle title="装机容量" unit={realCapacityUnit} className="nonePadding" />,
        dataIndex: 'stationCapacity',
        sorter: true,
        className: styles.numberStyle,
        render: (value) => dataFormats(realCapacityUnit === 'MW' ? value : multiplyFormarts(value, 1000), '--', 2),
      },
      {
        title: () => <TableColumnTitle title="装机" unit="台" className="nonePadding" />,
        dataIndex: 'stationUnitCount',
        sorter: true,
        className: styles.numberStyle,
        render: (value) => { return numWithComma(value); },
      },
      {
        title: () => <TableColumnTitle title="异常支路数" unit={'个'} className="nonePadding" />,
        dataIndex: 'anomalousBranchNum',
        sorter: true,
        className: styles.numberStyle,
        render: value => value ? value : 0,
      },
      {
        title: () => <TableColumnTitle title="告警" unit={'个'} className="nonePadding" />,
        dataIndex: 'alarmNum',
        sorter: true,
        className: styles.numberStyle,
        render: value => value ? value : 0,
      },
      {
        title: '状态',
        dataIndex: 'stationStatus',
        sorter: true,
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
        'capabilityRate',
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
    const { stationDataList, pageSize, currentPage, onPaginationChange, theme } = this.props;
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
        <Table
          columns={this.initColumn()}
          dataSource={datalist}
          onChange={this.ontableSort}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          pagination={false} />
      </div>
    );
  }
}
export default (PvStationList);
