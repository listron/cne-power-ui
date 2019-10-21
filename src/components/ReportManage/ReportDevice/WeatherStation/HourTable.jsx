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
    getCenterInverList: PropType.func,
    total: PropType.number,
    listLoading: PropType.bool,
    changeStore: PropType.func,
    reportTime: PropType.string,
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
        width: 140,
        fixed: 'left',
        sorter: true,
        render: (text) => <div className={styles.deviceName} title={text}>{text}</div>,
      },
      {
        title: '统计时段',
        dataIndex: 'date',
        width: 110,
        fixed: 'left',
        sorter: true,
        render: value => moment(value).format('HH:mm'),
        defaultSortOrder: 'ascend',
      },
      {
        title: () => <TableColumnTitle title="环境温度" unit="℃" />,
        dataIndex: 'temperature',
        width: 120,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="环境湿度" unit="%RH" />,
        dataIndex: 'humidity',
        width: 100,
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
    const { parmas, reportTime } = this.props;
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.getDayCenterInvert}`,
      params: { ...parmas, reportTime },
    });
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
    this.props.changeStore({ parmas: { ...this.props.parmas, pageSize, pageNum: currentPage } });
    this.changeTableList({ pageSize, pageNum: currentPage });
  }

  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { order } = sorter;
    const orderType = order === 'ascend' ? 'asc' : 'desc';
    const orderFiled = this.getSortField[sorter.field] || 'report_time';
    this.props.changeStore({ parmas: { ...this.props.parmas, orderType, orderFiled } });
    this.changeTableList({ orderType, orderFiled });
  }

  toLine = (name) => { // 驼峰转下划线
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  getSortField = {
    'deviceName': 'device_name',
    'date': 'report_time',
  }

  changeTableList = (value) => {
    const { parmas, reportTime } = this.props;
    this.props.getCenterInverList({ ...parmas, reportTime, ...value });
  }



  render() {
    const { total = 30, parmas, listLoading, downloading, reportList, theme } = this.props;
    const { pageSize = 1, pageNum = 10, deviceFullcodes } = parmas;
    const reportList2 = [];
    for (var i = 30; i > 0; i--) {
      reportList2.push({
        key: i,
        deviceName: '电站电站电站电站电站电站电站电站电站电站电站电站电站' + i,
        date: moment().format('YYYY-MM'),
        temperature: (Math.random() + 1) * 10000,
        humidity: (Math.random() + 1) * 10000,
        part1Temperature: (Math.random() + 1) * 10000,
        part2Temperature: (Math.random() + 1) * 100,
        accRadiationMax: (Math.random() + 1) * 10000,
        slopeRadiationMax: (Math.random() + 1) * 10000,
        accRadiation: (Math.random() + 1) * 10000,
        slopeRadiation: (Math.random() + 1) * 10000,
        windSpeed: (Math.random() + 1) * 10000,
        windDirector: (Math.random() + 1) * 10000,
        pressure: (Math.random() + 1) * 10000,
      });
    }
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <Button type={'primary'} onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}> 导出</Button>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={'theme'} />
        </div>
        <Table
          columns={this.initColumn()}
          dataSource={reportList2}
          bordered
          scroll={{ x: 1660, y: 500 }}
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
