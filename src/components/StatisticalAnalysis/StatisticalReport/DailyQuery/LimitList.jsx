import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import path from '../../../../constants/path';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { dataFormats, handleRight } from '../../../../utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';
import styles from './dailyQuery.scss';

const { APIBasePath } = path.basePaths;
const { statisticalAnalysis } = path.APISubPaths;

class LimitList extends Component {
  static propTypes = {
    listParam: PropTypes.object,
    queryParam: PropTypes.object,
    limitListData: PropTypes.object,
    tableLoading: PropTypes.bool,
    exportLoading: PropTypes.bool,
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
      loadingName: 'exportLoading',
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
    const { listParam, limitListData, tableLoading, exportLoading } = this.props;
    const { pageNum, pageSize } = listParam;
    const { total, dataList = [] } = limitListData;
    const dailyOperation = handleRight('dailyQuery_export');

    const columns = [{
      title: '电站名称',
      width: 140,
      dataIndex: 'stationName',
      className: 'stationName',
      fixed: 'left',
      textAlign: 'left',
      render: (text) => <div className="stationNameText" title={text}>{text || '--'}</div>,
    }, {
      title: '区域',
      width: 80,
      dataIndex: 'regionName',
      className: 'regionName',
      fixed: 'left',
      textAlign: 'left',
      render: (text) => <div className="regionNameText" title={text}>{text || '--'}</div>,
    }, {
      title: '设备类型',
      width: 110,
      dataIndex: 'deviceTypeName',
      className: 'deviceTypeName',
      fixed: 'left',
      textAlign: 'left',
      render: (text) => <div className="deviceTypeNameText" title={text}>{text || '--'}</div>,
    }, {
      title: '设备名称',
      width: 100,
      dataIndex: 'deviceName',
      className: 'deviceName',
      fixed: 'left',
      textAlign: 'left',
      render: (text) => <div className="deviceNameText" title={text}>{text || '--'}</div>,
    }, {
      title: '限功率',
      dataIndex: 'limitPower',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}%</div>,
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      className: 'numberStyle',
      textAlign: 'center',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }, {
      title: '截止时间',
      dataIndex: 'endTime',
      className: 'numberStyle',
      textAlign: 'center',
      render: (text) => <div title={text}>{text || '--'}</div>,
    }, {
      title: () => <TableColumnTitle title="总时长" unit="h" />,
      dataIndex: 'totalHours',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="总损失电量" unit="kWh" />,
      dataIndex: 'totalGen',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="统计时长" unit="h" />,
      dataIndex: 'statisticsHours',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="统计损失电量" unit="kWh" />,
      dataIndex: 'statisticsGen',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: '原因',
      width: 170,
      dataIndex: 'reason',
      className: 'reason',
      textAlign: 'left',
      render: (text) => <div className="reasonText" title={text}>{text || '--'}</div>,
    }];

    return (
      <div className={styles.limitList}>
        <div className={styles.pagination}>
        {dailyOperation ?
          <CneButton
            className={dataList.length === 0 ? styles.disabledExport : styles.listExport}
            onClick={this.onExport}
            loading={exportLoading}
            disabled={dataList.length === 0}
            lengthMode="short"
          >导出</CneButton> : <div></div>}
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={total}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <CneTable
          loading={tableLoading}
          dataSource={dataList && dataList.map((e, i) => ({ ...e, key: i }))}
          columns={columns}
          pagination={false}
          scroll={{x: 'max-content' }}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default LimitList;
