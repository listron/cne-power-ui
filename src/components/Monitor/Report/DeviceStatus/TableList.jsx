import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceStatus.scss';
import { Table, Radio } from "antd";
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma,dataFormats } from '../../../../utils/utilFunc';


class TableList extends Component {
  static propTypes = {
    getDeviceStatusList: PropTypes.func,
    changeDeviceStatusStore: PropTypes.func,
    onChangeFilter: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    filterTable: PropTypes.number,
    dateType: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    summaryType: PropTypes.number,
    summaryData: PropTypes.array,
    deviceStatusList: PropTypes.array,
    statusDetailList: PropTypes.array,
    tableType: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,

  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    this.props.changeDeviceStatusStore({ pageNum: currentPage, pageSize, })
    this.props.onChangeFilter({ pageNum: currentPage, pageSize })
  }
  ontableSort = (pagination, filter, sorter) => {
    const { onChangeFilter,tableType } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      date: '4',
      deviceStatusName: '5',
      num: '6',
      statusTime: '7',
      statusHours: '8',
      avgTime: '9',
    };
    const detailSortInfo={
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      deviceStatusName: '4',
      happenTime: '5',
      statusTime: '6',
      statusHours: '7',
      statusDescribe: '8',
    }
    const sortField =tableType==='all'? (sortInfo[field] ? sortInfo[field] : ''):(detailSortInfo[field] ? detailSortInfo[field] : '');
    const sortMethod = order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '';
    this.props.changeDeviceStatusStore({ sortField, sortMethod })
    onChangeFilter({ sortField, sortMethod })
  }
  initMonthColumn = () => {
    const { filterTable } = this.props;
    const filterShow = [
      {
        title: "区域",
        dataIndex: "regionName",
        sorter: true,
        // width:40,
      },
      {
        title: "电站名称",
        dataIndex: "stationName",
        sorter: true,
      },
      {
        title: "设备名称",
        dataIndex: "deviceName",
        sorter: true,
      },
      {
        title: "风机型号",
        dataIndex: "deviceModeName",
        sorter: true,
      },
    ];
    const show = filterShow.slice(0, filterTable);
    const showStatus = {
      title: "统计时段",
      dataIndex: "date",
      sorter: true,
    };
    const columns = [

      {
        title: "设备状态",
        dataIndex: "deviceStatusName",
        sorter: true,

      },
      {
        title: "次数",
        dataIndex: "num",
        sorter: true,
        render(text){ return numWithComma(dataFormats(text,'--',2,true)); },
      },

      {
        title: () => <TableColumnTitle title="状态时长" unit="s" />,
        dataIndex: "statusTime",
        sorter: true,
        render(text){ return numWithComma(dataFormats(text,'--',2,true)); },
      },
      {
        title: () => <TableColumnTitle title="状态小时数" unit="h" />,
        dataIndex: "statusHours",
        sorter: true,
        render(text){ return numWithComma(dataFormats(text,'--',2,true)); },
      },

      {
        title: "平均时长",
        dataIndex: "avgTime",
        sorter: true,

      },
    ];
    filterTable > 4 ? columns.unshift(showStatus) : columns.unshift(...show);
    return columns
  }
  detailColumn = () => {
    const columns = [
      {
        title: "区域",
        dataIndex: "regionName",
        sorter: true,
        // width:40,
      },
      {
        title: "电站名称",
        dataIndex: "stationName",
        sorter: true,
      },
      {
        title: "设备名称",
        dataIndex: "deviceName",
        sorter: true,
      },
      {
        title: "风机型号",
        dataIndex: "deviceModeName",
        sorter: true,
      },

      {
        title: "设备状态",
        dataIndex: "deviceStatusName",
        sorter: true,

      },
      {
        title: "发生时间",
        dataIndex: "happenTime",
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="状态时长" unit="s" />,
        dataIndex: "statusTime",
        sorter: true,
        render(text){ return numWithComma(dataFormats(text,'--',2,true)); },

      },
      {
        title: () => <TableColumnTitle title="状态小时数" unit="h" />,
        dataIndex: "statusHours",
        sorter: true,
        render(text){ return numWithComma(dataFormats(text,'--',2,true)); },

      },

      {
        title: "状态描述",
        dataIndex: "statusDescribe",
        sorter: true,

      },
    ];
    return columns
  }
  changeTable = (e) => {
    
    const tableType=e.target.value;
    this.props.changeDeviceStatusStore({tableType})
  }
  render() {
    const { total, pageSize, pageNum, deviceStatusList,tableType,statusDetailList } = this.props;
    const columns =tableType==='all'? this.initMonthColumn():this.detailColumn();
    const dataSource = tableType==='all'?deviceStatusList.map((e, i) => ({...e, key: i,})):statusDetailList.map((e, i) => ({...e, key: i,}));
    return (
      <React.Fragment>
        <div className={styles.tableHeader}>
          <div>
            <Radio.Group defaultValue="all" buttonStyle="solid" onChange={this.changeTable}>
              <Radio.Button value="all">汇总</Radio.Button>
              <Radio.Button value="detail">明细</Radio.Button>

            </Radio.Group>
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table columns={columns}
          dataSource={dataSource}
          onChange={this.ontableSort}
          // scroll={{ x: 1440 }}
          pagination={false} />
      </React.Fragment>
    )
  }
}

export default TableList;