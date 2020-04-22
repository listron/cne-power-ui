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
    startTime: PropType.string,
    endTime: PropType.string,
    dateType: PropType.string,
    getWeatherStationList: PropType.func,
    total: PropType.number,
    listLoading: PropType.bool,
    changeStore: PropType.func,
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
    const temperature = [
      { name: '环境温度Avg', unit: '℃', dataIndex: 'temperatureAvg', point: 2 },
      { name: '环境温度Max', unit: '℃', dataIndex: 'temperatureMax', point: 2 },
      { name: '环境温度Min', unit: '℃', dataIndex: 'temperatureMin', point: 2 },
    ];
    const radiation = [
      { name: '水平总累计辐射', unit: 'MJ/m2', dataIndex: 'accRadiationMax', point: 2 },
      { name: '斜面总累计辐射', unit: 'MJ/m2', dataIndex: 'slopeAccRadiationSum', point: 2 },
    ];
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        width: 160,
        fixed: 'left',
        sorter: true,
        textAlign: 'left',
        render: (text) => <div className={styles.deviceNameText} title={text}>{text ? text : '--'}</div>,
      },
      {
        title: '统计时段',
        dataIndex: 'date',
        width: 160,
        fixed: 'left',
        sorter: true,
        textAlign: 'center',
        render: (text) => <div className={styles.statisticsDate} title={text}>{text ? text : '--'}</div>,
      }, {
        title: '环境温度',
        children: temperature.map(item => {
          return {
            title: `${item.name}${item.unit ? `(${item.unit})` : ''}`,
            dataIndex: item.dataIndex,
            className: styles.rightText,
            width: this.calcWidth(item.name, item.unit),
            render: value => dataFormat(value, '--', item.point),
          };
        }),
      }, {
        title: () => <TableColumnTitle title="环境湿度Avg" unit="%RH" />,
        dataIndex: 'humidityAvg',
        width: 170,
        textAlign: 'right',
        render: (text) => <div className={styles.rightText} title={text}>{text ? text.toFixed(2) : '--'}</div>,
      }, {
        title: () => <TableColumnTitle title="瞬时斜面辐射Max" unit="W/m2" />,
        width: 170,
        dataIndex: 'slopeRadiationMax',
        textAlign: 'right',
        render: (text) => <div className={styles.rightText} title={text}>{text ? text.toFixed(2) : '--'}</div>,
      }, {
        title: '累计辐射强度',
        dataIndex: 'operateStatus',
        children: radiation.map(item => {
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
        title: () => <TableColumnTitle title="日照小时数" unit="h" />,
        dataIndex: 'sunshineHours',
        width: 150,
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="风速Max" unit="m/s" />,
        dataIndex: 'windSpeedMax',
        width: 140,
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="气压Avg" unit="Pa" />,
        dataIndex: 'pressureAvg',
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
    ];
    console.log('columns: ', columns);

    return columns;
  }


  exportFile = () => { // 导出文件
    const { parmas, startTime, endTime, dateType, stationName, deviceNames } = this.props;
    // `${APIBasePath}${reportManage.getCenterInvert}` : ;
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.exportWeatherdayList}`,
      params: { ...parmas, startTime, endTime, dateType, stationName, deviceNames },
    });
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
    this.changeTableList({ pageSize, pageNum: currentPage });
    this.props.changeStore({ parmas: { ...this.props.parmas, pageSize, pageNum: currentPage } });
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

  changeTableList = (value) => {
    const { parmas, startTime, endTime, dateType } = this.props;
    this.props.getWeatherStationList({ ...parmas, startTime, dateType, endTime, ...value });
  }

  render() {
    const { dateType = 'day', total, parmas, listLoading, downloading, reportList, theme } = this.props;
    const { pageSize = 1, pageNum = 10, deviceFullcodes, sortMethod, sortField } = parmas;
    const { clientHeight } = document.body;
    // footer 60; thead: 73, handler: 55; search 70; padding 15; menu 40;
    const scrollY = clientHeight - 330;
    const scroll = { x: 2010, y: scrollY };
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <CneButton onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}>导出</CneButton>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <div className={styles.tableBox}>
          <CneTable
            columns={this.initColumn()}
            dataSource={reportList.map((e, i) => ({ ...e, key: i }))}
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
