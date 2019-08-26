import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import path from '../../../../constants/path';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { dataFormats } from '../../../../utils/utilFunc';
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

    downLoadFile({
      url,
      fileName: '故障列表',
      params: {
        pageNum,
        pageSize,
        stationCodes,
        startDate,
        endDate,
        keyWord,
        faultIds,
      },
    });
  }

  render(){
    const { listParam, faultListData, tableLoading } = this.props;
    const { pageNum, pageSize } = listParam;
    const { total = 0, dataList = [] } = faultListData;

    const columns = [{
      title: '电站名称',
      width: 140,
      dataIndex: 'stationName',
      className: 'stationName',
      fixed: 'left',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '区域',
      width: 80,
      dataIndex: 'regionName',
      className: 'regionName',
      fixed: 'left',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '损失电量类型',
      width: 140,
      dataIndex: 'faultTypeName',
      className: 'faultTypeName',
      fixed: 'left',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '设备类型',
      width: 100,
      dataIndex: 'deviceTypeName',
      className: 'deviceTypeName',
      fixed: 'left',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '设备名称',
      width: 120,
      dataIndex: 'deviceName',
      className: 'deviceName',
      fixed: 'left',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '厂家',
      width: 125,
      dataIndex: 'manufactorName',
      className: 'manufactorName',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '型号',
      width: 110,
      dataIndex: 'deviceModeName',
      className: 'deviceModeName',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '开始时间',
      width: 160,
      dataIndex: 'startTime',
      className: 'startTime',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '截至时间',
      width: 160,
      dataIndex: 'endTime',
      className: 'endTime',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: () => <TableColumnTitle title="总时长" unit="h" style={{ maxWidth: '100%', height: '52px' }} />,
      width: 80,
      dataIndex: 'totalHours',
      className: 'totalHours',
      render: (text) => <span title={text}>{(dataFormats(text, '--', 2, true))}</span>,
    }, {
      title: () => <TableColumnTitle title="总损失电量" unit="kWh" style={{ maxWidth: '100%', height: '52px' }} />,
      width: 80,
      dataIndex: 'totalGen',
      className: 'totalGen',
      render: (text) => <span title={text}>{(dataFormats(text, '--', 2, true))}</span>,
    }, {
      title: () => <TableColumnTitle title="统计时长" unit="h" style={{ maxWidth: '100%', height: '52px' }} />,
      width: 80,
      dataIndex: 'statisticsHours',
      className: 'statisticsHours',
      render: (text) => <span title={text}>{(dataFormats(text, '--', 2, true))}</span>,
    }, {
      title: () => <TableColumnTitle title="统计损失电量" unit="kWh" style={{ maxWidth: '100%', height: '52px' }} />,
      width: 80,
      dataIndex: 'statisticsGen',
      className: 'statisticsGen',
      render: (text) => <span title={text}>{(dataFormats(text, '--', 2, true))}</span>,
    }, {
      title: '原因',
      width: 200,
      dataIndex: 'reason',
      className: 'reason',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }, {
      title: '故障处理进展',
      width: 200,
      dataIndex: 'process',
      className: 'process',
      render: (text) => <span title={text}>{text || '--'}</span>,
    }];

    return (
      <div className={styles.faultList}>
        <div className={styles.pagination}>
          <Button className={styles.listExport} onClick={this.onExport} disabled={dataList.length === 0 ? true : false}>导出</Button>
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
          scroll={{ x: 2000 }}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default FaultList;
