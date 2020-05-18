import React from 'react';
import styles from './confluenceBox.scss';
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

class ReportTable extends React.PureComponent {
  static propTypes = {
    parmas: PropType.object,
    getConfluenceBoxList: PropType.func,
    total: PropType.number,
    listLoading: PropType.bool,
    changeStore: PropType.func,
    reportTime: PropType.string,
    downLoadFile: PropType.func,
    downloading: PropType.bool,
    reportList: PropType.array,
    theme: PropType.string,
    stationName: PropType.string,
  }

  constructor() {
    super();
    this.width = 0;
  }

  calcWidth = (str, unit) => {
    const padding = 8;
    return (str.length + unit.length) * 14 + (2 * padding) + 30;
  }

  initColumn = (type) => { // 表头的数据
    const { maxPvCount } = this.props;
    const electric = Array.apply(null, Array(maxPvCount)).map((item, e) => { return { name: `I${e + 1}`, unit: 'A', dataIndex: `i${e + 1}`, point: 2 }; });
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
        render: (text) => <div className={styles.statisticsDate} title={text}>{moment(text).format('HH:mm')}</div>,
      },
      {
        title: () => <TableColumnTitle title="总电流" unit="A" />,
        dataIndex: 'totalCurrent',
        width: 110,
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="母线电压" unit="V" />,
        dataIndex: 'busbarVoltage',
        width: 100,
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="总功率" unit="kW" />,
        dataIndex: 'totalPower',
        width: 130,
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: '支路电流',
        dataIndex: 'electric',
        children: electric.map(item => {
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
        title: () => <TableColumnTitle title="机内温度" unit="℃" />,
        dataIndex: 'inMachineTemperature',
        textAlign: 'right',
        render: value => dataFormat(value, '--', 2),
      },
    ];
    return columns;
  }

  exportFile = () => { // 导出文件
    const { parmas, reportTime, stationName } = this.props;
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.exportConfluenceBox}`,
      params: { ...parmas, reportTime, stationName },
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

  toLine = (name) => { // 驼峰转下划线
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  changeTableList = (value) => {
    const { parmas, reportTime } = this.props;
    this.props.getConfluenceBoxList({ ...parmas, reportTime, ...value });
  }


  render() {
    const { total = 30, parmas, listLoading, downloading, theme, reportList, maxPvCount } = this.props;
    const { pageSize = 1, pageNum = 10, deviceFullcodes, sortMethod, sortField } = parmas;
    const { clientHeight } = document.body;
    // footer 60; thead: 73, handler: 55; search 70; padding 15; menu 40;
    const scrollY = clientHeight - 330;
    const datalist = [];
    if (reportList) {
      reportList.forEach((item, index) => {
        const it = { ...item, key: index };
        const { pvList } = item;
        if (pvList) {
          pvList.forEach((currentItem, currentIndex) => {
            const k = `i${currentIndex + 1}`;
            it[k] = currentItem;
          });
        }
        datalist.push(it);
      });
    }
    const posx = 2650 - 103 * (20 - maxPvCount);
    const scroll = { x: posx, y: scrollY };
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <CneButton onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}> 导出</CneButton>
          <CommonPagination className={styles.pagination} total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={'theme'} />
        </div>
        <div className={styles.tableBox}>
          <CneTable
            columns={this.initColumn()}
            dataSource={datalist}
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


export default ReportTable;
