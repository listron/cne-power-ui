import React from 'react';
import styles from './weatherStationBox.scss';
import PropType from 'prop-types';
import { Table, Button } from 'antd';
import moment from 'moment';
import { dataFormat } from '../../../../../utils/utilFunc';
import CommonPagination from '@components/Common/CommonPagination';
import TableColumnTitle from '@components/Common/TableColumnTitle';
import path from '@constants/path';
import CneTable from '@components/Common/Power/CneTable';
import CneButton from '@components/Common/Power/CneButton';
const { APIBasePath } = path.basePaths;

class ReportSearch extends React.PureComponent {
  static propTypes = {
    parmas: PropType.object,
    getWeatherStationList: PropType.func,
    total: PropType.number,
    listLoading: PropType.bool,
    changeStore: PropType.func,
    reportTime: PropType.string,
    downLoadFile: PropType.func,
    downloading: PropType.bool,
    reportList: PropType.array,
    theme: PropType.string,
    stationName: PropType.string,
    deviceNames: PropType.array,
  }

  constructor() {
    super();
    this.width = 0;
  }

  calcWidth = (str, unit) => {
    const padding = 8;
    return (str.length + unit.length) * 14 + (2 * padding) + 40;
  }

  initColumn = () => { // 表头的数据
    const power = [//组件温度
      { name: '温度1', unit: '℃', dataIndex: 'part1Temperature', point: 2 },
      { name: '温度2', unit: '℃', dataIndex: 'part2Temperature', point: 2 },
    ];
    const DcPower = [ // 瞬时辐射强度
      { name: '水平辐射', unit: 'W/m2', dataIndex: 'accRadiationMax', point: 2 },
      { name: '斜面辐射', unit: 'W/m2', dataIndex: 'slopeRadiationMax', point: 2 },
    ];
    const AcPower = [ // 累计辐射强度
      { name: '水平总辐射', unit: 'MJ/m2', dataIndex: 'accRadiation', point: 2 },
      { name: '斜面总辐射', unit: 'MJ/m2', dataIndex: 'slopeRadiation', point: 2 },

    ];
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        width: 160,
        fixed: 'left',
        sorter: true,
        textAlign: 'left',
        render: (text) => <div className={styles.deviceNameText} title={text}>{text}</div>,
      },
      {
        title: '统计时段',
        dataIndex: 'date',
        width: 130,
        fixed: 'left',
        sorter: true,
        textAlign: 'center',
        render: (text) => <div className={styles.statisticsDate} title={text}>{text ? moment(text).format('HH:mm') : '--'}</div>,
      },
      {
        title: () => <TableColumnTitle title="环境温度" unit="℃" />,
        dataIndex: 'temperature',
        width: 140,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="环境湿度" unit="%RH" />,
        dataIndex: 'humidity',
        width: 120,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },

      {
        title: '组件温度',
        // dataIndex: 'powerData',
        children: power.map(item => {
          return {
            title: `${item.name}${item.unit ? `(${item.unit})` : ''}`,
            dataIndex: item.dataIndex,
            className: styles.rightText,
            width: this.calcWidth(item.name, item.unit),
            render: value => dataFormat(value, '--', item.point),
          };
        }),
      },
      {
        title: '瞬时辐射强度',
        // dataIndex: 'DcPowerData',
        children: DcPower.map(item => {
          return {
            title: `${item.name}${item.unit ? `(${item.unit})` : ''}`,
            dataIndex: item.dataIndex,
            className: styles.rightText,
            width: this.calcWidth(item.name, item.unit),
            render: value => dataFormat(value, '--', item.point),
          };
        }),
      },
      {
        title: '累计辐射强度',
        // dataIndex: 'AcPowerData',
        children: AcPower.map(item => {
          return {
            title: `${item.name}${item.unit ? `(${item.unit})` : ''}`,
            dataIndex: item.dataIndex,
            className: styles.rightText,
            width: this.calcWidth(item.name, item.unit),
            render: value => dataFormat(value, '--', item.point),
          };
        }),
      },
      {
        title: () => <TableColumnTitle title="风速" unit="m/s" />,
        dataIndex: 'windSpeed',
        width: 120,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="风向" unit="°" />,
        dataIndex: 'windDirector',
        width: 100,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="气压" unit="Pa" />,
        dataIndex: 'pressure',
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
    ];
    return columns;
  }

  exportFile = () => { // 导出文件
    const { parmas, reportTime, stationName, deviceNames } = this.props;
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.exportWeatherList}`,
      params: { ...parmas, reportTime, stationName, deviceNames },
    });
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
    this.props.changeStore({ parmas: { ...this.props.parmas, pageSize, pageNum: currentPage } });
    this.changeTableList({ pageSize, pageNum: currentPage });
  }

  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { parmas = {} } = this.props;
    const { sortMethod, sortField } = parmas;
    let newSortFild = sortField, newSortMethod = 'desc';
    const { field } = sorter;
    const getSortField = {
      'deviceName': 'device_name',
      'date': 'report_time',
    };
    if (!field || getSortField[field] === sortField) {
      newSortMethod = sortMethod === 'asc' ? 'desc' : 'asc'; // 交换排序方式
    } else {
      newSortFild = getSortField[field];
    }
    this.props.changeStore({ parmas: { ...this.props.parmas, sortMethod: newSortMethod, sortField: newSortFild } });
    this.changeTableList({ sortMethod: newSortMethod, sortField: newSortFild });
  }

  toLine = (name) => { // 驼峰转下划线
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
  }


  changeTableList = (value) => {
    const { parmas, reportTime } = this.props;
    this.props.getWeatherStationList({ ...parmas, reportTime, ...value });
  }



  render() {
    const { total = 30, parmas, listLoading, downloading, reportList, theme } = this.props;
    const { pageSize = 1, pageNum = 10, deviceFullcodes, sortMethod, sortField } = parmas;
    const { clientHeight } = document.body;
    // footer 60; thead: 73, handler: 55; search 70; padding 15; menu 40;
    const scrollY = clientHeight - 330;
    const scroll = { x: 1860, y: scrollY };
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <CneButton onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}> 导出</CneButton>
          <CommonPagination className={styles.pagination} total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={'theme'} />
        </div>
        <div className={styles.tableBox}>
          <CneTable
            columns={this.initColumn()}
            dataSource={reportList}
            bordered
            scroll={scroll}
            pagination={false}
            showHeader={true}
            loading={listLoading}
            onChange={this.tableChange}
            sortField={{ 'device_name': 'deviceName', 'report_time': 'date' }[sortField]}
            sortMethod={{ 'asc': 'ascend', 'desc': 'descend' }[sortMethod]}
          />
        </div>
      </div>
    );
  }
}


export default ReportSearch;
