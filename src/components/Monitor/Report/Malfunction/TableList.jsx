import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './malfunction.scss';
import { Table, Radio } from "antd";
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../utils/utilFunc';


class TableList extends Component {
  static propTypes = {
    getMalfunctionList: PropTypes.func,
    changeMalfunctionStore: PropTypes.func,
    getMalfunctionDetail: PropTypes.func,
    onChangeFilter: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    dateType: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    summaryType: PropTypes.number,
    filterTable: PropTypes.number,
    summaryData: PropTypes.array,
    malfunctionList: PropTypes.array,
    malfunctionDetailList: PropTypes.array,
    tableType: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    params: PropTypes.object,
  }
  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    this.props.changeMalfunctionStore({ pageNum: currentPage, pageSize, })
    this.props.onChangeFilter({ pageNum: currentPage, pageSize })
  }
  ontableSort = (pagination, filter, sorter) => {
    const { onChangeFilter, tableType } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      date: '4',
      num: '5',
      faultTime: '6',
      faultHours: '7',
      faultGen: '8',
      faultDescribe: '9',

    };
    const detailSortInfo = {
      regionName: '0',
      stationName: '1',
      deviceName: '2',
      deviceModeName: '3',
      belongComponent: '4',
      faultDescribe: '5',
      faultStartTime: '6',
      faultEndTime: '7',
      faultCode: '8',
      faultTime: '9',
      faultHours: '10',
    }
    const sortField = tableType === 'all' ? (sortInfo[field] ? sortInfo[field] : '') : (detailSortInfo[field] ? detailSortInfo[field] : '');
    const sortMethod = order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '';
    this.props.changeMalfunctionStore({ sortField, sortMethod })
    onChangeFilter({ sortField, sortMethod })
  }
  initMonthColumn = () => {
    const { filterTable } = this.props;
    const filterDevice=[ {
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
      title: "设备型号",
      dataIndex: "deviceModeName",
      sorter: true,
    },]
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
    
    let show = filterTable>3?filterShow.slice(0, filterTable):filterDevice.slice(0, filterTable);
    const showFault = [
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
      }, {
        title: "故障描述",
        dataIndex: "deviceFaultName",
        sorter: true,
        defaultSortOrder: 'ascend'
      }];

    const columns = [
      {
        title: "统计时段",
        dataIndex: "date",
        sorter: true,
        render(text){return text.replace(/-/g,'/').replace(',','-')}
      },
      {
        title: "次数",
        dataIndex: "num",
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      },

      {
        title: () => <TableColumnTitle title="故障时长" unit="s" />,
        dataIndex: "faultTime",
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      },
      {
        title: () => <TableColumnTitle title="故障小时数" unit="h" />,
        dataIndex: "faultHours",
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      },

      {
        title: "损失电量",
        dataIndex: "faultGen",
        sorter: true,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      },
    ];
    filterTable > 4 ? columns.unshift(...showFault) : columns.unshift(...show);
    return columns
  }
  detailColumn = () => {
    const columns = [
      {
        title: "区域",
        dataIndex: "regionName",
        sorter: true,
        fixed: 'left',
        width:80,
      },
      {
        title: "电站名称",
        dataIndex: "stationName",
        sorter: true,
        fixed: 'left',
        width:108,
      }, {
        title: "设备名称",
        dataIndex: "deviceName",
        sorter: true,
        fixed: 'left',
        width:108,
      }, {
        title: "风机型号",
        dataIndex: "deviceModeName",
        sorter: true,
        fixed: 'left',
        width:108,
      }, {
        title: "所属部件",
        dataIndex: "belongComponent",
        sorter: true,
        width:112,
        render(text){ return(text?text:'--')},
      }, {
        title: "故障描述",
        dataIndex: "faultDescribe",
        sorter: true,
        width:112,
        render(text){ return(text?text:'--')},
      }, {
        title: "故障开始时间",
        dataIndex: "faultStartTime",
        sorter: true,
        width:140,
      }, {
        title: "故障结束时间",
        dataIndex: "faultEndTime",
        sorter: true,
        width:140,
      }, {
        title: "故障代码",
        dataIndex: "faultCode",
        sorter: true,
        width:112,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
      }, {
        title: () => <TableColumnTitle title="故障时长" unit="s" />,
        dataIndex: "faultTime",
        sorter: true,
        width:112,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      },
      {
        title: () => <TableColumnTitle title="故障小时数" unit="h" />,
        dataIndex: "faultHours",
        sorter: true,
        width:112,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight

      }, {
        title: "损失电量",
        dataIndex: "faultGen",
        sorter: true,
        width:112,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      }, {
        title: "风速",
        dataIndex: "windSpeedAvg",
        sorter: true,
        width:112,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      }, {
        title: "有功功率",
        dataIndex: "usePower",
        sorter: true,
        width:112,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight

      }, {
        title: "发电机转速",
        dataIndex: "speed",
        sorter: true,
        width:112,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      },{
        title: "桨叶角",
        dataIndex: "bladeAngle",
        sorter: true,
        // width:112,
        render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
        className:styles.numRight
      },
    ];
    return columns
  }
  changeTable = (e) => {
    const tableType = e.target.value;
    this.props.changeMalfunctionStore({ tableType });
    tableType==='all'&&this.props.getMalfunctionList({ ...this.props.params })
    tableType==='detail'&&this.props.getMalfunctionDetail({ ...this.props.params })
  }


  render() {
    const { total, pageSize, pageNum, malfunctionList, tableType, malfunctionDetailList,loading } = this.props;
    const columns = tableType === 'all' ? this.initMonthColumn() : this.detailColumn();
    const dataSource = tableType === 'all' ? malfunctionList.map((e, i) => ({ ...e, key: i, })) : malfunctionDetailList.map((e, i) => ({ ...e, key: i, }));
    return (
      <React.Fragment>
        <div className={styles.tableHeader}>
          <div>
            <Radio.Group value={tableType} buttonStyle="solid" onChange={this.changeTable}>
              <Radio.Button value="all">汇总</Radio.Button>
              <Radio.Button value="detail">明细</Radio.Button>
            </Radio.Group>
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          onChange={this.ontableSort}
          scroll={tableType === "detail" ? {x:1900} : {x:0}}
          pagination={false} />
      </React.Fragment>
    )
  }
}

export default TableList;