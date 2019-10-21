import React from 'react';
import styles from './weatherStationBox.scss';
import PropType from 'prop-types';
import { Table, Button } from 'antd';
import moment from 'moment';
import { dataFormat } from '../../../../utils/utilFunc';
import CommonPagination from '@components/Common/CommonPagination';
import TableColumnTitle from '@components/Common/TableColumnTitle';
import path from '@constants/path';
const { APIBasePath } = path.basePaths;

class ReportSearch extends React.PureComponent {
  static propTypes = {
    parmas: PropType.object,
    startTime: PropType.string,
    endTime: PropType.string,
    dateType: PropType.string,
    getCenterInverList: PropType.func,
    total: PropType.number,
    listLoading: PropType.bool,
    changeStore: PropType.func,
    downLoadFile: PropType.func,
    downloading: PropType.bool,
    reportList: PropType.array,
    theme: PropType.string,
  }

  constructor() {
    super();
    this.width = 0;
  }

  componentDidMount() {

  }


  calcWidth = (str, unit) => {
    const padding = 8;
    return (str.length + unit.length) * 14 + (2 * padding) + 20;
  }

  initColumn = (type) => { // 表头的数据
    const params = [
      { name: '环境温度Avg', unit: '℃', dataIndex: 'temperatureAvg', point: 2 },
      { name: '环境温度Max', unit: '℃', dataIndex: 'temperatureMax', point: 2 },
      { name: '环境温度Min', unit: '℃', dataIndex: 'temperatureMin', point: 2 },
    ];
    const status = [
      { name: '水平总累计辐射', unit: 'MJ/m2', dataIndex: 'accRadiationMax', point: 2 },
      { name: '斜面总累计辐射', unit: 'MJ/m2', dataIndex: 'slopeAccRadiationSum', point: 2 },
    ];
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        width: 140,
        fixed: 'left',
        sorter: true,
        render: (text) => <div className={styles.deviceName} title={text}>{text}</div>,
      },
      {
        title: '统计时段',
        dataIndex: 'date',
        width: 120,
        fixed: 'left',
        sorter: true,
        defaultSortOrder: 'ascend',
      },
      {
        title: '环境温度',
        // dataIndex: 'operateParams',
        children: params.map(item => {
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
        title: () => <TableColumnTitle title="环境湿度Avg" unit="m/s" />,
        dataIndex: 'humidityAvg',
        width: 150,
        render: (text) => <div className={styles.deviceName} title={text}>{text}</div>,
      },
      {
        title: () => <TableColumnTitle title="瞬时斜面辐射Max" unit="W/m2" />,
        width: 150,
        dataIndex: 'slopeRadiationMax',
        render: (text) => <div className={styles.deviceName} title={text}>{text}</div>,
      },
      {
        title: '累计辐射强度',
        // dataIndex: 'operateStatus',
        children: status.map(item => {
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
        width: 130,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="风速Max" unit="m/s" />,
        dataIndex: 'windSpeedMax',
        width: 120,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="气压Avg" unit="Pa" />,
        dataIndex: 'pressureAvg',
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
    ];
    return columns;
  }


  exportFile = () => { // 导出文件
    const { parmas, startTime, endTime, dateType } = this.props;
    // `${APIBasePath}${reportManage.getCenterInvert}` : ;
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.getCenterInvert}`,
      params: { ...parmas, startTime, endTime, dateType },
    });
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
    this.changeTableList({ pageSize, pageNum: currentPage });
    this.props.changeStore({ parmas: { ...this.props.parmas, pageSize, pageNum: currentPage } });
  }

  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { order } = sorter;
    const orderType = order === 'ascend' ? 'asc' : 'desc';
    const orderFiled = this.getSortField[sorter.field] || 'report_time';
    this.props.changeStore({ parmas: { ...this.props.parmas, orderType, orderFiled } });
    this.changeTableList({ orderType, orderFiled });
  }

  // toLine = (name) => { // 驼峰转下划线
  //   return name.replace(/([A-Z])/g, '_$1').toLowerCase();
  // }

  getSortField = {
    'deviceName': 'device_name',
    'date': 'report_time',
  }

  changeTableList = (value) => {
    const { parmas, startTime, endTime, dateType } = this.props;
    this.props.getCenterInverList({ ...parmas, startTime, dateType, endTime, ...value });
  }

  render() {
    const { dateType = 'day', total = 30, parmas, listLoading, downloading, reportList, theme } = this.props;
    const { pageSize, pageNum, deviceFullcodes } = parmas;
    const reportList2 = [];
    for (var i = 30; i > 0; i--) {
      reportList2.push({
        key: i,
        deviceName: '电站电站电站电站电站电站电站电站电站电站电站电站电站' + i,
        date: moment().format('YYYY-MM'),
        temperatureAvg: (Math.random() + 1) * 10000,
        temperatureMax: (Math.random() + 1) * 10000,
        temperatureMin: (Math.random() + 1) * 10000,
        humidityAvg: (Math.random() + 1) * 10000,
        slopeRadiationMax: (Math.random() + 1) * 10000,
        accRadiationMax: (Math.random() + 1) * 10000,
        slopeAccRadiationSum: (Math.random() + 1) * 10000,
        sunshineHours: (Math.random() + 1) * 10000,
        windSpeedMax: (Math.random() + 1) * 10000,
        pressureAvg: (Math.random() + 1) * 10000,

      });
    }
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <Button type={'primary'} onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}>导出</Button>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <Table
          columns={this.initColumn(dateType)}
          dataSource={reportList2}
          bordered
          scroll={{ x: 1800, y: 500 }}
          pagination={false}
          showHeader={true}
          loading={listLoading}
          onChange={this.tableChange}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}


export default ReportSearch;
