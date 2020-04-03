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

  componentDidMount() {

  }


  calcWidth = (str, unit) => {
    const padding = 8;
    return (str.length + unit.length) * 14 + (2 * padding) + 10;
  }

  initColumn = (type) => { // 表头的数据
    const {maxPvCount} = this.props;
    const electric = Array.apply(null, Array(maxPvCount)).map((item, e) => { return { name: `I${e + 1}`, unit: 'A', dataIndex: `i${e + 1}`, point: 2 }; });
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
        defaultSortOrder: 'ascend',
        render: (text) => <div className={styles.statisticsDate} title={text}>{moment(text).format('HH:mm')}</div>,
      },
      {
        title: () => <TableColumnTitle title="总电流" unit="A" />,
        dataIndex: 'totalCurrent',
        width: 90,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="母线电压" unit="V" />,
        dataIndex: 'busbarVoltage',
        width: 80,
        className: styles.rightText,
        render: value => dataFormat(value, '--', 2),
      },
      {
        title: () => <TableColumnTitle title="总功率" unit="kW" />,
        dataIndex: 'totalPower',
        width: 110,
        className: styles.rightText,
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
        className: styles.rightText,
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
    this.props.changeStore({ parmas: { ...this.props.parmas, pageSize, pageNum: currentPage } });
    this.changeTableList({ pageSize, pageNum: currentPage });
  }

  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { order } = sorter;
    const sortMethod = order === 'ascend' ? 'asc' : 'desc';
    const sortField = this.getSortField[sorter.field] || 'report_time';
    this.props.changeStore({ parmas: { ...this.props.parmas, sortMethod, sortField } });
    this.changeTableList({ sortMethod, sortField });
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
    this.props.getConfluenceBoxList({ ...parmas, reportTime, ...value });
  }



  render() {
    const { total = 30, parmas, listLoading, downloading, theme, reportList, maxPvCount } = this.props;
    const { pageSize = 1, pageNum = 10, deviceFullcodes } = parmas;
    const datalist = [];
    if (reportList) {
      reportList.forEach((item, index) => {
        let it = { ...item, key: index };
        const {pvList} = item;
        if (pvList) {
          pvList.forEach((currentItem, currentIndex) => {
            const k = `i${currentIndex + 1}`;
            it[k] = currentItem;
          })
        }
        datalist.push(it);
      })
    }
    const posx = 2150 - 83 * (20-maxPvCount);
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <CneButton onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}> 导出</CneButton>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={'theme'} />
        </div>
        <div className={styles.tableBox}>
          <CneTable
            columns={this.initColumn()}
            dataSource={datalist}
            bordered
            scroll={{ x: posx, y: 450 }}
            pagination={false}
            showHeader={true}
            loading={listLoading}
            onChange={this.tableChange}
            locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          />
        </div>
      </div>
    );
  }
}


export default ReportTable;
