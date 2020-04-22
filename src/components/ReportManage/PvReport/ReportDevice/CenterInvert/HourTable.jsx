import React from 'react';
import styles from './centerInvert.scss';
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

  calcWidth = (str, unit) => {
    const padding = 8;
    return (str.length + unit.length) * 14 + (2 * padding) + 30;
  }

  columnWidth = (width) => { // 因为是固定宽度，所以在1920的时候乘以了1.3 暂时不做
    // const clientWidth = document.body.clientWidth > 1680;
    // return clientWidth && width * 1.3 || width;
    return width;
  }

  initColumn = (type) => { // 表头的数据

    const power = [
      { name: '直流输入功率', unit: 'kW', dataIndex: 'inverterDcPower', point: 2 },
      { name: '交流有功功率', unit: 'kW', dataIndex: 'acPower', point: 2 },
      { name: '交流无功功率', unit: 'kW', dataIndex: 'acReactivePower', point: 2 },
    ];
    const DcPower = [ // 直流
      { name: '直流电压', unit: 'V', dataIndex: 'dcVoltage', point: 2 },
      { name: '直流电流', unit: 'A', dataIndex: 'dcCurrent', point: 2 },
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
        width: this.columnWidth(160),
        fixed: 'left',
        sorter: true,
        textAlign: 'left',
        render: (text) => <div className={styles.deviceNameText} title={text}>{text}</div>,
      },
      {
        title: '统计时段',
        dataIndex: 'date',
        width: this.columnWidth(130),
        fixed: 'left',
        sorter: true,
        defaultSortOrder: 'ascend',
        textAlign: 'center',
        render: (text) => <div className={styles.statisticsDate} title={text}>{text}</div>,
      },
      {
        title: () => <TableColumnTitle title="当日发电量" unit="kWh" />,
        dataIndex: 'inverterActualPower',
        width: this.columnWidth(140),
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="瞬时辐射" unit="W/m²" />,
        dataIndex: 'resourceValue',
        width: this.columnWidth(120),
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="逆变器效率" unit="%" />,
        dataIndex: 'invertEff',
        width: this.columnWidth(120),
        textAlign: 'right',
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
            width: this.columnWidth(this.calcWidth(item.name, item.unit)),
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
            width: this.columnWidth(this.calcWidth(item.name, item.unit)),
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
            width: this.columnWidth(this.calcWidth(item.name, item.unit)),
            render: value => dataFormat(value, '--', item.point),
          };
        }),
      },
      {
        title: '功率因数COS',
        dataIndex: 'powerFactorAvg',
        width: this.columnWidth(140),
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="电网频率" unit="Hz" />,
        dataIndex: 'powerFu',
        width: this.columnWidth(120),
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="机内温度" unit="℃" />,
        dataIndex: 'temperature',
        textAlign: 'right',
        // width: this.columnWidth(100),
        render: value => dataFormat(value, '--', 2),
      },
    ];
    return columns;
  }

  exportFile = () => { // 导出文件
    const { parmas, reportTime } = this.props;
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.exportDayCenterInvert}`,
      params: { ...parmas, reportTime },
    });
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
    this.props.changeStore({ parmas: { ...this.props.parmas, pageSize, pageNum: currentPage } });
    this.changeTableList({ pageSize, pageNum: currentPage });
  }

  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { parmas = {} } = this.props;
    const { orderType, orderFiled } = parmas;
    let newSortFild = orderFiled, newSortMethod = 'desc';
    const { field } = sorter;
    const getSortField = {
      'deviceName': 'device_name',
      'date': 'report_time',
    };
    if (!field || getSortField[field] === orderFiled) {
      newSortMethod = orderType === 'asc' ? 'desc' : 'asc'; // 交换排序方式
    } else {
      newSortFild = getSortField[field];
    }
    this.props.changeStore({ parmas: { ...this.props.parmas, orderType: newSortMethod, orderFiled: newSortFild } });
    this.changeTableList({ orderType: newSortMethod, orderFiled: newSortFild });
  }

  toLine = (name) => { // 驼峰转下划线
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
  }



  changeTableList = (value) => {
    const { parmas, reportTime } = this.props;
    this.props.getCenterInverList({ ...parmas, reportTime, ...value });
  }



  render() {
    const { total = 30, parmas, listLoading, downloading, reportList, theme } = this.props;
    const { pageSize = 1, pageNum = 10, deviceFullcodes, orderType, orderFiled } = parmas;
    const { clientHeight } = document.body;
    // footer 60; thead: 73, handler: 55; search 70; padding 15; menu 40;
    const scrollY = clientHeight - 330;
    const scroll = { x: 2620, y: scrollY };
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <CneButton onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}> 导出</CneButton>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={'theme'} />
        </div>
        <div className={styles.tableBox}>
          <CneTable
            columns={this.initColumn()}
            dataSource={reportList.map((e, index) => { return { ...e, key: index }; })}
            scroll={scroll}
            pagination={false}
            showHeader={true}
            loading={listLoading}
            onChange={this.tableChange}
            sortField={{ 'device_name': 'deviceName', 'report_time': 'date' }[orderFiled]}
            sortMethod={{ 'asc': 'ascend', 'desc': 'descend' }[orderType]}
          />
        </div>
      </div>
    );
  }
}


export default ReportSearch;
