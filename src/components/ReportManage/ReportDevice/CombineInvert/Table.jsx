import React from 'react';
import styles from './combineInvert.scss';
import PropType from 'prop-types';
import { Table, Button } from 'antd';
import moment from 'moment';
import { dataFormat } from '../../../../utils/utilFunc';
import CommonPagination from '@components/Common/CommonPagination';
import path from '@constants/path';
const { APIBasePath } = path.basePaths;

class ReportSearch extends React.PureComponent {
  static propTypes = {
    parmas: PropType.object,
    startTime: PropType.string,
    endTime: PropType.string,
    dateType: PropType.string,
    getCombineInvertList: PropType.func,
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
            className: styles.rightText,
            render: value => dataFormat(value, '--', 2),
          },
          {
            title: '对应时间',
            dataIndex: 'acPowerTime',
            // className: styles.rightText,
            width: 180,
            render: value => value && moment(value).format('YYYY-MM-DD HH:mm:ss') || '--',
          },
        ],
      },
    ];
    return columns;
  }


  exportFile = () => { // 导出文件
    const { parmas, startTime, endTime, dateType } = this.props;
    this.props.downLoadFile({
      url: `${APIBasePath}${path.APISubPaths.reportManage.exportCombineInvert}`,
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
    this.props.getCombineInvertList({ ...parmas, startTime, dateType, endTime, ...value });
  }

  render() {
    const { dateType = 'day', total = 30, parmas, listLoading, downloading, reportList, theme } = this.props;
    const { pageSize, pageNum, deviceFullcodes } = parmas;
    console.log('deviceFullcodes', deviceFullcodes);
    // const reportList = [];
    // for (var i = 30; i > 0; i--) {
    //   reportList.push({
    //     key: i,
    //     deviceName: '电站电站电站电站电站电站电站电站电站电站电站电站电站' + i,
    //     date: moment().format('YYYY-MM'),
    //     inverterAactualPower: (Math.random() + 1) * 1000000,
    //     resourceValue: (Math.random() + 1) * 10000,
    //     invertEff: (Math.random() + 1) * 10000,
    //     equivalentHours: (Math.random() + 1) * 100,
    //     usefulRate: (Math.random() + 1) * 10000,
    //     powerFactorAvg: (Math.random() + 1) * 10000,
    //     normalOperationTime: (Math.random() + 1) * 10000,
    //     limitOperationTime: (Math.random() + 1) * 10000,
    //     normalShutdownTime: (Math.random() + 1) * 10000,
    //     plannedShutdownTime: (Math.random() + 1) * 10000,
    //     falutShutdownTime: (Math.random() + 1) * 10000,
    //     comlossTime: (Math.random() + 1) * 10000,
    //     acPowerMax: (Math.random() + 1) * 10000,
    //     acPowerTime: moment('2019-12-23').format('YYYY-MM-DD HH:mm:ss'),
    //   });
    // }
    return (
      <div className={`${styles.reporeTable} ${styles[theme]}`}>
        <div className={styles.top}>
          <Button type={'primary'} onClick={this.exportFile} disabled={deviceFullcodes.length === 0} loading={downloading}>导出</Button>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <Table
          columns={this.initColumn(dateType)}
          dataSource={reportList.map(e => { return { ...e, key: e.date }; })}
          bordered
          scroll={{ x: 2200, y: 500 }}
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
