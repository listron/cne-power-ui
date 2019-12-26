import React from 'react';
import styles from './combineInvert.scss';
import PropType from 'prop-types';
import { Table, Button } from 'antd';
import moment from 'moment';
import { dataFormat } from '../../../../../utils/utilFunc';
import CommonPagination from '@components/Common/CommonPagination';
import TableColumnTitle from '@components/Common/TableColumnTitle';
import path from '@constants/path';
const { APIBasePath } = path.basePaths;

class ReportSearch extends React.PureComponent {
  static propTypes = {
    parmas: PropType.object,
    getCombineInvertList: PropType.func,
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
    return (str.length + unit.length) * 14 + (2 * padding) + 10;
  }

  initColumn = (type) => { // 表头的数据
    const power = [
      { name: '直流输入功率', unit: 'kW', dataIndex: 'inverterDcPower', point: 2 },
      { name: '交流有功功率', unit: 'kW', dataIndex: 'acPower', point: 2 },
      { name: '交流无功功率', unit: 'kW', dataIndex: 'acReactivePower', point: 2 },
    ];
    const DcPower = [ // 直流
      { name: 'PV1电压', unit: 'V', dataIndex: 'voltagePv1', point: 2 },
      { name: 'PV1电流', unit: 'A', dataIndex: 'currentPv1', point: 2 },
      { name: 'PV2电压', unit: 'V', dataIndex: 'voltagePv2', point: 2 },
      { name: 'PV2电流', unit: 'A', dataIndex: 'currentPv2', point: 2 },
      { name: 'PV3电压', unit: 'V', dataIndex: 'voltagePv3', point: 2 },
      { name: 'PV3电流', unit: 'A', dataIndex: 'currentPv3', point: 2 },
      { name: 'PV4电压', unit: 'V', dataIndex: 'voltagePv4', point: 2 },
      { name: 'PV4电流', unit: 'A', dataIndex: 'currentPv4', point: 2 },
      { name: 'PV5电压', unit: 'V', dataIndex: 'voltagePv5', point: 2 },
      { name: 'PV5电流', unit: 'A', dataIndex: 'currentPv5', point: 2 },
      { name: 'PV6电压', unit: 'V', dataIndex: 'voltagePv6', point: 2 },
      { name: 'PV6电流', unit: 'A', dataIndex: 'currentPv6', point: 2 },
      { name: 'PV7电压', unit: 'V', dataIndex: 'voltagePv7', point: 2 },
      { name: 'PV7电流', unit: 'A', dataIndex: 'currentPv7', point: 2 },
      { name: 'PV8电压', unit: 'V', dataIndex: 'voltagePv8', point: 2 },
      { name: 'PV8电流', unit: 'A', dataIndex: 'currentPv8', point: 2 },
    ];
    const AcPower = [ // 交流
      { name: 'Uab', unit: 'V', dataIndex: 'Uab', point: 2 },
      { name: 'Ubc', unit: 'V', dataIndex: 'Ubc', point: 2 },
      { name: 'Uca', unit: 'V', dataIndex: 'Uca', point: 2 },
      { name: 'Ua', unit: 'V', dataIndex: 'Ua', point: 2 },
      { name: 'Ub', unit: 'V', dataIndex: 'Ub', point: 2 },
      { name: 'Uc', unit: 'V', dataIndex: 'Uc', point: 2 },
      { name: 'Ia', unit: 'V', dataIndex: 'Ia', point: 2 },
      { name: 'Ib', unit: 'V', dataIndex: 'Ib', point: 2 },
      { name: 'Ic', unit: 'V', dataIndex: 'Ic', point: 2 },
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
        // render: value => moment(value).format('HH:mm'),
        defaultSortOrder: 'ascend',
      },
      {
        title: () => <TableColumnTitle title="当日发电量" unit="kWh" />,
        dataIndex: 'inverterActualPower',
        width: 120,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="瞬时辐射" unit="W/m²" />,
        dataIndex: 'resourceValue',
        width: 100,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="逆变器效率" unit="%" />,
        dataIndex: 'invertEff',
        width: 100,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: '运行功率',
        dataIndex: 'powerData',
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
        title: '直流侧数据',
        dataIndex: 'DcPowerData',
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
        title: '交流侧数据',
        dataIndex: 'AcPowerData',
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
        title: '功率因数COS',
        dataIndex: 'powerFactorAvg',
        width: 120,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="电网频率" unit="Hz" />,
        dataIndex: 'powerFu',
        width: 100,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="机内温度" unit="℃" />,
        dataIndex: 'temperature',
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
    ];
    return columns;
  }

  exportFile = () => { // 导出文件
    const { parmas, reportTime } = this.props;
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.exportHourCombineInvert}`,
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
    this.props.getCombineInvertList({ ...parmas, reportTime, ...value });
  }



  render() {
    const { total = 30, parmas, listLoading, downloading, theme, reportList } = this.props;
    const { pageSize = 1, pageNum = 10, deviceFullcodes } = parmas;
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <Button type={'primary'} onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}> 导出</Button>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={'theme'} />
        </div>
        <Table
          columns={this.initColumn()}
          dataSource={reportList.map((e, index) => { return { ...e, key: index }; })}
          bordered
          scroll={{ x: 3700, y: 500 }}
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
