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

class FaultList extends Component {
  static propTypes = {
    listParam: PropTypes.object,
    queryParam: PropTypes.object,
    faultListData: PropTypes.object,
    changeDailyQueryStore: PropTypes.func,
    getFaultList: PropTypes.func,
    tableLoading: PropTypes.bool,
    exportLoading: PropTypes.bool,
    faultIds: PropTypes.array,
    keyWord: PropTypes.string,
    downLoadFile: PropTypes.func,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { changeDailyQueryStore, getFaultList, listParam, queryParam, keyWord } = this.props;
    const { startDate, endDate, stationCodes } = queryParam;
    const newParam = {
      ...listParam,
      pageSize,
      pageNum: currentPage,
    };
    changeDailyQueryStore({
      ...newParam,
    });
    getFaultList({
      ...newParam,
      stationCodes,
      startDate,
      endDate,
      keyWord,
    });
  }

  onExport = () => { // 列表导出
    const { downLoadFile, queryParam, listParam, keyWord, faultIds } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.getExportFault}`;
    const { startDate, endDate, stationCodes } = queryParam;
    const { pageNum, pageSize } = listParam;
    const faultId = faultIds.map(e => {
      return Number(e.value);
    });

    downLoadFile({
      url,
      fileName: '故障列表',
      loadingName: 'exportLoading',
      params: {
        pageNum,
        pageSize,
        stationCodes,
        startDate,
        endDate,
        keyWord,
        faultIds: faultId,
      },
    });
  }

  render() {
    const { listParam, faultListData, tableLoading, exportLoading } = this.props;
    const { pageNum, pageSize } = listParam;
    const { total = 0, dataList = [] } = faultListData;
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
      render: (text) => <div className="regionNameText" title={text}>{text}</div>,
    }, {
      title: '损失电量类型',
      width: 140,
      dataIndex: 'faultTypeName',
      className: 'faultTypeName',
      fixed: 'left',
      textAlign: 'left',
      render: (text) => <div className="faultTypeNameText" title={text}>{text}</div>,
    }, {
      title: '设备类型',
      width: 110,
      textAlign: 'left',
      dataIndex: 'deviceTypeName',
      fixed: 'left',
      render: (text) => <div className="deviceTypeNameText" title={text}>{text || '--'}</div>,
    }, {
      title: '设备名称',
      width: 110,
      dataIndex: 'deviceName',
      fixed: 'left',
      textAlign: 'left',
      render: (text) => <div className="deviceNameText" title={text}>{text || '--'}</div>,
    }, {
      title: '厂家',
      dataIndex: 'manufactorName',
      textAlign: 'left',
      render: (text) => <div className="manufactorNameText" title={text}>{text || '--'}</div>,
    }, {
      title: '型号',
      textAlign: 'left',
      dataIndex: 'deviceModeName',
      render: (text) => <div className="deviceModeNameText" title={text}>{text || '--'}</div>,
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
      title: () => <TableColumnTitle title="总时长" unit="h" style={{ maxWidth: '100%', height: '52px' }} />,
      dataIndex: 'totalHours',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="总损失电量" unit="kWh" style={{ maxWidth: '100%', height: '52px' }} />,
      dataIndex: 'totalGen',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="统计时长" unit="h" style={{ maxWidth: '100%', height: '52px' }} />,
      dataIndex: 'statisticsHours',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: () => <TableColumnTitle title="统计损失电量" unit="kWh" style={{ maxWidth: '100%', height: '52px' }} />,
      dataIndex: 'statisticsGen',
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <div title={text}>{(dataFormats(text, '--', 2, true))}</div>,
    }, {
      title: '原因',
      width: 170,
      textAlign: 'left',
      dataIndex: 'reason',
      render: (text) => <div className="reasonText" title={text}>{text || '--'}</div>,
    }, {
      title: '故障处理进展',
      width: 170,
      textAlign: 'left',
      dataIndex: 'process',
      render: (text) => <div className="reasonText" title={text}>{text || '--'}</div>,
    }];

    return (
      <div className={styles.faultList}>
        <div className={styles.pagination}>
          {dailyOperation ?
            <CneButton
              className={dataList.length === 0 ? styles.disabledExport : styles.listExport}
              onClick={this.onExport}
              loading={exportLoading}
              lengthMode="short"
              disabled={dataList.length === 0}
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
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default FaultList;
