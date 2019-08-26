import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import path from '../../../../constants/path';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { dataFormats } from '../../../../utils/utilFunc';
import styles from './dailyQuery.scss';

const { APIBasePath } = path.basePaths;
const { statisticalAnalysis } = path.APISubPaths;

class LimitList extends Component {
  static propTypes = {
    listParam: PropTypes.object,
    queryParam: PropTypes.object,
    limitListData: PropTypes.object,
    tableLoading: PropTypes.bool,
    changeDailyQueryStore: PropTypes.func,
    getLimitList: PropTypes.func,
    downLoadFile: PropTypes.func,
    powerInformation: PropTypes.string,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { changeDailyQueryStore, getLimitList, listParam, queryParam } = this.props;
    const { startDate, endDate, stationCodes } = queryParam;
    const newParam = {
      ...listParam,
      pageSize,
      pageNum: currentPage,
    };
    changeDailyQueryStore({
      ...newParam,
    });
    getLimitList({
      ...newParam,
      stationCodes,
      startDate,
      endDate,
    });
  }

  onExport = () => { // 列表导出
    const { downLoadFile, queryParam, listParam, powerInformation } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.getExportLimit}`;
    const { startDate, endDate, stationCodes } = queryParam;
    const { pageNum, pageSize } = listParam;

    downLoadFile({
      url,
      fileName: '限电列表',
      params: {
        pageNum,
        pageSize,
        stationCodes,
        startDate,
        endDate,
        powerInformation,
      },
    });
  }

  render(){
    const { listParam, limitListData, tableLoading } = this.props;
    const { pageNum, pageSize } = listParam;
    const { total, dataList = [] } = limitListData;

    const columns = [{
      title: '电站名称',
      width: 140,
      dataIndex: 'stationName',
      className: 'stationName',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }, {
      title: '区域',
      width: 80,
      dataIndex: 'regionName',
      className: 'regionName',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }, {
      title: '设备类型',
      width: 110,
      dataIndex: 'deviceTypeName',
      className: 'deviceTypeName',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }, {
      title: '设备名称',
      width: 110,
      dataIndex: 'deviceName',
      className: 'deviceName',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }, {
      title: '限功率',
      width: 100,
      dataIndex: 'limitPower',
      className: 'limitPower',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}%</div>,
    }, {
      title: '开始时间',
      width: 150,
      dataIndex: 'startTime',
      className: 'startTime',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }, {
      title: '截至时间',
      width: 150,
      dataIndex: 'endTime',
      className: 'endTime',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }, {
      title: () => <TableColumnTitle title="总时长" unit="h" />,
      width: 100,
      dataIndex: 'totalHours',
      className: 'totalHours',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="总损失电量" unit="kWh" />,
      width: 100,
      dataIndex: 'totalGen',
      className: 'totalGen',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="统计时长" unit="h" />,
      width: 100,
      dataIndex: 'statisticsHours',
      className: 'statisticsHours',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="统计损失电量" unit="kWh" />,
      width: 100,
      dataIndex: 'statisticsGen',
      className: 'statisticsGen',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: '原因',
      width: 170,
      dataIndex: 'reason',
      className: 'reason',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }];

    return (
      <div className={styles.limitList}>
        <div className={styles.pagination}>
          <Button className={styles.listExport} onClick={this.onExport} disabled={dataList.length === 0}>导出</Button>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={total}
            onPaginationChange={this.onPaginationChange}
          />
        </div>

        <Table
          loading={tableLoading}
          dataSource={dataList && dataList.map((e, i) => ({ ...e, key: i }))}
          columns={columns}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default LimitList;
