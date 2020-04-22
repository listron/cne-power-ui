import React from 'react';
import styles from './centerInvert.scss';
import PropType from 'prop-types';
import { Table, Button, message } from 'antd';
import moment from 'moment';
import { dataFormat } from '../../../../../utils/utilFunc';
import CommonPagination from '@components/Common/CommonPagination';
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
    return (str.length + unit.length) * 14 + (2 * padding) + 30;
  }

  initColumn = (type) => { // 表头的数据
    const powerEnergy = type === 'month' ? '月发电量' : '日发电量';
    const params = [
      { name: powerEnergy, unit: 'kWh', dataIndex: 'inverterAactualPower', point: 2 },
      { name: '累计辐射', unit: 'MJ/m²', dataIndex: 'resourceValue', point: 2 },
      { name: '逆变器效率', unit: '%', dataIndex: 'invertEff', point: 2 },
      { name: '等效利用小时', unit: 'h', dataIndex: 'equivalentHours', point: 2 },
      { name: '可利用率', unit: '%', dataIndex: 'usefulRate', point: 2 },
      { name: '功率因数COS', unit: '', dataIndex: 'powerFactorAvg', point: 2 },
    ];
    const status = [
      { name: '正常运行时长', unit: 'h', dataIndex: 'normalOperationTime', point: 2 },
      { name: '限电运行时长', unit: 'h', dataIndex: 'limitOperationTime', point: 2 },
      { name: '正常停机时长', unit: 'h', dataIndex: 'normalShutdownTime', point: 2 },
      { name: '计划停机时长', unit: 'h', dataIndex: 'plannedShutdownTime', point: 2 },
      { name: '故障停机时长', unit: 'h', dataIndex: 'falutShutdownTime', point: 2 },
      { name: '通讯中断时长', unit: 'h', dataIndex: 'comlossTime', point: 2 },
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
        width: 140,
        fixed: 'left',
        sorter: true,
        textAlign: 'center',
        render: (text) => <div className={styles.statisticsDate} title={text}>{text}</div>,
      },
      {
        title: '运行参数',
        dataIndex: 'operateParams',
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
        title: '运行状态',
        dataIndex: 'operateStatus',
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
        title: '峰值功率',
        dataIndex: 'power',
        children: [
          {
            title: '交流有功功率(kW)', // 留着没有设置宽度
            dataIndex: 'acPowerMax',
            textAlign: 'right',
            width: 160,
            className: styles.rightText,
            render: value => dataFormat(value, '--', 2),
          },
          {
            title: '对应时间',
            dataIndex: 'acPowerTime',
            className: styles.centerText,
            width: 240,
            textAlign: 'center',
            render: value => value && moment(value).format('YYYY-MM-DD HH:mm:ss') || '--',
          },
        ],
      },
    ];
    return columns;
  }


  exportFile = () => { // 导出文件
    const { parmas, startTime, endTime, dateType } = this.props;
    const { deviceFullcodes } = parmas;
    const type = dateType === 'day' ? 'days' : 'month'; // 按月 月的长度 按日 日的天数
    const diffDays = Math.abs(moment(startTime).diff(moment(endTime), type));
    if (diffDays * deviceFullcodes.length > 200000) {
      message.warn('数据量过大，请减少电站数量或缩短时间范围的选择!');
      return;
    }
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.exportCenterInvert}`,
      params: { ...parmas, startTime, endTime, dateType },
    });
  }


  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
    this.changeTableList({ pageSize, pageNum: currentPage });
    this.props.changeStore({ parmas: { ...this.props.parmas, pageSize, pageNum: currentPage } });
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


  changeTableList = (value) => {
    const { parmas, startTime, endTime, dateType } = this.props;
    this.props.getCenterInverList({ ...parmas, startTime, dateType, endTime, ...value });
  }

  render() {
    const { dateType = 'day', total = 30, parmas, listLoading, downloading, reportList, theme } = this.props;
    const { pageSize = 1, pageNum = 10, deviceFullcodes, orderType, orderFiled } = parmas;
    const { clientHeight } = document.body;
    // footer 60; thead: 73, handler: 55; search 70; padding 15; menu 40;
    const scrollY = clientHeight - 330;
    const scroll = { x: 2400, y: scrollY };
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <CneButton onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}>导出</CneButton>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={theme} />
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
